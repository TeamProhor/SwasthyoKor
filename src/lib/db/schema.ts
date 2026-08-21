import { relations } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  jsonb,
  pgTable,
  primaryKey,
  real,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const collections = pgTable(
  "collections",
  {
    id: varchar("id", { length: 255 }).primaryKey(),
    handle: varchar("handle", { length: 255 }).notNull().unique(),
    title: varchar("title", { length: 255 }).notNull(),
    description: text("description"),
    seoTitle: varchar("seo_title", { length: 255 }),
    seoDescription: text("seo_description"),
    hidden: boolean("hidden").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [index("collections_handle_idx").on(table.handle)],
);

export const products = pgTable(
  "products",
  {
    id: varchar("id", { length: 255 }).primaryKey(),
    handle: varchar("handle", { length: 255 }).notNull().unique(),
    title: varchar("title", { length: 255 }).notNull(),
    description: text("description").notNull(),
    descriptionHtml: text("description_html"),
    tags: jsonb("tags").$type<string[]>().notNull().default([]),
    availableForSale: boolean("available_for_sale").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [index("products_handle_idx").on(table.handle)],
);

export const productImages = pgTable(
  "product_images",
  {
    id: varchar("id", { length: 255 }).primaryKey(),
    productId: varchar("product_id", { length: 255 })
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    url: text("url").notNull(),
    altText: text("alt_text").notNull(),
    width: integer("width").notNull(),
    height: integer("height").notNull(),
    position: integer("position").notNull().default(0),
  },
  (table) => [index("product_images_product_idx").on(table.productId)],
);

export const productOptions = pgTable(
  "product_options",
  {
    id: varchar("id", { length: 255 }).primaryKey(),
    productId: varchar("product_id", { length: 255 })
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    name: varchar("name", { length: 255 }).notNull(),
    position: integer("position").notNull().default(0),
    values: jsonb("values").$type<string[]>().notNull().default([]),
  },
  (table) => [index("product_options_product_idx").on(table.productId)],
);

export const productVariants = pgTable(
  "product_variants",
  {
    id: varchar("id", { length: 255 }).primaryKey(),
    productId: varchar("product_id", { length: 255 })
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    title: varchar("title", { length: 255 }).notNull(),
    priceAmount: real("price_amount").notNull(),
    priceCurrency: varchar("price_currency", { length: 10 })
      .notNull()
      .default("USD"),
    availableForSale: boolean("available_for_sale").notNull().default(true),
    position: integer("position").notNull().default(0),
    selectedOptions: jsonb("selected_options")
      .$type<{ name: string; value: string }[]>()
      .notNull()
      .default([]),
  },
  (table) => [index("product_variants_product_idx").on(table.productId)],
);

export const productCollections = pgTable(
  "product_collections",
  {
    productId: varchar("product_id", { length: 255 })
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    collectionId: varchar("collection_id", { length: 255 })
      .notNull()
      .references(() => collections.id, { onDelete: "cascade" }),
  },
  (table) => [
    primaryKey({ columns: [table.productId, table.collectionId] }),
    index("product_collections_collection_idx").on(table.collectionId),
    index("product_collections_product_idx").on(table.productId),
  ],
);

export const menus = pgTable(
  "menus",
  {
    id: varchar("id", { length: 255 }).primaryKey(),
    handle: varchar("handle", { length: 255 }).notNull(),
    title: varchar("title", { length: 255 }).notNull(),
    path: text("path").notNull(),
    position: integer("position").notNull().default(0),
  },
  (table) => [index("menus_handle_idx").on(table.handle)],
);

export const pages = pgTable(
  "pages",
  {
    id: varchar("id", { length: 255 }).primaryKey(),
    handle: varchar("handle", { length: 255 }).notNull().unique(),
    title: varchar("title", { length: 255 }).notNull(),
    body: text("body").notNull(),
    bodySummary: text("body_summary").notNull().default(""),
    seoTitle: varchar("seo_title", { length: 255 }),
    seoDescription: text("seo_description"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [index("pages_handle_idx").on(table.handle)],
);

export const carts = pgTable("carts", {
  id: varchar("id", { length: 255 }).primaryKey(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const cartItems = pgTable(
  "cart_items",
  {
    id: varchar("id", { length: 255 }).primaryKey(),
    cartId: varchar("cart_id", { length: 255 })
      .notNull()
      .references(() => carts.id, { onDelete: "cascade" }),
    productId: varchar("product_id", { length: 255 })
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    variantId: varchar("variant_id", { length: 255 })
      .notNull()
      .references(() => productVariants.id, { onDelete: "cascade" }),
    quantity: integer("quantity").notNull().default(1),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("cart_items_cart_idx").on(table.cartId),
    index("cart_items_variant_idx").on(table.variantId),
  ],
);

export const orders = pgTable("orders", {
  id: varchar("id", { length: 255 }).primaryKey(),
  email: varchar("email", { length: 255 }),
  totalAmount: real("total_amount").notNull(),
  totalCurrency: varchar("total_currency", { length: 10 })
    .notNull()
    .default("USD"),
  status: varchar("status", { length: 50 }).notNull().default("confirmed"),
  items: jsonb("items")
    .$type<
      {
        productHandle: string;
        productTitle: string;
        variantTitle: string;
        quantity: number;
        priceAmount: number;
        priceCurrency: string;
      }[]
    >()
    .notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// ---- relations ----

export const productsRelations = relations(products, ({ many }) => ({
  images: many(productImages),
  options: many(productOptions),
  variants: many(productVariants),
  collections: many(productCollections),
}));

export const productImagesRelations = relations(productImages, ({ one }) => ({
  product: one(products, {
    fields: [productImages.productId],
    references: [products.id],
  }),
}));

export const productOptionsRelations = relations(productOptions, ({ one }) => ({
  product: one(products, {
    fields: [productOptions.productId],
    references: [products.id],
  }),
}));

export const productVariantsRelations = relations(
  productVariants,
  ({ one }) => ({
    product: one(products, {
      fields: [productVariants.productId],
      references: [products.id],
    }),
  }),
);

export const productCollectionsRelations = relations(
  productCollections,
  ({ one }) => ({
    product: one(products, {
      fields: [productCollections.productId],
      references: [products.id],
    }),
    collection: one(collections, {
      fields: [productCollections.collectionId],
      references: [collections.id],
    }),
  }),
);

export const collectionsRelations = relations(collections, ({ many }) => ({
  products: many(productCollections),
}));

export const cartItemsRelations = relations(cartItems, ({ one }) => ({
  cart: one(carts, {
    fields: [cartItems.cartId],
    references: [carts.id],
  }),
  product: one(products, {
    fields: [cartItems.productId],
    references: [products.id],
  }),
  variant: one(productVariants, {
    fields: [cartItems.variantId],
    references: [productVariants.id],
  }),
}));

export const cartsRelations = relations(carts, ({ many }) => ({
  items: many(cartItems),
}));
