import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { defaultMutationFn } from "./query-provider/default-mutation-fn";
import { defaultQueryFn } from "./query-provider/default-query-fn";

const queryClient = new QueryClient({
   defaultOptions: {
      queries: {
         queryFn: defaultQueryFn,
      },
      mutations: {
         mutationFn: defaultMutationFn,
      },
   },
});

interface QueryProviderProps {
   children: React.ReactNode;
}

export const QueryProvider = ({ children }: QueryProviderProps) => {
   return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};
