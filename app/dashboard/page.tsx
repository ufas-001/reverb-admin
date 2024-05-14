import Inbox from "@/components/InboxTab";
import Message from "@/components/Message";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth";

const Page = async () => {
  const session = await getServerSession(authOptions);
  return (
    <div>
      <main className="h-full">
        <Message adminId={session?.user.id!} />
      </main>
    </div>
  );
};

export default Page;
