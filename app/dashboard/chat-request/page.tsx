import SideBar from "@/components/Sidebar";
import { getServerSession } from "next-auth";
import { ReactNode } from "react";
import { authOptions } from "@/pages/api/auth/[...nextauth]"; 
import { useRouter } from "next/router";
import { notFound } from "next/navigation";
import ChatRequest from "@/components/ChatRequest";


const Page = async () => {
    const session = await getServerSession(authOptions)
    if(!session){
        notFound()
    }
    
    return (
        <ChatRequest adminId={session.user.id} />
    )

}

export default Page