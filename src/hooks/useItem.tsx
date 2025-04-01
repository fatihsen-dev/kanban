import useDataStore from "@/store/data";

export default function useItem() {
   const store = useDataStore();

   const getById = (itemId: Item["id"]) => {
      return store.data.flatMap((column) => column.items).find((item) => item.id === itemId);
   };

   return { getById };
}
