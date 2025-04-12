import { useMutation } from "@/hooks/use-mutation";
import { useProjectStore } from "@/store/project-store";

export default function useColumn() {
   const { column: columnState, project } = useProjectStore();

   const createMutation = useMutation<IColumn, Pick<IColumn, "name" | "project_id">>();

   const getById = (columnId: IColumn["id"]) => {
      if (!project) return null;

      return columnState.getById(columnId);
   };

   const create = (column: Pick<IColumn, "name" | "project_id">, callback?: (error?: string) => void) => {
      if (!project) return;

      createMutation.mutate(
         {
            url: "/columns",
            method: "POST",
            payload: column,
         },
         {
            onSuccess: (data) => {
               if (!project) return;
               columnState.add(data);
               if (callback) callback();
            },
            onError: (error) => {
               const apiError = error.response?.data;
               if (callback) callback(apiError?.message || error.message);
            },
         }
      );
   };

   return { getById, create };
}
