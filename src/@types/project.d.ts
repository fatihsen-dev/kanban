interface IProject {
   id: string;
   name: string;
   created_at: string;
}

interface IProjectWithColumns extends IProject {
   columns: IColumnWithTasks[];
}
