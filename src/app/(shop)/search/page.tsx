import Link from "next/link";
import { Grid, GridTileImage } from "@/components/grid";
import { BoxSearch } from "@/components/icons";
import { ProductQuickView } from "@/components/product";
import {
  Empty,
  EmptyDescription,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { defaultSort, sorting } from "@/lib/constants";
import { getProducts } from "@/lib/db/queries";
import { MESSAGES } from "@/lib/messages";

export const metadata = {
  title: "পণ্য অনুসন্ধান | স্বাস্থ্যকর",
  description: "স্বাস্থ্যকর স্টোরে পণ্য অনুসন্ধান করুন।",
};

export default async function SearchPage(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const { sort, q: searchValue } = searchParams as { [key: string]: string };
  const currentSort = sorting.find((item) => item.slug === sort) || defaultSort;
  const { sortKey, reverse } = currentSort;

  const products = await getProducts({
    sortKey,
    reverse,
    query: searchValue,
  });

  const resultsText = products.length > 1 ? "টি ফলাফল পাওয়া গেছে" : "টি ফলাফল";

  return (
    <div>
      {searchValue ? (
        <p className="mb-4 text-sm text-neutral-500">
          {products.length === 0
            ? "কোনো পণ্য পাওয়া যায়নি "
            : `"${searchValue}" এর জন্য ${products.length} ${resultsText}`}
        </p>
      ) : null}
      {products.length > 0 ? (
        <Grid className="grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-4">
          {products.map((product) => (
            <Grid.Item key={product.handle} className="animate-fadeIn">
              <ProductQuickView product={product} className="size-full">
                <Link
                  className="relative inline-block size-full"
                  href={`/product/${product.handle}`}
                  prefetch={true}
                >
                  <GridTileImage
                    alt={product.title}
                    label={{
                      title: product.title,
                      amount: product.priceRange.maxVariantPrice.amount,
                      currencyCode:
                        product.priceRange.maxVariantPrice.currencyCode,
                    }}
                    src={product.featuredImage?.url ?? ""}
                    fill
                    sizes="(min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw"
                  />
                </Link>
              </ProductQuickView>
            </Grid.Item>
          ))}
        </Grid>
      ) : (
        <Empty className="min-h-64 border border-dashed border-neutral-300 dark:border-neutral-800 rounded-2xl">
          <EmptyMedia variant="icon">
            <BoxSearch className="size-6 text-neutral-400" />
          </EmptyMedia>
          <EmptyTitle>{MESSAGES.search.emptyTitle}</EmptyTitle>
          <EmptyDescription>{MESSAGES.search.emptyDesc}</EmptyDescription>
        </Empty>
      )}
    </div>
  );
}
