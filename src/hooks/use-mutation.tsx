import { UseMutationOptions, useMutation as useTanstackMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";

export function useMutation<TData = unknown, TPayload = unknown>(
   options?: Omit<
      UseMutationOptions<TData, AxiosError<IErrorResponse>, IMutationVariables<TPayload>, unknown>,
      "mutationFn"
   >
) {
   return useTanstackMutation<TData, AxiosError<IErrorResponse>, IMutationVariables<TPayload>, unknown>(options || {});
}
