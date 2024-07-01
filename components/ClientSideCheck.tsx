"use client"
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSession, signOut } from "next-auth/react";

interface ClientSideCheckProps {
  children: React.ReactNode;
}

const ClientSideCheck: React.FC<ClientSideCheckProps> = ({ children }) => {
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const session = await getSession();
      if (!session) {
        await signOut({ callbackUrl: "/auth/login" });
      }
    };

    checkSession();

    // Optional: Set up an interval to periodically check the session
    const interval = setInterval(checkSession, 5 * 60 * 1000); // Check every 5 minutes
    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [router]);

  return <>{children}</>;
};

export default ClientSideCheck;
