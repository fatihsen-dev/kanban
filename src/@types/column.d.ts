interface IColumn extends IBase {
   name: string;
   color: string | null;
   project_id: IProject["id"];
}

interface IColumnWithTasks extends IColumn {
   tasks: ITask[];
}
