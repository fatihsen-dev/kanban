import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

interface RoleSelectProps {
   role: IProjectAccessRole;
   setRole: (role: IProjectAccessRole) => void;
   onChange?: (role: IProjectAccessRole) => void;
   className?: string;
}

export default function RoleSelect({ role, setRole, onChange, className }: RoleSelectProps) {
   const handleChange = (value: string) => {
      setRole(value as IProjectAccessRole);
      if (onChange) onChange(value as IProjectAccessRole);
   };

   return (
      <Select value={role} onValueChange={handleChange}>
         <SelectTrigger
            className={cn(
               "w-[100px] bg-white hover:bg-gray-100 transition-colors cursor-pointer",
               className
            )}>
            <SelectValue placeholder='Theme' />
         </SelectTrigger>
         <SelectContent>
            <SelectItem className='hover:bg-gray-100 cursor-pointer' value='admin'>
               Admin
            </SelectItem>
            <SelectItem className='hover:bg-gray-100 cursor-pointer' value='read'>
               Read
            </SelectItem>
            <SelectItem className='hover:bg-gray-100 cursor-pointer' value='write'>
               Write
            </SelectItem>
         </SelectContent>
      </Select>
   );
}
