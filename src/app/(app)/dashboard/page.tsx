"use client"
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Message } from "@/models/User.model";
import { acceptMessage } from "@/schemas/acceptMessageSchema";
import { ApiResponce } from "@/types/Apiresponce";
import { zodResolver } from "@hookform/resolvers/zod";
import { Separator } from "@radix-ui/react-separator";
import { Switch } from "@radix-ui/react-switch";
import axios, { AxiosError } from "axios";
import { User } from "next-auth";
import { useSession } from "next-auth/react";
import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import MessageCard from "../MessageCard";

function page() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);

  const { toast } = useToast();

  const handleDeleteMessage = async (messageId: string) => {
    setMessages(messages.filter((message) => message._id !== messageId));
  };

  const { data: session } = useSession();

  const form = useForm({
    resolver: zodResolver(acceptMessage),
  });

  const { register, watch, setValue } = form;

  const acceptMessages = watch("acceptMessages");

  const fetchAcceptMessage = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      const responce = await axios.get<ApiResponce>("/api/accept-messages");
      setValue("acceptMessages", responce.data.isAcceptingMessage);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponce>;
      toast({
        title: "Error",
        description:
          axiosError.response?.data.message || "Failed to get Message Settings",
        variant: "destructive",
      });
    } finally {
      setIsSwitchLoading(loading);
    }
  }, [setValue]);

  const fetchMessages = useCallback(
    async (refresh: boolean = false) => {
      setIsSwitchLoading(false), setLoading(true);
      try {
        const responce = await axios.get<ApiResponce>("/api/get-messages");
        setMessages(responce.data.messages || []);

        if (refresh) {
          toast({
            title: "Refreshed Messsages",
            description: "showing latest Messages",
          });
        }
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponce>;
        toast({
          title: "Error",
          description:
            axiosError.response?.data.message || "failed to feetch messsages",
          variant: "destructive",
        });
      } finally {
        setIsSwitchLoading(false);
        setLoading(false);
      }
    },
    [setLoading, setMessages]
  );

  useEffect(() => {
    if (!session || !session.user) return;
    fetchMessages();
    fetchAcceptMessage();
  }, [session, setValue, fetchAcceptMessage, fetchMessages]);

  // handle switch change

  const handleSwitchChange = async () => {
    setIsSwitchLoading(true);
    try {
      const responce = await axios.post<ApiResponce>("/api/accept-messages", {
        isAcceptingMessage: !acceptMessages,
      });
      setValue("acceptMessages", !acceptMessages);
      toast({
        title: responce.data.message,
      });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponce>;
      toast({
        title: "Error",
        description:
          axiosError.response?.data.message ||
          "failed to update acceptMessages",
        variant: "destructive",
      });
    } finally {
      setIsSwitchLoading(false);
    }
  };

  const { username } = session?.user as User;
  // Todo : do more research
  const baseUrl = `${window.location.protocol}//${window.location.host}`;
  const profileUrl = `${baseUrl}/you/${username}`;
  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast({
      title: "copied",
      description: "profile URL copied",
    });
  };

  if (!session || !session?.user) {
    return <>Plese Login to sess dashbaord</>;
  }

  return (
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
      <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>
      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>
        <div className="flex items-center">
          <input
            type="text"
            value={profileUrl}
            disabled
            className="input input-bordered w-full p-2 mr-2"
          />
          <Button onClick={copyToClipboard}>Copy!</Button>
        </div>
      </div>
      <div className="mb-4">
        <Switch
          {...register("acceptMessages")}
          checked={acceptMessages}
          onCheckedChange={handleSwitchChange}
          disabled={isSwitchLoading}
        />
        <span className="ml-2">
          Accept Messages : {acceptMessages ? "On" : "Off"}
        </span>
      </div>
      <Separator />

      <Button className="mt4" variant="outline" />

      <div className="grid mt-4 grid-cols-1 md:grid-cols-2 gap-6">
        {messages.length > 0 ? (
          messages.map((message, index) => (
            <div key={index}>
              <MessageCard
                message={message}
                onmessageDelete={handleDeleteMessage}
              />
            </div>
          ))
        ) : (
          <p>No Messages to display</p>
        )}
      </div>
    </div>
  );
}

export default page;
