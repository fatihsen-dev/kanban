interface IProject extends IBase {
   name: string;
   owner_id: IUser["id"];
}

interface IProjectWithDetails extends IProject {
   columns: IColumnWithTasks[];
   members: IProjectMember[];
   teams: IProjectTeam[];
}
