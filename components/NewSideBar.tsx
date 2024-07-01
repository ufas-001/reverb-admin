"use client";
import Image from "next/image";
import { Fragment, ReactNode, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
  Bars3Icon,
  UsersIcon,
  XMarkIcon,
  Cog8ToothIcon,
  ArrowRightEndOnRectangleIcon,
  EnvelopeIcon,
  PaperAirplaneIcon,
  BookOpenIcon,
  ChartBarIcon
} from "@heroicons/react/24/outline";
import Inbox from "./InboxTab";
import { usePathname } from "next/navigation";
import axios from "axios";
import { BACKEND_URL } from "@/lib/constant";
import useSocket from "@/utils/useSocket";
import LogoIcon from "@/public/logo.svg";
import { signOut } from "next-auth/react";

function classNames(...classes: Array<string>) {
  return classes.filter(Boolean).join(" ");
}

interface NSideBarProps {
  children: ReactNode;
  user: string;
  adminId: number;
}

const NSideBar: React.FC<NSideBarProps> = ({ children, user, adminId}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const [data, setData] = useState([]);
  const socket = useSocket();

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/auth/login" });
  };

  const navigation = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: EnvelopeIcon,
      current: pathname === "/dashboard",
    },
    {
      name: "Automation",
      href: "#",
      icon: PaperAirplaneIcon,
      current: pathname === "#",
    },
    { name: "Calendar", href: "#", icon: UsersIcon, current: false },
    { name: "Reports", href: "#", icon: BookOpenIcon, current: false },
     { name: "Reports", href: "#", icon: ChartBarIcon, current: false }
  ];
  useEffect(() => {
    const getPendingRequest = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/conversation/pending`);
        setData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    // Call the function to fetch pending conversation requests when the component mounts
    getPendingRequest();

    // Listen for 'conversationRequest' event emitted by the server via Socket.IO
    if (socket) {
      socket.on("conversationRequest", () => {
        // When a new conversation request is received, trigger the function to fetch updated data
        getPendingRequest();
      });
    }

    // Clean up the Socket.IO connection when the component unmounts
    return () => {
      if (socket) {
        socket.off("conversationRequest");
      }
    };
  }, [socket]);

  return (
    <div>
      <Transition.Root show={sidebarOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50 lg:hidden"
          onClose={setSidebarOpen}
        >
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-900/80" />
          </Transition.Child>

          <div className="fixed inset-0 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                <Transition.Child
                  as={Fragment}
                  enter="ease-in-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-300"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                    <button
                      type="button"
                      className="-m-2.5 p-2.5"
                      onClick={() => setSidebarOpen(false)}
                    >
                      <span className="sr-only">Close sidebar</span>
                      <XMarkIcon
                        className="h-6 w-6 text-white"
                        aria-hidden="true"
                      />
                    </button>
                  </div>
                </Transition.Child>

                <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 px-6 pb-2 ring-1 ring-white/10">
                  <div className="flex h-16 shrink-0 items-center">
                    <LogoIcon className="h-8 w-8" />
                  </div>
                  <nav className="flex flex-1 flex-col">
                    <ul role="list" className="-mx-2 flex-1 space-y-1">
                      {navigation.map((item, index) => (
                        <li key={index}>
                          <a
                            href={item.href}
                            className={classNames(
                              item.current
                                ? "bg-gray-800 text-white"
                                : "text-gray-400 hover:text-white hover:bg-gray-800",
                              "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
                            )}
                          >
                            <item.icon
                              className="h-6 w-6 shrink-0"
                              aria-hidden="true"
                            />
                            {item.name}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </nav>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Static sidebar for desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-50 lg:flex flex-col flex-1 lg:w-[5%] lg:overflow-y-auto lg:bg-gray-900 lg:pb-4 h-full">
        <div className="flex h-14 shrink-0 items-center justify-center">
          <LogoIcon className="h-8 w-8 text-white " />
        </div>
        <nav className="mt-2">
          <ul role="list" className="flex flex-col items-center space-y-1">
            {navigation.map((item, index) => (
              <li key={index}>
                <a
                  href={item.href}
                  className={classNames(
                    item.current
                      ? "text-white"
                      : "text-gray-400 hover:text-white hover:bg-gray-800",
                    "group flex justify-center gap-x-3 rounded-md p-3 text-sm leading-6 font-semibold "
                  )}
                >
                  {item.icon === PaperAirplaneIcon ? (
                    <item.icon
                      className="h-6 w-6 rotate-[-30deg] shrink-0"
                      aria-hidden="true"
                    />
                  ) : (
                    <item.icon
                      className="h-6 w-6 shrink-0"
                      aria-hidden="true"
                    />
                  )}
                  <span className="sr-only">{item.name}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="text-white flex flex-col items-center justify-end h-full">
          <a
            href="/profile"
            className={classNames(
              pathname === "/profile"
                ? "bg-gray-800 text-white"
                : "text-gray-400 hover:text-white hover:bg-gray-800",
              "group flex gap-x-3 rounded-md p-3 text-sm leading-6 font-semibold"
            )}
          >
            <span className="h-8 w-8 flex items-center text-gray-900 text-sm font-bold justify-center rounded-full bg-white">
              {user[0].toUpperCase()}
            </span>
          </a>

          <a
            href="/settings"
            className={classNames(
              pathname === "/settings"
                ? "bg-gray-800 text-white"
                : "text-gray-400 hover:text-white hover:bg-gray-800",
              "group flex gap-x-3 rounded-md p-3 text-sm leading-6 font-semibold"
            )}
          >
            <Cog8ToothIcon className="h-6 w-6 shrink-0" aria-hidden="true" />
            <span className="sr-only">Settings</span>
          </a>
          <button
            onClick={handleSignOut}
            className={classNames(
              pathname === "#"
                ? "bg-gray-800 text-white"
                : "text-gray-400 hover:text-white hover:bg-gray-800",
              "group flex gap-x-3 rounded-md p-3 text-sm leading-6 font-semibold"
            )}
          >
            <ArrowRightEndOnRectangleIcon
              className="h-6 w-6 shrink-0"
              aria-hidden="true"
            />
            <span className="sr-only">Logout</span>
          </button>
        </div>
      </div>

      <div className="sticky top-0 z-40 flex items-center gap-x-6 bg-gray-900 px-4 py-4 shadow-sm sm:px-6 lg:hidden">
        <button
          type="button"
          className="-m-2.5 p-2.5 text-gray-400 lg:hidden"
          onClick={() => setSidebarOpen(true)}
        >
          <span className="sr-only">Open sidebar</span>
          <Bars3Icon className="h-6 w-6" aria-hidden="true" />
        </button>
        <div className="flex-1 text-sm font-semibold leading-6 text-white">
          Dashboard
        </div>
        <a href="#">
          <span className="sr-only">Your profile</span>
          <span className="h-8 w-8 flex items-center text-gray-900 text-sm font-bold justify-center rounded-full bg-white">
            {user[0].toUpperCase()}
          </span>
        </a>
      </div>
      <div className="lg:pl-[5%] h-screen flex">
        <aside className="hidden w-[20%] overflow-y-auto border-r border-gray-200  xl:block">
          <Inbox numberOfReq={data.length} adminId={adminId} />
        </aside>
        <main className="h-full w-[80%]">
          <div className="sm:px-6 lg:px-0 w-full">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default NSideBar;
