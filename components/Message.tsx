"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TextMessage from "./TextMessage";
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "@/lib/constant";
import useSocket from "@/utils/useSocket";
import { Button } from "./ui/button";
import { CheckIcon, ClockIcon, SearchIcon, StarIcon } from "lucide-react";
import { formatTime } from "@/utils/dateUtils";

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
interface AcceptedRequest {
  uniqueId: string;
  messageContent: string;
  accepted: boolean;
  adminId: number;
  messages: {
    user: string;
    content: string;
    createdAt: string;
    updatedAt: string;
  }[];
  updatedAt: string;
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
    useState<(AcceptedRequest | null)[]>();
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
        const sortedData = response.data.sort(
          (a: AcceptedRequest, b: AcceptedRequest) => {
            const aFirstMessageDate = a.messages[0]
              ? new Date(a.messages[0].updatedAt).getTime()
              : 0;
            const bFirstMessageDate = b.messages[0]
              ? new Date(b.messages[0].updatedAt).getTime()
              : 0;
            return bFirstMessageDate - aFirstMessageDate;
          }
        );
        setAllAcceptedReq(sortedData);
      } catch (error) {
        console.log(error);
      }
    };
    getAllAcceptedRequest();

    if (socket) {
      socket.on("messageCreated", () => {
        console.log("fetching all accepted")
        getAllAcceptedRequest();
      });
    }

    // Clean up the Socket.IO connection when the component unmounts
    return () => {
      if (socket) {
        socket.off("messageCreated");
      }
    };
  }, [socket]);


  console.log("Accepted: ", allAcceptedReq);
  return (
    <div>
      <div>
        <Tabs defaultValue={messageList[0].id} className="w-full flex flex-row">
          <TabsList className="flex flex-col w-[35%] h-screen overflow-y-auto bg-white justify-start items-start p-0  border-r border-gray-200 rounded-none">
            <div className="sticky bg-white top-0 z-10 w-full">
              <h4 className="font-bold text-black text-2xl h-[50px] flex items-center border-b border-gray-200 mb-4 w-full px-3">
                Messages
              </h4>
              <div className="px-3 w-full">
                <div className=" border rounded-md border-gray-200 flex items-center gap-x-3 w-full px-2 h-8 mb-5">
                  <SearchIcon className=" h-4 w-4" />
                  <input
                    type="text"
                    className=" w-full inset-0 border-none focus:outline-none placeholder:text-sm text-sm"
                    placeholder="Search"
                  />
                </div>
              </div>
            </div>
            {allAcceptedReq?.map((list, index) => {
              const getFirstTwoLetters = (str: string) => {
                return str.substring(0, 2);
              };

              const getLastMessage = (
                messages: { user: string; content: string }[]
              ): string => {
                if (messages.length === 0) {
                  return ""; // Handle empty array case, you can adjust the return value as needed
                }
                const lastMessageObj = messages[0];
                return lastMessageObj.content;
              };
              const getFormatedTime = formatTime(list?.messages[0].updatedAt!);

              return (
                <div className="px-3 pb-2 w-full">
                  <TabsTrigger
                    value={list?.uniqueId!}
                    onClick={() => {
                      setUniqueValue(list?.uniqueId!);
                      console.log("list: ", list);
                    }}
                    key={index}
                    className="flex flex-col justify-between items-start px-2 py-3 w-full h-[100px] rounded-md data-[state=active]:bg-gray-200 data-[state=active]:shadow-none data-[state=active]:border-2 border border-gray-200 overflow-y-auto"
                  >
                    <div className="flex flex-row items-center justify-between w-full">
                      <div className="flex flex-row items-center gap-x-3">
                        <span className="flex items-center justify-center h-7 w-7 bg-gray-950 text-xs rounded-full text-white uppercase">
                          {getFirstTwoLetters(list?.uniqueId!)}
                        </span>
                        <span className=" text-sm uppercase">
                          {list?.uniqueId}
                        </span>
                      </div>
                      <span className="text-[12px] data-[state=active]:text-blue-500">
                        {getFormatedTime}
                      </span>
                    </div>
                    <p className="text-gray-500 font-normal truncate w-full text-left">
                      {getLastMessage(list?.messages!)}
                    </p>
                  </TabsTrigger>
                </div>
              );
            })}
          </TabsList>
          {allAcceptedReq?.map((list, index) => {
            return (
              <TabsContent
                key={index}
                value={list?.uniqueId!}
                className="w-[65%] mt-0"
              >
                <div className="sticky top-0 h-[50px] px-4 bg-white border-b border-gray-200 opacity-100 flex items-center justify-between">
                  <h4 className="uppercase font-bold">{list?.uniqueId}</h4>
                  <span className="flex items-center gap-x-3 pr-4">
                    <StarIcon className="h-4 w-4" />
                    <ClockIcon className="h-4 w-4" />
                    <CheckIcon className="h-4 w-4 mt-1" />
                  </span>
                </div>
                <TextMessage id={list?.uniqueId!} />
              </TabsContent>
            );
          })}
        </Tabs>
      </div>
    </div>
  );
};

export default Message;
