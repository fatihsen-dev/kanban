import { useProjectStore } from "@/store/project-store";
import CreateColumnModal from "./create-column-modal";
import EditColumnModal from "./edit-column-modal";

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
