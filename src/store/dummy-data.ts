import { v4 as uuidv4 } from "uuid";

const project_id = uuidv4();
const column_id1 = uuidv4();
const column_id2 = uuidv4();
const column_id3 = uuidv4();

export const initialData: IProjectWithColumns[] = [
   {
      id: project_id,
      name: "Project 1",
      columns: [
         {
            id: column_id1,
            name: "Todo",
            tasks: [
               {
                  id: uuidv4(),
                  title: "Todo 1",
                  created_at: new Date().toISOString(),
                  column_id: column_id1,
                  project_id,
               },
               {
                  id: uuidv4(),
                  title: "Todo 2",
                  created_at: new Date().toISOString(),
                  column_id: column_id1,
                  project_id,
               },
            ],
            project_id,
            created_at: new Date().toISOString(),
         },
         {
            id: column_id2,
            name: "In Progress",
            tasks: [
               {
                  id: uuidv4(),
                  title: "In Progress 1",
                  created_at: new Date().toISOString(),
                  column_id: column_id2,
                  project_id,
               },
               {
                  id: uuidv4(),
                  title: "In Progress 2",
                  created_at: new Date().toISOString(),
                  column_id: column_id2,
                  project_id,
               },
               {
                  id: uuidv4(),
                  title: "In Progress 3",
                  created_at: new Date().toISOString(),
                  column_id: column_id2,
                  project_id,
               },
               {
                  id: uuidv4(),
                  title: "In Progress 4",
                  created_at: new Date().toISOString(),
                  column_id: column_id2,
                  project_id,
               },
            ],
            project_id,
            created_at: new Date().toISOString(),
         },
         {
            id: column_id3,
            name: "Done",
            tasks: [
               {
                  id: uuidv4(),
                  title: "Done 1",
                  created_at: new Date().toISOString(),
                  column_id: column_id3,
                  project_id,
               },
               {
                  id: uuidv4(),
                  title: "Done 2",
                  created_at: new Date().toISOString(),
                  column_id: column_id3,
                  project_id,
               },
            ],
            project_id,
            created_at: new Date().toISOString(),
         },
      ],
      created_at: new Date().toISOString(),
   },
];
