"use client";
import {
  InboxIcon,
  UserGroupIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { usePathname } from "next/navigation";

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}
interface InboxProps {
  numberOfReq: number;
}

const Inbox: React.FC<InboxProps> = ({ numberOfReq }) => {
  const pathname = usePathname();
  const conversationNav = [
    {
      name: "Messages",
      icon: InboxIcon,
      href: "/dashboard",
      current: pathname === "/dashboard",
    },
  ];
  const automationNav = [
    {
      name: "Chatbot",
      icon: InboxIcon,
      href: "/messages",
      current: pathname === "/messages",
    },
    {
      name: "Customization",
      icon: UserIcon,
      href: "/customization",
      current: pathname === "/customization",
    },
  ];

  return (
    <Accordion type="single" collapsible className="w-44 ">
      <h4 className="font-bold text-2xl pl-3 text-black pb-6">Inbox</h4>
      <AccordionItem value="conversation" className="border-b-0">
        <AccordionTrigger className="flex flex-row gap-x-2 text-sm flex-grow-0 hover:no-underline">
          Conversation
        </AccordionTrigger>
        {conversationNav.map((item) => {
          return (
            <AccordionContent className="mt-2">
              <Link
                href={item.href}
                className={classNames(
                  item.current ? "text-blue-900" : "text-black",
                  "flex gap-x-2 text-sm leading-6 font-semibold"
                )}
              >
                <item.icon aria-hidden="true" className="h-5 w-5 shrink-0" />
                {item.name}
              </Link>
            </AccordionContent>
          );
        })}
        <AccordionContent className="mt-2">
          <Link
            href="/dashboard/request"
            className={classNames(
              pathname === "/dashboard/request"
                ? "text-blue-900"
                : "text-black",
              numberOfReq <= 0 ? "" : "px-2 pt-1",
              "flex gap-x-2 text-sm leading-6 font-semibold relative "
            )}
          >
            {numberOfReq <= 0 ? null : (
              <span className="absolute h-5 w-5 left-0 top-[-7px] rounded-full flex items-center bg-gray-900 text-white text-[8px] justify-center">
                {numberOfReq}
              </span>
            )}
            <UserIcon aria-hidden="true" className="h-5 w-5 shrink-0" />
            Chat Request
          </Link>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="automation" className="border-b-0">
        <AccordionTrigger className="flex flex-row gap-x-2 text-sm flex-grow-0 hover:no-underline">
          Automation
        </AccordionTrigger>
        {automationNav.map((item) => {
          return (
            <AccordionContent className="mt-2">
              <Link
                href={item.href}
                className={classNames(
                  item.current ? "text-blue-900" : "text-black",
                  "group flex gap-x-2 rounded-md text-sm leading-6 font-semibold"
                )}
              >
                <item.icon aria-hidden="true" className="h-5 w-5 shrink-0" />
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
