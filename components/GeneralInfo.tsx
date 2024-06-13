"use client";
import { useEffect, useState } from "react";
import { Dialog, Switch } from "@headlessui/react";
import axios from "axios";
import { BACKEND_URL } from "@/lib/constant";

function classNames(...classes: Array<string>) {
  return classes.filter(Boolean).join(" ");
}

interface GeneralInfoProps {
  token: string;
  id: number;
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

const GeneralInfo: React.FC<GeneralInfoProps> = ({ id, token }) => {
  const [userInfo, setUserInfo] = useState<User | null>();
  const [disabled, setDisabled] = useState(true)

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/user/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUserInfo(response.data)
      } catch (error) {
        console.error(error);
      }
    };
    getUserInfo();
  }, [id, token]);
  return (
    <main className="px-4 py-16 sm:px-6 lg:flex-auto lg:px-20 lg:py-20">
      <div className="mx-auto max-w-2xl space-y-16 sm:space-y-20 lg:mx-0 lg:max-w-none">
        <div>
          <h2 className="text-base font-semibold leading-7 text-gray-900">
            Profile
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-500">
            This information will be displayed publicly so be careful what you
            share.
          </p>

          <dl className="mt-6 space-y-6 divide-y divide-gray-100 border-t border-gray-200 text-sm leading-6">
            <div className="pt-6 sm:flex">
              <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">
                Full name
              </dt>
              <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                <div className="text-gray-900">{userInfo?.name}</div>
                <button
                  type="button"
                  disabled={disabled}
                  className={classNames(
                    disabled ? "text-indigo-500" : "text-indigo-600",
                    "font-semibold hover:text-indigo-500"
                  )}
                >
                  Update
                </button>
              </dd>
            </div>
            <div className="pt-6 sm:flex">
              <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">
                Email address
              </dt>
              <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                <div className="text-gray-900">{userInfo?.email}</div>
                <button
                  type="button"
                  className="font-semibold text-indigo-600 hover:text-indigo-500"
                >
                  Update
                </button>
              </dd>
            </div>
            <div className="pt-6 sm:flex">
              <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">
                Developer key
              </dt>
              <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                <div className="text-gray-900">{userInfo?.apiKey.key}</div>
                <button
                  type="button"
                  className="font-semibold text-indigo-600 hover:text-indigo-500"
                >
                  Update
                </button>
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </main>
  );
};

export default GeneralInfo;
