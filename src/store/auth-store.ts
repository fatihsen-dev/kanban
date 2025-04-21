import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface State {
   status: "loading" | "authenticated" | "unauthenticated";
   token: string | null;
   setToken: (token: string | null) => void;
   user: IUser | null;
   setUser: (user: IUser | null) => void;
}

export const useAuthStore = create<State>()(
   devtools(
      (set) => ({
         status: "loading",
         token: null,
         user: null,
         setToken: (token) => set({ token, status: token ? "authenticated" : "unauthenticated" }),
         setUser: (user) => set({ user, status: user ? "authenticated" : "unauthenticated" }),
      }),
      {
         name: "auth-store",
      }
   )
);
