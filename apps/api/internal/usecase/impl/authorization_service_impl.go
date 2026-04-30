package impl

import (
	"context"
	"strings"

	"github.com/google/uuid"
	"github.com/unitechio/eLearning/apps/api/internal/domain"
	"github.com/unitechio/eLearning/apps/api/internal/dto"
	"github.com/unitechio/eLearning/apps/api/internal/repository"
	"github.com/unitechio/eLearning/apps/api/pkg/apperr"
)

type AuthorizationUsecase struct {
	userRepo    repository.UserRepository
	billingRepo repository.BillingRepository
}

func NewAuthorizationService(userRepo repository.UserRepository, billingRepo repository.BillingRepository) *AuthorizationUsecase {
	return &AuthorizationUsecase{userRepo: userRepo, billingRepo: billingRepo}
}

func (s *AuthorizationUsecase) GetAccessProfile(ctx context.Context, userID uuid.UUID) (*dto.AccessProfile, error) {
	user, err := s.userRepo.FindByIDWithAccess(ctx, userID)
	if err != nil {
		if isNotFoundErr(err) {
			return nil, apperr.NotFound("user", userID)
		}
		return nil, apperr.Internal(err)
	}
	roleSet := map[string]struct{}{}
	permissionSet := map[string]struct{}{}
	for _, role := range user.Roles {
		roleSet[strings.ToLower(role.Name)] = struct{}{}
		for _, permission := range role.Permissions {
			permissionSet[strings.ToLower(permission.Resource+":"+permission.Action)] = struct{}{}
		}
	}
	for _, permission := range user.Permissions {
		permissionSet[strings.ToLower(permission.Resource+":"+permission.Action)] = struct{}{}
	}
	roles := make([]string, 0, len(roleSet))
	for role := range roleSet {
		roles = append(roles, role)
	}
	permissions := make([]string, 0, len(permissionSet))
	for permission := range permissionSet {
		permissions = append(permissions, permission)
	}
	features := []string{"core_learning"}
	isPremium, err := s.hasPremium(ctx, userID)
	if err != nil {
		return nil, err
	}
	if isPremium {
		features = append(features, "premium", "ai_stream", "speaking_realtime", "vocab_pro")
	}
	isAdmin := hasAnyRole(roles, "admin", "super_admin")
	isInstructor := hasAnyRole(roles, "instructor", "admin", "super_admin")
	return &dto.AccessProfile{
		UserID:       user.ID.String(),
		TenantID:     user.TenantID.String(),
		Email:        user.Email,
		Roles:        roles,
		Permissions:  permissions,
		Features:     features,
		IsAdmin:      isAdmin,
		IsInstructor: isInstructor,
		IsPremium:    isPremium,
	}, nil
}

func (s *AuthorizationUsecase) GetTenantID(ctx context.Context, userID uuid.UUID) (uuid.UUID, error) {
	user, err := s.userRepo.FindByID(ctx, userID)
	if err != nil {
		if isNotFoundErr(err) {
			return uuid.Nil, apperr.NotFound("user", userID)
		}
		return uuid.Nil, apperr.Internal(err)
	}
	return user.TenantID, nil
}

func (s *AuthorizationUsecase) RequireRoles(ctx context.Context, userID uuid.UUID, roles ...string) error {
	profile, err := s.GetAccessProfile(ctx, userID)
	if err != nil {
		return err
	}
	if hasAnyRole(profile.Roles, roles...) {
		return nil
	}
	return apperr.Forbidden("insufficient role for this action")
}

func (s *AuthorizationUsecase) RequireFeature(ctx context.Context, userID uuid.UUID, feature string) error {
	profile, err := s.GetAccessProfile(ctx, userID)
	if err != nil {
		return err
	}
	for _, item := range profile.Features {
		if strings.EqualFold(item, feature) {
			return nil
		}
	}
	return apperr.Forbidden("premium feature is locked")
}

func (s *AuthorizationUsecase) AssignRole(ctx context.Context, actorID, targetUserID uuid.UUID, roleID uint) error {
	if err := s.RequireRoles(ctx, actorID, "admin", "super_admin"); err != nil {
		return err
	}
	if roleID == 0 {
		return apperr.BadRequest("role_id is required")
	}
	if err := s.userRepo.AssignRoleByID(ctx, targetUserID, roleID); err != nil {
		return apperr.Internal(err)
	}
	return nil
}

func (s *AuthorizationUsecase) RemoveRole(ctx context.Context, actorID, targetUserID uuid.UUID, roleID uint) error {
	if err := s.RequireRoles(ctx, actorID, "admin", "super_admin"); err != nil {
		return err
	}
	if roleID == 0 {
		return apperr.BadRequest("role_id is required")
	}
	if err := s.userRepo.RemoveRoleByID(ctx, targetUserID, roleID); err != nil {
		return apperr.Internal(err)
	}
	return nil
}

func (s *AuthorizationUsecase) GrantPermissions(ctx context.Context, actorID, targetUserID uuid.UUID, permissionIDs []uint) error {
	if err := s.RequireRoles(ctx, actorID, "admin", "super_admin"); err != nil {
		return err
	}
	if len(permissionIDs) == 0 {
		return apperr.BadRequest("permission_ids are required")
	}
	if err := s.userRepo.AssignPermissionIDs(ctx, targetUserID, permissionIDs); err != nil {
		return apperr.Internal(err)
	}
	return nil
}

func (s *AuthorizationUsecase) RevokePermissions(ctx context.Context, actorID, targetUserID uuid.UUID, permissionIDs []uint) error {
	if err := s.RequireRoles(ctx, actorID, "admin", "super_admin"); err != nil {
		return err
	}
	if len(permissionIDs) == 0 {
		return apperr.BadRequest("permission_ids are required")
	}
	if err := s.userRepo.RemovePermissionIDs(ctx, targetUserID, permissionIDs); err != nil {
		return apperr.Internal(err)
	}
	return nil
}

func (s *AuthorizationUsecase) CanReadCourse(ctx context.Context, userID uuid.UUID, course *domain.Course) error {
	profile, actorTenant, err := s.loadActorAccess(ctx, userID)
	if err != nil {
		return err
	}
	if !sameTenantOrSuperAdmin(profile, actorTenant, course.TenantID) {
		return apperr.Forbidden("cross-tenant course access is denied")
	}
	if course.Visibility == "public" || course.CreatedBy == userID || hasAnyRole(profile.Roles, "admin", "super_admin", "instructor") {
		return nil
	}
	return apperr.Forbidden("course is not accessible")
}

func (s *AuthorizationUsecase) CanManageCourse(ctx context.Context, userID uuid.UUID, course *domain.Course) error {
	profile, actorTenant, err := s.loadActorAccess(ctx, userID)
	if err != nil {
		return err
	}
	if !sameTenantOrSuperAdmin(profile, actorTenant, course.TenantID) {
		return apperr.Forbidden("cross-tenant course access is denied")
	}
	if hasAnyRole(profile.Roles, "admin", "super_admin") || course.CreatedBy == userID {
		return nil
	}
	return apperr.Forbidden("only course owner or admin can manage this course")
}

func (s *AuthorizationUsecase) CanReadActivity(ctx context.Context, userID uuid.UUID, activity *domain.Activity) error {
	profile, actorTenant, err := s.loadActorAccess(ctx, userID)
	if err != nil {
		return err
	}
	if !sameTenantOrSuperAdmin(profile, actorTenant, activity.TenantID) {
		return apperr.Forbidden("cross-tenant activity access is denied")
	}
	if activity.Visibility == "public" || activity.CreatedBy == userID || hasAnyRole(profile.Roles, "admin", "super_admin", "instructor") {
		return nil
	}
	return apperr.Forbidden("activity is not accessible")
}

func (s *AuthorizationUsecase) CanManageActivity(ctx context.Context, userID uuid.UUID, activity *domain.Activity) error {
	profile, actorTenant, err := s.loadActorAccess(ctx, userID)
	if err != nil {
		return err
	}
	if !sameTenantOrSuperAdmin(profile, actorTenant, activity.TenantID) {
		return apperr.Forbidden("cross-tenant activity access is denied")
	}
	if hasAnyRole(profile.Roles, "admin", "super_admin") || activity.CreatedBy == userID {
		return nil
	}
	return apperr.Forbidden("only activity owner or admin can manage this activity")
}

func (s *AuthorizationUsecase) hasPremium(ctx context.Context, userID uuid.UUID) (bool, error) {
	subscription, err := s.billingRepo.FindActiveSubscriptionByUserID(userID)
	if err != nil {
		if isNotFoundErr(err) {
			return false, nil
		}
		return false, apperr.Internal(err)
	}
	if subscription == nil {
		return false, nil
	}
	return strings.EqualFold(subscription.Status, "active"), nil
}

func hasAnyRole(current []string, expected ...string) bool {
	set := map[string]struct{}{}
	for _, item := range current {
		set[strings.ToLower(item)] = struct{}{}
	}
	for _, item := range expected {
		if _, ok := set[strings.ToLower(item)]; ok {
			return true
		}
	}
	return false
}

func (s *AuthorizationUsecase) loadActorAccess(ctx context.Context, userID uuid.UUID) (*dto.AccessProfile, uuid.UUID, error) {
	profile, err := s.GetAccessProfile(ctx, userID)
	if err != nil {
		return nil, uuid.Nil, err
	}
	tenantID, err := s.GetTenantID(ctx, userID)
	if err != nil {
		return nil, uuid.Nil, err
	}
	return profile, tenantID, nil
}

func sameTenantOrSuperAdmin(profile *dto.AccessProfile, actorTenant, resourceTenant uuid.UUID) bool {
	if profile != nil && hasAnyRole(profile.Roles, "super_admin") {
		return true
	}
	return actorTenant == resourceTenant
}
