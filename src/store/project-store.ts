import { v4 as uuidv4 } from "uuid";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface State {
   project: IProjectWithColumns | null;
   projects: IProject[];
   setProject: (project: IProjectWithColumns) => void;
   addProject: (project: IProject) => void;
   removeProject: (project_id: IProject["id"]) => void;
   column: {
      modal: {
         isOpen: boolean;
         toggle: () => void;
         close: () => void;
         open: () => void;
      };
      getById: (column_id: IColumn["id"]) => IColumn | null;
      add: (column: Omit<IColumnWithTasks, "id" | "created_at" | "project_id" | "tasks">) => void;
      remove: (column_id: IColumn["id"]) => void;
   };
   task: {
      modal: {
         isOpen: boolean;
         column_id: string | null;
         toggle: (column_id: string | null) => void;
         close: () => void;
         open: () => void;
      };
      getById: (task_id: ITask["id"]) => ITask | null;
      add: (task: ITask) => void;
      update: (task: Omit<ITask, "created_at" | "project_id">) => void;
      remove: (task_id: ITask["id"]) => void;
      move: (prev_column_id: IColumn["id"], new_column_id: IColumn["id"], task: ITask) => void;
   };
}

export const useProjectStore = create<State>()(
   devtools(
      (set, get) => ({
         projects: [],
         project: null,
         setProject: (project: IProjectWithColumns) => {
            set(() => ({ project }));
         },
         addProject: (project: IProject) => {
            set((state) => ({ projects: [...state.projects, project] }));
         },
         removeProject: (project_id: IProject["id"]) => {
            set((state) => ({ projects: state.projects.filter((project) => project.id !== project_id) }));
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
            getById: (column_id) => {
               return get().project?.columns.find((column) => column.id === column_id) || null;
            },
            add: (column) => {
               set(
                  (state) => {
                     if (!state.project) return state;

                     const newColumn: IColumnWithTasks = {
                        id: uuidv4(),
                        ...column,
                        project_id: state.project.id,
                        tasks: [],
                        created_at: new Date().toISOString(),
                     };

                     return {
                        project: {
                           ...state.project,
                           columns: [...state.project.columns, newColumn],
                        },
                     };
                  },
                  undefined,
                  "add-column"
               );
            },
            remove: (column_id) => {
               set(
                  (state) => {
                     if (!state.project) return state;

                     return {
                        project: {
                           ...state.project,
                           columns: state.project.columns.filter((c) => c.id !== column_id),
                        },
                     };
                  },
                  undefined,
                  "remove-column"
               );
            },
         },
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
            getById: (task_id) => {
               return (
                  get()
                     .project?.columns.flatMap((column) => column.tasks)
                     .find((task) => task.id === task_id) || null
               );
            },
            add: (task) => {
               set(
                  (state) => {
                     if (!state.project) return state;

                     return {
                        project: {
                           ...state.project,
                           columns: state.project.columns.map((column: IColumnWithTasks) => {
                              if (column.id === task.column_id) {
                                 return { ...column, tasks: [...column.tasks, task] };
                              }
                              return column;
                           }),
                        },
                     };
                  },
                  undefined,
                  "add-task"
               );
            },
            remove: (task_id) => {
               set(
                  (state) => {
                     if (!state.project) return state;

                     return {
                        project: {
                           ...state.project,
                           columns: state.project.columns.map((column: IColumnWithTasks) => {
                              return { ...column, tasks: column.tasks.filter((task: ITask) => task.id !== task_id) };
                           }),
                        },
                     };
                  },
                  undefined,
                  "remove-task"
               );
            },
            move: (prev_column_id, new_column_id, task) => {
               if (prev_column_id === new_column_id) return;

               set(
                  (state) => {
                     if (!state.project) return state;

                     let taskToMove: ITask | null = null;

                     const columnsWithoutTask = state.project.columns.map((column) => {
                        if (column.id === prev_column_id) {
                           const foundTask = column.tasks.find((t) => t.id === task.id);
                           if (foundTask) {
                              taskToMove = { ...foundTask, column_id: new_column_id };
                              return { ...column, tasks: column.tasks.filter((t) => t.id !== task.id) };
                           }
                        }
                        return column;
                     });

                     const columnsWithTaskMoved = columnsWithoutTask.map((column) => {
                        if (column.id === new_column_id && taskToMove) {
                           return { ...column, tasks: [...column.tasks, taskToMove] };
                        }
                        return column;
                     });

                     return {
                        project: {
                           ...state.project,
                           columns: columnsWithTaskMoved,
                        },
                     };
                  },
                  undefined,
                  "move-task"
               );
            },
            update: (task) => {
               set(
                  (state) => {
                     if (!state.project) return state;

                     return {
                        project: {
                           ...state.project,
                           columns: state.project.columns.map((column) => ({
                              ...column,
                              tasks: column.tasks.map((t) => (t.id === task.id ? { ...t, ...task } : t)),
                           })),
                        },
                     };
                  },
                  undefined,
                  "update-task"
               );
            },
         },
      }),
      {
         name: "data-store",
      }
   )
);
