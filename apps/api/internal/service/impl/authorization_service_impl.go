package impl

import (
	"strings"

	"github.com/google/uuid"
	"github.com/unitechio/eLearning/apps/api/internal/dto"
	"github.com/unitechio/eLearning/apps/api/internal/repository"
	"github.com/unitechio/eLearning/apps/api/pkg/apperr"
)

type AuthorizationService struct {
	userRepo    repository.UserRepository
	billingRepo repository.BillingRepository
}

func NewAuthorizationService(userRepo repository.UserRepository, billingRepo repository.BillingRepository) *AuthorizationService {
	return &AuthorizationService{userRepo: userRepo, billingRepo: billingRepo}
}

func (s *AuthorizationService) GetAccessProfile(userID uuid.UUID) (*dto.AccessProfile, error) {
	user, err := s.userRepo.FindByIDWithAccess(userID)
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
	isPremium, err := s.hasPremium(userID)
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
		Email:        user.Email,
		Roles:        roles,
		Permissions:  permissions,
		Features:     features,
		IsAdmin:      isAdmin,
		IsInstructor: isInstructor,
		IsPremium:    isPremium,
	}, nil
}

func (s *AuthorizationService) RequireRoles(userID uuid.UUID, roles ...string) error {
	profile, err := s.GetAccessProfile(userID)
	if err != nil {
		return err
	}
	if hasAnyRole(profile.Roles, roles...) {
		return nil
	}
	return apperr.Forbidden("insufficient role for this action")
}

func (s *AuthorizationService) RequireFeature(userID uuid.UUID, feature string) error {
	profile, err := s.GetAccessProfile(userID)
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

func (s *AuthorizationService) hasPremium(userID uuid.UUID) (bool, error) {
	items, total, err := s.billingRepo.ListHistoryByUserID(userID, repository.BillingHistoryListFilter{
		Pagination: repository.Pagination{Page: 1, PageSize: 1},
		Status:     "paid",
	})
	if err != nil {
		return false, apperr.Internal(err)
	}
	if total == 0 || len(items) == 0 {
		return false, nil
	}
	return true, nil
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
