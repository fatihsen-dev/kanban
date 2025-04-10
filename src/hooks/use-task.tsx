import { useProjectStore } from "@/store/project-store";

export default function useTask() {
   const store = useProjectStore();

   const getById = (taskId: Task["id"]) => {
      return store.data.flatMap((column) => column.tasks).find((task) => task.id === taskId);
   };

   return { getById };
}
