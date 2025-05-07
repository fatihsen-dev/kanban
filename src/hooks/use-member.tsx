import { useMutation } from "@/hooks/use-mutation";
import { useProjectStore } from "@/store/project-store";

export default function useMember() {
   const { project } = useProjectStore();

   const updateMutation = useMutation<ISuccessResponse<null>, Pick<IProjectMember, "role">>();

   const update = (
      member: Pick<IProjectMember, "id" | "role">,
      callback?: (error?: string) => void
   ) => {
      updateMutation.mutate(
         {
            url: `/projects/${project?.id}/members/${member.id}`,
            method: "PUT",
            payload: member,
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

   return { update };
}
