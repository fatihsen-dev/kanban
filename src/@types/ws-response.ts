export enum EventName {
   ColumnCreated = "column.created",
   ColumnUpdated = "column.updated",
   ColumnDeleted = "column.deleted",
   TaskCreated = "task.created",
   TaskUpdated = "task.updated",
   TaskDeleted = "task.deleted",
   TaskMoved = "task.moved",
   TeamCreated = "team.created",
   TeamUpdated = "team.updated",
   TeamDeleted = "team.deleted",
   InvitationCreated = "invitation.created",
   UserStatusUpdated = "user.status.updated",
}

export interface IWsResponse {
   name: EventName;
   data: unknown;
}
