# 🌿 Swasthyokor (স্বস্থ্যকর) - Modern Next.js 16 & PostgreSQL Migration Progress

## 📋 Overview
Full-scale architectural rewrite and modernization of the **Swasthyokor** organic and pure food marketplace. Upgraded legacy Next.js patterns into high-performance **Next.js 16 (App Router + Turbopack + React 19)**, **PostgreSQL with Drizzle ORM**, **Tailwind CSS v4 (`@theme inline`)**, **Base UI (`@base-ui/react`) + shadcn UI**, and **TanStack Query v5**.

---

## 🏗️ 1. Database Architecture & PostgreSQL Setup
- **PostgreSQL Connection**: Configured connection pool for PostgreSQL on port `5433` (`DATABASE_URL`).
- **Drizzle ORM Schema (`src/lib/db/schema.ts`)**:
  - `products`: Product catalog with slug, title, description, HTML body, tags, availability, and timestamps.
  - `product_images`: Multi-image support with sort ordering and dimensions.
  - `product_variants`: SKU variants with price amounts, currency, inventory status, and `jsonb` selected options.
  - `product_options`: Product variant option definitions (e.g. Size, Weight).
  - `collections`: Taxonomy and curated collections (`featured`, `carousel`, `honey`, `ghee`, `oil`).
  - `product_collections`: Many-to-many junction table with cascade deletion.
  - `carts` & `cart_items`: Full persistent shopping cart system.
  - `orders`: Order placement, total calculations, currency, and line items snapshot.
  - `pages`: Dynamic CMS pages (`about`, `terms`, `privacy`, `shipping-returns`).
  - `menus`: Header and footer menu hierarchies.
- **Migration & Seeding**:
  - Executed migration `drizzle/0000_spooky_luckman.sql`.
  - Seeded realistic Bengali & English organic marketplace catalog (`src/lib/db/seed.ts`).

---

## ⚡ 2. Next.js 16 App Router & Route Handlers
- **`src/app/layout.tsx`**: Root layout featuring Google Font `Hind_Siliguri`, Theme providers, Navbar, Footer, Toaster, and QueryProvider.
- **`src/app/page.tsx`**: Landing page featuring the modernized `ThreeItemGrid` and animated `Carousel`.
- **`src/app/product/[handle]/page.tsx`**: Product details page with image gallery, interactive variant selector, description, JSON-LD Schema.org SEO, and modernized Related Products.
- **`src/app/search/page.tsx` & `src/app/search/[collection]/page.tsx`**: Dynamic search & category catalog with collection filtering and sorting.
- **`src/app/order/[id]/page.tsx`**: Order receipt and confirmation view.
- **`src/app/[page]/page.tsx`**: Dynamic CMS page renderer.
- **`src/app/opengraph-image.tsx`**: Dynamic OpenGraph image generator using `next/og`.
- **`src/app/sitemap.ts` & `src/app/robots.ts`**: Search engine indexing configurations.

---

## 🎨 3. UI & Styling Modernization (Tailwind CSS v4 & shadcn)
- **Tailwind CSS v4**: Strict adherence to `@theme inline`, semantic color tokens (OKLCH), CSS container queries, and typography plugins (`@tailwindcss/container-queries`, `@tailwindcss/typography`).
- **shadcn UI & Base UI (`@base-ui/react`)**:
  - Integrated Base UI primitives for Accessible Dialog, Sheet, and Toast.
  - Cleaned non-standard components from `src/components/ui` to keep only official shadcn primitives.
  - Upgraded **Three-Item Grid** (`src/components/grid/three-items.tsx`), **Carousel** (`src/components/carousel.tsx`), and **Grid Tiles** (`src/components/grid/tile.tsx`) with modern rounded glassmorphic badges and hover interactions.

---

## 🛒 4. Cart & Server Actions
- **Server Actions (`src/lib/actions/cart.ts`, `src/lib/actions/checkout.ts`)**: Secure server-side mutations for adding items, updating quantities, deleting items, and checking out.
- **TanStack Query Hook (`src/hooks/use-cart.ts`)**: Optimistic updates and client state synchronization.

---

## 🧹 5. Code Quality, Linter & Build Verification
- **Biome Linter (`biome.json`)**:
  - Configured formatting and lint rules.
  - Removed all `biome-ignore` comments and resolved all type warnings.
  - Checked 61 files: **0 errors, 0 warnings**.
- **Build Verification**:
  - `bun run build` runs clean with full TypeScript checks and optimized static/dynamic page generation.
