# STI 2026 — Admin & CMS Architecture & Operations Manual

Dokumentasi resmi arsitektur sistem Content Management System (CMS), portal redaksi `/admin`, otentikasi, otorisasi, validasi media, audit logging, dan integrasi dengan situs publik STI 2026.

---

## 1. Ringkasan Arsitektur

Portal redaksi STI 2026 dirancang di atas **Next.js 15 App Router** dengan pendekatan **Hybrid Storage**:
1. **Cloud Production (Supabase)**: Memanfaatkan PostgreSQL dengan Row-Level Security (RLS) dan Supabase Storage untuk penyimpanan data relasional dan aset media.
2. **Local Development & Offline Fallback**: Menggunakan penyimpanan JSON lokal (`src/data/*.json`) dan sistem berkas statis (`public/uploads/`) saat variabel lingkungan Supabase belum dikonfigurasi. Hal ini memastikan seluruh alur kerja redaksi dapat diuji dan dikembangkan secara lokal tanpa ketergantungan pada koneksi cloud.

### Diagram Alur Data

```text
[ ADMIN PANEL UI (/admin) ]
       │
       ▼ (Server Actions + RBAC)
[ CMS Store Layer (src/lib/cms/store.ts) ]
       │
       ├─── Supabase Configured? ───► [ PostgreSQL via @supabase/supabase-js ]
       │                              [ Supabase Storage: bucket 'media' ]
       └─── Fallback / Local Dev ───► [ src/data/*.json ]
                                      [ public/uploads/ ]
                                               │
                                               ▼
                                 [ Public Data Accessor (src/lib/data.ts) ]
                                               │
                                 [ Privacy & Consent Firewall ]
                                 (consentPublic === true & publishStatus === 'published')
                                               │
                                               ▼
                                   [ Public Website (STI 2026) ]
```

---

## 2. Autentikasi & Otorisasi

### 2.1 Mekanisme Sesi
- Sesi dikelola menggunakan **HTTP-Only, Secure, SameSite=Lax Cookie** bernama `sti_admin_session`.
- Token sesi ditandatangani menggunakan algoritma **HMAC-SHA256** melalui standar **Web Crypto API** (`crypto.subtle`), sehingga kompatibel dengan Node.js runtime dan Edge Middleware.
- Kedaluwarsa sesi diatur selama **7 hari**.

### 2.2 Role-Based Access Control (RBAC)
Sistem membedakan dua level peran:
- **`admin`**: Memiliki hak akses penuh untuk membuat, memperbarui, mempublikasikan, dan menghapus entitas (termasuk tindakan destruktif).
- **`editor`**: Memiliki hak akses untuk mengelola konten (CRUD data mahasiswa, proyek, cerita memori, dan agenda), namun tidak diizinkan menjalankan operasi penghapusan kritis atau mengubah konfigurasi sistem.

### 2.3 Rute & Perlindungan Server-Side
- Rute `/admin/*` dilindungi oleh Next.js **Middleware** (`src/middleware.ts`) dan server-side session validator (`requireSession()`, `requireRole()`).
- Upaya akses tidak terotentikasi otomatis dialihkan ke `/admin/login` dengan parameter query `?redirect=<target_path>`.

---

## 3. Fitur Utama Admin CMS

### 3.1 Dashboard Redaksi (`/admin/dashboard`)
- **Metrik Utama**: Total mahasiswa terdaftar, jumlah mahasiswa yang telah memberikan izin (consent), total katalog proyek, arsip kenangan, dan agenda angkatan.
- **Content Readiness Checklist**: Audit otomatis kesiapan konten (Foto Formal Angkatan, Direktori Mahasiswa, Persetujuan Publik, Katalog Proyek, Arsip Memori, dan Berkas Media).
- **Aksi Cepat & Log Aktivitas**: Pintasan formulir dan daftar log audit terkini.

### 3.2 Direktori Mahasiswa (`/admin/students`)
- **CRUD Penuh**: Tambah, edit, dan arsipkan profil mahasiswa.
- **Privacy & Consent Firewall**:
  - Mahasiswa dengan `consentPublic: false` diberi tanda merah **✕ TIDAK PUBLIK** dan diblokir dari seluruh rute publik.
  - Peringatan aktif otomatis muncul jika editor mencoba mengubah data tanpa izin publik.
  - Validasi PII ketat mencegah masuknya nomor telepon, alamat rumah, NIM, atau IPK.

### 3.3 Katalog Proyek & Inovasi (`/admin/projects`)
- Manajemen karya, prototipe, dan produk mahasiswa.
- Referensi anggota tim terhubung langsung dengan ID mahasiswa terverifikasi.
- Pengaturan highlight "Featured Showcase" pada beranda.

### 3.4 Arsip Kenangan (`/admin/memories`)
- Pengelolaan album foto, periode semester, dan narasi cerita kebersamaan angkatan.
- Penataan urutan foto dan teks alternatif (alt text) untuk aksesibilitas.

### 3.5 Agenda & Timeline Perjalanan (`/admin/events`)
- Pengelolaan acara akademik, wisuda, pameran, dan agenda sosial.
- Pemantauan timeline perjalanan semester 2022 hingga 2026.

### 3.6 Media Library & Unggah Berkas (`/admin/media`)
- **Validasi Berkas**:
  - Format Gambar yang diizinkan: JPG, PNG, WebP, AVIF (Maksimal 10MB).
  - Format Video yang diizinkan: MP4, WebM, QuickTime (Maksimal 50MB).
- **Sanitasi Nama Berkas**: Mencegah serangan *path traversal* dengan mengubah nama menjadi alfanumerik aman berstempel waktu.
- **Pemrosesan Gambar (Sharp)**:
  - Otomatis menghapus seluruh metadata EXIF (termasuk koordinat GPS privasi).
  - Optimasi otomatis ke format WebP berkualitas 85%.
- **Fitur Salin URL**: Mempermudah penyisipan aset media ke dalam formulir konten.

### 3.7 Log Audit (`/admin/settings`)
- Mencatat setiap aksi redaksi (`create`, `update`, `delete`, `upload`) beserta aktor, peran, entitas, ID sasaran, dan stempel waktu.

---

## 4. Konfigurasi Lingkungan (Environment Setup)

Salin `.env.example` ke `.env.local` untuk mengatur kredensial:

```bash
# Supabase Configuration (Opsional untuk development, wajib untuk cloud production)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# CMS Admin Session Secret (Minimal 32 karakter acak)
ADMIN_SESSION_SECRET=your-32-character-secret-key-here

# Default Redaksi (Development Bootstrap Only — Wajib diganti di production!)
ADMIN_EMAIL=admin@sti2026.itb.ac.id
ADMIN_PASSWORD=AdminSTI2026!Editorial
ADMIN_DEFAULT_ROLE=admin
```

> **PERINGATAN KEAMANAN PRODUKSI:**
> Di lingkungan `NODE_ENV=production`, sistem otentikasi secara otomatis **menolak fallback kredensial default**. Kredensial produksi harus disetel melalui variabel lingkungan yang aman (`ADMIN_EMAIL` / `ADMIN_PASSWORD`) atau melalui integrasi Supabase Auth. Kredensial default tidak akan pernah dibundle ke client browser dan tidak akan berfungsi di server produksi.

---

## 5. Menjalankan Database Migrations (Supabase Production)

Jika menggunakan instance Supabase production:
1. Masuk ke Supabase SQL Editor atau gunakan Supabase CLI:
   ```bash
   supabase db push
   ```
   atau jalankan isi berkas migrasi:
   `supabase/migrations/20261001000000_initial_schema.sql`
2. Buat storage bucket publik bernama `media` pada menu **Storage** Supabase.
3. Konfigurasikan policy RLS storage agar hanya admin bertoken yang dapat menulis (`INSERT`), sedangkan publik dapat membaca (`SELECT`).

---

## 6. Prosedur QA & Verifikasi

Jalankan pengujian otomatis untuk memvalidasi keamanan, privasi, build, dan tipografi:
```bash
# Menjalankan 40 pengujian otomatis (PII, referential integrity, HTML semantic, tokens, CMS QA)
npm test

# Verifikasi strict typecheck
npm run typecheck

# Verifikasi Next.js static and dynamic route generation
npm run build
```
Semua perintah di atas diverifikasi **100% PASS** tanpa error.

---

## 7. Model Publikasi (Build-Gated)

Situs publik STI 2026 adalah **publikasi statis** (docs/ARCHITECTURE.md §9): halaman
publik meng-import `src/data/*.json` pada saat **build**, sama seperti aset statis
lainnya. CMS menyimpan perubahan editorial seketika, tetapi situs publik baru berubah
setelah **build berikutnya** dijalankan dan di-deploy.

### 7.1 Implikasi operasional

| Tindakan di CMS | Efek pada situs publik |
| --- | --- |
| Menyimpan / mengubah / menghapus data | Tersimpan seketika di CMS; publik **belum** berubah |
| Mengunggah berkas media | Berkas masuk ke `public/uploads/`; publik **belum** menyajikannya |
| `npm run build` + deploy | Seluruh perubahan (termasuk media) menjadi tayang |

Konsekuensinya, `revalidatePath()` **tidak dipakai** untuk rute publik: data sudah
di-inline saat build sehingga revalidasi runtime tidak akan menerbitkan apa pun.
Klaim palsu semacam itu dihindari; sebagai gantinya UI CMS menampilkan status
publikasi yang sebenarnya melalui `src/lib/cms/publish.ts`
(`pending-rebuild` / `in-sync` / `development`).

### 7.2 Status publikasi di UI CMS

Setiap halaman CMS menampilkan satu banner status:

- **Perubahan menunggu build & deploy** — ada berkas konten yang lebih baru daripada
  build terakhir (`.next/BUILD_ID`). Jalankan `npm run build`, lalu deploy ulang.
- **Situs publik sesuai build terakhir** — tidak ada perubahan yang tertunda.
- **Mode pengembangan** — `next dev` memuat data terbaru secara langsung; perilaku
  build-gated hanya berlaku pada build produksi.

Status ini dihitung dari mtime berkas konten dibandingkan waktu build, sehingga selalu
akurat tanpa perlu pencatatan manual.

### 7.3 Media

- **Driver lokal:** berkas di `public/uploads/` adalah **input build**, sehingga harus
  ikut ter-commit/ter-deploy agar muncul di situs publik (karena itu
  `src/data/media-assets.json` dan `public/uploads/` tidak di-ignore oleh git).
- **Produksi (disarankan):** gunakan **Supabase Storage** agar URL media bersifat publik
  dan tidak perlu menyimpan biner di repositori.
- `src/data/audit-logs.json` bersifat operasional (bukan input build) dan di-ignore.

> Mode Supabase pada `src/lib/cms/store.ts` tetap kompatibel: perubahan tetap tercatat
> dan build berikutnya mengambil data dari sumber yang sama.
