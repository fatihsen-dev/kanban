import { IWsResponse } from "@/@types/ws-response";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface State {
   lastMessage: IWsResponse | null;
   setLastMessage: (message: IWsResponse | null) => void;
}

export const useWsStore = create<State>()(
   devtools(
      (set) => ({
         lastMessage: null,
         setLastMessage: (message) => set({ lastMessage: message }),
      }),
      {
         name: "ws-store",
      }
   )
);
