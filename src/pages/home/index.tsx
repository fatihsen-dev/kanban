import useDataStore from "@/store/data";
import { Plus } from "lucide-react";
import Column from "./column";
import CreateColumnModal from "./create-column-modal";
import CreateItemModal from "./create-item-modal";

export default function Home() {
   const store = useDataStore();

   return (
      <div className='flex p-4 gap-4 h-screen'>
         <div
            className='grid gap-4 h-full'
            style={{
               gridTemplateColumns: `repeat(${store.data.length}, 1fr)`,
            }}>
            {store.data.map((column) => (
               <Column key={column.id} column={column} />
            ))}
         </div>
         <div
            onClick={store.column.modal.toggle}
            className='bg-gray-50 border-2 border-dashed border-gray-300 rounded-md p-4 flex items-center justify-center transition-all hover:bg-gray-100 cursor-pointer text-gray-700'>
            <Plus size={46} strokeWidth={1.3} />
         </div>
         <CreateItemModal />
         <CreateColumnModal />
      </div>
   );
}
