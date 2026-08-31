import "dotenv/config";
import { db } from "./index";
import {
  cartItems,
  carts,
  collections,
  menus,
  orders,
  pages,
  productCollections,
  productImages,
  productOptions,
  products,
  productVariants,
} from "./schema";

type SeedProduct = {
  handle: string;
  title: string;
  description: string;
  price: number;
  tags: string[];
  availableForSale?: boolean;
  sizes?: string[];
  imageUrls: string[];
};

const now = new Date();

const PRODUCTS: SeedProduct[] = [
  {
    handle: "swasthyo-organic-honey",
    title: "খাঁটি সুন্দরবন মধু (Pure Sundarban Raw Honey)",
    description:
      "১০০% খাঁটি ও প্রাকৃতিক সুন্দরবনের কাঁচা মধু। কোনো কৃত্রিম মিষ্টি বা প্রিজারভেটিভ ছাড়া সংগৃহীত উচ্চ পুষ্টিগুণ সমৃদ্ধ অর্গানিক মধু।",
    price: 15,
    tags: ["organic", "new", "food"],
    imageUrls: [
      "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=800&auto=format&fit=crop&q=85",
      "https://images.unsplash.com/photo-1587049352847-4a222e784d38?w=800&auto=format&fit=crop&q=85",
      "https://images.unsplash.com/photo-1471943311424-646960669fbc?w=800&auto=format&fit=crop&q=85",
    ],
  },
  {
    handle: "swasthyo-cold-pressed-mustard-oil",
    title: "ঘানি ভাঙা সরিষার তেল (Cold Pressed Mustard Oil)",
    description:
      "কাঠের ঘানিতে ভাঙা খাঁটি দেশি সরিষার তেল। খাঁটি ঝাঁঝ ও প্রাকৃতিক পুষ্টিতে ভরপুর স্বাস্থ্যকর রান্নার তেল।",
    price: 12,
    tags: ["organic", "oil", "food"],
    imageUrls: [
      "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=800&auto=format&fit=crop&q=85",
      "https://images.unsplash.com/photo-1599940824399-b87987ceb72a?w=800&auto=format&fit=crop&q=85",
    ],
  },
  {
    handle: "swasthyo-organic-ghee",
    title: "গাওয়া ঘি (Pure Grass-fed Cow Ghee)",
    description:
      "দেশি গরুর খাঁটি দুধের মালাই থেকে ঐতিহ্যবাহী পদ্ধতিতে তৈরি সুগন্ধি দানাদার গাওয়া ঘি।",
    price: 25,
    tags: ["dairy", "new", "food"],
    imageUrls: [
      "https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=800&auto=format&fit=crop&q=85",
      "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=800&auto=format&fit=crop&q=85",
    ],
  },
  {
    handle: "swasthyo-moringa-powder",
    title: "সজিনা পাতা গুঁড়ো (Organic Moringa Leaf Powder)",
    description:
      "প্রাকৃতিক মাল্টিভিটামিন ও সুপারফুড। রোগ প্রতিরোধ ক্ষমতা বৃদ্ধি ও শারীরিক শক্তি যোগাতে অতুলনীয়।",
    price: 10,
    tags: ["superfood", "wellness"],
    imageUrls: [
      "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&auto=format&fit=crop&q=85",
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&auto=format&fit=crop&q=85",
    ],
  },
  {
    handle: "swasthyo-chia-seeds",
    title: "অর্গানিক চিয়া সিড (Premium Organic Chia Seeds)",
    description:
      "ওমেগা-৩ ফ্যাটি অ্যাসিড, ফাইবার ও অ্যান্টিঅক্সিডেন্ট সমৃদ্ধ প্রিমিয়াম গ্রেডের অর্গানিক চিয়া সিড।",
    price: 8,
    tags: ["superfood", "weight-management"],
    imageUrls: [
      "https://images.unsplash.com/photo-1514733670139-4d87a1941d55?w=800&auto=format&fit=crop&q=85",
      "https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?w=800&auto=format&fit=crop&q=85",
    ],
  },
  {
    handle: "swasthyo-black-seed-oil",
    title: "কালোজিরা তেল (Cold-pressed Black Seed Oil)",
    description:
      "১০০% খাঁটি কোল্ড-প্রেসড কালোজিরা তেল। প্রাকৃতিক আরোগ্য ও ইমিউনিটি বৃদ্ধির মহৌষধ।",
    price: 14,
    tags: ["oil", "wellness"],
    imageUrls: [
      "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800&auto=format&fit=crop&q=85",
      "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=800&auto=format&fit=crop&q=85",
    ],
  },
  {
    handle: "swasthyo-mixed-dry-fruits",
    title: "প্রিমিয়াম নাটস ও ড্রাই ফ্রুটস মিক্স (Mixed Dry Fruits)",
    description:
      "কাঠবাদাম, কাজুবাদাম, পেস্তা, আখরোট ও কিশমিশের সেরা মিশ্রণ। স্বাস্থ্যকর স্ন্যাক্স হিসেবে আদর্শ।",
    price: 22,
    tags: ["nuts", "snack"],
    imageUrls: [
      "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&auto=format&fit=crop&q=85",
      "https://images.unsplash.com/photo-1536591375315-1b838865f24a?w=800&auto=format&fit=crop&q=85",
      "https://images.unsplash.com/photo-1508061253366-f7da158b6d46?w=800&auto=format&fit=crop&q=85",
    ],
  },
  {
    handle: "swasthyo-herbal-tulsi-green-tea",
    title: "তুলসী গ্রিন টি (Organic Tulsi Herbal Green Tea)",
    description:
      "অর্গানিক গ্রিন টি এবং রাম, কৃষ্ণ ও বন তুলসীর সংমিশ্রণ। মানসিক প্রশান্তি ও সতেজতার জন্য সেরা।",
    price: 9,
    tags: ["tea", "beverage"],
    imageUrls: [
      "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=800&auto=format&fit=crop&q=85",
      "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=800&auto=format&fit=crop&q=85",
    ],
  },
  {
    handle: "swasthyo-pink-himalayan-salt",
    title: "হিমালয়ান পিংক সল্ট (Himalayan Pink Rock Salt)",
    description:
      "৮৪টি প্রাকৃতিক খনিজ সমৃদ্ধ খাঁটি হিমালয়ান পিংক রক সল্ট। সাধারণ লবণের স্বাস্থ্যকর বিকল্প।",
    price: 6,
    tags: ["grocery", "wellness"],
    imageUrls: [
      "https://images.unsplash.com/photo-1607672632458-9eb56696346b?w=800&auto=format&fit=crop&q=85",
      "https://images.unsplash.com/photo-1518110925495-5fe2fda0442c?w=800&auto=format&fit=crop&q=85",
    ],
  },
  {
    handle: "swasthyo-apple-cider-vinegar",
    title: "কাঁচা অ্যাপল সিডার ভিনেগার (Raw Apple Cider Vinegar with Mother)",
    description:
      "অর্গানিক আপেল থেকে তৈরি আনফিল্টার্ড এবং কাঁচা অ্যাপল সিডার ভিনেগার যাতে উইথ দ্য মাদার বিদ্যমান।",
    price: 16,
    tags: ["wellness", "organic"],
    imageUrls: [
      "https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=800&auto=format&fit=crop&q=85",
      "https://images.unsplash.com/photo-1568651779193-e60136e1d2b4?w=800&auto=format&fit=crop&q=85",
    ],
  },
];

const COLLECTIONS = [
  {
    handle: "hidden-homepage-featured-items",
    title: "হোমপেজ ফিচার্ড",
    description: "হোমপেজে ফিচার্ড পণ্যসমূহ।",
    hidden: true,
    productHandles: [
      "swasthyo-organic-honey",
      "swasthyo-organic-ghee",
      "swasthyo-cold-pressed-mustard-oil",
    ],
  },
  {
    handle: "hidden-homepage-carousel",
    title: "হোমপেজ ক্যারাউজেল",
    description: "হোমপেজ ক্যারাউজেলে দেখানো পণ্যসমূহ।",
    hidden: true,
    productHandles: PRODUCTS.map((p) => p.handle),
  },
  {
    handle: "organic-essentials",
    title: "খাঁটি পণ্য (Essentials)",
    description: "মধু, ঘি, তেল সহ দৈনন্দিন জীবনের খাঁটি খাদ্যপণ্য।",
    hidden: false,
    productHandles: [
      "swasthyo-organic-honey",
      "swasthyo-organic-ghee",
      "swasthyo-cold-pressed-mustard-oil",
      "swasthyo-pink-himalayan-salt",
    ],
  },
  {
    handle: "superfoods-wellness",
    title: "সুপারফুড ও সুস্থতা (Superfoods)",
    description: "রোগ প্রতিরোধ ক্ষমতা ও শারীরিক শক্তির জন্য স্বাস্থ্যকর সুপারফুড।",
    hidden: false,
    productHandles: [
      "swasthyo-moringa-powder",
      "swasthyo-chia-seeds",
      "swasthyo-black-seed-oil",
      "swasthyo-mixed-dry-fruits",
      "swasthyo-apple-cider-vinegar",
      "swasthyo-herbal-tulsi-green-tea",
    ],
  },
  {
    handle: "new-arrivals",
    title: "নতুন সংগ্রহ (New Arrivals)",
    description: "সদ্য যুক্ত হওয়া ফ্রেশ স্বাস্থ্যকর খাদ্যসামগ্রী।",
    hidden: false,
    productHandles: [
      "swasthyo-organic-honey",
      "swasthyo-organic-ghee",
      "swasthyo-moringa-powder",
      "swasthyo-mixed-dry-fruits",
    ],
  },
];

const MENUS = [
  { handle: "header", title: "হোম", path: "/" },
  { handle: "header", title: "আম", path: "/search?q=আম" },
  { handle: "header", title: "মধু", path: "/search?q=মধু" },
  { handle: "header", title: "প্যান্ট্রি", path: "/search/organic-essentials" },
  { handle: "header", title: "হেলথ", path: "/search/superfoods-wellness" },
  { handle: "footer", title: "হোম", path: "/" },
  { handle: "footer", title: "আমাদের কথা", path: "/about" },
  { handle: "footer", title: "খাঁটি পণ্য", path: "/search/organic-essentials" },
  { handle: "footer", title: "সুপারফুড", path: "/search/superfoods-wellness" },
  { handle: "footer", title: "শর্তাবলী", path: "/terms" },
  { handle: "footer", title: "প্রাইভেসি পলিসি", path: "/privacy" },
  { handle: "footer", title: "শিপিং ও রিটার্ন", path: "/shipping-returns" },
];

const PAGES = [
  {
    handle: "about",
    title: "আমাদের কথা (About Swasthyokor)",
    body: `<p><strong>স্বাস্থ্যকর (Swasthyokor)</strong> হলো বিশুদ্ধ, স্বাস্থ্যকর এবং প্রাকৃতিক পণ্যের একটি আধুনিক ই-কমার্স প্ল্যাটফর্ম। আমরা কোনো ভেজাল বা কৃত্রিম উপাদান ছাড়া সরাসরি খামার ও প্রকৃতি থেকে সংগৃহীত সেরা মানের খাদ্যসামগ্রী আপনাদের দ্বারে পৌঁছে দিতে অঙ্গীকারবদ্ধ।</p><p>আমাদের পুরো প্ল্যাটফর্মটি তৈরি হয়েছে Next.js 16 এবং PostgreSQL এর সর্বাধুনিক আর্কিটেকচার দ্বারা, যা গ্রাহককে প্রদান করে নিরাপদ ও নির্ভরযোগ্য শপিং অভিজ্ঞতা।</p>`,
  },
  {
    handle: "terms",
    title: "ব্যবহারের নিয়ম ও শর্তাবলী (Terms & Conditions)",
    body: `<p>স্বাস্থ্যকর স্টোরফ্রন্টে আপনাকে স্বাগতম। এই প্ল্যাটফর্ম ব্যবহার করে আপনি খাঁটি অর্গানিক পণ্য অর্ডার করতে পারেন। অর্ডার কনফার্মেশনের পর আপনার প্রদত্ত ঠিকানায় দ্রুত ডেলিভারি নিশ্চিত করা হয়।</p>`,
  },
  {
    handle: "privacy",
    title: "প্রাইভেসি পলিসি (Privacy Policy)",
    body: `<p>আপনার ব্যক্তিগত তথ্যের গোপনীয়তা রক্ষা করা আমাদের দায়িত্ব। গ্রাহকের নাম, ফোন নম্বর ও ডেলিভারি ঠিকানা শুধুমাত্র অর্ডার প্রসেসিং এর কাজে নিরাপদে সংরক্ষিত হয়।</p>`,
  },
  {
    handle: "shipping-returns",
    title: "শিপিং ও রিটার্ন পলিসি (Shipping & Returns)",
    body: `<p>আমরা সারা দেশে দ্রুত ও যত্নসহকারে পণ্য ডেলিভারি করে থাকি। কোনো পণ্যে ত্রুটি থাকলে বা সিল ভাঙা থাকলে ডেলিভারির ২৪ ঘণ্টার মধ্যে আমাদের জানালে আমরা রিপ্লেসমেন্ট প্রদান করি।</p>`,
  },
];

async function seed() {
  console.log("পুরনো ডেটা মুছে ফেলা হচ্ছে...");

  await db.delete(cartItems);
  await db.delete(carts);
  await db.delete(orders);
  await db.delete(productCollections);
  await db.delete(productImages);
  await db.delete(productOptions);
  await db.delete(productVariants);
  await db.delete(products);
  await db.delete(collections);
  await db.delete(menus);
  await db.delete(pages);

  console.log("পণ্য সিড করা হচ্ছে...");

  const productIds = new Map<string, string>();

  for (const seedProduct of PRODUCTS) {
    const productId = crypto.randomUUID();
    productIds.set(seedProduct.handle, productId);

    const descriptionHtml = `<p>${seedProduct.description}</p>`;

    await db.insert(products).values({
      id: productId,
      handle: seedProduct.handle,
      title: seedProduct.title,
      description: seedProduct.description,
      descriptionHtml,
      tags: seedProduct.tags,
      availableForSale: seedProduct.availableForSale ?? true,
      createdAt: now,
      updatedAt: now,
    });

    for (let i = 0; i < seedProduct.imageUrls.length; i++) {
      await db.insert(productImages).values({
        id: crypto.randomUUID(),
        productId,
        url: seedProduct.imageUrls[i],
        altText: `${seedProduct.title} ছবি ${i + 1}`,
        width: 800,
        height: 800,
        position: i + 1,
      });
    }

    if (seedProduct.sizes) {
      const optionId = crypto.randomUUID();
      await db.insert(productOptions).values({
        id: optionId,
        productId,
        name: "Size",
        position: 1,
        values: seedProduct.sizes,
      });

      for (const size of seedProduct.sizes) {
        await db.insert(productVariants).values({
          id: crypto.randomUUID(),
          productId,
          title: size,
          priceAmount: seedProduct.price,
          priceCurrency: "USD",
          availableForSale: true,
          position: seedProduct.sizes.indexOf(size) + 1,
          selectedOptions: [{ name: "Size", value: size }],
        });
      }
    } else {
      await db.insert(productVariants).values({
        id: crypto.randomUUID(),
        productId,
        title: "Default Title",
        priceAmount: seedProduct.price,
        priceCurrency: "USD",
        availableForSale: true,
        position: 1,
        selectedOptions: [],
      });
    }
  }

  console.log("কালেকশন সিড করা হচ্ছে...");

  const collectionIds = new Map<string, string>();

  for (const collection of COLLECTIONS) {
    const collectionId = crypto.randomUUID();
    collectionIds.set(collection.handle, collectionId);

    await db.insert(collections).values({
      id: collectionId,
      handle: collection.handle,
      title: collection.title,
      description: collection.description,
      seoTitle: collection.title,
      seoDescription: collection.description,
      hidden: collection.hidden,
      createdAt: now,
      updatedAt: now,
    });

    for (const productHandle of collection.productHandles) {
      const productId = productIds.get(productHandle);
      if (!productId) continue;

      await db.insert(productCollections).values({
        productId,
        collectionId,
      });
    }
  }

  console.log("মেনু এবং পেজ সিড করা হচ্ছে...");

  for (const [i, menu] of MENUS.entries()) {
    await db.insert(menus).values({
      id: crypto.randomUUID(),
      handle: menu.handle,
      title: menu.title,
      path: menu.path,
      position: i,
    });
  }

  for (const page of PAGES) {
    const summary = page.body
      .replace(/<[^>]*>/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 140);

    await db.insert(pages).values({
      id: crypto.randomUUID(),
      handle: page.handle,
      title: page.title,
      body: page.body,
      bodySummary: summary,
      seoTitle: page.title,
      seoDescription: summary,
      createdAt: now,
      updatedAt: now,
    });
  }

  const [productCount, collectionCount, menuCount, pageCount] =
    await Promise.all([
      db.select({ count: products.id }).from(products),
      db.select({ count: collections.id }).from(collections),
      db.select({ count: menus.id }).from(menus),
      db.select({ count: pages.id }).from(pages),
    ]);

  console.log(
    `সিড সম্পন্ন: ${productCount.length}টি পণ্য, ${collectionCount.length}টি কালেকশন, ${menuCount.length}টি মেনু আইটেম, ${pageCount.length}টি পেজ।`,
  );
}

seed()
  .then(() => {
    console.log("PostgreSQL সিডিং সম্পন্ন হয়েছে।");
    process.exit(0);
  })
  .catch((error) => {
    console.error("সিডিং ত্রুটি:", error);
    process.exit(1);
  });
