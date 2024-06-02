"use client";
import { Fragment, useEffect, useState } from "react";
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";
import { EllipsisHorizontalIcon } from "@heroicons/react/20/solid";
import Image from "next/image";
import UpdateColorCustomization from "./modals/updateColorCustomization";
import { tree } from "next/dist/build/templates/app-page";
import axios from "axios";
import { BACKEND_URL } from "@/lib/constant";

function classNames(...classes: Array<string>) {
  return classes.filter(Boolean).join(" ");
}

const preference = {
  backgroundColor: "blue",
  textColor: "White",
  bannerColor: "light blue",
};

interface PreferenceColor {
  backgroundColor: string;
  textColor: string;
  bannerColor: string;
}

interface WidgetCustomizationProps {
  adminId: number
}
const WidgetCustomization: React.FC<WidgetCustomizationProps> = ({adminId}) => {
  const [updateColorCustomization, setUpdateColorCustomization] = useState(false);
  const [preferenceData, setPrefernceData] = useState<(PreferenceColor | null)>()
  
  useEffect(() => {
    const getPreferenceData = async () => {
     try {
       const response = await axios.get(`${BACKEND_URL}/preference/${adminId}`);
       setPrefernceData(response.data)
     } catch (error) {
      console.error
     }
    }
    getPreferenceData()
  }, [adminId, updateColorCustomization])

  return (
    <div className="px-4 py-16 sm:px-6 lg:px-20 lg:py-20">
      <ul
        role="list"
        className="grid grid-cols-1 gap-x-6 gap-y-8 lg:grid-cols-3 xl:gap-x-8"
      >
        <li className="overflow-hidden rounded-xl border border-gray-200">
          <div className="flex items-center gap-x-4 border-b border-gray-900/5 bg-gray-50 p-6">
            <Image
              src="https://tailwindui.com/img/logos/48x48/tuple.svg"
              alt="color"
              width={12}
              height={12}
              className="h-12 w-12 flex-none rounded-lg bg-white object-cover ring-1 ring-gray-900/10"
            />
            <div className="text-sm font-medium leading-6 text-gray-900">
              Color Customization
            </div>
            <Menu as="div" className="relative ml-auto">
              <MenuButton className="-m-2.5 block p-2.5 text-gray-400 hover:text-gray-500">
                <span className="sr-only">Open options</span>
                <EllipsisHorizontalIcon
                  className="h-5 w-5"
                  aria-hidden="true"
                />
              </MenuButton>
              <Transition
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <MenuItems className="absolute right-0 z-10 mt-0.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
                  <MenuItem>
                    {({ focus }) => (
                      <button
                        type="button"
                        className={classNames(
                          focus ? "bg-gray-50" : "",
                          "block px-3 py-1 text-sm leading-6 text-gray-900 w-full"
                        )}
                        onClick={() => setUpdateColorCustomization(true)}
                      >
                        Edit<span className="sr-only">, edit</span>
                      </button>
                    )}
                  </MenuItem>
                </MenuItems>
              </Transition>
            </Menu>
          </div>
          <dl className="-my-3 divide-y divide-gray-100 px-6 py-4 text-sm leading-6">
            <div className="flex justify-between gap-x-4 py-3">
              <dt className="text-gray-500">Background Color</dt>
              <dd className="flex items-start gap-x-2">
                <div className="font-medium text-gray-900">
                  {preferenceData ? preferenceData.backgroundColor : preference.backgroundColor}
                </div>
              </dd>
            </div>
            <div className="flex justify-between gap-x-4 py-3">
              <dt className="text-gray-500">Banner Color</dt>
              <dd className="flex items-start gap-x-2">
                <div className="font-medium text-gray-900">
                  {preferenceData ? preferenceData.bannerColor : preference.bannerColor}
                </div>
              </dd>
            </div>
            <div className="flex justify-between gap-x-4 py-3">
              <dt className="text-gray-500">Text Color</dt>
              <dd className="flex items-start gap-x-2">
                <div className="font-medium text-gray-900">
                  {preferenceData ? preferenceData.textColor : preference.textColor}
                </div>
              </dd>
            </div>
          </dl>
        </li>
      </ul>
      <UpdateColorCustomization adminId={adminId} openUpdateColorCustomization={updateColorCustomization} setUpdateColorCustomization={setUpdateColorCustomization} />
    </div>
  );
};

export default WidgetCustomization;
