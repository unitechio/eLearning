export interface Folder {
  id: number;
  name: string;
  parent_id?: number;
  owner_id: string;
  created_at: string;
  updated_at: string;
  children?: Folder[];
}

export interface FileAsset {
  id: number;
  document_id: number;
  version_id: number;
  storage_key: string;
  original_name: string;
  mime_type: string;
  extension: string;
  size: number;
  checksum?: string;
  width?: number;
  height?: number;
  duration?: number;
  page_count?: number;
  thumbnail_key?: string;
  preview_key?: string;
  created_at: string;
}

export interface DocumentVersion {
  id: number;
  document_id: number;
  file_asset_id: number;
  version_number: number;
  created_by: string;
  change_summary?: string;
  created_at: string;
  file_asset: FileAsset;
  creator?: {
    id: string;
    first_name?: string;
    last_name?: string;
    email: string;
  };
}

export interface DocumentPermission {
  id: number;
  document_id: number;
  subject_type: 'user' | 'role';
  subject_id: string;
  permission: 'viewer' | 'editor' | 'owner';
  created_at: string;
}

export interface DocumentActivity {
  id: number;
  document_id: number;
  actor_id: string;
  action: string;
  metadata?: string;
  created_at: string;
  actor?: {
    id: string;
    first_name?: string;
    last_name?: string;
    email: string;
  };
}

export interface Document {
  id: number;
  title: string;
  description?: string;
  owner_id: string;
  folder_id?: number;
  status: 'active' | 'processing' | 'failed' | 'archived' | 'deleted';
  visibility: 'public' | 'private';
  current_version_id?: number;
  is_favorite: boolean;
  created_at: string;
  updated_at: string;
  owner?: {
    id: string;
    first_name?: string;
    last_name?: string;
    email: string;
  };
  folder?: Folder;
  current_version?: DocumentVersion;
}

export interface DocumentStats {
  total_documents: number;
  total_storage: number;
  uploaded_month: number;
  stats_by_type: Record<string, number>;
}
