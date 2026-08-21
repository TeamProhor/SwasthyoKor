export type Money = {
  amount: string;
  currencyCode: string;
};

export type Image = {
  url: string;
  altText: string;
  width: number;
  height: number;
};

export type SEO = {
  title: string;
  description: string;
};

export type SelectedOption = {
  name: string;
  value: string;
};

export type ProductOption = {
  id: string;
  name: string;
  values: string[];
};

export type ProductVariant = {
  id: string;
  title: string;
  availableForSale: boolean;
  selectedOptions: SelectedOption[];
  price: Money;
};

export type Product = {
  id: string;
  handle: string;
  title: string;
  description: string;
  descriptionHtml?: string;
  tags: string[];
  availableForSale: boolean;
  createdAt: string;
  updatedAt: string;
  priceRange: {
    minVariantPrice: Money;
    maxVariantPrice: Money;
  };
  featuredImage?: Image;
  images: Image[];
  variants: ProductVariant[];
  options: ProductOption[];
  seo: SEO;
};

export type Collection = {
  handle: string;
  title: string;
  description: string;
  seo: SEO;
  path: string;
  updatedAt: string;
};

export type Menu = {
  title: string;
  path: string;
};

export type Page = {
  id: string;
  title: string;
  handle: string;
  body: string;
  bodySummary: string;
  seo?: SEO;
  createdAt: string;
  updatedAt: string;
};

export type CartItem = {
  id: string;
  quantity: number;
  cost: {
    totalAmount: Money;
  };
  merchandise: {
    id: string;
    title: string;
    selectedOptions: SelectedOption[];
    product: {
      id: string;
      handle: string;
      title: string;
      featuredImage?: Image;
    };
  };
};

export type Cart = {
  id: string;
  totalQuantity: number;
  lines: CartItem[];
  cost: {
    subtotalAmount: Money;
    totalAmount: Money;
    totalTaxAmount: Money;
  };
};

export type OrderItem = {
  productHandle: string;
  productTitle: string;
  variantTitle: string;
  quantity: number;
  priceAmount: number;
  priceCurrency: string;
};

export type Order = {
  id: string;
  email: string | null;
  totalAmount: number;
  totalCurrency: string;
  status: string;
  items: OrderItem[];
  createdAt: string;
};
