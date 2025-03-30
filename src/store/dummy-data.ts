import { v4 as uuidv4 } from "uuid";

export const initialData: Column[] = [
   {
      id: uuidv4(),
      title: "Todo",
      items: [
         {
            id: uuidv4(),
            name: "Todo 1",
            created_at: new Date().toISOString(),
            order: 0,
         },
         {
            id: uuidv4(),
            name: "Todo 2",
            created_at: new Date().toISOString(),
            order: 1,
         },
      ],
      created_at: new Date().toISOString(),
   },
   {
      id: uuidv4(),
      title: "In Progress",
      items: [
         {
            id: uuidv4(),
            name: "In Progress 1",
            created_at: new Date().toISOString(),
            order: 0,
         },
         {
            id: uuidv4(),
            name: "In Progress 2",
            created_at: new Date().toISOString(),
            order: 1,
         },
         {
            id: uuidv4(),
            name: "In Progress 3",
            created_at: new Date().toISOString(),
            order: 2,
         },
         {
            id: uuidv4(),
            name: "In Progress 4",
            created_at: new Date().toISOString(),
            order: 3,
         },
      ],
      created_at: new Date().toISOString(),
   },
   {
      id: uuidv4(),
      title: "Done",
      items: [
         {
            id: uuidv4(),
            name: "Done 1",
            created_at: new Date().toISOString(),
            order: 0,
         },
         {
            id: uuidv4(),
            name: "Done 2",
            created_at: new Date().toISOString(),
            order: 1,
         },
      ],
      created_at: new Date().toISOString(),
   },
];
