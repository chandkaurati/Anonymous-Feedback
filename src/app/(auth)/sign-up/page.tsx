"use client";
import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {useDebounceCallback } from "usehooks-ts";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { signupSchemaVanliDation } from "@/schemas/signUpSchema";
import axios, { AxiosError } from "axios";
import { ApiResponce } from "@/types/Apiresponce";
import {PulseLoader, SyncLoader} from "react-spinners"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
 
function page() {
  const [username, setUsername] = useState("");
  const [usernameMessage, setUsernameMessage] = useState("");
  const [isChekingUsername, setIsChekingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const debounced = useDebounceCallback(setUsername, 500);
  const { toast } = useToast();
  const router = useRouter();

  // zod implementation

  const form = useForm<z.infer<typeof signupSchemaVanliDation>>({
    resolver: zodResolver(signupSchemaVanliDation),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof signupSchemaVanliDation>) => {
    setIsSubmitting(true);
    try {
      const responce = await axios.post<ApiResponce>("/api/sign-up", data);
      console.log(responce);
      toast({
        title: "success",
        description: "user register succefully",
      });
      router.replace(`/verify/${username}`);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponce>;
      let errorMessage = axiosError.message;
      toast({
        title: "Signup failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const checkUsernameUnique = async () => {
      if (username) {
        setIsChekingUsername(true);
        setUsernameMessage("");
        try {
          const responce = await axios.get(
            `/api/check-username-unique?username=${username}`
          );
          setUsernameMessage(responce.data.message);
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponce>;
          if(axiosError.response){
            setUsernameMessage(axiosError.response.data.message)
          }else{
            setUsernameMessage(axiosError.message)
          }
        } finally {
          setIsChekingUsername(false);
        }
      }
    };

    checkUsernameUnique();
  }, [username]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight lg:text-4xl mb-6">
            Join Mistry Message
          </h1>
          <p className="mb-4">Sign up to start your anonymous Adventure</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your username"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        debounced(e.target.value);
                      }}
                    />
                  </FormControl>
                  {isChekingUsername && <SyncLoader size={8}/> }
                  <p className={`text-sm ${usernameMessage ===  "Username is Available" ? 'text-green-600'  : 'text-red-600'} `}>{usernameMessage}</p>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>email</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter your password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <PulseLoader size={8} />
              ) : (
                "Signup"
              )}
            </Button>
          </form>
        </Form>
        <div className="text-center mt-4">
          <p>
            Already Member?
            <Link href="/sign-in" className="text-blue-600 hover:text-blue-800">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default page;
