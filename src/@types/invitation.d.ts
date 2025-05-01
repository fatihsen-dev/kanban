interface IInvitation {
   id: string;
   inviter: IUser;
   invitee: IUser;
   project: IProject;
   created_at: string;
   status: IInvitationStatus;
}

type IInvitationStatus = "pending" | "accepted" | "rejected";
