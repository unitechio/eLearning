package impl

import (
	"context"
	"fmt"
	"strconv"
	"strings"
	"time"

	"github.com/google/uuid"
	"github.com/unitechio/eLearning/apps/api/internal/domain"
	"github.com/unitechio/eLearning/apps/api/internal/dto"
	"github.com/unitechio/eLearning/apps/api/internal/repository"
	"github.com/unitechio/eLearning/apps/api/pkg/apperr"
	"github.com/unitechio/eLearning/apps/api/pkg/logger"
)

type NotificationUsecase struct {
	repo repository.NotificationRepository
}

func NewNotificationService(repo repository.NotificationRepository) *NotificationUsecase {
	return &NotificationUsecase{repo: repo}
}

func (s *NotificationUsecase) ListNotifications(userID uuid.UUID, query dto.NotificationListQuery) (*dto.PageResult[dto.NotificationItem], error) {
	query.PaginationQuery = query.PaginationQuery.Normalize()
	items, total, err := s.repo.ListByUserID(userID, dto.NotificationListFilter{
		Pagination: repository.Pagination{Page: query.Page, PageSize: query.PageSize},
		Search:     query.Search,
		Category:   query.Category,
		IsRead:     query.Read,
	})
	if err != nil {
		return nil, apperr.Internal(err)
	}
	res := make([]dto.NotificationItem, 0, len(items))
	for _, item := range items {
		res = append(res, dto.NotificationItem{
			ID:        strconv.FormatUint(uint64(item.ID), 10),
			Title:     item.Title,
			Message:   item.Message,
			IsRead:    item.IsRead,
			Category:  item.Category,
			CreatedAt: item.CreatedAt.Format("2006-01-02T15:04:05Z07:00"),
		})
	}
	return &dto.PageResult[dto.NotificationItem]{Items: res, Meta: buildMeta(query.PaginationQuery, total)}, nil
}

func (s *NotificationUsecase) MarkAsRead(userID uuid.UUID, id string) error {
	notificationID, err := strconv.ParseUint(id, 10, 64)
	if err != nil {
		return apperr.BadRequest("invalid notification id")
	}
	item, err := s.repo.FindByIDForUser(uint(notificationID), userID)
	if err != nil {
		if isNotFoundErr(err) {
			return apperr.NotFound("notification", id)
		}
		return apperr.Internal(err)
	}
	item.MarkAsRead()
	if err := s.repo.Save(item); err != nil {
		return apperr.Internal(err)
	}
	return nil
}

func (u *NotificationUsecase) SendNotification(ctx context.Context, notification *domain.Notification) error {
	// Check user preferences
	prefs, err := u.prefRepo.GetByUserID(ctx, notification.UserID)
	if err == nil && prefs != nil {
		// Check if notification type is enabled
		if notification.Channel == domain.NotificationChannelInApp && !prefs.EnableInApp {
			return nil // Skip
		}
		if notification.Channel == domain.NotificationChannelEmail && !prefs.EnableEmail {
			return nil // Skip
		}
		// Check quiet hours
		if prefs.IsInQuietHours() && notification.Priority != domain.NotificationPriorityUrgent {
			u.log.Info(ctx, "Notification skipped due to quiet hours", logger.LogField{Key: "user_id", Value: notification.UserID})
			return nil
		}
	}

	// Save to DB
	if err := u.repo.Create(ctx, notification); err != nil {
		return err
	}

	// Send to socket Hub
	if notification.Channel == domain.NotificationChannelInApp || notification.Channel == "" {
		if u.hub != nil {
			// TODO: Convert notification to socket.Message type
			// u.hub.SendToUser(notification.UserID, notification)
		}
	}

	// Send Email
	if notification.Channel == domain.NotificationChannelEmail {
		user, err := u.userRepo.GetByID(ctx, notification.UserID)
		if err != nil {
			u.log.Error(ctx, "Failed to get user for email notification", logger.LogField{Key: "user_id", Value: notification.UserID}, logger.LogField{Key: "error", Value: err})
			return nil // Don't fail the whole operation? Or should we?
		}
		if user.Email != "" {
			if err := u.emailservice.SendEmail(ctx, []string{user.Email}, notification.Title, notification.Message); err != nil {
				u.log.Error(ctx, "Failed to send email notification", logger.LogField{Key: "user_id", Value: notification.UserID}, logger.LogField{Key: "error", Value: err})
				// Update IsSent status?
			} else {
				// Update IsSent to true
				notification.IsSent = true
				_ = u.repo.Update(ctx, notification)
			}
		}
	}

	return nil
}

func (u *NotificationUsecase) SendNotificationFromTemplate(ctx context.Context, userID uuid.UUID, templateName string, variables map[string]string) error {
	template, err := u.templateRepo.GetByName(ctx, templateName)
	if err != nil {
		return fmt.Errorf("template not found: %w", err)
	}

	if !template.IsActive {
		return fmt.Errorf("template is inactive")
	}

	// Replace variables in Subject and Body
	subject := template.Subject
	body := template.BodyText // Or BodyHTML
	for k, v := range variables {
		subject = strings.ReplaceAll(subject, "{{"+k+"}}", v)
		body = strings.ReplaceAll(body, "{{"+k+"}}", v)
	}

	notification := &domain.Notification{
		UserID:   &userID,
		Type:     template.Type,
		Channel:  template.Channel,
		Priority: template.Priority,
		Title:    subject,
		Message:  body,
		IsSent:   false,
	}

	return u.SendNotification(ctx, notification)
}

func (u *NotificationUsecase) SendBulkNotification(ctx context.Context, userIDs []string, notification *domain.Notification) error {
	for _, userID := range userIDs {
		n := *notification // Copy
		n.UserID = userID
		n.ID = "" // Reset ID to let DB generate new one
		if err := u.SendNotification(ctx, &n); err != nil {
			u.log.Error(ctx, "Failed to send bulk notification", logger.LogField{Key: "user_id", Value: userID}, logger.LogField{Key: "error", Value: err})
			// Continue with others
		}
	}
	return nil
}

func (u *NotificationUsecase) GetNotification(ctx context.Context, id string) (*domain.Notification, error) {
	return u.repo.GetByID(ctx, id)
}

func (u *NotificationUsecase) GetUserNotifications(ctx context.Context, userID string, filter domain.NotificationFilter) ([]*domain.Notification, int64, error) {
	return u.repo.GetByUserID(ctx, userID, filter)
}

func (u *NotificationUsecase) GetUnreadCount(ctx context.Context, userID string) (int64, error) {
	return u.repo.GetUnreadCount(ctx, userID)
}

func (u *NotificationUsecase) MarkAsRead(ctx context.Context, id string) error {
	return u.repo.MarkAsRead(ctx, id)
}

func (u *NotificationUsecase) MarkAllAsRead(ctx context.Context, userID string) error {
	return u.repo.MarkAllAsRead(ctx, userID)
}

func (u *NotificationUsecase) DeleteNotification(ctx context.Context, id string) error {
	return u.repo.Delete(ctx, id)
}

func (u *NotificationUsecase) CleanupOldNotifications(ctx context.Context, retentionDays int) error {
	duration := time.Duration(retentionDays) * 24 * time.Hour
	return u.repo.DeleteOlderThan(ctx, duration)
}

func (u *NotificationUsecase) GetUserPreferences(ctx context.Context, userID string) (*domain.NotificationPreference, error) {
	pref, err := u.prefRepo.GetByUserID(ctx, userID)
	if err != nil {
		// If not found, return default preferences
		return &domain.NotificationPreference{
			UserID:      userID,
			EnableInApp: true,
			EnableEmail: true,
			EnablePush:  true,
		}, nil
	}
	return pref, nil
}

func (u *NotificationUsecase) UpdateUserPreferences(ctx context.Context, userID string, preferences *domain.NotificationPreference) error {
	existing, err := u.prefRepo.GetByUserID(ctx, userID)
	if err != nil {
		// Create if not exists
		preferences.UserID = userID
		return u.prefRepo.Create(ctx, preferences)
	}
	preferences.ID = existing.ID
	preferences.UserID = userID
	return u.prefRepo.Update(ctx, preferences)
}
