import { v4 as uuidv4 } from "uuid";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { initialData } from "./dummy-data";

interface State {
   data: IColumn[];
   task: {
      modal: {
         isOpen: boolean;
         column_id: string | null;
         toggle: (column_id: string | null) => void;
         close: () => void;
         open: () => void;
      };
      add: (column_id: IColumn["id"], task: Omit<ITask, "id" | "created_at">) => void;
      remove: (task_id: ITask["id"]) => void;
      move: (prev_column_id: IColumn["id"], new_column_id: IColumn["id"], task: ITask) => void;
   };
   column: {
      modal: {
         isOpen: boolean;
         toggle: () => void;
         close: () => void;
         open: () => void;
      };
      add: (column: Omit<IColumn, "id" | "created_at">) => void;
      remove: (column_id: IColumn["id"]) => void;
   };
}

export const useProjectStore = create<State>()(
   devtools(
      (set) => ({
         data: initialData,
         task: {
            modal: {
               isOpen: false,
               column_id: null,
               toggle: (column_id) => {
                  set(
                     (state) => ({
                        task: {
                           ...state.task,
                           modal: { ...state.task.modal, column_id, isOpen: !state.task.modal.isOpen },
                        },
                     }),
                     undefined,
                     "toggle-task-modal"
                  );
               },
               close: () => {
                  set(
                     (state) => ({
                        task: { ...state.task, modal: { ...state.task.modal, isOpen: false } },
                     }),
                     undefined,
                     "close-task-modal"
                  );
               },
               open: () => {
                  set(
                     (state) => ({
                        task: { ...state.task, modal: { ...state.task.modal, isOpen: true } },
                     }),
                     undefined,
                     "open-task-modal"
                  );
               },
            },
            add: (column_id, task) => {
               set(
                  (state) => ({
                     data: state.data.map((column) => {
                        if (column.id === column_id) {
                           const newTask: ITask = {
                              id: uuidv4(),
                              ...task,
                              created_at: new Date().toISOString(),
                           };

                           return {
                              ...column,
                              tasks: [...column.tasks, newTask],
                           };
                        } else {
                           return column;
                        }
                     }),
                  }),
                  undefined,
                  "add-task"
               );
            },
            remove: (task_id) => {
               set(
                  (state) => ({
                     data: state.data.map((column) => {
                        if (column.tasks.some((i) => i.id === task_id)) {
                           return { ...column, tasks: column.tasks.filter((i) => i.id !== task_id) };
                        }
                        return column;
                     }),
                  }),
                  undefined,
                  "remove-task"
               );
            },
            move: (prev_column_id, new_column_id, task) => {
               if (prev_column_id === new_column_id) return;

               set(
                  (state) => {
                     return {
                        data: state.data.map((column) => {
                           if (column.id === prev_column_id) {
                              return { ...column, tasks: column.tasks.filter((i) => i.id !== task.id) };
                           } else if (column.id === new_column_id) {
                              const newTask = {
                                 ...task,
                                 id: uuidv4(),
                                 created_at: new Date().toISOString(),
                              };
                              return { ...column, tasks: [...column.tasks, newTask] };
                           } else {
                              return column;
                           }
                        }),
                     };
                  },
                  undefined,
                  "move-task"
               );
            },
         },
         column: {
            modal: {
               isOpen: false,
               toggle: () => {
                  set(
                     (state) => ({
                        column: {
                           ...state.column,
                           modal: { ...state.column.modal, isOpen: !state.column.modal.isOpen },
                        },
                     }),
                     undefined,
                     "toggle-column-modal"
                  );
               },
               close: () => {
                  set(
                     (state) => ({
                        column: { ...state.column, modal: { ...state.column.modal, isOpen: false } },
                     }),
                     undefined,
                     "close-column-modal"
                  );
               },
               open: () => {
                  set(
                     (state) => ({
                        column: { ...state.column, modal: { ...state.column.modal, isOpen: true } },
                     }),
                     undefined,
                     "open-column-modal"
                  );
               },
            },
            add: (column) => {
               const newColumn = {
                  id: uuidv4(),
                  ...column,
                  created_at: new Date().toISOString(),
               };

               set(
                  (state) => ({
                     data: [...state.data, newColumn],
                  }),
                  undefined,
                  "add-column"
               );
            },
            remove: (column_id) => {
               set(
                  (state) => ({
                     data: state.data.filter((c) => c.id !== column_id),
                  }),
                  undefined,
                  "remove-column"
               );
            },
         },
      }),
      {
         name: "data-store",
      }
   )
);
