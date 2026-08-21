import {
  eq,
  type InferSelectModel,
  ilike,
  inArray,
  or,
  type SQL,
} from "drizzle-orm";
import type {
  Cart,
  CartItem,
  Collection,
  Menu,
  Order,
  Page,
  Product,
} from "../types";
import { db } from "./index";
import {
  cartItems,
  carts,
  collections,
  menus,
  orders,
  pages,
  productCollections,
  type productImages,
  type productOptions,
  products,
  type productVariants,
} from "./schema";

type SortKey = "RELEVANCE" | "BEST_SELLING" | "CREATED_AT" | "PRICE";

type ProductRow = InferSelectModel<typeof products> & {
  images: InferSelectModel<typeof productImages>[];
  variants: InferSelectModel<typeof productVariants>[];
  options: InferSelectModel<typeof productOptions>[];
};

const DEFAULT_CURRENCY = "USD";

function money(amount: number, currencyCode = DEFAULT_CURRENCY) {
  return { amount: amount.toFixed(2), currencyCode };
}

function toProduct(row: ProductRow): Product {
  const variants = row.variants.map((variant) => ({
    id: variant.id,
    title: variant.title,
    availableForSale: variant.availableForSale,
    selectedOptions: variant.selectedOptions,
    price: money(variant.priceAmount, variant.priceCurrency),
  }));

  const prices = row.variants.map((variant) => variant.priceAmount);
  const minPrice = prices.length ? Math.min(...prices) : 0;
  const maxPrice = prices.length ? Math.max(...prices) : 0;

  const images = row.images.map((image) => ({
    url: image.url,
    altText: image.altText,
    width: image.width,
    height: image.height,
  }));

  return {
    id: row.id,
    handle: row.handle,
    title: row.title,
    description: row.description,
    descriptionHtml: row.descriptionHtml ?? undefined,
    tags: row.tags,
    availableForSale: row.availableForSale,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
    priceRange: {
      minVariantPrice: money(minPrice),
      maxVariantPrice: money(maxPrice),
    },
    featuredImage: images[0],
    images,
    variants,
    options: row.options.map((option) => ({
      id: option.id,
      name: option.name,
      values: option.values,
    })),
    seo: { title: row.title, description: row.description },
  };
}

async function loadProducts(where?: SQL): Promise<Product[]> {
  const rows = await db.query.products.findMany({
    where,
    with: {
      images: { orderBy: (image, { asc }) => [asc(image.position)] },
      variants: { orderBy: (variant, { asc }) => [asc(variant.position)] },
      options: { orderBy: (option, { asc }) => [asc(option.position)] },
    },
  });

  return rows.map(toProduct);
}

function sortProducts(
  products: Product[],
  sortKey: SortKey,
  reverse: boolean,
): Product[] {
  const sorted = [...products].sort((a, b) => {
    switch (sortKey) {
      case "PRICE":
        return (
          Number(a.priceRange.minVariantPrice.amount) -
          Number(b.priceRange.minVariantPrice.amount)
        );
      case "CREATED_AT":
        return a.createdAt.localeCompare(b.createdAt);
      default:
        return b.createdAt.localeCompare(a.createdAt);
    }
  });

  return reverse ? sorted.reverse() : sorted;
}

export async function getProducts({
  query,
  sortKey,
  reverse,
}: {
  query?: string;
  sortKey?: SortKey;
  reverse?: boolean;
}): Promise<Product[]> {
  const where = query
    ? or(
        ilike(products.title, `%${query}%`),
        ilike(products.description, `%${query}%`),
        ilike(products.handle, `%${query}%`),
      )
    : undefined;

  const all = await loadProducts(where);
  return sortProducts(all, sortKey ?? "RELEVANCE", reverse ?? false);
}

export async function getProduct(handle: string): Promise<Product | undefined> {
  const row = await db.query.products.findFirst({
    where: eq(products.handle, handle),
    with: {
      images: { orderBy: (image, { asc }) => [asc(image.position)] },
      variants: { orderBy: (variant, { asc }) => [asc(variant.position)] },
      options: { orderBy: (option, { asc }) => [asc(option.position)] },
    },
  });

  return row ? toProduct(row) : undefined;
}

export async function getProductRecommendations(
  productId: string,
): Promise<Product[]> {
  const productCollectionsForId = await db
    .select({ collectionId: productCollections.collectionId })
    .from(productCollections)
    .where(eq(productCollections.productId, productId));

  const collectionIds = productCollectionsForId.map((pc) => pc.collectionId);

  let relatedIds: string[] = [];
  if (collectionIds.length) {
    const relatedRows = await db
      .select({ productId: productCollections.productId })
      .from(productCollections)
      .where(inArray(productCollections.collectionId, collectionIds));

    relatedIds = [
      ...new Set(
        relatedRows
          .map((row) => row.productId)
          .filter((id) => id !== productId),
      ),
    ];
  }

  const all = await loadProducts();
  const byId = new Map(all.map((product) => [product.id, product]));
  const related = relatedIds
    .map((id) => byId.get(id))
    .filter((product): product is Product => Boolean(product));

  if (related.length >= 4) return related.slice(0, 4);

  const fillers = all.filter(
    (product) => product.id !== productId && !related.includes(product),
  );

  return [...related, ...fillers].slice(0, 4);
}

export async function getCollections(): Promise<Collection[]> {
  const rows = await db.query.collections.findMany({
    where: eq(collections.hidden, false),
    orderBy: (collection, { asc }) => [asc(collection.title)],
  });

  return [
    {
      handle: "",
      title: "সকল পণ্য (All)",
      description: "সকল পণ্য",
      seo: { title: "সকল পণ্য", description: "সকল পণ্য" },
      path: "/search",
      updatedAt: new Date(0).toISOString(),
    },
    ...rows.map((collection) => ({
      handle: collection.handle,
      title: collection.title,
      description: collection.description ?? "",
      seo: {
        title: collection.seoTitle ?? collection.title,
        description: collection.seoDescription ?? collection.description ?? "",
      },
      path: `/search/${collection.handle}`,
      updatedAt: collection.updatedAt.toISOString(),
    })),
  ];
}

export async function getCollection(
  handle: string,
): Promise<Collection | undefined> {
  const row = await db.query.collections.findFirst({
    where: eq(collections.handle, handle),
  });

  if (!row) return undefined;

  return {
    handle: row.handle,
    title: row.title,
    description: row.description ?? "",
    seo: {
      title: row.seoTitle ?? row.title,
      description: row.seoDescription ?? row.description ?? "",
    },
    path: `/search/${row.handle}`,
    updatedAt: row.updatedAt.toISOString(),
  };
}

export async function getCollectionProducts({
  collection,
  sortKey,
  reverse,
}: {
  collection: string;
  sortKey?: SortKey;
  reverse?: boolean;
}): Promise<Product[]> {
  const row = await db.query.collections.findFirst({
    where: eq(collections.handle, collection),
    with: { products: true },
  });

  if (!row) return [];

  const productIds = row.products.map((pc) => pc.productId);
  if (!productIds.length) return [];

  const all = await loadProducts(inArray(products.id, productIds));
  return sortProducts(all, sortKey ?? "RELEVANCE", reverse ?? false);
}

export async function getMenu(handle: string): Promise<Menu[]> {
  const rows = await db.query.menus.findMany({
    where: eq(menus.handle, handle),
    orderBy: (menu, { asc }) => [asc(menu.position)],
  });

  return rows.map((menu) => ({ title: menu.title, path: menu.path }));
}

export async function getPage(handle: string): Promise<Page | undefined> {
  const row = await db.query.pages.findFirst({
    where: eq(pages.handle, handle),
  });

  if (!row) return undefined;

  return {
    id: row.id,
    title: row.title,
    handle: row.handle,
    body: row.body,
    bodySummary: row.bodySummary,
    seo:
      row.seoTitle || row.seoDescription
        ? {
            title: row.seoTitle ?? row.title,
            description: row.seoDescription ?? row.bodySummary,
          }
        : undefined,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

export async function getPages(): Promise<Page[]> {
  const rows = await db.query.pages.findMany({
    orderBy: (page, { asc }) => [asc(page.title)],
  });

  return rows.map((row) => ({
    id: row.id,
    title: row.title,
    handle: row.handle,
    body: row.body,
    bodySummary: row.bodySummary,
    seo:
      row.seoTitle || row.seoDescription
        ? {
            title: row.seoTitle ?? row.title,
            description: row.seoDescription ?? row.bodySummary,
          }
        : undefined,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  }));
}

export async function getCart(cartId?: string | null): Promise<Cart | null> {
  if (!cartId) return null;

  const cart = await db.query.carts.findFirst({
    where: eq(carts.id, cartId),
  });
  if (!cart) return null;

  const items = await db.query.cartItems.findMany({
    where: eq(cartItems.cartId, cartId),
    with: {
      variant: true,
      product: { with: { images: true } },
    },
  });

  const lines: CartItem[] = items.map((item) => {
    const lineTotal = item.variant.priceAmount * item.quantity;
    const featuredImage = item.product.images.find(
      (image) => image.position === 1,
    );
    const image = featuredImage ?? item.product.images[0];

    return {
      id: item.id,
      quantity: item.quantity,
      cost: {
        totalAmount: money(lineTotal, item.variant.priceCurrency),
      },
      merchandise: {
        id: item.variantId,
        title: item.variant.title,
        selectedOptions: item.variant.selectedOptions,
        product: {
          id: item.product.id,
          handle: item.product.handle,
          title: item.product.title,
          featuredImage: image
            ? {
                url: image.url,
                altText: image.altText,
                width: image.width,
                height: image.height,
              }
            : undefined,
        },
      },
    };
  });

  const totalQuantity = lines.reduce((sum, line) => sum + line.quantity, 0);
  const subtotal = lines.reduce(
    (sum, line) => sum + Number(line.cost.totalAmount.amount),
    0,
  );
  const currencyCode = lines[0]?.cost.totalAmount.currencyCode ?? "USD";

  return {
    id: cart.id,
    totalQuantity,
    lines,
    cost: {
      subtotalAmount: money(subtotal, currencyCode),
      totalAmount: money(subtotal, currencyCode),
      totalTaxAmount: money(0, currencyCode),
    },
  };
}

export async function getOrder(id: string): Promise<Order | null> {
  const row = await db.query.orders.findFirst({
    where: eq(orders.id, id),
  });

  if (!row) return null;

  return {
    id: row.id,
    email: row.email,
    totalAmount: row.totalAmount,
    totalCurrency: row.totalCurrency,
    status: row.status,
    items: row.items,
    createdAt: row.createdAt.toISOString(),
  };
}
