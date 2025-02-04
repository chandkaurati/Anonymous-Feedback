"use client";

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
import { useToast } from "@/hooks/use-toast";
import { verifyCodeValidation } from "@/schemas/verifySchema";
import { ApiResponce } from "@/types/Apiresponce";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import  {BeatLoader} from "react-spinners"
import * as z from "zod";

function page() {
  const router = useRouter();
  const params = useParams<{ username: string }>();
  const [loading, setLoading] = useState<boolean>(false)
  const { toast } = useToast();

  const form = useForm<z.infer<typeof verifyCodeValidation>>({
    resolver: zodResolver(verifyCodeValidation),
  });

  const onSubmit = async (data: z.infer<typeof verifyCodeValidation>) => {
    setLoading(true)
    try {
      const responce = await axios.post("/api/verify-account", {
        username: params.username,
        code: data.code,
      });

      toast({
        title: "success",
        description: responce.data.message,
      });

      router.replace("/sign-in");
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponce>;
      let errorMessage = axiosError.response?.data.message;
      toast({
        title: "Erorr",
        description: errorMessage || "failed to verify",
        variant: "destructive",
      });
    }finally{
      setLoading(false)
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight lg:text-4xl mb-6">
            verify your Account
          </h1>
          <p className="mb-4">Enter the verification code</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>verification code</FormLabel>
                  <FormControl>
                    <Input placeholder="shadcn" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">{loading? <BeatLoader size={10} color="black"/> : "Verify"}</Button>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default page;
