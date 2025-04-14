import { useMutation } from "@/hooks/use-mutation";
import useToast from "@/hooks/use-toast";
import { useProjectStore } from "@/store/project-store";

export default function useTask() {
   const { toast } = useToast();
   const { task: taskState, project } = useProjectStore();

   const createMutation = useMutation<ITask, Pick<ITask, "title" | "column_id" | "project_id">>();
   const updateMutation = useMutation<ITask, Omit<ITask, "created_at" | "project_id">>();
   const removeMutation = useMutation<void, Pick<ITask, "project_id">>();

   const getById = (taskId: ITask["id"]) => {
      if (!project) return null;

      return taskState.getById(taskId);
   };

   const create = (task: Pick<ITask, "title" | "column_id" | "project_id">, callback?: (error?: string) => void) => {
      if (!project) return;

      createMutation.mutate(
         {
            url: "/tasks",
            method: "POST",
            payload: task,
         },
         {
            onSuccess: (data) => {
               if (!project) return;
               taskState.add(data);
               if (callback) callback();
            },
            onError: (error) => {
               const apiError = error.response?.data;
               if (callback) callback(apiError?.message || error.message);
            },
         }
      );
   };

   const update = (task: Omit<ITask, "created_at" | "project_id">, callback?: (error?: string) => void) => {
      if (!project) return;

      updateMutation.mutate(
         {
            url: `/tasks/${task.id}?project_id=${project.id}`,
            method: "PUT",
            payload: task,
         },
         {
            onSuccess: () => {
               if (!project) return;
               taskState.update(task);
               if (callback) callback();
            },
            onError: (error) => {
               const apiError = error.response?.data;
               if (callback) callback(apiError?.message || error.message);
            },
         }
      );
   };

   const move = (prev_column_id: IColumn["id"], new_column_id: IColumn["id"], task: ITask) => {
      if (!project) return;

      const callback = (error?: string) => {
         if (error) {
            toast(error, "error");
         } else {
            taskState.move(prev_column_id, new_column_id, task);
         }
      };

      update(
         {
            ...task,
            column_id: new_column_id,
         },
         callback
      );
   };

   const remove = (taskId: ITask["id"], callback?: (error?: string) => void) => {
      if (!project) return;

      removeMutation.mutate(
         {
            url: `/tasks/${taskId}?project_id=${project.id}`,
            method: "DELETE",
         },
         {
            onSuccess: () => {
               taskState.remove(taskId);
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
