import MDEditor from "@uiw/react-md-editor";
import { useEffect } from "react";

interface PreviewProps {
   content: string;
}

export default function Preview({ content }: PreviewProps) {
   useEffect(() => {
      const editor = document.querySelector(".markdown-editor");
      if (!editor) return;
      const linkElements = editor.querySelectorAll("a");
      linkElements.forEach((link) => {
         link.setAttribute("target", "_blank");
      });
   }, []);

   return <MDEditor.Markdown className='markdown-editor preview' source={content} />;
}
