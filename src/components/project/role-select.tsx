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
         <SelectTrigger className={cn("w-[180px]", className)}>
            <SelectValue placeholder='Theme' />
         </SelectTrigger>
         <SelectContent>
            <SelectItem value='admin'>Admin</SelectItem>
            <SelectItem value='read'>Read</SelectItem>
            <SelectItem value='write'>Write</SelectItem>
         </SelectContent>
      </Select>
   );
}
