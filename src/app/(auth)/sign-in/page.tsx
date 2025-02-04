"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { signInSchemaa } from "@/schemas/signInSchema";
import axios from "axios";
import { signIn } from "next-auth/react";

function page() {
  const form = useForm<z.infer<typeof signInSchemaa>>({
    resolver: zodResolver(signInSchemaa),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });
  const [loading, setLoading] = useState();
  const router = useRouter();
  const { toast } = useToast();

  const onSubmit = async (data: z.infer<typeof signInSchemaa>) => {
    const result = await signIn("credentials", {
      redirect: false,
      identifier: data.identifier,
      password: data.password,
    });
    console.log(result);
    if (result?.error) {
      toast({
        title: "failed to login",
        description: "Incorrect email or password plese check credentials",
        variant: "destructive",
      });
    }
    if (result?.url) {
      router.replace("/dashboard");
    }
  };

  const handleClick = async () => {
    alert("hi");
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight lg:text-4xl mb-6">
            Sign in
          </h1>
          <p className="mb-4">Sign up to start your anonymous Adventure</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="identifier"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>email/usernmae</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="enter your email or username"
                      {...field}
                    />
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

            <Button type="submit">Login</Button>
          </form>
        </Form>
        <div className="text-center mt-4">
          <p>
            Don't have an account?
            <Link href="/sign-up" className="text-blue-600 hover:text-blue-800">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default page;
