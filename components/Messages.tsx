import { BACKEND_URL } from "@/lib/constant";
import useSocket from "@/utils/useSocket";
import axios from "axios";
import { useEffect, useRef, useState } from "react";

interface MessagesProps {
    id: string
}

interface Messages {
    senderType: string;
    content: string;
    updatedAt: string;
    createdAt: string
}

function classNames(...classes:any) {
    return classes.filter(Boolean).join(' ')
}

 
const Messages: React.FC<MessagesProps> = ({id}) => {
    const scrollDownRef = useRef<HTMLDivElement>(null)
    const [messages, setMessages] = useState<(Messages | null)[]>()
    const socket = useSocket();

    useEffect(() => {
      const getConversationMessages = async () => {
        try {
          const response = await axios.get(`${BACKEND_URL}/conversation/messages/${id}`);
          setMessages(response.data);
        } catch (error) {
          console.error('Error fetching data:', error);
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
        socket.on('messageCreated', () => {
          // When a new message is created, trigger the function to fetch updated conversation messages
          getConversationMessages();
        });
      }

      // Clean up the Socket.IO connection when the component unmounts
      return () => {
        if (socket) {
          socket.off('messageCreated');
        }
      };
    }, [socket, id]);
    
    const displayMessages = messages?.reverse()

    return ( 
        <div
          id='messages'
          ref={scrollDownRef}
          className='flex h-full flex-1 flex-col-reverse gap-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch'
        >
            <div className="flex flex-col-reverse gap-y-4">
                {
                   displayMessages?.map((message, index) => {
                   return (
                        <div key={index} className={classNames(message?.senderType === "admin" ? "justify-end": "justify-start" ,"flex items-end")}>
                            <div className={classNames("flex flex-col space-y-2 text-base max-w-xs mx-2")}>
                                <p className={classNames(message?.senderType === "admin" ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-900" ,"px-4 py-2 rounded-lg inline-block rounded-br-none")}>{message?.content}</p>
                            </div>
                        </div>
                    )
                   }) 
                }
            </div>
                
        </div>
    );
}
 
export default Messages;