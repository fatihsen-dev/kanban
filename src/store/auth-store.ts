import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface State {
   status: "loading" | "authenticated" | "unauthenticated";
   token: string | null;
   setToken: (token: string | null) => void;
   user: IUser | null;
   setUser: (user: IUser | null) => void;
   authMember: IProjectMember | null;
   setAuthMember: (authMember: IProjectMember | null) => void;
   invitations: IInvitation[];
   setInvitations: (invitations: IInvitation[]) => void;
   addInvitation: (invitation: IInvitation) => void;
   removeInvitation: (invitation: IInvitation) => void;
   clearInvitations: () => void;
   signOut: () => void;
}

export const useAuthStore = create<State>()(
   devtools(
      (set, get) => ({
         status: "loading",
         token: null,
         user: null,
         authMember: null,
         invitations: [],
         setToken: (token) => set({ token, status: token ? "authenticated" : "unauthenticated" }),
         setUser: (user) => set({ user, status: user ? "authenticated" : "unauthenticated" }),
         setAuthMember: (authMember) => set({ authMember }),
         setInvitations: (invitations) => set({ invitations }),
         addInvitation: (invitation) => set({ invitations: [...get().invitations, invitation] }),
         removeInvitation: (invitation) =>
            set({ invitations: get().invitations.filter((i) => i.id !== invitation.id) }),
         clearInvitations: () => set({ invitations: [] }),
         signOut: () => {
            localStorage.removeItem("token");
            set({ token: null, user: null, authMember: null, invitations: [] });
            window.location.href = "/login";
         },
      }),
      {
         name: "auth-store",
      }
   )
);
