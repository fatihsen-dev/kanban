import useDataStore from "@/store/data";
import { useRef } from "react";
import { useDrag, useDrop } from "react-dnd";

interface ItemProps {
   item: Item;
   column_id: string;
}

const ItemType = "ITEM";

export default function Item({ item, column_id }: ItemProps) {
   const store = useDataStore();

   const ref = useRef<HTMLDivElement>(null);

   const [{ isOver }, drop] = useDrop({
      accept: ItemType,
      drop: (droppedItem: Item & { column_id: string }) => {
         store.item.move(column_id, droppedItem.column_id, droppedItem, item.order, droppedItem.order);
      },
      collect: (monitor) => ({
         isOver: monitor.isOver(),
         canDrop: monitor.canDrop(),
      }),
   });

   const [{ isDragging }, drag] = useDrag(() => ({
      type: ItemType,
      item: { ...item, column_id },
      collect: (monitor) => ({
         isDragging: monitor.isDragging(),
      }),
   }));

   drag(drop(ref));

   return (
      <div
         ref={ref}
         className={`bg-white border-2 border-dashed border-gray-300 rounded-md p-4 transition-colors ${
            isDragging ? "opacity-50 cursor-move" : "opacity-100 cursor-move"
         } ${isOver ? "bg-green-500!" : ""}`}>
         <div className='flex items-center gap-2'>
            <div className='w-5 h-5 bg-gray-300 rounded-full text-xs flex items-center justify-center'>
               {item.order}
            </div>
            <b className='hover:underline cursor-pointer'>{item.name}</b>
         </div>
      </div>
   );
}
