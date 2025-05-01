interface IInvitationCreateRequest {
   invitee_ids: string[];
   project_id: string;
   message: string | null;
}

interface IInvitationUpdateStatusRequest {
   status: IInvitationStatus;
}
