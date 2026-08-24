# SwasthyoKor (স্বাস্থ্যকর) - Development Progress & Architecture Report

> **Last Updated:** 2026-08-23  
> **Status:** Production-Ready (Next.js 16+, Turbopack, Neon Postgres, S3 Storage)

---

## 1. Authentication & Security Architecture

### Google OAuth & Resend Magic Link Integration
- **Postgres Auth Schema** ([`src/lib/db/schema.ts`](file:///root/WORK/swasthyokor/src/lib/db/schema.ts)):
  - `users`: Includes `isAdmin`, `isBanned`, `emailVerified`, `phone`, and avatar metadata.
  - `accounts`: Multi-provider support (`google`, `email`/password with Argon2 hashing).
  - `sessions`: 30-day sliding window session cookies (`swasthyokor_session`).
  - `magic_link_tokens`: Single-use 15-minute token lifecycle.
- **Endpoints & Helpers**:
  - Google OAuth token exchange: [`src/app/api/auth/oauth/google/route.ts`](file:///root/WORK/swasthyokor/src/app/api/auth/oauth/google/route.ts), [`src/app/api/auth/callback/google/route.ts`](file:///root/WORK/swasthyokor/src/app/api/auth/callback/google/route.ts).
  - Magic Link verification & Resend dispatch: [`src/lib/email.ts`](file:///root/WORK/swasthyokor/src/lib/email.ts), [`src/app/api/auth/verify/route.ts`](file:///root/WORK/swasthyokor/src/app/api/auth/verify/route.ts).
  - Session verification & Me endpoint: [`src/app/api/auth/me/route.ts`](file:///root/WORK/swasthyokor/src/app/api/auth/me/route.ts), [`src/lib/auth/session.ts`](file:///root/WORK/swasthyokor/src/lib/auth/session.ts).
  - Client authentication hooks: [`src/lib/auth-client.ts`](file:///root/WORK/swasthyokor/src/lib/auth-client.ts), [`src/hooks/use-auth.ts`](file:///root/WORK/swasthyokor/src/hooks/use-auth.ts).

### Route Protection & Proxy (`src/proxy.ts`)
- Implemented [`src/proxy.ts`](file:///root/WORK/swasthyokor/src/proxy.ts) using Next.js 16 proxy pattern.
- Protects `/dashboard/*` and `/admin/*` routes with automated redirect preservation (`callbackUrl`).
- Server-side role guard in [`src/app/(admin)/layout.tsx`](file:///root/WORK/swasthyokor/src/app/(admin)/layout.tsx) restricting admin panel strictly to users with `isAdmin: true`.

---

## 2. Admin Panel (`/admin`)

Built in strict conformity with `@.agents/skills/shadcn/SKILL.md` and `@.agents/skills/postgres-drizzle/SKILL.md`:

### Complete Pages & Sub-routes
1. **Overview Dashboard** ([`src/app/(admin)/admin/page.tsx`](file:///root/WORK/swasthyokor/src/app/(admin)/admin/page.tsx)):
   - Live metrics (Total Products, Orders, Revenue, Registered Users).
   - Recent products and recent orders summaries with shadcn `Card`, `Badge`, and `Empty` state composition.
2. **Products Management** ([`src/app/(admin)/admin/products/page.tsx`](file:///root/WORK/swasthyokor/src/app/(admin)/admin/products/page.tsx)):
   - Live products table with stock status and delete action.
   - **Responsive Product Creation Dialog** ([`src/components/admin/CreateProductDialog.tsx`](file:///root/WORK/swasthyokor/src/components/admin/CreateProductDialog.tsx)):
     - Powered by [`ResponsiveDialog`](file:///root/WORK/swasthyokor/src/components/shared/ResponsiveDialog.tsx) (modal on desktop, drawer on mobile).
     - Direct file upload to Neon S3 Object Storage (`swasthyokor-storage` bucket).
3. **Orders Tracking** ([`src/app/(admin)/admin/orders/page.tsx`](file:///root/WORK/swasthyokor/src/app/(admin)/admin/orders/page.tsx)):
   - Live order list, customer info, item details, order status toggles (Pending, Processing, Completed, Cancelled).
4. **Collections / Categories Management** ([`src/app/(admin)/admin/collections/page.tsx`](file:///root/WORK/swasthyokor/src/app/(admin)/admin/collections/page.tsx)):
   - Live collection list with handle/slug, description, and delete capabilities.
   - **Responsive Collection Creation Dialog** ([`src/components/admin/CreateCollectionDialog.tsx`](file:///root/WORK/swasthyokor/src/components/admin/CreateCollectionDialog.tsx)).
5. **Customer List** ([`src/app/(admin)/admin/customers/page.tsx`](file:///root/WORK/swasthyokor/src/app/(admin)/admin/customers/page.tsx)):
   - Registered users directory with avatars and role badges.

---

## 3. User Dashboard (`/dashboard`)

Complete suite of user account management pages:

1. **Dashboard Overview** ([`src/app/(dashboard)/dashboard/page.tsx`](file:///root/WORK/swasthyokor/src/app/(dashboard)/dashboard/page.tsx)):
   - Live metrics for Total Orders, Cart Item Count, Account Status, and Recent Order History.
2. **Order History & Tracking** ([`src/app/(dashboard)/dashboard/orders/page.tsx`](file:///root/WORK/swasthyokor/src/app/(dashboard)/dashboard/orders/page.tsx)):
   - Chronological table of customer orders with item count, status badge, total amount, and link to single-order receipt.
3. **Payment History** ([`src/app/(dashboard)/dashboard/payments/page.tsx`](file:///root/WORK/swasthyokor/src/app/(dashboard)/dashboard/payments/page.tsx)):
   - Transaction list, cumulative spend stats card, payment method indicator, and invoice link.
4. **Profile Management** ([`src/app/(dashboard)/dashboard/profile/page.tsx`](file:///root/WORK/swasthyokor/src/app/(dashboard)/dashboard/profile/page.tsx)):
   - Full name, mobile phone number, and avatar image upload to Neon S3 storage ([`src/components/dashboard/ProfileForm.tsx`](file:///root/WORK/swasthyokor/src/components/dashboard/ProfileForm.tsx)).
5. **Account Settings** ([`src/app/(dashboard)/dashboard/settings/page.tsx`](file:///root/WORK/swasthyokor/src/app/(dashboard)/dashboard/settings/page.tsx)):
   - Theme switch configuration (Dark/Light/System) and account security/verification badges.

---

## 4. Storage & Database Setup

- **PostgreSQL**: Hosted on Neon (`us-east-2`), pooled connection via Drizzle ORM.
- **Neon Object Storage (S3-compatible)**:
  - Branch storage endpoint configured with AWS SDK (`@aws-sdk/client-s3`).
  - Bucket: `swasthyokor-storage` (public read permissions).
  - Helper module: [`src/lib/storage.ts`](file:///root/WORK/swasthyokor/src/lib/storage.ts).

---

## 5. Build & Lint Verification
- **Biome Linter**: `bun run lint --write --unsafe` (0 errors).
- **TypeScript**: `tsc --noEmit` (0 errors).
- **Next.js Production Build**: `bun run build` (All user & admin routes statically/dynamically generated).
