import { Button } from "@/components/ui/button";
import {
   Drawer,
   DrawerClose,
   DrawerContent,
   DrawerDescription,
   DrawerFooter,
   DrawerHeader,
   DrawerTitle,
} from "@/components/ui/drawer";
import useItem from "@/hooks/useItem";
import { useEffect, useState } from "react";

interface ItemDetailsProps {
   itemId: string | null;
   setItemId: (itemId: string | null) => void;
}

export default function ItemDetails({ itemId, setItemId }: ItemDetailsProps) {
   const { getById } = useItem();
   const [isOpen, setIsOpen] = useState(false);
   const [item, setItem] = useState<Item | null>(null);
   useEffect(() => {
      if (itemId) {
         const item = getById(itemId);
         if (item) {
            setItem(item);
            setIsOpen(true);
         }
      }
   }, [itemId]);

   return (
      <Drawer
         direction='right'
         open={isOpen}
         onOpenChange={() => {
            setItemId(null);
            setIsOpen(false);
         }}>
         <DrawerContent>
            <DrawerHeader>
               <DrawerTitle>{item?.title}</DrawerTitle>
               <DrawerDescription>This action cannot be undone.</DrawerDescription>
            </DrawerHeader>
            <DrawerFooter>
               <Button>Button</Button>
               <DrawerClose></DrawerClose>
            </DrawerFooter>
         </DrawerContent>
      </Drawer>
   );
}
