import { useMutation } from "@/hooks/use-mutation";
import { useProjectStore } from "@/store/project-store";

export default function useProject() {
   const { addProject } = useProjectStore();

   const createMutation = useMutation<IProject, Pick<IProject, "name">>();

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

   return { create };
}
