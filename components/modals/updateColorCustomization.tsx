"use client";
import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { preferenceValidator } from "@/validations/preference";
import { z } from "zod";
import axios from "axios";
import { BACKEND_URL } from "@/lib/constant";
import toast from "react-hot-toast";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

interface PreferenceColor {
  backgroundColor: string;
  textColor: string;
  bannerColor: string;
}

const preferenceColor = [
  {
    backgroundColor: "blue",
    textColor: "white",
    bannerColor: "ligt-blue",
  },
  {
    backgroundColor: "black",
    textColor: "white",
    bannerColor: "black",
  },
  {
    backgroundColor: "red",
    textColor: "white",
    bannerColor: "light-red",
  },
];

type FormData = z.infer<typeof preferenceValidator>;

interface UpdateColorCustomizationProps {
  adminId: number;
  openUpdateColorCustomization: boolean;
  setUpdateColorCustomization: React.Dispatch<React.SetStateAction<boolean>>;
}

const UpdateColorCustomization: React.FC<UpdateColorCustomizationProps> = ({
  openUpdateColorCustomization,
  setUpdateColorCustomization,
  adminId,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedColor, setSelectedColor] = useState<PreferenceColor>(
    preferenceColor[0]
  );

  const handleBackgroundColorChange = (value: string) => {
    const selectedPreference = preferenceColor.find(
      (preference) => preference.backgroundColor === value
    );
    if (selectedPreference) {
      setSelectedColor(selectedPreference);
    }
  };
  const onSubmitHandler = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      setIsLoading(true);
      const response = await axios.patch(
        `${BACKEND_URL}/preference/${adminId}`,
        {
          ...selectedColor,
        }
      );
      console.log("Response", response);
      toast.success("widget color updated");
      setUpdateColorCustomization(false);
    } catch (error) {
      toast.error("Something went wrong....");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Transition.Root show={openUpdateColorCustomization} as={Fragment}>
      <Dialog className="relative z-10" onClose={setUpdateColorCustomization}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full max-w-[450px] mx-auto items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel
                as="div"
                className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:px-9 sm:py-12"
              >
                <div>
                  <div className="text-center">
                    <h3 className="text-base font-semibold leading-6 text-gray-900 pb-4">
                      Create Article Link
                    </h3>
                    <form
                      className="space-y-4 text-start w-full"
                      onSubmit={onSubmitHandler}
                    >
                      <div>
                        <Select
                          value={selectedColor.backgroundColor}
                          onValueChange={handleBackgroundColorChange}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select your primary color" />
                          </SelectTrigger>
                          <SelectContent>
                            {preferenceColor.map((item, index) => {
                              return (
                                <SelectItem
                                  key={index}
                                  value={item.backgroundColor}
                                >
                                  {item.backgroundColor}
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label
                          htmlFor="email"
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                          Banner Color
                        </label>
                        <div className="mt-1">
                          <input
                            type="text"
                            id="header"
                            className="block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500 disabled:ring-gray-200 sm:text-sm sm:leading-6"
                            value={selectedColor.bannerColor}
                            readOnly
                          />
                        </div>
                      </div>
                      <div>
                        <label
                          htmlFor="link"
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                          Text Color
                        </label>
                        <div className="mt-1">
                          <input
                            type="text"
                            id="link"
                            className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500 disabled:ring-gray-200 sm:text-sm sm:leading-6"
                            value={selectedColor.textColor}
                            readOnly
                          />
                        </div>
                      </div>
                      <div>
                        <div className="mt-5 sm:mt-7 flex gap-x-10 justify-between">
                          <button
                            type="submit"
                            className="inline-flex lg:w-[150px] justify-center rounded-md bg-gray-950 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:col-start-2"
                          >
                            Create
                          </button>
                          <button
                            type="button"
                            className="mt-3 inline-flex lg:w-[150px] justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
                            onClick={() => setUpdateColorCustomization(false)}
                            data-autofocus
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default UpdateColorCustomization;
