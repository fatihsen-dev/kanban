import { CircleCheck, CircleX } from "lucide-react";
import rht from "react-hot-toast";

export default function useToast() {
   const toast = (message: string, type: "success" | "error" | "info" = "info") => {
      rht.custom((t) => (
         <div
            style={{
               animation: t.visible ? "enter 200ms ease-out" : "leave 150ms ease-in forwards",
            }}
            className='border bg-muted rounded-md flex items-center p-1 text-nowrap transition-transform duration-300'>
            <div className='flex items-center gap-2 px-2 pr-3 py-2.5'>
               {type !== "info" && (
                  <>
                     {type === "success" && <CircleCheck size={18} className='text-green-500' />}
                     {type === "error" && <CircleX size={18} className='text-red-500' />}
                  </>
               )}
               <p className='text-sm'>{message}</p>
            </div>
         </div>
      ));
   };

   return { toast };
}
