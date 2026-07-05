import { AccessMenuItem, AccessPermission, AccessRole, AccessUser } from './model';

export const accessRoles: AccessRole[] = [
  {
    id: 'role-admin',
    name: 'Administrator',
    description: 'Toan quyen cau hinh he thong, quan ly nguoi dung va audit.',
    status: 'active',
    memberCount: 2,
    permissionCount: 24,
    createdAt: '2026-04-20',
  },
  {
    id: 'role-content',
    name: 'Content Manager',
    description: 'Quan ly noi dung, danh muc va workflow phe duyet.',
    status: 'active',
    memberCount: 5,
    permissionCount: 12,
    createdAt: '2026-04-22',
  },
  {
    id: 'role-support',
    name: 'Support Staff',
    description: 'Ho tro nguoi dung, xem ho so va cap nhat ticket noi bo.',
    status: 'inactive',
    memberCount: 3,
    permissionCount: 8,
    createdAt: '2026-04-25',
  },
];

export const accessPermissions: AccessPermission[] = [
  {
    id: 'perm-user-read',
    code: 'user.read',
    name: 'Xem danh sach nguoi dung',
    description: 'Cho phep xem danh sach, chi tiet va bo loc nguoi dung.',
    group: 'Nguoi dung',
  },
  {
    id: 'perm-user-write',
    code: 'user.write',
    name: 'Cap nhat nguoi dung',
    description: 'Cho phep tao moi, chinh sua va khoa tai khoan.',
    group: 'Nguoi dung',
  },
  {
    id: 'perm-role-read',
    code: 'role.read',
    name: 'Xem vai tro',
    description: 'Cho phep xem danh sach vai tro va cac quyen thuoc vai tro.',
    group: 'Vai tro',
  },
  {
    id: 'perm-role-write',
    code: 'role.write',
    name: 'Cap nhat vai tro',
    description: 'Cho phep tao moi, doi ten va cap nhat mo ta vai tro.',
    group: 'Vai tro',
  },
  {
    id: 'perm-permission-assign',
    code: 'permission.assign',
    name: 'Gan quyen',
    description: 'Cho phep gan va thu hoi permission cho vai tro.',
    group: 'Phan quyen',
  },
  {
    id: 'perm-menu-config',
    code: 'menu.config',
    name: 'Cau hinh menu',
    description: 'Cho phep sap xep menu, doi icon va cau hinh route.',
    group: 'Dieu huong',
  },
];

export const accessUsers: AccessUser[] = [
  {
    id: 'user-001',
    employeeCode: 'EMP001',
    fullName: 'Tran Van Vuong',
    email: 'vuong.tran@eenglish.local',
    department: 'Operations',
    status: 'active',
    roles: ['Administrator'],
  },
  {
    id: 'user-002',
    employeeCode: 'EMP014',
    fullName: 'Nguyen Minh Chau',
    email: 'chau.nguyen@eenglish.local',
    department: 'Content',
    status: 'active',
    roles: ['Content Manager'],
  },
  {
    id: 'user-003',
    employeeCode: 'EMP021',
    fullName: 'Le Hoang Nam',
    email: 'nam.le@eenglish.local',
    department: 'Support',
    status: 'inactive',
    roles: ['Support Staff'],
  },
];

export const accessMenuItems: AccessMenuItem[] = [
  {
    id: 'menu-dashboard',
    title: 'Dashboard',
    path: '/dashboard',
    icon: 'layout-dashboard',
    order: 10,
    level: 0,
  },
  {
    id: 'menu-user-root',
    title: 'Quan ly nguoi dung',
    path: '/preview/user',
    icon: 'users',
    order: 20,
    level: 0,
    permissionCode: 'user.read',
  },
  {
    id: 'menu-user-list',
    title: 'Danh sach nguoi dung',
    path: '/preview/user/users',
    icon: 'user-round',
    order: 21,
    level: 1,
    parentId: 'menu-user-root',
    permissionCode: 'user.read',
  },
  {
    id: 'menu-user-role',
    title: 'Vai tro',
    path: '/preview/user/roles',
    icon: 'shield-check',
    order: 22,
    level: 1,
    parentId: 'menu-user-root',
    permissionCode: 'role.read',
  },
  {
    id: 'menu-user-permission',
    title: 'Permission catalog',
    path: '/preview/user/permissions',
    icon: 'key-round',
    order: 23,
    level: 1,
    parentId: 'menu-user-root',
    permissionCode: 'permission.assign',
  },
];

export const rolePermissionMap: Record<string, string[]> = {
  Administrator: accessPermissions.map((permission) => permission.code),
  'Content Manager': ['user.read', 'role.read', 'permission.assign'],
  'Support Staff': ['user.read'],
};
