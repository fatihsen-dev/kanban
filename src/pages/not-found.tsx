import { NavLink } from "react-router";

export default function NotFound() {
   return (
      <div className='h-screen flex flex-col justify-center items-center gap-1'>
         <h1 className='text-5xl font-bold'>404</h1>
         <p className='text-xl'>
            Page not found go to{" "}
            <NavLink className='text-blue-500' to='/'>
               Home
            </NavLink>{" "}
            page
         </p>
      </div>
   );
}
