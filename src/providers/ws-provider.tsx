import { EventName, IWsResponse } from "@/@types/ws-response";
import Loading from "@/components/loading";
import { useAuthStore } from "@/store/auth-store";
import { useProjectStore } from "@/store/project-store";
import { useWsStore } from "@/store/ws-store";
import { useEffect } from "react";
import { useParams } from "react-router";
import useWebSocket from "react-use-websocket";

interface WsProviderProps {
   children: React.ReactNode;
}

export default function WsProvider({ children }: WsProviderProps) {
   const { setLastMessage } = useWsStore();
   const { task, column, updateMemberByUserId, team, member } = useProjectStore();
   const { project_id } = useParams();
   const { token, addInvitation } = useAuthStore();

   const { readyState, lastJsonMessage } = useWebSocket<IWsResponse>(
      `${import.meta.env.VITE_WS_URL}/ws?token=${token}${
         project_id ? `&project_id=${project_id}` : ""
      }`,
      {
         share: true,
         shouldReconnect: () => false,
      }
   );

   useEffect(() => {
      if (lastJsonMessage) {
         setLastMessage(lastJsonMessage);
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
            case EventName.InvitationCreated:
               addInvitation(lastJsonMessage.data as IInvitation);
               break;
            case EventName.TeamCreated:
               team.add(lastJsonMessage.data as IProjectTeam);
               break;
            case EventName.TeamUpdated:
               team.update(
                  lastJsonMessage.data as Partial<IProjectTeam> & Pick<IProjectTeam, "id">
               );
               break;
            case EventName.ProjectMemberCreated:
               member.add(lastJsonMessage.data as IProjectMember);
               break;
            case EventName.ProjectMemberUpdated:
               member.update(
                  lastJsonMessage.data as Partial<IProjectMember> & Pick<IProjectMember, "id">
               );
               break;
            case EventName.UserStatusUpdated:
               updateMemberByUserId((lastJsonMessage.data as IUserStatusResponse).id, {
                  user: {
                     status: (lastJsonMessage.data as IUserStatusResponse).status,
                  },
               });
               break;
         }
      }
   }, [
      lastJsonMessage,
      task,
      column,
      addInvitation,
      setLastMessage,
      updateMemberByUserId,
      team,
      member,
   ]);

   if (readyState === 1) {
      return <>{children}</>;
   }

   return <Loading />;
}
