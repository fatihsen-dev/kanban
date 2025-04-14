interface IColumn {
   id: string;
   name: string;
   project_id: string;
   created_at: string;
}

interface IColumnWithTasks extends IColumn {
   tasks: ITask[];
}
