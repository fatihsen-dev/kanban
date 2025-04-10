"use client";

import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useMutation } from "@/hooks/use-mutation";
import useToast from "@/hooks/use-toast";
import { loginSchema } from "@/schemas/login-schema";
import { Lock, Mail } from "lucide-react";
import { useForm } from "react-hook-form";
import { NavLink, useNavigate } from "react-router";
import { z } from "zod";

export default function SignInForm() {
   const navigate = useNavigate();
   const { toast } = useToast();

   const loginMutation = useMutation<IUserLoginResponse, Pick<IUser, "email" | "password">>({
      onSuccess: (data) => {
         localStorage.setItem("token", data.token);
         toast("Login successful", "success");
         navigate("/");
      },
      onError: (error) => {
         const apiError = error.response?.data;
         toast(apiError?.message || error.message, "error");
      },
   });

   const form = useForm({
      resolver: zodResolver(loginSchema),
      defaultValues: {
         email: "",
         password: "",
      },
   });

   const onSubmit = async (data: z.infer<typeof loginSchema>) => {
      loginMutation.mutate({
         url: "/auth/login",
         method: "POST",
         payload: data,
      });
   };

   return (
      <Card className='w-full max-w-md'>
         <CardHeader>
            <h2 className='text-2xl font-semibold text-center'>Login</h2>
         </CardHeader>
         <CardContent>
            <Form {...form}>
               <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
                  <FormField
                     control={form.control}
                     name='email'
                     render={({ field }) => (
                        <FormItem>
                           <FormControl>
                              <div className='relative'>
                                 <Mail size={20} className='absolute left-2 top-1/2 -translate-y-1/2 text-gray-500' />
                                 <Input className='pl-8' placeholder='Email' {...field} />
                              </div>
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />
                  <FormField
                     control={form.control}
                     name='password'
                     render={({ field }) => (
                        <FormItem>
                           <FormControl>
                              <div className='relative'>
                                 <Lock size={20} className='absolute left-2 top-1/2 -translate-y-1/2 text-gray-500' />
                                 <Input type='password' className='pl-8' placeholder='Password' {...field} />
                              </div>
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />
                  <Button type='submit' className='w-full'>
                     Sign In
                  </Button>
               </form>
            </Form>
         </CardContent>
         <CardFooter className='flex flex-col gap-2'>
            <p>
               Don&apos;t have an account yet?{" "}
               <NavLink className='text-blue-500 hover:underline' to='/register'>
                  Register
               </NavLink>
            </p>
         </CardFooter>
      </Card>
   );
}
