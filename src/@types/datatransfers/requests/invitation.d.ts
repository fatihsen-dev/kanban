interface IInvitationCreateRequest {
   invitee_ids: string[];
   message: string | null;
}

interface IInvitationUpdateStatusRequest {
   status: IInvitationStatus;
}
