interface IProjectTeam extends IBase {
   name: string;
   role: IProjectAccessRole;
   project_id: IProject["id"];
   members: IProjectMember[];
}
