import { QueryProvider } from "@/providers/query-provider";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { NuqsAdapter } from "nuqs/adapters/react-router/v7";
import { Toaster } from "react-hot-toast";

interface ProvidersProps {
   children: React.ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
   return (
      <QueryProvider>
         <NuqsAdapter>{children}</NuqsAdapter>
         <Toaster position='top-right' reverseOrder={false} />
         <ReactQueryDevtools initialIsOpen={false} />
      </QueryProvider>
   );
}
