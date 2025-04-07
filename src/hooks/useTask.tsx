import useDataStore from "@/store/data";

export default function useTask() {
   const store = useDataStore();

   const getById = (taskId: Task["id"]) => {
      return store.data.flatMap((column) => column.tasks).find((task) => task.id === taskId);
   };

   return { getById };
}
