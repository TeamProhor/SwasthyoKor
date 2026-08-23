"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { SearchNormal } from "@/components/icons";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { createUrl } from "@/lib/utils";

export default function Search() {
  const router = useRouter();
  const searchParams = useSearchParams();

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const val = e.target as HTMLFormElement;
    const search = val.search as HTMLInputElement;
    const newParams = new URLSearchParams(searchParams.toString());

    if (search.value) {
      newParams.set("q", search.value);
    } else {
      newParams.delete("q");
    }

    router.push(createUrl("/search", newParams));
  }

  return (
    <form
      onSubmit={onSubmit}
      className="w-max-[550px] relative w-full lg:w-80 xl:w-full"
    >
      <InputGroup className="rounded-lg border bg-white text-sm text-black dark:border-neutral-800 dark:bg-transparent dark:text-white">
        <InputGroupInput
          key={searchParams?.get("q")}
          type="text"
          name="search"
          placeholder="পণ্য খুঁজুন (Search products...)"
          autoComplete="off"
          defaultValue={searchParams?.get("q") || ""}
          className="px-4 py-2 placeholder:text-neutral-500 dark:placeholder:text-neutral-400"
        />
        <InputGroupAddon align="inline-end" className="pr-3">
          <SearchNormal className="size-4 text-neutral-400" />
        </InputGroupAddon>
      </InputGroup>
    </form>
  );
}

export function SearchSkeleton() {
  return (
    <form className="w-max-[550px] relative w-full lg:w-80 xl:w-full">
      <InputGroup className="rounded-lg border bg-white text-sm text-black dark:border-neutral-800 dark:bg-transparent dark:text-white">
        <InputGroupInput
          placeholder="পণ্য খুঁজুন..."
          disabled
          className="px-4 py-2 placeholder:text-neutral-500 dark:placeholder:text-neutral-400"
        />
        <InputGroupAddon align="inline-end" className="pr-3">
          <SearchNormal className="size-4 text-neutral-400" />
        </InputGroupAddon>
      </InputGroup>
    </form>
  );
}
