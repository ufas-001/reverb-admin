import GeneralSettings from "@/components/GeneralSettings";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth";

const Page = async () => {
    const session = await getServerSession(authOptions)
    return ( 
        <GeneralSettings adminId={session?.user.id!} />
     );
}
 
export default Page;