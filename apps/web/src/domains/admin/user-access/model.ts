export type AccessStatus = 'active' | 'inactive';

export interface AccessRole {
  id: string;
  name: string;
  description: string;
  status: AccessStatus;
  memberCount: number;
  permissionCount: number;
  createdAt: string;
}

export interface AccessPermission {
  id: string;
  code: string;
  name: string;
  description: string;
  group: string;
}

export interface AccessUser {
  id: string;
  employeeCode: string;
  fullName: string;
  email: string;
  department: string;
  status: AccessStatus;
  roles: string[];
}

export interface AccessMenuItem {
  id: string;
  title: string;
  path: string;
  icon: string;
  order: number;
  level: number;
  parentId?: string;
  permissionCode?: string;
}
