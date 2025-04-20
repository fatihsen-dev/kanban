import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface State {
   project: IProjectWithColumns | null;
   projects: IProject[];
   setProjects: (projects: IProject[]) => void;
   setProject: (project: IProjectWithColumns) => void;
   addProject: (project: IProject) => void;
   removeProject: (project_id: IProject["id"]) => void;
   column: {
      modal: {
         isOpen: boolean;
         name: "create" | "edit" | null;
         column_id: IColumn["id"] | null;
         toggle: (name?: "create" | "edit", column_id?: IColumn["id"]) => void;
         close: () => void;
         open: (name?: "create" | "edit", column_id?: IColumn["id"]) => void;
      };
      getById: (column_id: IColumn["id"]) => IColumn | null;
      add: (column: IColumnWithTasks) => void;
      remove: (column_id: IColumn["id"]) => void;
      update: (column: Partial<IColumn> & Pick<IColumn, "id">) => void;
   };
   task: {
      modal: {
         isOpen: boolean;
         name: "create" | "edit" | null;
         column_id: string | null;
         toggle: (column_id: string | null, name?: "create" | "edit") => void;
         close: () => void;
         open: (name?: "create" | "edit") => void;
      };
      getById: (task_id: ITask["id"]) => ITask | null;
      add: (task: ITask) => void;
      update: (task: Partial<ITask> & Pick<ITask, "id">) => void;
      remove: (task_id: ITask["id"]) => void;
      move: (task: ITask) => void;
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
         setProjects: (projects: IProject[]) => {
            set(() => ({ projects }));
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
               name: null,
               column_id: null,
               toggle: (name, column_id) => {
                  set(
                     (state) => ({
                        column: {
                           ...state.column,
                           modal: {
                              ...state.column.modal,
                              isOpen: !state.column.modal.isOpen,
                              name: name ?? null,
                              column_id: column_id ?? null,
                           },
                        },
                     }),
                     undefined,
                     "toggle-column-modal"
                  );
               },
               close: () => {
                  set(
                     (state) => ({
                        column: { ...state.column, modal: { ...state.column.modal, isOpen: false, name: null } },
                     }),
                     undefined,
                     "close-column-modal"
                  );
               },
               open: (name, column_id) => {
                  set(
                     (state) => ({
                        column: {
                           ...state.column,
                           modal: {
                              ...state.column.modal,
                              isOpen: true,
                              name: name ?? null,
                              column_id: column_id ?? null,
                           },
                        },
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

                     return {
                        project: {
                           ...state.project,
                           columns: [
                              ...state.project.columns.filter((c) => c.id !== column.id),
                              {
                                 ...column,
                                 tasks: column.tasks ?? [],
                              },
                           ],
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
            update: (column) => {
               set((state) => {
                  if (!state.project) return state;

                  return {
                     project: {
                        ...state.project,
                        columns: state.project.columns.map((c) => (c.id === column.id ? { ...c, ...column } : c)),
                     },
                  };
               });
            },
         },
         task: {
            modal: {
               isOpen: false,
               column_id: null,
               name: null,
               toggle: (column_id, name) => {
                  set(
                     (state) => ({
                        task: {
                           ...state.task,
                           modal: {
                              ...state.task.modal,
                              column_id,
                              isOpen: !state.task.modal.isOpen,
                              name: name ?? null,
                           },
                        },
                     }),
                     undefined,
                     "toggle-task-modal"
                  );
               },
               close: () => {
                  set(
                     (state) => ({
                        task: { ...state.task, modal: { ...state.task.modal, isOpen: false, name: null } },
                     }),
                     undefined,
                     "close-task-modal"
                  );
               },
               open: (name) => {
                  set(
                     (state) => ({
                        task: {
                           ...state.task,
                           modal: { ...state.task.modal, isOpen: true, name: name ?? null },
                        },
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
                                 return {
                                    ...column,
                                    tasks: [...column.tasks.filter((t) => t.id !== task.id), task],
                                 };
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
            move: (task) => {
               set(
                  (state) => {
                     if (!state.project) return state;

                     const column = state.project.columns.find((column) => column.tasks.some((t) => t.id === task.id));
                     if (!column) return state;
                     const ts = column.tasks.find((t) => t.id === task.id);
                     if (!ts) return state;

                     return {
                        project: {
                           ...state.project,
                           columns: state.project.columns.map((column) => {
                              if (column.id === ts.column_id) {
                                 return {
                                    ...column,
                                    tasks: column.tasks.filter((t) => t.id !== ts.id),
                                 };
                              }
                              if (column.id === task.column_id) {
                                 return {
                                    ...column,
                                    tasks: [...column.tasks, { ...ts, ...task }],
                                 };
                              }
                              return column;
                           }),
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
