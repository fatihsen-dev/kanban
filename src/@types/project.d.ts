interface IProject extends IBase {
   name: string;
}

interface IProjectWithDetails extends IProject {
   columns: IColumnWithTasks[];
   members: IProjectMember[];
   teams: IProjectTeam[];
}
