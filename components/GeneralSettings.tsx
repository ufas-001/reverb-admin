import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, Switch } from "@headlessui/react";
import { useState } from "react";
import GeneralInfo from "./GeneralInfo";
import ArticleLink from "./ArticleLink";
import WidgetCustomization from "./WidgetCustomization";
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
  adminId: number
}
const GeneralSettings: React.FC<GeneralSettingsProps> = ({adminId}) => {
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
        <GeneralInfo />
      </TabsContent>
      <TabsContent value="article-links">
        <ArticleLink adminId={adminId} />
      </TabsContent>
      <TabsContent value="widget">
        <WidgetCustomization adminId={adminId} />
      </TabsContent>
    </Tabs>
  );
};

export default GeneralSettings;
