import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, Switch } from "@headlessui/react";
import { useState } from "react";
import GeneralInfo from "./GeneralInfo";

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

const GeneralSettings = () => {
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
          value="currentustomisation"
          className="pr-4 data-[state=active]:bg-none data-[state=active]:shadow-none data-[state=active]:text-black"
        >
          Customisation
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
      <TabsContent value="password">Change your password here.</TabsContent>
    </Tabs>
  );
};

export default GeneralSettings;
