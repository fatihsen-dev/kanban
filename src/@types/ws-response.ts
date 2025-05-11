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
   ProjectMemberCreated = "project.member.created",
   ProjectMemberUpdated = "project.member.updated",
   TeamMembersAdded = "team.members.added",
   ProjectDeleted = "project.deleted",
}

export interface IWsResponse {
   name: EventName;
   data: unknown;
}
