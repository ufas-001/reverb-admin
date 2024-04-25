"use client"
import { Button } from "@/components/ui/button"
import { notFound, useRouter } from "next/navigation"
import axios from "axios"
import { useState } from "react"
import toast from "react-hot-toast"
import Messages from "@/components/Messages"
import { BACKEND_URL } from "@/lib/constant"

interface PageProps {
    params: {
        id: string
    }
  }

const Page =  ({ params }: PageProps) => {
    const { id } = params
    const [input, setInput] = useState<string>(" ")

    const handleContinueConversation = async () => {
        if(!input) return
        try {
            const response = await axios.post(`${BACKEND_URL}/conversation/${id}/continue`,{
                    senderType: "admin", 
                    messageContent: input
            })
            setInput("")
        } catch (error) {
            toast.error("Something went wrong ...")
        }
    }
    return (
        <div className='flex-1 justify-between flex flex-col h-full max-h-[calc(100vh-6rem)]'>
            <Messages id={id} />
            <div className="mt-2 flex flex-col gap-y-3">  
              <textarea
                rows={4}
                name="comment"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                id="comment"
                className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-0 focus:ring-gray-100 sm:text-sm sm:leading-6"
              />
              <Button onClick={handleContinueConversation}  className="text-white bg-indigo-600 self-end">Send</Button>
            </div>
        </div>
    )
}

export default Page