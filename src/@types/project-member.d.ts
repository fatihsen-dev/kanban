interface IProjectMember extends IBase {
   project_id: IProject["id"];
   team_id: ITeam["id"] | null;
   user_id: IUser["id"];
   role: IProjectAccessRole;
   user: IUser;
}
