# LICENSES.md
> STI 2026 — Sistem dan Teknologi Informasi
> Third-Party Asset, Dependency & License Audit

---

## 1. REPOSITORY STATUS & AUDIT GOVERNANCE

> [!IMPORTANT]
> - **CURRENT REPOSITORY STATE: Documentation Phase Only.**
> - No `package.json` exists in the repository; zero npm packages have been downloaded or installed.
> - **Status Classification System:**
>   - `PROPOSED`: Architected and recommended; pending user confirmation before installation.
>   - `CONFIRMED`: User has formally approved the dependency.
>   - `USED`: Package has been installed, added to `package.json`, and audited in code.
> - **Verification Mandate:** All entries below are currently `PROPOSED`. Once Phase 1 commences, each package must undergo formal license verification (`npx license-checker`) upon installation.

---

## 2. SOFTWARE DEPENDENCIES AUDIT

---

### 2.1 Next.js Framework

| Attribute | Specification |
|-----------|---------------|
| **Package** | `next` |
| **Proposed Version** | 15.x (latest stable) |
| **Status** | `PROPOSED — PENDING APPROVAL` |
| **Upstream Source** | https://github.com/vercel/next.js |
| **Stated License** | MIT License |
| **Commercial Use Permitted** | Yes |
| **UI Attribution Required** | No |
| **Verification Rule** | Run `npx license-checker --packages next` immediately upon Phase 1 install. |
| **License URL** | https://github.com/vercel/next.js/blob/canary/license.md |

---

### 2.2 React & React DOM

| Attribute | Specification |
|-----------|---------------|
| **Package** | `react`, `react-dom` |
| **Proposed Version** | 19.x (bundled with Next.js 15) |
| **Status** | `PROPOSED — PENDING APPROVAL` |
| **Upstream Source** | https://github.com/facebook/react |
| **Stated License** | MIT License |
| **Commercial Use Permitted** | Yes |
| **UI Attribution Required** | No |
| **Verification Rule** | Verify in `package-lock.json` upon installation. |
| **License URL** | https://github.com/facebook/react/blob/main/LICENSE |

---

### 2.3 TypeScript Language

| Attribute | Specification |
|-----------|---------------|
| **Package** | `typescript` (devDependency) |
| **Proposed Version** | 5.x |
| **Status** | `PROPOSED — PENDING APPROVAL` |
| **Upstream Source** | https://github.com/microsoft/TypeScript |
| **Stated License** | Apache License 2.0 |
| **Commercial Use Permitted** | Yes |
| **UI Attribution Required** | No (compiler tooling only) |
| **Verification Rule** | Verify devDependency license. |
| **License URL** | https://github.com/microsoft/TypeScript/blob/main/LICENSE.txt |

---

### 2.4 Geist Typeface

| Attribute | Specification |
|-----------|---------------|
| **Asset** | Geist Font Family (Weights 400 & 500) |
| **Delivery Method** | `next/font/google` (pre-hosted & self-contained) |
| **Status** | `PROPOSED — PENDING APPROVAL` |
| **Creator / Copyright** | Vercel Inc. |
| **Stated License** | SIL Open Font License 1.1 (OFL-1.1) |
| **Commercial Use Permitted** | Yes |
| **UI Attribution Required** | No requirement to display font credit in the end-user UI. |
| **OFL Restrictions** | Cannot sell the font files standalone; modifications must not use reserved font name. |
| **License URL** | https://github.com/vercel/geist-font/blob/main/LICENSE.txt |

---

### 2.5 GSAP (GreenSock Animation Platform)

| Attribute | Specification |
|-----------|---------------|
| **Package** | `gsap` |
| **Proposed Version** | 3.x |
| **Status** | `PROPOSED — PENDING APPROVAL` |
| **Upstream Source** | https://github.com/greensock/GSAP |
| **Stated License** | GSAP Standard "No Charge" GreenSock License |
| **Commercial Use Permitted** | Yes (under Standard License for websites that don't charge multiple end-users for access) |
| **Restricted Club Plugins** | **STRICTLY PROHIBITED:** `SplitText`, `MorphSVG`, `DrawSVG`, `InertiaPlugin` are Club GreenSock paid plugins and must NOT be used without a paid commercial license. |
| **ScrollTrigger Status** | ScrollTrigger is included in the free standard license. |
| **UI Attribution Required** | Not required in UI under standard license. |
| **License URL** | https://gsap.com/licensing/ |

---

### 2.6 Icon Library Candidates

> [!IMPORTANT]
> **Status:** `[ICON LIBRARY] — PENDING APPROVAL`
> - Strictly one icon library may be selected and installed. Mixing icon sets is forbidden.

#### Option A: Lucide React (Recommended)
| Attribute | Specification |
|-----------|---------------|
| **Package** | `lucide-react` |
| **Status** | `PROPOSED (RECOMMENDED) — PENDING APPROVAL` |
| **Upstream Source** | https://github.com/lucide-icons/lucide |
| **License** | ISC License (Extremely permissive, functionally equivalent to MIT) |
| **Attribution Required** | No |
| **Suitability for Beau** | High — clean, uniform 1.5px/1.75px stroke geometry matches Geist font features. |
| **License URL** | https://github.com/lucide-icons/lucide/blob/main/LICENSE |

#### Option B: Heroicons
| Attribute | Specification |
|-----------|---------------|
| **Package** | `@heroicons/react` |
| **Status** | `ALTERNATIVE CANDIDATE — PENDING APPROVAL` |
| **Upstream Source** | https://github.com/tailwindlabs/heroicons |
| **License** | MIT License |
| **Attribution Required** | No |
| **Suitability for Beau** | Moderate — solid 1.5px outline set, but slightly bolder visual balance. |

#### Option C: Phosphor Icons
| Attribute | Specification |
|-----------|---------------|
| **Package** | `@phosphor-icons/react` |
| **Status** | `ALTERNATIVE CANDIDATE — PENDING APPROVAL` |
| **Upstream Source** | https://github.com/phosphor-icons/react |
| **License** | MIT License |
| **Attribution Required** | No |
| **Suitability for Beau** | Moderate — offers multiple weights (Thin, Light, Regular), but increases package overhead. |

---

## 3. MEDIA & PHOTOGRAPHY INTELLECTUAL PROPERTY

### 3.1 Student & Cohort Photography
- **Origin:** Submitted directly by STI 2026 students, cohort committees, and designated student photographers.
- **Copyright:** Retained by original student photographers and subjects.
- **Usage Rights:** Limited non-exclusive license granted to the STI 2026 digital yearbook for publication.
- **Attribution:** Individual photographer credit provided on image captions where requested.
- **Consent Status:** Every identifiable student must have an explicit signed/verified consent record (`consentPublic: true`).

### 3.2 Prohibited Assets
- ❌ **Commercial Stock Photography:** (e.g. Getty, Shutterstock, Unsplash corporate office photos) — strictly banned to protect cohort authenticity.
- ❌ **Third-Party AI-Generated Human Faces:** Strictly forbidden.

---

## 4. OPEN LICENSE DECISIONS & VERIFICATION CHECKLIST

| Decision ID | Item | Options | Recommendation | Status |
|-------------|------|---------|----------------|--------|
| **L1** | Icon System Selection | Lucide vs Heroicons vs Phosphor | **Lucide React** (ISC, 1.5px stroke, minimalist) | `[ICON LIBRARY] — PENDING APPROVAL` |
| **L2** | Geist Font Delivery | `next/font/google` vs npm `geist` | `next/font/google` (automated self-hosting, OFL) | `PROPOSED — PENDING APPROVAL` |
| **L3** | GSAP Standard License | Standard free vs CSS-only motion | **Standard Free GSAP** (ScrollTrigger included; no paid plugins) | `PROPOSED — PENDING APPROVAL` |
| **L4** | License Audit Command | Post-install CI verification | Run `npx license-checker --production --summary` | `PLANNED FOR PHASE 1` |
