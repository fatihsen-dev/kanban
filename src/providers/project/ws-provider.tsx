import Loading from "@/components/loading";
import { useProjectStore } from "@/store/project-store";
import { useEffect } from "react";
import { useParams } from "react-router";
import useWebSocket from "react-use-websocket";

interface WsProviderProps {
   children: React.ReactNode;
}

export default function WsProvider({ children }: WsProviderProps) {
   const { task } = useProjectStore();
   const { project_id } = useParams();

   const { readyState, lastJsonMessage } = useWebSocket<IWsResponse>(
      `${import.meta.env.VITE_WS_URL}/ws/${project_id}`,
      {
         share: true,
         shouldReconnect: () => false,
      }
   );

   useEffect(() => {
      if (lastJsonMessage) {
         switch (lastJsonMessage.name) {
            case "task_created":
               task.add(lastJsonMessage.data as ITask);
               break;
         }
      }
   }, [lastJsonMessage, task]);

   if (readyState === 1) {
      return <>{children}</>;
   }

   return <Loading />;
}
