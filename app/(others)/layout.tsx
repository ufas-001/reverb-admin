import SideBar from "@/components/Sidebar";
import { getServerSession } from "next-auth";
import { ReactNode } from "react";
import { authOptions } from "../../pages/api/auth/[...nextauth]";
import GeneralSideBar from "@/components/GeneralSidebar";
import ClientSideCheck from "@/components/ClientSideCheck";
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
      <ClientSideCheck>
        <GeneralSideBar>{children}</GeneralSideBar>
      </ClientSideCheck>
    );

}

export default Layout