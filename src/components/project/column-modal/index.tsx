import { useProjectStore } from "@/store/project-store";
import CreateColumnModal from "./create-column-modal";
import EditColumnModal from "./edit-column-modal";

export const colors = [
   {
      color: "#fb2c36",
   },
   {
      color: "#00c951",
   },
   {
      color: "#2b7fff",
   },
   {
      color: "#ad46ff",
   },
];

export default function ColumnModal() {
   const { column } = useProjectStore();

   const render = () => {
      switch (column.modal.name) {
         case "create":
            return <CreateColumnModal />;
         case "edit":
            return <EditColumnModal />;
         default:
            return null;
      }
   };

   return render();
}
