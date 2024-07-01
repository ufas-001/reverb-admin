import SideBar from "@/components/Sidebar";
import { getServerSession} from "next-auth";
import { ReactNode } from "react";
import { authOptions } from "../../pages/api/auth/[...nextauth]";
import NSideBar from "@/components/NewSideBar";
import { useRouter } from "next/router";
import { notFound } from "next/navigation";
import { signOut } from "next-auth/react";
import ClientSideCheck from "@/components/ClientSideCheck";

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
        <NSideBar adminId={session.user.id} user={session.user.email}>
          {children}
        </NSideBar>
      </ClientSideCheck>
    );

}

export default Layout