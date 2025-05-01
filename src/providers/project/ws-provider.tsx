import { EventName, IWsResponse } from "@/@types/ws-response";
import Loading from "@/components/loading";
import { useAuthStore } from "@/store/auth-store";
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
   const { token } = useAuthStore();

   const { readyState, lastJsonMessage } = useWebSocket<IWsResponse>(
      `${import.meta.env.VITE_WS_URL}/ws?token=${token}${project_id ? `&project_id=${project_id}` : ""}`,
      {
         share: true,
         shouldReconnect: () => false,
      }
   );

   useEffect(() => {
      if (lastJsonMessage) {
         switch (lastJsonMessage.name) {
            case EventName.TaskCreated:
               task.add(lastJsonMessage.data as ITask);
               break;
            case EventName.TaskUpdated:
               task.update(lastJsonMessage.data as ITask);
               break;
            case EventName.TaskMoved:
               task.move(lastJsonMessage.data as ITask);
               break;
            case EventName.TaskDeleted:
               task.remove((lastJsonMessage.data as ITask).id);
               break;
            case EventName.ColumnCreated:
               column.add(lastJsonMessage.data as IColumnWithTasks);
               break;
            case EventName.ColumnUpdated:
               column.update(lastJsonMessage.data as IColumn);
               break;
            case EventName.ColumnDeleted:
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
