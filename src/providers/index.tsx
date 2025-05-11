import Modals from "@/components/modals";
import { QueryProvider } from "@/providers/query-provider";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { NuqsAdapter } from "nuqs/adapters/react-router/v7";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "./theme-provider";

interface ProvidersProps {
   children: React.ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
   return (
      <QueryProvider>
         <ThemeProvider defaultTheme='light'>
            <NuqsAdapter>{children}</NuqsAdapter>
            <Modals />
            <Toaster position='top-right' reverseOrder={false} />
            <ReactQueryDevtools initialIsOpen={false} />
         </ThemeProvider>
      </QueryProvider>
   );
}
