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
   extraCommands?: boolean;
}

export default function Editor({ value, setValue, extraCommands = true }: EditorProps) {
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
      <MDEditor
         value={value}
         onChange={(e) => setValue(e ?? "")}
         commands={filteredCommands}
         extraCommands={extraCommands ? [previewCommand] : []}
         preview='edit'
         className='markdown-editor editor'
      />
   );
}
