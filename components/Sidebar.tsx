"use client"
import { ReactNode } from "react";
import { Fragment, useState, useEffect } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import axios from "axios";
import useSocket from "@/utils/useSocket";
import {
  Bars3Icon,
  CalendarIcon,
  ChartPieIcon,
  DocumentDuplicateIcon,
  FolderIcon,
  HomeIcon,
  UserIcon,
  UsersIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import { useParams, usePathname } from "next/navigation";
import { BACKEND_URL } from "@/lib/constant";


const teams = [
  { id: 1, name: 'session: 234j56', href: '#', initial: 'H', current: false },
  { id: 2, name: 'session: 2hj345', href: '#', initial: 'T', current: false },
  { id: 3, name: 'session: 5wrynw', href: '#', initial: 'W', current: false },
]

function classNames(...classes:any) {
  return classes.filter(Boolean).join(' ')
}

interface SideBarProps {
    children: ReactNode
    user: string
    adminId: number
}

interface ChatUser {
  id: number;
  uniqueId: string;
  createdAt: string; // Assuming createdAt is represented as a string
}

interface Conversation {
  id: number;
  adminId: number | null;
  createdAt: string; // Assuming createdAt is represented as a string
  chatUserId: number;
  chatUser: ChatUser;
}

interface AccpetdRquest {
  uniqueId: string;
  messageContent: string;
  accepted: Boolean;
  adminId: number
}
 
const SideBar: React.FC<SideBarProps> = ({children, user, adminId}) => {
    const pathname = usePathname()
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [data, setData] = useState([]);
    const socket = useSocket();
    const [allAcceptedReq, setAllAcceptedReq] = useState<(AccpetdRquest | null)[]>()
    const navigation = [
      { name: 'Dashboard', href: '/dashboard', icon: HomeIcon, current: pathname === "/dashboard" },
      
    ]
    useEffect(() => {
      const getPendingRequest = async () => {
        try {
          const response = await axios.get(`${BACKEND_URL}/conversation/pending`);
          console.log("data2", response.data)
          setData(response.data);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
  
      // Call the function to fetch pending conversation requests when the component mounts
      getPendingRequest()
  
      // Listen for 'conversationRequest' event emitted by the server via Socket.IO
      if (socket) {
        socket.on('conversationRequest', () => {
          // When a new conversation request is received, trigger the function to fetch updated data
          getPendingRequest();
        });
      }
  
      // Clean up the Socket.IO connection when the component unmounts
      return () => {
        if (socket) {
          socket.off('conversationRequest');
        }
      };
    }, [socket]); 
    useEffect(() => {
      const getAllAcceptedRequest = async () => {
        try {
          const response = await axios.get(`${BACKEND_URL}/conversation/accepted/${adminId}`)
          setAllAcceptedReq(response.data)
          console.log("dataAcc", response.data)
        } catch (error) {
          console.log(error)
        }
      }
      getAllAcceptedRequest()
      
    }, [])
    console.log("DataSet", data)
    return ( 
        <div>
        <Transition.Root show={sidebarOpen} as={Fragment}>
          <Dialog as="div" className="relative z-50 lg:hidden" onClose={setSidebarOpen}>
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
                      <button type="button" className="-m-2.5 p-2.5" onClick={() => setSidebarOpen(false)}>
                        <span className="sr-only">Close sidebar</span>
                        <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
                      </button>
                    </div>
                  </Transition.Child>
                  {/* Sidebar component, swap this element with another sidebar if you like */}
                  <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-2">
                    <div className="flex h-16 shrink-0 items-center">
                      <img
                        className="h-8 w-auto"
                        src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                        alt="Your Company"
                      />
                    </div>
                    <nav className="flex flex-1 flex-col">
                      <ul role="list" className="flex flex-1 flex-col gap-y-7">
                        <li>
                          <ul role="list" className="-mx-2 space-y-1">
                            {navigation.map((item) => (
                              <li key={item.name}>
                                <a
                                  href={item.href}
                                  className={classNames(
                                    item.current
                                      ? 'bg-gray-50 text-indigo-600'
                                      : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50',
                                    'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
                                  )}
                                >
                                  <item.icon
                                    className={classNames(
                                      item.current ? 'text-indigo-600' : 'text-gray-400 group-hover:text-indigo-600',
                                      'h-6 w-6 shrink-0'
                                    )}
                                    aria-hidden="true"
                                  />
                                  {item.name}
                                </a>
                              </li>
                            ))}
                              <li>
                                <a
                                  href="/dashboard/request"
                                  className={classNames(
                                    pathname === "dashboard/chat-request"
                                      ? 'bg-gray-50 text-indigo-600'
                                      : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50',
                                    'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
                                  )}
                                >
                                  <UsersIcon
                                    className={classNames(
                                      pathname === "/dashboard/chat-request" ? 'text-indigo-600' : 'text-gray-400 group-hover:text-indigo-600',
                                      'h-6 w-6 shrink-0'
                                    )}
                                    aria-hidden="true"
                                  />
                                  Chat Request
                                  {
                                    data.length > 0 ? (<span className="rounded-full bg-blue-500 items-center justify-center flex h-5 w-5 text-white text-xs">{data.length}</span>) : null
                                  }
                                </a>
                              </li>
                          </ul>

                        </li>
                        <li>
                          <div className="text-xs font-semibold leading-6 text-gray-400">Your Chats</div>
                          <ul role="list" className="-mx-2 mt-2 space-y-1">
                            {allAcceptedReq?.map((acceptedReq, index) => (
                              <li key={index}>
                                <a
                                  href="#"
                                  className={classNames(
                                    acceptedReq
                                      ? 'bg-gray-50 text-indigo-600'
                                      : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50',
                                    'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
                                  )}
                                >
                                  <span
                                    className={classNames(
                                      acceptedReq
                                        ? 'text-indigo-600 border-indigo-600'
                                        : 'text-gray-400 border-gray-200 group-hover:border-indigo-600 group-hover:text-indigo-600',
                                      'flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium bg-white'
                                    )}
                                  >
                                    
                                  </span>
                                  <span className="truncate"></span>
                                </a>
                              </li>
                            ))}
                          </ul>
                        </li>
                      </ul>
                    </nav>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition.Root>

        {/* Static sidebar for desktop */}
        <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
          {/* Sidebar component, swap this element with another sidebar if you like */}
          <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6">
            <div className="flex h-16 shrink-0 items-center">
              <img
                className="h-8 w-auto"
                src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                alt="Your Company"
              />
            </div>
            <nav className="flex flex-1 flex-col">
              <ul role="list" className="flex flex-1 flex-col gap-y-7">
                <li>
                  <ul role="list" className="-mx-2 space-y-1">
                    {navigation.map((item) => (
                      <li key={item.name}>
                        <a
                          href={item.href}
                          className={classNames(
                            item.current
                              ? 'bg-gray-50 text-indigo-600'
                              : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50',
                            'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
                          )}
                        >
                          <item.icon
                            className={classNames(
                              item.current ? 'text-indigo-600' : 'text-gray-400 group-hover:text-indigo-600',
                              'h-6 w-6 shrink-0'
                            )}
                            aria-hidden="true"
                          />
                          {item.name}
                        </a>
                      </li>
                    ))}
                    <li>
                      <a
                        href="/dashboard/chat-request"
                        className={classNames(
                          pathname === "/dashboard/chat-request"
                            ? 'bg-gray-50 text-indigo-600'
                            : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50',
                          'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold relative'
                        )}
                      >
                        <UsersIcon
                          className={classNames(
                            pathname === "/dashboard/chat-request" ? 'text-indigo-600' : 'text-gray-400 group-hover:text-indigo-600',
                            'h-6 w-6 shrink-0'
                          )}
                          aria-hidden="true"
                        />
                        Chat Request
                        {
                          data.length > 0 ? (<span className="rounded-full bg-blue-500 items-center justify-center flex h-4 w-4 text-white text-[10px]">{data.length}</span>) : null
                        }
                      </a>
                    </li>
                  </ul>
                </li>
                <li>
                  <div className="text-xs font-semibold leading-6 text-gray-400 "> Your Chats</div>
                  <ul role="list" className="-mx-2 mt-2 space-y-1 h-[300px] overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch">
                    {allAcceptedReq?.map((acceptedReq, index) => (
                      <li key={index}>
                        <a
                          href={`/dashboard/chat/${acceptedReq?.uniqueId}`}
                          className={classNames(
                            pathname === `/dashboard/chat/${acceptedReq?.uniqueId}`
                              ? 'bg-gray-50 text-indigo-600'
                              : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50',
                            'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
                          )}
                        >
                          <span
                            className={classNames(
                              pathname === `/dashboard/chat/${acceptedReq?.uniqueId}`
                                ? 'text-indigo-600 border-indigo-600'
                                : 'text-gray-400 border-gray-200 group-hover:border-indigo-600 group-hover:text-indigo-600',
                              'flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium bg-white'
                            )}
                          >
                           U
                          </span>
                          <span className="truncate">{acceptedReq?.uniqueId}</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </li>
                <li className="-mx-6 mt-auto">
                  <a
                    href="#"
                    className="flex items-center px-2 gap-x-4 py-3 text-sm font-semibold leading-6 text-gray-900 hover:bg-gray-50"
                  >
                   <span
                    className="h-8 w-8 flex items-center text-white text-sm font-bold justify-center rounded-full bg-indigo-600"
                  >
                    {user[0].toUpperCase()}
                  </span>
                    <span className="sr-only">Your profile</span>
                    <span aria-hidden="true">{user}</span>
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        <div className="sticky top-0 z-40 flex items-center gap-x-6 bg-white px-4 py-4 shadow-sm sm:px-6 lg:hidden">
          <button type="button" className="-m-2.5 p-2.5 text-gray-700 lg:hidden" onClick={() => setSidebarOpen(true)}>
            <span className="sr-only">Open sidebar</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
          <div className="flex-1 text-sm font-semibold leading-6 text-gray-900">Dashboard</div>
          <a href="#">
            <span className="sr-only">Your profile</span>
            <span
              className="h-8 w-8 flex items-center text-white text-sm font-medium justify-center rounded-full bg-indigo-600"
            >
              U
            </span>
          </a>
        </div>

        <main className="py-10 lg:pl-72 h-screen ">
          <div className="px-4 sm:px-6 lg:px-8 h-full border-t border-gray-100">{children}</div>
        </main>
      </div>
    );
}
 
export default SideBar;