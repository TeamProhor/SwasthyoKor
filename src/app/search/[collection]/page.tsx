import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Grid from "@/components/grid";
import { GridTileImage } from "@/components/grid/tile";
import { defaultSort, sorting } from "@/lib/constants";
import { getCollection, getCollectionProducts } from "@/lib/db/queries";

export async function generateMetadata(props: {
  params: Promise<{ collection: string }>;
}): Promise<Metadata> {
  const { collection: collectionHandle } = await props.params;
  const collection = await getCollection(collectionHandle);

  if (!collection) return notFound();

  return {
    title: `${collection.seo?.title || collection.title} | স্বস্থ্যকর`,
    description:
      collection.seo?.description ||
      collection.description ||
      `${collection.title} পণ্যসমূহ`,
  };
}

export default async function CollectionPage(props: {
  params: Promise<{ collection: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { collection: collectionHandle } = await props.params;
  const searchParams = await props.searchParams;
  const { sort } = searchParams as { [key: string]: string };
  const currentSort = sorting.find((item) => item.slug === sort) || defaultSort;
  const { sortKey, reverse } = currentSort;

  const collection = await getCollection(collectionHandle);
  if (!collection) return notFound();

  const products = await getCollectionProducts({
    collection: collectionHandle,
    sortKey,
    reverse,
  });

  return (
    <section>
      <div className="mb-4">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          {collection.title}
        </h1>
        {collection.description ? (
          <p className="mt-1 text-sm text-muted-foreground">
            {collection.description}
          </p>
        ) : null}
      </div>

      {products.length === 0 ? (
        <p className="py-8 text-neutral-500">এই ক্যাটাগরিতে কোনো পণ্য পাওয়া যায়নি।</p>
      ) : (
        <Grid className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <Grid.Item key={product.handle} className="animate-fadeIn">
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
            </Grid.Item>
          ))}
        </Grid>
      )}
    </section>
  );
}
