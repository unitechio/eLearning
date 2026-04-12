package database

import (
	"github.com/unitechio/eLearning/apps/api/internal/model"
	"github.com/unitechio/eLearning/apps/api/pkg/logger"
	"go.uber.org/zap"
	"gorm.io/gorm"
)

func AutoMigrate(db *gorm.DB) error {
	logger.Info("Running database migrations...")
	// 	func Migrate(db *gorm.DB) error {
	// 		db.Exec(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`)
	// 		return db.AutoMigrate(
	// 			&user.User{},
	// 			&vocabulary.Word{},
	// 			&vocabulary.UserWordProgress{},
	// 			&writing.Submission{},
	// 			&speaking.Attempt{},
	// 		)
	// }

	if err := db.AutoMigrate(
		&model.User{},
		&model.Customer{},
		&model.Role{},
		&model.Permission{},
		&model.UserRole{},
		&model.RolePermission{},
		&model.UserPermission{},
		&model.OTP{},
		&model.RefreshToken{},
	); err != nil {
		logger.Error("Failed to migrate user tables", zap.Error(err))
		return err
	}

	// Authorization related tables (new enhanced permission system)
	if err := db.AutoMigrate(
		&model.Module{},
		&model.Department{},
		&model.Service{},
		&model.Scope{},
		&model.EnhancedPermission{},
		&model.RoleEnhancedPermission{},
		&model.UserEnhancedPermission{},
	); err != nil {
		logger.Error("Failed to migrate authorization tables", zap.Error(err))
		return err
	}

	// Content related tables
	if err := db.AutoMigrate(
		&model.Post{},
		&model.Media{},
		&model.PostMedia{},
		&model.Category{},
		&model.Tag{},
		&model.PostSchedule{},
	); err != nil {
		logger.Error("Failed to migrate content tables", zap.Error(err))
		return err
	}

	// // Page Builder tables
	// if err := db.AutoMigrate(
	// 	&model.Page{},
	// 	&model.Block{},
	// 	&model.PageBlock{},
	// 	&model.PageVersion{},
	// 	&model.PageBlockItem{},
	// 	&model.BlockItem{},
	// 	&model.ThemeSetting{},
	// ); err != nil {
	// 	logger.Error("Failed to migrate page builder tables", zap.Error(err))
	// 	return err
	// }

	// Content Module tables (new system)
	// if err := db.AutoMigrate(
	// 	&model.ContentModule{},
	// 	&model.PageContent{},
	// ); err != nil {
	// 	logger.Error("Failed to migrate content module tables", zap.Error(err))
	// 	return err
	// }

	// System related tables
	if err := db.AutoMigrate(
		&model.AuditLog{},
		&model.SystemSetting{},
		&model.Notification{},
		&model.ActivityLog{},
		&model.EmailTemplate{},
		&model.EmailLog{},
		&model.Document{},
		&model.DocumentPermission{},
		&model.DocumentComment{},
		&model.DocumentVersion{},
	); err != nil {
		logger.Error("Failed to migrate system tables", zap.Error(err))
		return err
	}

	logger.Info("Database migrations completed successfully")
	return nil
}

// SeedData seeds initial data into the database
func SeedData(db *gorm.DB) error {
	logger.Info("Seeding initial data...")

	// Seed Modules
	if err := seedModules(db); err != nil {
		return err
	}

	// Seed Departments
	if err := seedDepartments(db); err != nil {
		return err
	}

	// Seed Services
	if err := seedServices(db); err != nil {
		return err
	}

	// Seed Scopes
	if err := seedScopes(db); err != nil {
		return err
	}

	// Seed Roles (legacy)
	if err := seedRoles(db); err != nil {
		return err
	}

	// Seed Permissions (legacy)
	if err := seedPermissions(db); err != nil {
		return err
	}

	// Seed Enhanced Permissions
	if err := seedEnhancedPermissions(db); err != nil {
		return err
	}

	// Assign permissions to super_admin role
	if err := assignPermissionsToSuperAdmin(db); err != nil {
		return err
	}

	// Seed Users
	if err := seedUsers(db); err != nil {
		return err
	}

	// Seed Categories
	if err := seedCategories(db); err != nil {
		return err
	}

	logger.Info("Initial data seeded successfully")
	return nil
}

// seedModules seeds system modules
func seedModules(db *gorm.DB) error {
	modules := []model.Module{
		{
			Code:        "admin",
			Name:        "Administration",
			DisplayName: "System Administration",
			Description: "Core system administration and configuration",
			Icon:        "settings",
			Color:       "#FF6B6B",
			Order:       1,
			IsActive:    true,
			IsSystem:    true,
		},
		{
			Code:        "crm",
			Name:        "CRM",
			DisplayName: "Customer Relationship Management",
			Description: "Customer and relationship management",
			Icon:        "users",
			Color:       "#4ECDC4",
			Order:       2,
			IsActive:    true,
			IsSystem:    true,
		},
		{
			Code:        "content",
			Name:        "Content",
			DisplayName: "Content Management",
			Description: "Content creation and management",
			Icon:        "file-text",
			Color:       "#95E1D3",
			Order:       3,
			IsActive:    true,
			IsSystem:    true,
		},
	}

	for i := range modules {
		if err := db.Where(model.Module{Code: modules[i].Code}).
			Assign(modules[i]).
			FirstOrCreate(&modules[i]).Error; err != nil {
			logger.Error("Failed to create module", zap.String("module", modules[i].Code), zap.Error(err))
			return err
		}
	}

	logger.Info("Modules seeded successfully")
	return nil
}

// seedDepartments seeds departments
func seedDepartments(db *gorm.DB) error {
	// Get module IDs
	var adminModule, crmModule, contentModule model.Module
	db.Where("code = ?", "admin").First(&adminModule)
	db.Where("code = ?", "crm").First(&crmModule)
	db.Where("code = ?", "content").First(&contentModule)

	departments := []model.Department{
		{
			ModuleID:    adminModule.ID,
			Code:        "system",
			Name:        "System",
			DisplayName: "System Department",
			Description: "Core system operations",
			IsActive:    true,
			IsSystem:    true,
		},
		{
			ModuleID:    crmModule.ID,
			Code:        "sales",
			Name:        "Sales",
			DisplayName: "Sales Department",
			Description: "Sales and customer acquisition",
			IsActive:    true,
			IsSystem:    true,
		},
		{
			ModuleID:    contentModule.ID,
			Code:        "editorial",
			Name:        "Editorial",
			DisplayName: "Editorial Department",
			Description: "Content creation and editing",
			IsActive:    true,
			IsSystem:    true,
		},
	}

	for _, dept := range departments {
		if err := db.Where("code = ?", dept.Code).FirstOrCreate(&dept).Error; err != nil {
			logger.Error("Failed to create department", zap.String("department", dept.Code), zap.Error(err))
			return err
		}
	}

	logger.Info("Departments seeded successfully")
	return nil
}

// seedServices seeds services
func seedServices(db *gorm.DB) error {
	// Get department IDs
	var systemDept, salesDept, editorialDept model.Department
	db.Where("code = ?", "system").First(&systemDept)
	db.Where("code = ?", "sales").First(&salesDept)
	db.Where("code = ?", "editorial").First(&editorialDept)

	services := []model.Service{
		// System services
		{
			DepartmentID: systemDept.ID,
			Code:         "users",
			Name:         "User Management",
			DisplayName:  "User Management Service",
			Description:  "Manage system users",
			Endpoint:     "/api/v1/users",
			IsActive:     true,
			IsSystem:     true,
		},
		{
			DepartmentID: systemDept.ID,
			Code:         "roles",
			Name:         "Role Management",
			DisplayName:  "Role Management Service",
			Description:  "Manage user roles",
			Endpoint:     "/api/v1/roles",
			IsActive:     true,
			IsSystem:     true,
		},
		{
			DepartmentID: systemDept.ID,
			Code:         "permissions",
			Name:         "Permission Management",
			DisplayName:  "Permission Management Service",
			Description:  "Manage permissions",
			Endpoint:     "/api/v1/permissions",
			IsActive:     true,
			IsSystem:     true,
		},
		// CRM services
		{
			DepartmentID: salesDept.ID,
			Code:         "customers",
			Name:         "Customer Management",
			DisplayName:  "Customer Management Service",
			Description:  "Manage customers",
			Endpoint:     "/api/v1/customers",
			IsActive:     true,
			IsSystem:     true,
		},
		// Content services
		{
			DepartmentID: editorialDept.ID,
			Code:         "posts",
			Name:         "Post Management",
			DisplayName:  "Post Management Service",
			Description:  "Manage posts and articles",
			Endpoint:     "/api/v1/posts",
			IsActive:     true,
			IsSystem:     true,
		},
		{
			DepartmentID: editorialDept.ID,
			Code:         "media",
			Name:         "Media Management",
			DisplayName:  "Media Management Service",
			Description:  "Manage media files",
			Endpoint:     "/api/v1/media",
			IsActive:     true,
			IsSystem:     true,
		},
	}

	for _, service := range services {
		if err := db.Where("code = ?", service.Code).FirstOrCreate(&service).Error; err != nil {
			logger.Error("Failed to create service", zap.String("service", service.Code), zap.Error(err))
			return err
		}
	}

	logger.Info("Services seeded successfully")
	return nil
}

// seedScopes seeds permission scopes
func seedScopes(db *gorm.DB) error {
	scopes := []model.Scope{
		{
			Code:        "org",
			Name:        "Organization",
			DisplayName: "Organization Scope",
			Description: "Access to all resources across the organization",
			Level:       model.ScopeLevelOrganization,
			Priority:    100,
			IsSystem:    true,
		},
		{
			Code:        "dept",
			Name:        "Department",
			DisplayName: "Department Scope",
			Description: "Access to resources within the department",
			Level:       model.ScopeLevelDepartment,
			Priority:    50,
			IsSystem:    true,
		},
		{
			Code:        "team",
			Name:        "Team",
			DisplayName: "Team Scope",
			Description: "Access to resources within the team",
			Level:       model.ScopeLevelTeam,
			Priority:    25,
			IsSystem:    true,
		},
		{
			Code:        "personal",
			Name:        "Personal",
			DisplayName: "Personal Scope",
			Description: "Access to own resources only",
			Level:       model.ScopeLevelPersonal,
			Priority:    10,
			IsSystem:    true,
		},
	}

	for _, scope := range scopes {
		if err := db.Where("code = ?", scope.Code).FirstOrCreate(&scope).Error; err != nil {
			logger.Error("Failed to create scope", zap.String("scope", scope.Code), zap.Error(err))
			return err
		}
	}

	logger.Info("Scopes seeded successfully")
	return nil
}

// seedRoles seeds default roles (legacy system)
func seedRoles(db *gorm.DB) error {
	roles := []model.Role{
		{
			Name:        "super_admin",
			DisplayName: "Super Administrator",
			Description: "Full system access",
			Level:       model.RoleLevelOrganization,
			IsSystem:    true,
		},
		{
			Name:        "admin",
			DisplayName: "Administrator",
			Description: "Administrative access",
			Level:       model.RoleLevelOrganization,
			IsSystem:    true,
		},
		{
			Name:        "manager",
			DisplayName: "Manager",
			Description: "Management access",
			Level:       model.RoleLevelDepartment,
			IsSystem:    true,
		},
		{
			Name:        "user",
			DisplayName: "User",
			Description: "Basic user access",
			Level:       model.RoleLevelService,
			IsSystem:    true,
		},
	}

	for _, role := range roles {
		if err := db.Where("name = ?", role.Name).FirstOrCreate(&role).Error; err != nil {
			logger.Error("Failed to create role", zap.String("role", role.Name), zap.Error(err))
			return err
		}
	}

	logger.Info("Roles seeded successfully")
	return nil
}

// seedPermissions seeds legacy permissions
func seedPermissions(db *gorm.DB) error {
	permissions := []model.Permission{
		// User management
		{Resource: "users", Action: "create", Module: "admin", Department: "system", Service: "users", Description: "Create users"},
		{Resource: "users", Action: "read", Module: "admin", Department: "system", Service: "users", Description: "Read users"},
		{Resource: "users", Action: "update", Module: "admin", Department: "system", Service: "users", Description: "Update users"},
		{Resource: "users", Action: "delete", Module: "admin", Department: "system", Service: "users", Description: "Delete users"},

		// Customer management
		{Resource: "customers", Action: "create", Module: "crm", Department: "sales", Service: "customers", Description: "Create customers"},
		{Resource: "customers", Action: "read", Module: "crm", Department: "sales", Service: "customers", Description: "Read customers"},
		{Resource: "customers", Action: "update", Module: "crm", Department: "sales", Service: "customers", Description: "Update customers"},
		{Resource: "customers", Action: "delete", Module: "crm", Department: "sales", Service: "customers", Description: "Delete customers"},

		// Post management
		{Resource: "posts", Action: "create", Module: "content", Department: "editorial", Service: "posts", Description: "Create posts"},
		{Resource: "posts", Action: "read", Module: "content", Department: "editorial", Service: "posts", Description: "Read posts"},
		{Resource: "posts", Action: "update", Module: "content", Department: "editorial", Service: "posts", Description: "Update posts"},
		{Resource: "posts", Action: "delete", Module: "content", Department: "editorial", Service: "posts", Description: "Delete posts"},
		{Resource: "posts", Action: "publish", Module: "content", Department: "editorial", Service: "posts", Description: "Publish posts"},

		// Media management
		{Resource: "media", Action: "upload", Module: "content", Department: "editorial", Service: "media", Description: "Upload media"},
		{Resource: "media", Action: "read", Module: "content", Department: "editorial", Service: "media", Description: "Read media"},
		{Resource: "media", Action: "delete", Module: "content", Department: "editorial", Service: "media", Description: "Delete media"},

		// Role management
		{Resource: "roles", Action: "create", Module: "admin", Department: "system", Service: "roles", Description: "Create roles"},
		{Resource: "roles", Action: "read", Module: "admin", Department: "system", Service: "roles", Description: "Read roles"},
		{Resource: "roles", Action: "update", Module: "admin", Department: "system", Service: "roles", Description: "Update roles"},
		{Resource: "roles", Action: "delete", Module: "admin", Department: "system", Service: "roles", Description: "Delete roles"},

		// Permission management
		{Resource: "permissions", Action: "manage", Module: "admin", Department: "system", Service: "permissions", Description: "Manage permissions"},
	}

	for _, permission := range permissions {
		key := permission.Module + ":" + permission.Department + ":" + permission.Service + ":" + permission.Resource + ":" + permission.Action
		if err := db.Where("module = ? AND department = ? AND service = ? AND resource = ? AND action = ?",
			permission.Module, permission.Department, permission.Service, permission.Resource, permission.Action).
			FirstOrCreate(&permission).Error; err != nil {
			logger.Error("Failed to create permission", zap.String("permission", key), zap.Error(err))
			return err
		}
	}

	logger.Info("Permissions seeded successfully")
	return nil
}

// seedEnhancedPermissions seeds enhanced permissions with full hierarchy
func seedEnhancedPermissions(db *gorm.DB) error {
	// Get all modules, departments, services, scopes
	var modules []model.Module
	var departments []model.Department
	var services []model.Service
	var scopes []model.Scope

	db.Find(&modules)
	db.Find(&departments)
	db.Find(&services)
	db.Find(&scopes)

	// Create map for quick lookup
	moduleMap := make(map[string]uint)
	for _, m := range modules {
		moduleMap[m.Code] = m.ID
	}

	deptMap := make(map[string]uint)
	for _, d := range departments {
		deptMap[d.Code] = d.ID
	}

	serviceMap := make(map[string]uint)
	for _, s := range services {
		serviceMap[s.Code] = s.ID
	}

	scopeMap := make(map[string]uint)
	for _, sc := range scopes {
		scopeMap[sc.Code] = sc.ID
	}

	// Define enhanced permissions
	type PermDef struct {
		Module     string
		Department string
		Service    string
		Scope      string
		Resource   string
		Action     model.PermissionAction
		Display    string
		Desc       string
	}

	permDefs := []PermDef{
		// User management with different scopes
		{"admin", "system", "users", "org", "users", model.ActionCreate, "Create Users (Org)", "Create users at organization level"},
		{"admin", "system", "users", "org", "users", model.ActionRead, "Read Users (Org)", "View all users in organization"},
		{"admin", "system", "users", "dept", "users", "read", "Read Users (Dept)", "View users in department"},
		{"admin", "system", "users", "org", "users", model.ActionUpdate, "Update Users (Org)", "Update any user"},
		{"admin", "system", "users", "personal", "users", model.ActionUpdate, "Update Own Profile", "Update own user profile"},
		{"admin", "system", "users", "org", "users", model.ActionDelete, "Delete Users (Org)", "Delete any user"},

		// Customer management
		{"crm", "sales", "customers", "org", "customers", model.ActionCreate, "Create Customers (Org)", "Create customers"},
		{"crm", "sales", "customers", "org", "customers", model.ActionRead, "Read Customers (Org)", "View all customers"},
		{"crm", "sales", "customers", "dept", "customers", model.ActionRead, "Read Customers (Dept)", "View department customers"},
		{"crm", "sales", "customers", "personal", "customers", model.ActionRead, "Read Own Customers", "View assigned customers"},
		{"crm", "sales", "customers", "org", "customers", model.ActionUpdate, "Update Customers (Org)", "Update any customer"},
		{"crm", "sales", "customers", "personal", "customers", model.ActionUpdate, "Update Own Customers", "Update assigned customers"},
		{"crm", "sales", "customers", "org", "customers", model.ActionDelete, "Delete Customers (Org)", "Delete any customer"},

		// Post management
		{"content", "editorial", "posts", "org", "posts", model.ActionCreate, "Create Posts (Org)", "Create posts"},
		{"content", "editorial", "posts", "org", "posts", model.ActionRead, "Read Posts (Org)", "View all posts"},
		{"content", "editorial", "posts", "personal", "posts", model.ActionRead, "Read Own Posts", "View own posts"},
		{"content", "editorial", "posts", "org", "posts", model.ActionUpdate, "Update Posts (Org)", "Update any post"},
		{"content", "editorial", "posts", "personal", "posts", model.ActionUpdate, "Update Own Posts", "Update own posts"},
		{"content", "editorial", "posts", "org", "posts", model.ActionDelete, "Delete Posts (Org)", "Delete any post"},
		{"content", "editorial", "posts", "org", "posts", model.ActionPublish, "Publish Posts (Org)", "Publish any post"},
		{"content", "editorial", "posts", "personal", "posts", model.ActionPublish, "Publish Own Posts", "Publish own posts"},

		// Media management
		{"content", "editorial", "media", "org", "media", model.ActionCreate, "Upload Media (Org)", "Upload media files"},
		{"content", "editorial", "media", "org", "media", model.ActionRead, "Read Media (Org)", "View all media"},
		{"content", "editorial", "media", "personal", "media", model.ActionRead, "Read Own Media", "View own media"},
		{"content", "editorial", "media", "org", "media", model.ActionDelete, "Delete Media (Org)", "Delete any media"},
		{"content", "editorial", "media", "personal", "media", model.ActionDelete, "Delete Own Media", "Delete own media"},

		// Role management
		{"admin", "system", "roles", "org", "roles", model.ActionManage, "Manage Roles", "Full role management"},

		// Permission management
		{"admin", "system", "permissions", "org", "permissions", model.ActionManage, "Manage Permissions", "Full permission management"},
	}

	for _, pd := range permDefs {
		perm := model.EnhancedPermission{
			ModuleID:     moduleMap[pd.Module],
			DepartmentID: deptMap[pd.Department],
			ServiceID:    serviceMap[pd.Service],
			ScopeID:      scopeMap[pd.Scope],
			Resource:     pd.Resource,
			Action:       pd.Action,
			DisplayName:  pd.Display,
			Description:  pd.Desc,
			IsSystem:     true,
		}

		// Generate code manually for FirstOrCreate
		code := pd.Module + ":" + pd.Department + ":" + pd.Service + ":" + pd.Scope + ":" + pd.Resource + ":" + string(pd.Action)
		perm.Code = code

		if err := db.Where("code = ?", code).FirstOrCreate(&perm).Error; err != nil {
			logger.Error("Failed to create enhanced permission", zap.String("code", code), zap.Error(err))
			return err
		}
	}

	logger.Info("Enhanced permissions seeded successfully")
	return nil
}

// assignPermissionsToSuperAdmin assigns all permissions to super_admin role
func assignPermissionsToSuperAdmin(db *gorm.DB) error {
	var superAdminRole model.Role
	if err := db.Where("name = ?", "super_admin").First(&superAdminRole).Error; err != nil {
		logger.Error("Failed to find super_admin role", zap.Error(err))
		return err
	}

	// Assign legacy permissions
	var allPermissions []model.Permission
	if err := db.Find(&allPermissions).Error; err != nil {
		logger.Error("Failed to fetch permissions", zap.Error(err))
		return err
	}

	for _, permission := range allPermissions {
		rolePermission := model.RolePermission{
			RoleID:       superAdminRole.ID,
			PermissionID: permission.ID,
		}
		db.Where("role_id = ? AND permission_id = ?", rolePermission.RoleID, rolePermission.PermissionID).
			FirstOrCreate(&rolePermission)
	}

	// Assign enhanced permissions
	var allEnhancedPermissions []model.EnhancedPermission
	if err := db.Find(&allEnhancedPermissions).Error; err != nil {
		logger.Error("Failed to fetch enhanced permissions", zap.Error(err))
		return err
	}

	for _, permission := range allEnhancedPermissions {
		roleEnhancedPermission := model.RoleEnhancedPermission{
			RoleID:       superAdminRole.ID,
			PermissionID: permission.ID,
		}
		db.Where("role_id = ? AND permission_id = ?", roleEnhancedPermission.RoleID, roleEnhancedPermission.PermissionID).
			FirstOrCreate(&roleEnhancedPermission)
	}

	logger.Info("Permissions assigned to super_admin successfully")
	return nil
}

// seedUsers seeds default users
func seedUsers(db *gorm.DB) error {
	hashedPassword, err := utils.HashPassword("password123")
	if err != nil {
		return err
	}

	adminUser := model.User{
		Email:         "admin@example.com",
		Password:      hashedPassword,
		FirstName:     "Admin",
		LastName:      "User",
		Status:        model.UserStatusActive,
		EmailVerified: true,
	}

	if err := db.Where("email = ?", adminUser.Email).FirstOrCreate(&adminUser).Error; err != nil {
		logger.Error("Failed to create admin user", zap.Error(err))
		return err
	}

	// Assign super_admin role
	var superAdminRole model.Role
	if err := db.Where("name = ?", "super_admin").First(&superAdminRole).Error; err != nil {
		logger.Error("Failed to find super_admin role", zap.Error(err))
		return err
	}

	userRole := model.UserRole{
		UserID: adminUser.ID,
		RoleID: superAdminRole.ID,
	}

	if err := db.Where("user_id = ? AND role_id = ?", userRole.UserID, userRole.RoleID).FirstOrCreate(&userRole).Error; err != nil {
		logger.Error("Failed to assign role to admin user", zap.Error(err))
		return err
	}

	logger.Info("Admin user seeded successfully")
	return nil
}

// seedCategories seeds default categories
func seedCategories(db *gorm.DB) error {
	categories := []model.Category{
		// Blog Categories
		{Name: "Technology", Slug: "technology", Type: model.CategoryTypeBlog, Status: model.CategoryStatusActive, Order: 1},
		{Name: "Lifestyle", Slug: "lifestyle", Type: model.CategoryTypeBlog, Status: model.CategoryStatusActive, Order: 2},
		{Name: "Travel", Slug: "travel", Type: model.CategoryTypeBlog, Status: model.CategoryStatusActive, Order: 3},

		// Header Categories
		{Name: "Home", Slug: "home", Type: model.CategoryTypeHeader, Status: model.CategoryStatusActive, Order: 1},
		{Name: "About", Slug: "about", Type: model.CategoryTypeHeader, Status: model.CategoryStatusActive, Order: 2},
		{Name: "Contact", Slug: "contact", Type: model.CategoryTypeHeader, Status: model.CategoryStatusActive, Order: 3},

		// Footer Categories
		{Name: "Privacy Policy", Slug: "privacy-policy", Type: model.CategoryTypeFooter, Status: model.CategoryStatusActive, Order: 1},
		{Name: "Terms of Service", Slug: "terms-of-service", Type: model.CategoryTypeFooter, Status: model.CategoryStatusActive, Order: 2},
	}

	for _, cat := range categories {
		if err := db.Where("slug = ? AND type = ?", cat.Slug, cat.Type).FirstOrCreate(&cat).Error; err != nil {
			logger.Error("Failed to create category", zap.String("category", cat.Name), zap.Error(err))
			return err
		}
	}

	// Add subcategories for Technology
	var techCat model.Category
	db.Where("slug = ? AND type = ?", "technology", model.CategoryTypeBlog).First(&techCat)

	if techCat.ID != 0 {
		subCategories := []model.Category{
			{Name: "Programming", Slug: "programming", Type: model.CategoryTypeBlog, Status: model.CategoryStatusActive, Order: 1, ParentID: &techCat.ID},
			{Name: "Gadgets", Slug: "gadgets", Type: model.CategoryTypeBlog, Status: model.CategoryStatusActive, Order: 2, ParentID: &techCat.ID},
		}

		for _, sub := range subCategories {
			if err := db.Where("slug = ? AND type = ?", sub.Slug, sub.Type).FirstOrCreate(&sub).Error; err != nil {
				logger.Error("Failed to create subcategory", zap.String("category", sub.Name), zap.Error(err))
				return err
			}
		}
	}

	logger.Info("Categories seeded successfully")
	return nil
}
