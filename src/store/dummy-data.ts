import { v4 as uuidv4 } from "uuid";

export const initialData: Column[] = [
   {
      id: uuidv4(),
      title: "Todo",
      tasks: [
         {
            id: uuidv4(),
            title: "Todo 1",
            created_at: new Date().toISOString(),
         },
         {
            id: uuidv4(),
            title: "Todo 2",
            created_at: new Date().toISOString(),
         },
      ],
      created_at: new Date().toISOString(),
   },
   {
      id: uuidv4(),
      title: "In Progress",
      tasks: [
         {
            id: uuidv4(),
            title: "In Progress 1",
            created_at: new Date().toISOString(),
         },
         {
            id: uuidv4(),
            title: "In Progress 2",
            created_at: new Date().toISOString(),
         },
         {
            id: uuidv4(),
            title: "In Progress 3",
            created_at: new Date().toISOString(),
         },
         {
            id: uuidv4(),
            title: "In Progress 4",
            created_at: new Date().toISOString(),
         },
      ],
      created_at: new Date().toISOString(),
   },
   {
      id: uuidv4(),
      title: "Done",
      tasks: [
         {
            id: uuidv4(),
            title: "Done 1",
            created_at: new Date().toISOString(),
         },
         {
            id: uuidv4(),
            title: "Done 2",
            created_at: new Date().toISOString(),
         },
      ],
      created_at: new Date().toISOString(),
   },
];
