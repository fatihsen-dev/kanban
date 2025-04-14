import Loading from "@/components/loading";
import { useProjectStore } from "@/store/project-store";
import { useEffect } from "react";
import { useParams } from "react-router";
import useWebSocket from "react-use-websocket";

interface WsProviderProps {
   children: React.ReactNode;
}

export default function WsProvider({ children }: WsProviderProps) {
   const { task, column } = useProjectStore();
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
            case "task_updated":
               task.update(lastJsonMessage.data as ITask);
               break;
            case "task_deleted":
               task.remove((lastJsonMessage.data as ITask).id);
               break;
            case "column_created":
               column.add(lastJsonMessage.data as IColumnWithTasks);
               break;
            case "column_updated":
               column.update(lastJsonMessage.data as IColumn);
               break;
            case "column_deleted":
               column.remove((lastJsonMessage.data as IColumn).id);
               break;
         }
      }
   }, [lastJsonMessage, task, column]);

   if (readyState === 1) {
      return <>{children}</>;
   }

   return <Loading />;
}
