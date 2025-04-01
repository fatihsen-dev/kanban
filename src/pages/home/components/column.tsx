import { Button } from "@/components/ui/button";
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
import { useDrop } from "react-dnd";
import Item from "./item";

interface ColumnProps {
   column: Column;
   itemId: string | null;
   setItemId: (itemId: string | null) => void;
}

export default function Column({ column, itemId, setItemId }: ColumnProps) {
   const store = useDataStore();

   const [{ isOver }, drop] = useDrop(() => ({
      accept: "ITEM",
      drop: ({ column_id, ...item }: Item & { column_id: string }) => {
         store.item.move(column_id, column.id, item);
      },
      collect: (monitor) => ({
         isOver: monitor.isOver(),
      }),
   }));

   return (
      <div
         ref={drop as unknown as React.RefObject<HTMLDivElement>}
         className={`bg-gray-50 border-2 border-dashed border-gray-300 rounded-md p-4 min-w-96 h-full flex flex-col gap-4 transition-colors ${
            isOver ? "bg-gray-200" : ""
         }`}>
         <div className='flex justify-between items-center border-b border-gray-300 pb-4'>
            <div className='flex flex-col gap-2'>
               <h2 className='text-lg font-bold'>{column.title}</h2>
               <span className='text-sm text-gray-500'>{column.items.length} items</span>
            </div>
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
                     onClick={() => store.column.remove(column.id)}>
                     Delete
                  </DropdownMenuItem>
               </DropdownMenuContent>
            </DropdownMenu>
         </div>
         <div className='flex flex-col gap-2 flex-1'>
            {column.items.map((item) => (
               <Item key={item.id} column_id={column.id} item={item} itemId={itemId} setItemId={setItemId} />
            ))}
         </div>
         <div className='flex justify-between items-center border-t border-gray-300 pt-4'>
            <Button size='lg' variant='outline' className='w-full' onClick={() => store.item.modal.toggle(column.id)}>
               Add Item
            </Button>
         </div>
      </div>
   );
}
