"use client";
import { useEffect, useRef, useState, ChangeEvent } from "react";
import { Button } from "./ui/button";
import useSocket from "@/utils/useSocket";
import axios from "axios";
import { BACKEND_URL } from "@/lib/constant";
import toast from "react-hot-toast";
import Typing from "./IsTyping";

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

interface Messages {
  senderType: string;
  content: string;
  updatedAt: string;
  createdAt: string;
}

interface TextMessageProps {
  id: string;
}

const TextMessage: React.FC<TextMessageProps> = ({ id }) => {
  const scrollDownRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<(Messages | null)[]>();
  const [input, setInput] = useState<string>(" ");
  const [typing, setTyping] = useState(false);
  const [otherUserTyping, setOtherUserTyping] = useState(false);
  const [typingSender, setTypingSender] = useState<string | null>(null);
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(
    null
  );
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null); //
  const senderType = "admin";

  const socket = useSocket();
  useEffect(() => {
    const getConversationMessages = async () => {
      try {
        const response = await axios.get(
          `${BACKEND_URL}/conversation/messages/${id}`
        );
        setMessages(response.data);
        console.log("respons :", response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }

      const container = scrollDownRef.current;
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    };

    // Call the function to fetch conversation messages when the component mounts
    getConversationMessages();

    // Listen for 'messageCreated' event emitted by the server via Socket.IO
    if (socket) {
      socket.on("messageCreated", () => {
        getConversationMessages();
        console.log("Called socket");
      });
    }

    // Clean up the Socket.IO connection when the component unmounts
    return () => {
      if (socket) {
        socket.off("messageCreated");
      }
    };
  }, [socket, id]);

  const handleContinueConversation = async () => {
    if (!input) return;
    try {
      const response = await axios.post(
        `${BACKEND_URL}/conversation/${id}/continue`,
        {
          senderType: "admin",
          messageContent: input,
        }
      );
      setInput("");
      setTyping(false);
    } catch (error) {
      toast.error("Something went wrong ...");
    }
  };

  const displayMessages = messages?.reverse();
  const conversationId = id

 useEffect(() => {
   if (socket && conversationId) {
     console.log(
       "Listening to typing events for conversation ID:",
       conversationId
     );

     const handleUserTyping = (data: { senderType: string }) => {
       console.log("Received typing event: ", data);

       if (data.senderType !== senderType) {
         setOtherUserTyping(true);
         setTypingSender(data.senderType);

         // Clear the existing timeout, if any
         if (typingTimeoutRef.current) {
           clearTimeout(typingTimeoutRef.current);
         }

         // Set a new timeout to clear the typing indicator after 1 second of no typing events
         typingTimeoutRef.current = setTimeout(() => {
           setOtherUserTyping(false);
           console.log("otherUser stopped typing");
         }, 1000);
       }
     };

     socket.on(`userTyping:${conversationId}`, handleUserTyping);

     return () => {
       socket.off(`userTyping:${conversationId}`, handleUserTyping);
       if (typingTimeoutRef.current) {
         clearTimeout(typingTimeoutRef.current);
       }
     };
   }
 }, [socket, conversationId]);

  useEffect(() => {
    const handleTyping = () => {
      if (socket && id) {
        socket.emit("typing", { conversationId: id, senderType });
        console.log("gettin socket values :", { id, senderType });
      }
    };

    if (typing) {
      handleTyping();
      const timeoutId = setTimeout(() => setTyping(false), 1000);
      return () => clearTimeout(timeoutId);
    }
  }, [socket, typing, id, senderType]);

  const handleChange = (
    e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    setInput(e.target.value);
    if (!typing) {
      setTyping(true);
    }
  };

  return (
    <div className="flex flex-col pb-12 px-4">
      <div
        id="messages"
        ref={scrollDownRef}
        className="flex flex-col-reverse gap-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch h-[calc(100vh-20rem)]"
      >
        <div className="flex flex-col-reverse gap-y-4">
          {displayMessages?.map((message, index) => {
            return (
              <div
                key={index}
                className={classNames(
                  message?.senderType === "admin"
                    ? "justify-end"
                    : "justify-start",
                  "flex items-end"
                )}
              >
                <div
                  className={classNames(
                    "flex flex-col space-y-2 text-base max-w-xs mx-2"
                  )}
                >
                  <p
                    className={classNames(
                      message?.senderType === "admin"
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-200 text-gray-900",
                      "px-4 py-2 rounded-lg inline-block rounded-br-none"
                    )}
                  >
                    {message?.content}
                  </p>
                </div>
              </div>
            );
          })}
          {otherUserTyping && (
            <div className="flex justify-start items-center">
              <Typing />
            </div>
          )}
        </div>
      </div>
      <div className="mt-2 flex flex-col gap-y-3">
        <textarea
          rows={4}
          name="comment"
          value={input}
          onChange={handleChange}
          className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-0 focus:ring-gray-100 sm:text-sm sm:leading-6"
        />
        <Button
          onClick={handleContinueConversation}
          className="text-white bg-green-600 self-end"
        >
          Send
        </Button>
      </div>
    </div>
  );
};

export default TextMessage;
