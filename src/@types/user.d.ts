type UserStatus = "online" | "offline" | "away";

interface IUser extends IBase {
   name: string;
   email: string;
   password: string;
   status?: UserStatus;
}
