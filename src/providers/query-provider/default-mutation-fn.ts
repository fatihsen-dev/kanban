import { Api } from "@/lib/axios";
import { AxiosResponse } from "axios";

export const defaultMutationFn = async <TData = unknown, TVariables extends IMutationVariables = IMutationVariables>(
   variables: unknown
): Promise<TData> => {
   const { url, method, payload } = variables as TVariables;
   let response: AxiosResponse<ISuccessResponse<TData>>;

   try {
      switch (method) {
         case "POST":
            response = await Api.post<ISuccessResponse<TData>>(url, payload);
            break;
         case "PUT":
            response = await Api.put<ISuccessResponse<TData>>(url, payload);
            break;
         case "PATCH":
            response = await Api.patch<ISuccessResponse<TData>>(url, payload);
            break;
         case "DELETE":
            response = await Api.delete<ISuccessResponse<TData>>(url);
            break;
         default:
            throw new Error(`Unsupported mutation method: ${method}`);
      }
      const responseBody = response.data;
      if (responseBody && responseBody.success) {
         return responseBody.data as TData;
      } else {
         throw new Error(responseBody?.message || "Mutation failed with success:false or unexpected format");
      }
   } catch (error) {
      console.error("Mutation Error:", error);
      throw error; // throw to use mutation hook
   }
};
