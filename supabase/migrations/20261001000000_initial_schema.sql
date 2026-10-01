-- ====================================================================
-- STI 2026 — PostgreSQL & Supabase Database Migration
-- Architecture: docs/ARCHITECTURE.md & docs/ADMIN.md
-- Data Model: docs/DATA_MODEL.md
-- ====================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- --------------------------------------------------------------------
-- 1. ENUMS
-- --------------------------------------------------------------------
CREATE TYPE publish_status_enum AS ENUM ('draft', 'published', 'archived');
CREATE TYPE user_role_enum AS ENUM ('admin', 'editor');
CREATE TYPE media_type_enum AS ENUM ('image', 'video');
CREATE TYPE project_status_enum AS ENUM ('completed', 'in-progress', 'prototype', 'archived');

-- --------------------------------------------------------------------
-- 2. COHORT METADATA (SINGLETON)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS cohort_metadata (
  id TEXT PRIMARY KEY DEFAULT 'sti-2026',
  name TEXT NOT NULL DEFAULT 'STI 2026',
  program_name TEXT NOT NULL DEFAULT 'Sistem dan Teknologi Informasi',
  program_abbreviation TEXT NOT NULL DEFAULT 'STI',
  faculty TEXT NOT NULL DEFAULT 'Sekolah Teknik Elektro dan Informatika',
  university TEXT NOT NULL DEFAULT 'Institut Teknologi Bandung',
  graduation_year INTEGER NOT NULL DEFAULT 2026,
  motto TEXT,
  statement TEXT NOT NULL DEFAULT '',
  class_photo_formal TEXT,
  closing_photo TEXT,
  valedictory_title TEXT NOT NULL DEFAULT '',
  valedictory_body TEXT[] NOT NULL DEFAULT '{}',
  sign_off TEXT NOT NULL DEFAULT 'Keluarga Besar STI 2026',
  stats JSONB NOT NULL DEFAULT '[]'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- --------------------------------------------------------------------
-- 3. STUDENTS
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS students (
  id TEXT PRIMARY KEY, -- Slug-based unique identifier e.g. "ahmad-fauzi"
  name TEXT NOT NULL,
  nickname TEXT,
  photo TEXT NOT NULL DEFAULT '',
  photo_fallback TEXT,
  bio TEXT,
  interests TEXT[] NOT NULL DEFAULT '{}',
  quote TEXT,
  social_links JSONB NOT NULL DEFAULT '[]'::jsonb,
  consent_public BOOLEAN NOT NULL DEFAULT false,
  consent_date TIMESTAMPTZ,
  publish_status publish_status_enum NOT NULL DEFAULT 'draft',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_students_consent_status ON students(consent_public, publish_status);

-- --------------------------------------------------------------------
-- 4. ROLES
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS roles (
  id TEXT PRIMARY KEY,
  label TEXT NOT NULL,
  student_id TEXT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  period TEXT,
  division TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_roles_student_id ON roles(student_id);

-- --------------------------------------------------------------------
-- 5. PROJECTS
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY, -- Slug-based identifier
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  cover_image TEXT NOT NULL DEFAULT '',
  members JSONB NOT NULL DEFAULT '[]'::jsonb, -- Array of { studentId: string, role?: string }
  technology TEXT[] NOT NULL DEFAULT '{}',
  link TEXT,
  year INTEGER,
  status project_status_enum NOT NULL DEFAULT 'completed',
  category TEXT,
  course TEXT,
  gallery TEXT[] NOT NULL DEFAULT '{}',
  featured BOOLEAN NOT NULL DEFAULT false,
  publish_status publish_status_enum NOT NULL DEFAULT 'draft',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_projects_status ON projects(publish_status, featured);

-- --------------------------------------------------------------------
-- 6. MEMORIES & CAMPUS PHOTOS
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS memories (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  period TEXT,
  category TEXT,
  photos JSONB NOT NULL DEFAULT '[]'::jsonb, -- Array of { src, alt, caption?, width?, height? }
  publish_status publish_status_enum NOT NULL DEFAULT 'draft',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS campus_photos (
  id TEXT PRIMARY KEY,
  src TEXT NOT NULL,
  alt TEXT NOT NULL,
  caption TEXT,
  activity TEXT,
  date TEXT,
  publish_status publish_status_enum NOT NULL DEFAULT 'draft',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- --------------------------------------------------------------------
-- 7. EVENTS & TIMELINE
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS events (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  date TEXT NOT NULL,
  description TEXT NOT NULL,
  location TEXT,
  poster TEXT,
  category TEXT,
  publish_status publish_status_enum NOT NULL DEFAULT 'draft',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS achievements (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  student_id TEXT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  year INTEGER,
  competition TEXT,
  category TEXT,
  description TEXT,
  consent_public BOOLEAN NOT NULL DEFAULT false,
  publish_status publish_status_enum NOT NULL DEFAULT 'draft',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS timeline (
  id TEXT PRIMARY KEY,
  milestone TEXT NOT NULL,
  date TEXT NOT NULL,
  description TEXT,
  category TEXT,
  image TEXT,
  publish_status publish_status_enum NOT NULL DEFAULT 'draft',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- --------------------------------------------------------------------
-- 8. MEDIA ASSETS LIBRARY
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS media_assets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  filename TEXT NOT NULL,
  url TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  size_bytes BIGINT NOT NULL,
  width INTEGER,
  height INTEGER,
  type media_type_enum NOT NULL DEFAULT 'image',
  alt_text TEXT,
  created_by TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_media_type ON media_assets(type);

-- --------------------------------------------------------------------
-- 9. AUDIT LOGS
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  actor_email TEXT NOT NULL,
  actor_role user_role_enum NOT NULL DEFAULT 'editor',
  action TEXT NOT NULL,
  entity TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  details JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at DESC);

-- --------------------------------------------------------------------
-- 10. ROW LEVEL SECURITY (RLS) POLICIES
-- --------------------------------------------------------------------
ALTER TABLE cohort_metadata ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE memories ENABLE ROW LEVEL SECURITY;
ALTER TABLE campus_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE timeline ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Public READ: only published and consented records
CREATE POLICY "Public Read Cohort Metadata" ON cohort_metadata FOR SELECT USING (true);

CREATE POLICY "Public Read Students" ON students FOR SELECT
  USING (publish_status = 'published' AND consent_public = true);

CREATE POLICY "Public Read Roles" ON roles FOR SELECT USING (true);

CREATE POLICY "Public Read Projects" ON projects FOR SELECT
  USING (publish_status = 'published');

CREATE POLICY "Public Read Memories" ON memories FOR SELECT
  USING (publish_status = 'published');

CREATE POLICY "Public Read Campus Photos" ON campus_photos FOR SELECT
  USING (publish_status = 'published');

CREATE POLICY "Public Read Events" ON events FOR SELECT
  USING (publish_status = 'published');

CREATE POLICY "Public Read Achievements" ON achievements FOR SELECT
  USING (publish_status = 'published' AND consent_public = true);

CREATE POLICY "Public Read Timeline" ON timeline FOR SELECT
  USING (publish_status = 'published');

CREATE POLICY "Public Read Media Assets" ON media_assets FOR SELECT USING (true);

-- Authenticated Admin/Editor FULL ACCESS:
CREATE POLICY "Admin Full Access Cohort Metadata" ON cohort_metadata FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin Full Access Students" ON students FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin Full Access Roles" ON roles FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin Full Access Projects" ON projects FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin Full Access Memories" ON memories FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin Full Access Campus Photos" ON campus_photos FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin Full Access Events" ON events FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin Full Access Achievements" ON achievements FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin Full Access Timeline" ON timeline FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin Full Access Media Assets" ON media_assets FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin Full Access Audit Logs" ON audit_logs FOR ALL TO authenticated USING (true);
