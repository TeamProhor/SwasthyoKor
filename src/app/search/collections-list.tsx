import { getCollections } from "@/lib/db/queries";
import FilterList from "./filter-list";

export default async function CollectionsList() {
  const collections = await getCollections();
  return <FilterList list={collections} title="ক্যাটাগরি (Collections)" />;
}
