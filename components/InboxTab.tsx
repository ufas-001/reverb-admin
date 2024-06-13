"use client";
import {
  AtSymbolIcon,
  InboxIcon,
  UserGroupIcon,
  UserCircleIcon,
  UsersIcon,
  ChatBubbleBottomCenterTextIcon,
  UserIcon,
  AdjustmentsVerticalIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "@/lib/constant";

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}
interface InboxProps {
  numberOfReq: number;
  adminId: number
}

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

const Inbox: React.FC<InboxProps> = ({ numberOfReq, adminId }) => {
  const pathname = usePathname();
  const [acceptedReq, setAcceptedReq] = useState<(AcceptedRequest | null)[]>()
  const conversationNav = [
    {
      name: "Messages",
      icon: InboxIcon,
      href: "/dashboard",
      current: pathname === "/dashboard",
      length: acceptedReq?.length
    },
    {
      name: "Unassigned",
      icon: UserCircleIcon,
      href: "/dashboard/chat-request",
      current: pathname === "/dashboard/chat-request",
      length: numberOfReq
    },
    {
      name: "Mentions",
      icon: AtSymbolIcon,
      href: "#",
      current: pathname === "/",
      length: 0
    },
    {
      name: "All",
      icon: UsersIcon,
      href: "#",
      current: pathname === "/",
      length: 0
    },
  ];
  const automationNav = [
    {
      name: "Chatbot",
      icon: ChatBubbleBottomCenterTextIcon,
      href: "/messages",
      current: pathname === "/messages",
    },
    {
      name: "Customization",
      icon: AdjustmentsVerticalIcon,
      href: "/customization",
      current: pathname === "/customization",
    },
  ];

  useEffect(() => {
    const getAccecpetedConversation = async () => {
      const response = await axios.get(
        `${BACKEND_URL}/conversation/accepted/${adminId}`
      );
      setAcceptedReq(response.data)

    }
    getAccecpetedConversation()

  }, [adminId])

  return (
    <Accordion type="single" defaultValue="conversation" collapsible className="w-full">
      <h4 className="font-bold text-2xl pl-3 text-black w-full mb-4 h-[50px] flex items-center border-b border-gray-200">Inbox</h4>
      <AccordionItem value="conversation" className="border-b-0 px-3">
        <AccordionTrigger  className="flex flex-row gap-x-2 text-base py-2 font-medium flex-grow-0 hover:no-underline">
          Conversation
        </AccordionTrigger>
        {conversationNav.map((item, index) => {
          return (
            <AccordionContent key={index} className="pb-2">
              <Link
                href={item.href}
                className={classNames(
                  item.current ? "text-blue-900" : "text-black",
                  "flex justify-between items-center text-sm leading-6 font-normal pl-1"
                )}
              >
                <span className="flex gap-x-2 items-center">
                  <item.icon aria-hidden="true" className="h-4 w-4 font-bold shrink-0" />
                  <span>{item.name}</span>
                </span>
                <span>{item.length}</span>
              </Link>
            </AccordionContent>
          );
        })}
      </AccordionItem>
      <AccordionItem value="automation" className="border-b-0 px-3 py-0">
        <AccordionTrigger className="flex flex-row gap-x-2 py-2 text-base font-medium flex-grow-0 hover:no-underline">
          Automation
        </AccordionTrigger>
        {automationNav.map((item, index) => {
          return (
            <AccordionContent key={index} className="pb-2">
              <Link
                href={item.href}
                className={classNames(
                  item.current ? "text-blue-900" : "text-black",
                  "group flex gap-x-2 rounded-md text-sm leading-6 font-normal items-center pl-1"
                )}
              >
                <item.icon aria-hidden="true" className="h-4 w-4 shrink-0" />
                {item.name}
              </Link>
            </AccordionContent>
          );
        })}
      </AccordionItem>
    </Accordion>
  );
};

export default Inbox;
