import { useMutation } from "@/hooks/use-mutation";
import { useProjectStore } from "@/store/project-store";

export default function useProject() {
   const { addProject } = useProjectStore();

   const createMutation = useMutation<IProject, Pick<IProject, "name">>();
   const deleteMutation = useMutation<void, { id: string }>();

   const create = (project: Pick<IProject, "name">, callback?: (error?: string) => void) => {
      createMutation.mutate(
         {
            url: `/projects`,
            method: "POST",
            payload: project,
         },
         {
            onSuccess: (data) => {
               addProject(data);
               if (callback) callback();
            },
            onError: (error) => {
               const apiError = error.response?.data;
               if (callback) callback(apiError?.message || error.message);
            },
         }
      );
   };

   const deleteProject = (id: string, callback?: (error?: string) => void) => {
      deleteMutation.mutate(
         { url: `/projects/${id}`, method: "DELETE" },
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

   return { create, delete: deleteProject };
}
