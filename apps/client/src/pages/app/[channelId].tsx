import {
  Avatar,
  Button,
  Card,
  CardBody,
  CardHeader,
  cn,
  Textarea,
} from "@heroui/react";
import { LucideSend } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import useSWR, { mutate } from "swr";

import http from "@/lib/http";
import { useAuth } from "@/providers/AuthProvider";
import { Channel, Message, User } from "@/types";
import { useSocket } from "@/providers/SocketProvider";

interface MessageWithUser extends Message {
  user: User;
}

const useChannel = () => {
  const { channelId } = useParams();
  return useSWR<{ messages: MessageWithUser[] } & Channel>(
    `/channels/${channelId}`,
  );
};

const notification = new Audio("/notification.mp3");

export default function ViewChannel() {
  const socket = useSocket();
  const { data: channel } = useChannel();
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.scrollTo({
      top: containerRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [channel]);

  useEffect(() => {
    if (!channel) return;

    socket.emit("join", channel.id);

    socket.on("messageCreate", () => {
      notification.play();
      mutate(`/channels/${channel.id}`);
    });

    return () => {
      socket.emit("leave", channel.id);
      socket.off("messageCreate");
    };
  }, [channel]);

  if (!channel) return null;

  return (
    <div className="flex h-full flex-col">
      <div ref={containerRef} className="flex-1 overflow-y-auto">
        <div className="grid gap-3 p-3">
          {channel.messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
        </div>
      </div>

      <SubmitForm />
    </div>
  );
}

const SubmitForm = () => {
  const { channelId } = useParams();
  const [message, setMessage] = useState("");
  const inputRef = React.useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    // key bindings
    // enter sends the message
    // shift + enter adds a new line
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }

      if (e.key === "Enter" && e.shiftKey) {
        e.preventDefault();
        setMessage((prev) => `${prev}\n`);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    inputRef.current?.focus();
  }, [channelId]);

  const handleSend = async () => {
    if (message.trim() === "") {
      return toast.error("Message cannot be empty");
    }

    const data = {
      channelId,
      content: message,
    };

    try {
      await http.post("/messages", data);
      setMessage("");
      inputRef.current?.focus();
    } catch (error) {
      http.handleError(error);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    handleSend();
  };

  return (
    <Card className="border-s border-content3" radius="none">
      <CardBody>
        <form
          className="flex items-end justify-between gap-3"
          onSubmit={handleSubmit}
        >
          <Textarea
            name="content"
            onValueChange={setMessage}
            placeholder="Message"
            ref={inputRef}
            value={message}
            variant="faded"
            minRows={1}
          />
          <Button color="primary" isIconOnly type="submit">
            <LucideSend className="text-white" />
          </Button>
        </form>
      </CardBody>
    </Card>
  );
};

const MessageBubble = ({ message }: { message: MessageWithUser }) => {
  const { user } = useAuth();

  if (!user) return null;

  const isSentByUser = message.userId === user.id;
  const alignmentClass = isSentByUser ? "justify-end" : "justify-start";
  const cardClass = isSentByUser ? "bg-secondary-400" : "bg-primary-400";
  const textAlignClass = isSentByUser ? "text-end" : "text-start";

  return (
    <div className={cn("flex", alignmentClass)}>
      <div className="flex items-end gap-1">
        {!isSentByUser && (
          <Avatar className="mb-5" name={message.user.username} size="sm" />
        )}
        <div className="flex flex-col gap-1">
          <Card className={cn("min-w-56 max-w-xl text-white", cardClass)}>
            <CardHeader className="pb-0">
              <h4 className="font-semibold">{message.user.username}</h4>
            </CardHeader>
            <CardBody className="pt-0">{message.content}</CardBody>
          </Card>
          <p className={cn(`text-xs text-foreground-500`, textAlignClass)}>
            {new Date(message.createdAt).toLocaleString()}
          </p>
        </div>
        {isSentByUser && <Avatar className="mb-5" size="sm" />}
      </div>
    </div>
  );
};
