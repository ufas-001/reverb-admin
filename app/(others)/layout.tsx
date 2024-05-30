import SideBar from "@/components/Sidebar";
import { getServerSession } from "next-auth";
import { ReactNode } from "react";
import { authOptions } from "../../pages/api/auth/[...nextauth]";
import GeneralSideBar from "@/components/GeneralSidebar";
import NSideBar from "@/components/NewSideBar";
import { useRouter } from "next/router";
import { notFound } from "next/navigation";

interface LayoutProps {
    children: ReactNode
}

const Layout = async ({ children }: LayoutProps) => {
    const session = await getServerSession(authOptions)
    if(!session){
        notFound()
    }
    
    return (
        // <SideBar user={session.user.email} adminId={session.user.id}>{children}</SideBar>
        <GeneralSideBar >{ children }</GeneralSideBar>
    )

}

export default Layout