type IUserAuthResponse = IUser;

interface IUserLoginResponse {
   token: string;
   user: IUser;
}

interface IUserRegisterResponse {
   token: string;
   user: IUser;
}
