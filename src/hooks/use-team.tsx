import { useMutation } from "@/hooks/use-mutation";
import { useProjectStore } from "@/store/project-store";

export default function useTeam() {
   const { project } = useProjectStore();

   const createMutation = useMutation<IProjectTeam, Pick<IProjectTeam, "name">>();

   const create = (team: Pick<IProjectTeam, "name" | "role">, callback?: (error?: string) => void) => {
      createMutation.mutate(
         {
            url: `/projects/${project?.id}/teams`,
            method: "POST",
            payload: team,
         },
         {
            onSuccess: (data) => {
               console.log(data);
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
