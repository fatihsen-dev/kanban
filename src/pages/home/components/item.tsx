import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuLabel,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useDataStore from "@/store/data";
import { Ellipsis } from "lucide-react";
import { useRef } from "react";
import { useDrag } from "react-dnd";

interface ItemProps {
   item: Item;
   column_id: string;
   itemId: string | null;
   setItemId: (itemId: string | null) => void;
}

const ItemType = "ITEM";

export default function Item({ item, column_id, itemId, setItemId }: ItemProps) {
   const store = useDataStore();

   const ref = useRef<HTMLDivElement>(null);

   const [{ isDragging }, drag] = useDrag(() => ({
      type: ItemType,
      item: { ...item, column_id },
      collect: (monitor) => ({
         isDragging: monitor.isDragging(),
      }),
   }));

   drag(ref);

   return (
      <div
         ref={ref}
         className={`bg-white border-2 border-dashed border-gray-300 rounded-md p-4 transition-colors ${
            isDragging ? "opacity-50 cursor-move" : "opacity-100 cursor-move"
         }`}>
         <div className='flex items-center gap-2 justify-between'>
            <button
               onClick={() => setItemId(item.id)}
               className={`hover:underline cursor-pointer ${itemId === item.id ? "text-blue-500" : ""}`}>
               {item.title}
            </button>
            <DropdownMenu>
               <DropdownMenuTrigger className='cursor-pointer'>
                  <Ellipsis className='w-full! h-full!' />
               </DropdownMenuTrigger>
               <DropdownMenuContent side='left' align='start' sideOffset={0} alignOffset={0}>
                  <DropdownMenuLabel>Column</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                     className='cursor-pointer'
                     variant='destructive'
                     onClick={() => store.item.remove(item.id)}>
                     Delete
                  </DropdownMenuItem>
               </DropdownMenuContent>
            </DropdownMenu>
         </div>
      </div>
   );
}
