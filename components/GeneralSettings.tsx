"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, Switch } from "@headlessui/react";
import { useEffect, useState } from "react";
import GeneralInfo from "./GeneralInfo";
import ArticleLink from "./ArticleLink";
import WidgetCustomization from "./WidgetCustomization";
import { BACKEND_URL } from "@/lib/constant";
import axios from "axios";
import Loading from "./Loader/Loading";
const secondaryNavigation = [
  { name: "Account", href: "#", current: true },
  { name: "Notifications", href: "#", current: false },
  { name: "Billing", href: "#", current: false },
  { name: "Teams", href: "#", current: false },
  { name: "Integrations", href: "#", current: false },
];
function classNames(...classes: Array<string>) {
  return classes.filter(Boolean).join(" ");
}
interface GeneralSettingsProps {
  adminId: number;
  token: string
}

interface ApiKey {
  id: number;
  key: string;
  userId: number;
  createdAt: string;
}

interface User {
  apiKey: ApiKey;
  email: string;
  id: number;
  name: string;
  password: string;
}

const GeneralSettings: React.FC<GeneralSettingsProps> = ({
  adminId,
  token,
}) => {
  const [userInfo, setUserInfo] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${BACKEND_URL}/user/${adminId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUserInfo(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    getUserInfo();
  }, [adminId, token]);

  if (loading) {
    return <Loading loading={loading} />;
  }

  return (
    <Tabs defaultValue="account" className="w-full mt-10">
      <TabsList className="mx-16 bg-white px-0">
        <TabsTrigger
          value="account"
          className="pr-4 data-[state=active]:bg-none data-[state=active]:shadow-none data-[state=active]:text-black"
        >
          Account
        </TabsTrigger>
        <TabsTrigger
          value="article-links"
          className="pr-4 data-[state=active]:bg-none data-[state=active]:shadow-none data-[state=active]:text-black"
        >
          Article Links
        </TabsTrigger>
        <TabsTrigger
          value="widget"
          className="pr-4 data-[state=active]:bg-none data-[state=active]:shadow-none data-[state=active]:text-black"
        >
          Widget
        </TabsTrigger>
      </TabsList>
      <TabsContent value="account">
        <GeneralInfo id={adminId} token={token} />
      </TabsContent>
      <TabsContent value="article-links">
        <ArticleLink apiKey={userInfo?.apiKey.key!} />
      </TabsContent>
      <TabsContent value="widget">
        <WidgetCustomization apiKey={userInfo?.apiKey.key!} />
      </TabsContent>
    </Tabs>
  );
};

export default GeneralSettings;
