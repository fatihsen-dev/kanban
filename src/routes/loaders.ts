import { authUser } from "@/lib/axios/auth-user";
import { redirect } from "react-router";

export const authLoader = async () => {
   try {
      const token = localStorage.getItem("token");
      if (token) {
         const response = await authUser();
         if (response.data.success) {
            return redirect("/");
         }
      }
   } catch {
      return redirect("/login");
   }
};

export const protectedLoader = async () => {
   try {
      const response = await authUser();
      if (response.data.success) {
         return { authUser: response.data.data };
      }
   } catch {
      return redirect("/login");
   }
};
