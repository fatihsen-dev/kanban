import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface State {
   project: IProjectWithDetails | null;
   projects: IProject[];
   authMember: IProjectMember | null;
   setProjects: (projects: IProject[]) => void;
   setProject: (project: IProjectWithDetails) => void;
   addProject: (project: IProject) => void;
   removeProject: (project_id: IProject["id"]) => void;
   setMember: (member: IProjectMember) => void;
   updateMemberByUserId: (
      user_id: IUser["id"],
      member: Omit<Partial<IProjectMember>, "user"> & { user: Partial<IProjectMember["user"]> }
   ) => void;
   column: {
      getById: (column_id: IColumn["id"]) => IColumn | null;
      add: (column: IColumnWithTasks) => void;
      remove: (column_id: IColumn["id"]) => void;
      update: (column: Partial<IColumn> & Pick<IColumn, "id">) => void;
   };
   task: {
      getById: (task_id: ITask["id"]) => ITask | null;
      add: (task: ITask) => void;
      update: (task: Partial<ITask> & Pick<ITask, "id">) => void;
      remove: (task_id: ITask["id"]) => void;
      move: (task: ITask) => void;
   };
   team: {
      add: (team: IProjectTeam) => void;
   };
   member: {
      add: (member: IProjectMember) => void;
   };
}

export const useProjectStore = create<State>()(
   devtools(
      (set, get) => ({
         projects: [],
         project: null,
         authMember: null,
         setMember: (member: IProjectMember) => {
            set({ authMember: member });
         },
         updateMemberByUserId: (user_id, member) => {
            set((state) => {
               if (!state.project) return state;

               return {
                  project: {
                     ...state.project,
                     members: state.project.members.map((m) =>
                        m.user.id === user_id
                           ? {
                                ...m,
                                ...member,
                                user: member.user ? { ...m.user, ...member.user } : m.user,
                             }
                           : m
                     ),
                  },
               };
            });
         },
         setProject: (project: IProjectWithDetails) => {
            set({ project });
         },
         setProjects: (projects: IProject[]) => {
            set({ projects });
         },
         addProject: (project: IProject) => {
            set((state) => ({ projects: [...state.projects, project] }));
         },
         removeProject: (project_id: IProject["id"]) => {
            set((state) => ({
               projects: state.projects.filter((project) => project.id !== project_id),
            }));
         },
         column: {
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
                        columns: state.project.columns.map((c) =>
                           c.id === column.id ? { ...c, ...column } : c
                        ),
                     },
                  };
               });
            },
         },
         task: {
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
                              return {
                                 ...column,
                                 tasks: column.tasks.filter((task: ITask) => task.id !== task_id),
                              };
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

                     const column = state.project.columns.find((column) =>
                        column.tasks.some((t) => t.id === task.id)
                     );
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
                              tasks: column.tasks.map((t) =>
                                 t.id === task.id ? { ...t, ...task } : t
                              ),
                           })),
                        },
                     };
                  },
                  undefined,
                  "update-task"
               );
            },
         },
         team: {
            add: (team) => {
               set((state) => {
                  if (!state.project) return state;

                  return {
                     project: { ...state.project, teams: [...state.project.teams, team] },
                  };
               });
            },
         },
         member: {
            add: (member) => {
               set((state) => {
                  if (!state.project) return state;

                  return {
                     project: { ...state.project, members: [...state.project.members, member] },
                  };
               });
            },
         },
      }),
      {
         name: "project-store",
      }
   )
);
