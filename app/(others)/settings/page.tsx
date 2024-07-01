"use client";

import { useState, useEffect } from "react";
import { getSession } from "next-auth/react";
import Loading from "@/components/Loader/Loading";
import GeneralSettings from "@/components/GeneralSettings";

interface BackendTokens {
  accessToken: string;
  refreshToken: string;
}

interface User {
  id: number;
  email: string;
  name: string;
}

interface Session {
  user: User;
  backendTokens: BackendTokens;
  expires: string;
}

const Page = () => {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    const fetchSession = async () => {
      const session = await getSession();
      setSession(session as Session);
      setLoading(false);
    };

    fetchSession();
  }, []);

  if (loading) {
    return <Loading loading={loading} />;
  }

  return (
    <GeneralSettings
      adminId={session?.user.id!}
      token={session?.backendTokens.accessToken!}
    />
  );
};

export default Page;
