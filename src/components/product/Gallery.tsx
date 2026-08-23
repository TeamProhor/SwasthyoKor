"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { GridTileImage } from "@/components/grid/GridTile";
import { ArrowLeft, ArrowRight } from "@/components/icons";

export function Gallery({
  images,
}: {
  images: { src: string; altText: string }[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const imageParam = searchParams.get("image");
  const imageIndex = imageParam ? parseInt(imageParam, 10) : 0;

  const updateImage = (index: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("image", index);
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  const nextImageIndex = imageIndex + 1 < images.length ? imageIndex + 1 : 0;
  const previousImageIndex =
    imageIndex === 0 ? images.length - 1 : imageIndex - 1;

  const buttonClassName =
    "h-full px-6 transition-all ease-in-out hover:scale-110 hover:text-black dark:hover:text-white flex items-center justify-center";

  return (
    <form>
      <div className="relative aspect-square size-full max-h-[550px] overflow-hidden">
        {images[imageIndex] && (
          <Image
            className="size-full object-cover rounded-2xl"
            fill
            sizes="(min-width: 1024px) 66vw, 100vw"
            alt={images[imageIndex]?.altText as string}
            src={images[imageIndex]?.src as string}
            priority={true}
          />
        )}

        {images.length > 1 ? (
          <div className="absolute bottom-[15%] flex w-full justify-center">
            <div className="mx-auto flex h-11 items-center rounded-full border border-white bg-neutral-50/80 text-neutral-500 backdrop-blur-sm dark:border-black dark:bg-neutral-900/80">
              <button
                type="button"
                onClick={() => updateImage(previousImageIndex.toString())}
                aria-label="আগের ছবি (Previous Image)"
                className={buttonClassName}
              >
                <ArrowLeft className="size-5" />
              </button>
              <div className="mx-1 h-6 w-px bg-neutral-500" />
              <button
                type="button"
                onClick={() => updateImage(nextImageIndex.toString())}
                aria-label="পরের ছবি (Next Image)"
                className={buttonClassName}
              >
                <ArrowRight className="size-5" />
              </button>
            </div>
          </div>
        ) : null}
      </div>

      {images.length > 1 ? (
        <ul className="my-4 sm:my-8 flex items-center flex-wrap justify-center gap-2 overflow-auto py-1 lg:mb-0">
          {images.map((image, index) => {
            const isActive = index === imageIndex;

            return (
              <li key={image.src} className="size-16 sm:size-20">
                <button
                  type="button"
                  onClick={() => updateImage(index.toString())}
                  aria-label="ছবি নির্বাচন করুন"
                  className="size-full"
                >
                  <GridTileImage
                    alt={image.altText}
                    src={image.src}
                    width={80}
                    height={80}
                    active={isActive}
                  />
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </form>
  );
}
