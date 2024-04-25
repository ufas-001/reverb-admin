"use client"
import { BACKEND_URL } from '@/lib/constant';
import { EnvelopeIcon, PhoneIcon,  } from '@heroicons/react/20/solid'
import { useEffect, useState } from 'react';
import axios from "axios"
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

interface Conversation {
    uniqueId: string;
    message: string
    
}

interface ChatRequestProps {
    adminId: number
}

const people = [
  {
    name: 'Conversation Id',
    title: 'Regional Paradigm Technician',
    role: 'Admin',
    email: 'janecooper@example.com',
    telephone: '+1-202-555-0170',
    imageUrl:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60',
  },
  // More people...
]

const ChatRequest: React.FC <ChatRequestProps> = ({adminId}) => {
    const [data, setData] = useState<(Conversation | null)[]>();
    const router = useRouter()

    useEffect(() => {
        const getPendingRequest = async () => {
            try {
                // Fetch data from your API using Axios
                const response = await axios.get('https://reverb.siting.xyz/conversation/pending');
                setData(response.data);
            } catch (error) {
               toast.error("something went wrong")
            } 
        }
        getPendingRequest()
    }, []);

    const handleAcceptConversation = async (conversationId:string) => { 
        try {
            const response = await axios.post(`${BACKEND_URL}/conversation/accept`, {
                conversationId: conversationId, 
                adminId
            });
        
            toast.success("Chat Request accepted")
        } catch (error) {
            toast.error("something went wrong")
        } finally {
            window.location.reload();
        }
    }

    
    return (
        <ul role="list" className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 pt-4">
            {data?.map((data, index) => (
                <li key={index} className="col-span-1 divide-y divide-gray-200 rounded-lg bg-white shadow">
                    <div className="flex w-full items-center justify-between space-x-6 p-6">
                        <div className="flex-1 truncate">
                            <div className="flex items-center space-x-3">
                                <h3 className="truncate text-sm font-medium text-gray-900">Conversation Id: {data?.uniqueId}</h3>
                                <span className="inline-flex flex-shrink-0 items-center rounded-full bg-green-50 px-1.5 py-0.5 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                                    user
                                </span>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="-mt-px flex divide-x divide-gray-200">
                            <div className="flex w-0 flex-1">
                                <button
                                    
                                onClick={() => handleAcceptConversation(data?.uniqueId!)}
                                className="relative -mr-px inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-bl-lg border border-transparent py-4 text-sm font-semibold text-indigo-600"
                                >
                                    Accept
                                </button>
                            </div>
                        </div>
                    </div>
                </li>
            ))}
        </ul>
    )
}

export default ChatRequest