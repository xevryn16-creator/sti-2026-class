# STI 2026 — Production Deployment & Supabase Migration Manual

Dokumentasi resmi prosedur deployment produksi dan migrasi database Supabase untuk sistem website dan CMS **STI 2026**.

---

## 1. Persiapan Infrastruktur Supabase

Untuk menjalankan STI 2026 di lingkungan cloud production, siapkan instance PostgreSQL dan Storage pada Supabase:

### 1.1 Pembuatan Proyek Supabase
1. Masuk ke [Supabase Dashboard](https://supabase.com/dashboard).
2. Buat proyek baru (*New Project*).
3. Simpan **Database Password**, **Project URL**, dan **API Keys**:
   - `Project URL`: `https://<project-ref>.supabase.co`
   - `Anon Key` (`public` role)
   - `Service Role Key` (`secret` role — JANGAN pernah dibagikan atau dibundle ke client!)

---

## 2. Eksekusi Skema Migrasi Database

Skema database relasional telah didefinisikan secara lengkap pada:
`supabase/migrations/20261001000000_initial_schema.sql`

Skema mencakup 11 tabel inti:
1. `cohort_metadata`
2. `students`
3. `roles`
4. `projects`
5. `memories`
6. `campus_photos`
7. `events`
8. `achievements`
9. `timeline`
10. `media_assets`
11. `audit_logs`

### Metode A: Menggunakan Supabase CLI (Direkomendasikan)
Jika Anda memiliki akses terminal dengan Supabase CLI:
```bash
# Login ke akun Supabase
npx supabase login

# Hubungkan ke proyek remote
npx supabase link --project-ref <project-ref>

# Terapkan migrasi ke database produksi
npx supabase db push
```

### Metode B: Melalui Supabase SQL Editor
1. Buka dashboard proyek Supabase Anda.
2. Buka menu **SQL Editor** pada sidebar kiri.
3. Klik **New Query**.
4. Salin seluruh isi berkas `supabase/migrations/20261001000000_initial_schema.sql`.
5. Klik tombol **Run** (Ctrl+Enter).
6. Pastikan seluruh tabel dan trigger berhasil dibuat tanpa error (`Success. No rows returned`).

---

## 3. Konfigurasi Storage Bucket (`media`)

Sistem upload CMS membutuhkan Supabase Storage bucket untuk menyimpan foto dan video angkatan:

1. Buka menu **Storage** pada dashboard Supabase.
2. Klik **New Bucket**.
3. Masukkan konfigurasi berikut:
   - **Name**: `media` (atau sesuai nilai `SUPABASE_STORAGE_BUCKET`, default: `sti-media`)
   - **Public bucket**: Aktifkan (`ON`) agar gambar dapat diakses secara publik oleh pengunjung situs.
   - **File size limit**: `50MB`
   - **Allowed MIME types**: `image/jpeg`, `image/png`, `image/webp`, `image/avif`, `video/mp4`, `video/webm`, `video/quicktime`
4. Simpan bucket.

### Kebijakan Akses Storage (RLS Policies)
Secara default, bucket publik mengizinkan pembacaan anonim. Konfigurasikan kebijakan akses:
- **SELECT (Read)**: `anon`, `authenticated` (izinkan akses publik untuk semua aset terbit).
- **INSERT (Upload)**: `service_role` / `authenticated` (hanya admin/editor yang dapat mengunggah melalui server action backend).
- **UPDATE / DELETE**: `service_role` / `authenticated` (hanya pengguna admin yang terotorisasi).

---

## 4. Konfigurasi Variabel Lingkungan (Hosting / Production Server)

Pada platform hosting produksi (Vercel, Cloudflare Pages, VPS Node.js, atau Railway), tambahkan Environment Variables berikut:

| Nama Variabel | Wajib/Opsional | Nilai Contoh | Keterangan |
|---|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Wajib | `https://sti2026.itb.ac.id` | URL kanonik domain publik |
| `NEXT_PUBLIC_SUPABASE_URL` | Wajib (Prod) | `https://xyzcompany.supabase.co` | Endpoint REST Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Wajib (Prod) | `eyJh...` | Public client anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Wajib (Prod) | `eyJh...` | Server-only key (JANGAN expose!) |
| `SUPABASE_STORAGE_BUCKET` | Opsional | `sti-media` | Nama bucket storage |
| `ADMIN_SESSION_SECRET` | Wajib | `32+ random characters string` | Kunci tanda tangan HMAC-SHA256 cookie |
| `ADMIN_EMAIL` | Wajib (Prod) | `admin@sti2026.itb.ac.id` | Email akun administrator produksi |
| `ADMIN_PASSWORD` | Wajib (Prod) | `[Password acak kuat]` | Kata sandi unik administrator produksi |
| `EDITOR_EMAIL` | Opsional | `editor@sti2026.itb.ac.id` | Email staf redaksi |
| `EDITOR_PASSWORD` | Opsional | `[Password acak staf]` | Kata sandi staf redaksi |
| `STORAGE_DRIVER` | Wajib (Prod) | `supabase` | Alihkan penyimpanan media ke Supabase |

> **PERHATIAN KEAMANAN:**
> Di lingkungan produksi (`NODE_ENV=production`), sistem secara otomatis mematikan akun fallback dev. Anda **wajib** mengisi `ADMIN_EMAIL` dan `ADMIN_PASSWORD` dengan nilai rahasia di environment hosting.

---

## 5. Prosedur Build & Deployment

Untuk melakukan build di lingkungan produksi:
```bash
# 1. Pastikan seluruh dependensi terpasang
npm install --frozen-lockfile

# 2. Verifikasi tipe TypeScript
npm run typecheck

# 3. Jalankan pengujian QA otomatis (45 tests)
npm test

# 4. Bangun bundel Next.js App Router
npm run build

# 5. Jalankan server produksi
npm start
```

---

## 6. Verifikasi Pasca-Deployment (Post-Deploy Checklist)

Setelah situs live di domain produksi:
1. [ ] Buka `https://<domain>/admin/login`. Pastikan halaman login terbuka dengan aman melalui HTTPS.
2. [ ] Masuk menggunakan akun admin produksi (`ADMIN_EMAIL` & `ADMIN_PASSWORD`).
3. [ ] Buat 1 entitas uji non-publik (`consentPublic: false`), simpan sebagai draft.
4. [ ] Buka rute publik di jendela incognito. Pastikan entitas draft tidak muncul pada direktori.
5. [ ] Terbitkan entitas uji dan berikan `consentPublic: true`.
6. [ ] Periksa rute publik; pastikan profil langsung tampil dan gambar teroptimasi.
7. [ ] Hapus/arsipkan entitas uji untuk menjaga kebersihan data angkatan.
