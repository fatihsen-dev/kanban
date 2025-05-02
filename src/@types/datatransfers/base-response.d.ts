interface IResponse<T> {
   success: boolean;
   message: string;
   data?: T;
}

type IErrorResponse = Omit<IResponse<null>, "data">;

type ISuccessResponse<T> = IResponse<T>;
