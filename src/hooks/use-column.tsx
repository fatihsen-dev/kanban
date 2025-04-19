import { useMutation } from "@/hooks/use-mutation";
import { useProjectStore } from "@/store/project-store";

export default function useColumn() {
   const { column: columnState, project } = useProjectStore();

   const createMutation = useMutation<IColumn, Pick<IColumn, "name" | "project_id">>();
   const updateMutation = useMutation<IColumn, Omit<IColumn, "created_at" | "project_id">>();
   const removeMutation = useMutation<void, Pick<IColumn, "project_id">>();

   const getById = (columnId: IColumn["id"]) => {
      if (!project) return null;

      return columnState.getById(columnId);
   };

   const create = (column: Pick<IColumn, "name" | "project_id">, callback?: (error?: string) => void) => {
      if (!project) return;

      createMutation.mutate(
         {
            url: `/projects/${project.id}/columns`,
            method: "POST",
            payload: column,
         },
         {
            onSuccess: (data) => {
               if (!project) return;
               columnState.add({
                  tasks: [],
                  ...data,
               });
               if (callback) callback();
            },
            onError: (error) => {
               const apiError = error.response?.data;
               if (callback) callback(apiError?.message || error.message);
            },
         }
      );
   };

   const update = (column: Omit<IColumn, "created_at" | "project_id">, callback?: (error?: string) => void) => {
      if (!project) return;

      updateMutation.mutate(
         {
            url: `/projects/${project.id}/columns/${column.id}`,
            method: "PUT",
            payload: column,
         },
         {
            onSuccess: () => {
               if (!project) return;
               columnState.update(column);
               if (callback) callback();
            },
            onError: (error) => {
               const apiError = error.response?.data;
               if (callback) callback(apiError?.message || error.message);
            },
         }
      );
   };

   const remove = (columnId: IColumn["id"], callback?: (error?: string) => void) => {
      if (!project) return;

      removeMutation.mutate(
         {
            url: `/projects/${project.id}/columns/${columnId}`,
            method: "DELETE",
         },
         {
            onSuccess: () => {
               columnState.remove(columnId);
               if (callback) callback();
            },
            onError: (error) => {
               const apiError = error.response?.data;
               if (callback) callback(apiError?.message || error.message);
            },
         }
      );
   };

   return { getById, create, update, remove };
}
