type UserStatus = "online" | "offline";

interface IUser extends IBase {
   name: string;
   email: string;
   password: string;
   status?: UserStatus;
}
