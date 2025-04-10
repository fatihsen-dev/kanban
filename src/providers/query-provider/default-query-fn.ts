import { Api } from "@/lib/axios";

export const defaultQueryFn = async ({ queryKey }: IQueryFn) => {
   const { data } = await Api.get(`${queryKey[0]}`);
   return data;
};
