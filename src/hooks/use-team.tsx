import { useMutation } from "@/hooks/use-mutation";
import { useProjectStore } from "@/store/project-store";

export default function useTeam() {
   const { project } = useProjectStore();

   const createMutation = useMutation<IProjectTeam, Pick<IProjectTeam, "name">>();
   const updateMutation = useMutation<
      Partial<IProjectTeam> & Pick<IProjectTeam, "id">,
      Partial<IProjectTeam> & Pick<IProjectTeam, "id">
   >();
   const deleteMutation = useMutation<Pick<IProjectTeam, "id">, Pick<IProjectTeam, "id">>();
   const addMembersMutation = useMutation<
      { team_id: IProjectTeam["id"]; member_ids: IProjectMember["id"][] },
      { member_ids: IProjectMember["id"][] }
   >();

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

   const update = (team: Partial<IProjectTeam> & Pick<IProjectTeam, "id">, callback?: (error?: string) => void) => {
      updateMutation.mutate(
         {
            url: `/projects/${project?.id}/teams/${team.id}`,
            method: "PUT",
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

   const remove = (team: Pick<IProjectTeam, "id">, callback?: (error?: string) => void) => {
      deleteMutation.mutate(
         { url: `/projects/${project?.id}/teams/${team.id}`, method: "DELETE" },
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

   const addMembers = (
      team_id: IProjectTeam["id"],
      member_ids: IProjectMember["id"][],
      callback?: (error?: string) => void
   ) => {
      addMembersMutation.mutate(
         {
            url: `/projects/${project?.id}/teams/${team_id}/members`,
            method: "PUT",
            payload: { member_ids },
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

   return { create, update, remove, addMembers };
}
