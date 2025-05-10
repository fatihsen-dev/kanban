import MDEditor, { commands, EditorContext } from "@uiw/react-md-editor";
import { Eye, Pen } from "lucide-react";
import { useContext } from "react";

const ToggleButton = () => {
   const { preview, dispatch } = useContext(EditorContext);

   const togglePreview = () => {
      if (dispatch) {
         dispatch({
            preview: preview === "edit" ? "preview" : "edit",
         });
      }
   };

   if (preview === "edit") {
      return (
         <button onClick={togglePreview}>
            <Eye className='custom-icon' />
         </button>
      );
   }

   return (
      <button onClick={togglePreview}>
         <Pen className='custom-icon' />
      </button>
   );
};

interface EditorProps {
   value: string;
   setValue: (value: string) => void;
}

export default function Editor({ value, setValue }: EditorProps) {
   const filteredCommands = commands
      .getCommands()
      .filter((cmd) => cmd.keyCommand !== "help" && cmd.keyCommand !== "divider");

   const previewCommand = {
      name: "preview",
      keyCommand: "preview",
      value: "preview",
      icon: <ToggleButton />,
   };

   return (
      <div className='container' data-color-mode='light'>
         <MDEditor
            value={value}
            onChange={(e) => setValue(e ?? "")}
            commands={filteredCommands}
            extraCommands={[previewCommand]}
            preview={value.length > 0 ? "preview" : "edit"}
            className='large-icon-editor'
         />
      </div>
   );
}
