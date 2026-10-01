import type {
  ClassEntity,
  StudentEntity,
  RoleEntity,
  ProjectEntity,
  MemoryEntity,
  CampusPhotoEntity,
  EventEntity,
  AchievementEntity,
  TimelineEntryEntity,
} from "./index";

export type PublishStatus = "draft" | "published" | "archived";
export type UserRole = "admin" | "editor";
export type MediaType = "image" | "video";

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

export interface AdminSession {
  user: AdminUser;
  expiresAt: number;
}

export interface MediaAssetEntity {
  id: string;
  filename: string;
  url: string;
  mimeType: string;
  sizeBytes: number;
  width?: number;
  height?: number;
  type: MediaType;
  altText?: string;
  createdAt: string;
  createdBy?: string;
}

export interface AuditLogEntry {
  id: string;
  actorEmail: string;
  actorRole: UserRole;
  action: string;
  entity: string;
  entityId: string;
  details?: Record<string, unknown>;
  createdAt: string;
}

export interface ContentReadinessItem {
  key: string;
  label: string;
  ready: boolean;
  count?: number;
  total?: number;
  detail?: string;
}

export interface CMSDashboardStats {
  totalStudents: number;
  consentedStudents: number;
  totalProjects: number;
  totalMemories: number;
  totalEvents: number;
  totalMedia: number;
  draftsCount: number;
  publishedCount: number;
  readiness: ContentReadinessItem[];
  recentLogs: AuditLogEntry[];
}

export interface CMSStudentItem extends StudentEntity {
  publishStatus?: PublishStatus;
  sortOrder?: number;
  updatedAt?: string;
}

export interface CMSProjectItem extends ProjectEntity {
  publishStatus?: PublishStatus;
  sortOrder?: number;
  updatedAt?: string;
}

export interface CMSMemoryItem extends MemoryEntity {
  publishStatus?: PublishStatus;
  sortOrder?: number;
  updatedAt?: string;
}

export interface CMSEventItem extends EventEntity {
  publishStatus?: PublishStatus;
  updatedAt?: string;
}

export interface CMSTimelineItem extends TimelineEntryEntity {
  publishStatus?: PublishStatus;
  sortOrder?: number;
  updatedAt?: string;
}
