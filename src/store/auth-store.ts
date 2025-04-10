import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface State {
   status: "loading" | "authenticated" | "unauthenticated";
   user: IUser | null;
   setUser: (user: IUser | null) => void;
}

export const useAuthStore = create<State>()(
   devtools((set) => ({
      status: "loading",
      user: null,
      setUser: (user) => set({ user, status: user ? "authenticated" : "unauthenticated" }),
   }))
);
