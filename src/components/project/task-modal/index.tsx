import { useProjectStore } from "@/store/project-store";
import CreateTaskModal from "./create-task-modal";

export default function TaskModal() {
   const { task } = useProjectStore();

   const render = () => {
      switch (task.modal.name) {
         case "create":
            return <CreateTaskModal />;
         default:
            return null;
      }
   };

   return render();
}
