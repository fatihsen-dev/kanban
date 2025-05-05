import formatDate from "@/lib/format-date";
import { useProjectStore } from "@/store/project-store";

export default function Info() {
   const { project } = useProjectStore();

   return (
      <div className='bg-gray-50 border border-gray-200 rounded-sm p-2'>
         <table>
            <tbody>
               <tr>
                  <td>Name: </td>
                  <td className='pl-4'>{project?.name}</td>
               </tr>
               <tr>
                  <td>Column Size: </td>
                  <td className='pl-4'>{project?.columns.length}</td>
               </tr>
               <tr>
                  <td>Task Size: </td>
                  <td className='pl-4'>{project?.columns.reduce((acc, column) => acc + column.tasks.length, 0)}</td>
               </tr>
               <tr>
                  <td>Members Size: </td>
                  <td className='pl-4'>{project?.members.length}</td>
               </tr>
               <tr>
                  <td>Created At: </td>
                  <td className='pl-4'>{formatDate(project?.created_at)}</td>
               </tr>
            </tbody>
         </table>
      </div>
   );
}
