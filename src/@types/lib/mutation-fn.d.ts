interface IMutationVariables<TPayload = unknown> {
   url: string;
   method: "POST" | "PUT" | "PATCH" | "DELETE";
   payload?: TPayload;
}
