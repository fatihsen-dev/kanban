import { useMutation } from "@/hooks/use-mutation";
import useToast from "@/hooks/use-toast";
import { useProjectStore } from "@/store/project-store";

export default function useTask() {
   const { toast } = useToast();
   const { task: taskState, project } = useProjectStore();

   const createMutation = useMutation<ITask, Pick<ITask, "title" | "content" | "column_id" | "project_id">>();
   const updateMutation = useMutation<ITask, Partial<ITask> & Pick<ITask, "id">>();
   const removeMutation = useMutation<void, Pick<ITask, "project_id">>();

   const getById = (taskId: ITask["id"]) => {
      if (!project) return null;

      return taskState.getById(taskId);
   };

   const create = (
      task: Pick<ITask, "title" | "content" | "column_id" | "project_id">,
      callback?: (error?: string) => void
   ) => {
      if (!project) return;

      createMutation.mutate(
         {
            url: `/projects/${project.id}/tasks`,
            method: "POST",
            payload: task,
         },
         {
            onSuccess: () => {
               if (!project) return;
               if (callback) callback();
            },
            onError: (error) => {
               const apiError = error.response?.data;
               if (callback) callback(apiError?.message || error.message);
            },
         }
      );
   };

   const update = (task: Partial<ITask> & Pick<ITask, "id">, callback?: (error?: string) => void) => {
      if (!project) return;

      updateMutation.mutate(
         {
            url: `/projects/${project.id}/tasks/${task.id}`,
            method: "PUT",
            payload: task,
         },
         {
            onSuccess: () => {
               if (!project) return;
               if (callback) callback();
            },
            onError: (error) => {
               const apiError = error.response?.data;
               if (callback) callback(apiError?.message || error.message);
            },
         }
      );
   };

   const move = (task: ITask) => {
      if (!project) return;

      const callback = (error?: string) => {
         if (error) {
            toast(error, "error");
         }
      };

      update(
         {
            id: task.id,
            column_id: task.column_id,
         },
         callback
      );
   };

   const remove = (taskId: ITask["id"], callback?: (error?: string) => void) => {
      if (!project) return;

      removeMutation.mutate(
         {
            url: `/projects/${project.id}/tasks/${taskId}`,
            method: "DELETE",
         },
         {
            onSuccess: () => {
               if (callback) callback();
            },
            onError: (error) => {
               const apiError = error.response?.data;
               if (callback) callback(apiError?.message || error.message);
            },
         }
      );
   };

   return { getById, create, update, move, remove };
}
