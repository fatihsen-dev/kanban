import { Api } from ".";

export const authUser = () => Api.get<ISuccessResponse<IUser>>("/auth/me");
