"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TextMessage from "./TextMessage";
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "@/lib/constant";
import useSocket from "@/utils/useSocket";

const messageList = [
  {
    name: "John Doe",
    id: "1",
    messages: "My acccount was suspended",
  },
  {
    name: "Dave Moh",
    id: "2",
    messages: "My acccount was suspended",
  },
  {
    name: "Daniel Matt",
    id: "3",
    messages: "My acccount was suspended",
  },
  {
    name: "Arslan Kennedy",
    id: "4",
    messages: "My acccount was suspended",
  },
];
interface AccpetedRquest {
  uniqueId: string;
  messageContent: string;
  accepted: Boolean;
  adminId: number;
}

interface Messages {
  senderType: string;
  content: string;
}

interface MessageProps {
  adminId: number;
}

const Message: React.FC<MessageProps> = ({ adminId }) => {
  const [allAcceptedReq, setAllAcceptedReq] =
    useState<(AccpetedRquest | null)[]>();
    const socket = useSocket();
    const scrollDownRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<(Messages | null)[]>();
  const [uniqueValue, setUniqueValue] = useState("");
  useEffect(() => {
    const getAllAcceptedRequest = async () => {
      try {
        const response = await axios.get(
          `${BACKEND_URL}/conversation/accepted/${adminId}`
        );
        setAllAcceptedReq(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    getAllAcceptedRequest();
  }, []);

  useEffect(() => {
    const getConversationMessages = async () => {
      try {
        const response = await axios.get(
          `${BACKEND_URL}/conversation/messages/${uniqueValue}`
        );
        setMessages(response.data);
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
        // When a new message is created, trigger the function to fetch updated conversation messages
        getConversationMessages();
      });
    }

    // Clean up the Socket.IO connection when the component unmounts
    return () => {
      if (socket) {
        socket.off("messageCreated");
      }
    };
  }, [socket]);
    
    console.log("allAcceptedReq", allAcceptedReq)
  return (
    <div>
      <div>
        <Tabs defaultValue={messageList[0].id} className="w-full flex flex-row">
          <TabsList className="flex flex-col w-[400px] h-screen overflow-y-auto bg-white justify-start items-start px-0  border-r border-gray-200 rounded-none py-6">
            <h4 className="font-bold pl-3 text-black pb-6 text-2xl">
              Messages
            </h4>
            {allAcceptedReq?.map((list, index) => {
              const getFirstLetters = (str: string) => {
                // Split the string into an array of words
                let words = str.split(" ");
                // Initialize an empty string to store the first letters
                let firstLetters = "";

                // Loop through each word in the array
                for (let i = 0; i < words.length; i++) {
                  // Get the first letter of the current word
                  let firstLetter = words[i].charAt(0);
                  // Concatenate the first letter to the result string
                  firstLetters += firstLetter;
                }

                // Return the string containing the first letters of each word
                return firstLetters;
              };

              return (
                <TabsTrigger
                  value={list?.uniqueId!}
                  onClick={() => setUniqueValue(list?.uniqueId!)}
                  key={index}
                  className="flex flex-col justify-between items-start px-2 py-4 w-full h-[120px] data-[state=active]:bg-gray-200 data-[state=active]:shadow-none data-[state=active]:text-blue-900 data-[state=active]:border-l-2 data-[state=active]:border-l-blue-900 rounded-l rounded-r-none border-b border-b-gray-200"
                >
                  <div className="flex flex-row items-center gap-x-3">
                    <span className="rounded-full bg-blue-900 text-white h-8 w-8 flex items-center justify-center text-[12px]">
                      {getFirstLetters(list?.uniqueId!)}
                    </span>
                    <span>{list?.uniqueId}</span>
                  </div>
                  <p className="text-black font-normal">"Hello"</p>
                </TabsTrigger>
              );
            })}
          </TabsList>
          {allAcceptedReq?.map((list, index) => {
            return (
              <TabsContent key={index} value={list?.uniqueId!} className="w-full">
                <div className="fixed w-full h-[40px] pl-4 bg-white border-b border-gray-200 opacity-100">
                  <h4 className="font-bold">{list?.uniqueId}</h4>
                </div>
                <TextMessage />
              </TabsContent>
            );
          })}
        </Tabs>
      </div>
    </div>
  );
};

export default Message;
