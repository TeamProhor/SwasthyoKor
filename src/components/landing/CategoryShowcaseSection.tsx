import Link from "next/link";
import { ArrowRight } from "@/components/icons";
import { ProductCard } from "@/components/product";
import { Button } from "@/components/ui/button";
import { getCollectionProducts } from "@/lib/db/queries";

interface CategoryBlock {
  collectionHandle: string;
  title: string;
  subtitle: string;
}

const CATEGORY_BLOCKS: CategoryBlock[] = [
  {
    collectionHandle: "organic-essentials",
    title: "খাঁটি মধু ও অর্গানিক এসেনশিয়ালস",
    subtitle: "সুন্দরবনের কাঁচা মধু, গাওয়া ঘি ও খাঁটি গুড়ের সমাহার",
  },
  {
    collectionHandle: "oils-and-ghee",
    title: "ঘানি ভাঙা তেল ও খাঁটি গাওয়া ঘি",
    subtitle: "কাঠের ঘানির খাঁটি সরিষার তেল, এক্সট্রা ভার্জিন অলিভ ও কালোজিরা তেল",
  },
  {
    collectionHandle: "superfoods-wellness",
    title: "সুপারফুড ও প্রাকৃতিক পুষ্টি",
    subtitle: "চিয়া সিড, মোরিঙ্গা, স্পিরুলিনা ও অর্গানিক হেলথ ফুড",
  },
  {
    collectionHandle: "nuts-dry-fruits",
    title: "প্রিমিয়াম বাদাম ও ড্রাই ফ্রুটস",
    subtitle: "ক্যালিফোর্নিয়া কাঠবাদাম, রোস্টেড কাজু ও মদিনার মরিয়ম খেজুর",
  },
];

export async function CategoryShowcaseSection() {
  return (
    <div className="flex flex-col gap-8 sm:gap-12 mx-auto w-full max-w-7xl px-4 py-2 sm:py-6">
      {CATEGORY_BLOCKS.map(async (cat) => {
        const products = await getCollectionProducts({
          collection: cat.collectionHandle,
        });

        if (!products.length) return null;

        const displayProducts = products.slice(0, 4);

        return (
          <section
            key={cat.collectionHandle}
            className="flex flex-col gap-4 sm:gap-6"
          >
            {/* Category Header - Clean Typography without icons */}
            <div className="flex items-end justify-between border-b border-border/50 pb-3 sm:pb-4">
              <div>
                <h2 className="text-lg sm:text-2xl font-extrabold tracking-tight text-foreground">
                  {cat.title}
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                  {cat.subtitle}
                </p>
              </div>

              <Button
                render={<Link href={`/category/${cat.collectionHandle}`} />}
                variant="outline"
                size="sm"
                className="rounded-full text-xs font-semibold shrink-0 border-border/80"
              >
                <span>সব দেখুন</span>
                <ArrowRight className="size-3.5 ml-1" />
              </Button>
            </div>

            {/* 4-Column Product Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
              {displayProducts.map((product) => (
                <ProductCard key={product.handle} product={product} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
