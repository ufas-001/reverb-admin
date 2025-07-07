"use client";
import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { articleLinkValidator } from "@/validations/articleLink";
import { z } from "zod";
import axios from "axios";
import { BACKEND_URL } from "@/lib/constant";
import toast from "react-hot-toast";

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

type FormData = z.infer<typeof articleLinkValidator>;

interface DeleteArticleLinkProps {
  apiKey: string;
  id: string;
  openDeleteArticleLink: boolean;
  setDeleteArticleLink: React.Dispatch<React.SetStateAction<boolean>>;
}

const DeleteArticleLink: React.FC<DeleteArticleLinkProps> = ({
  openDeleteArticleLink,
  setDeleteArticleLink,
  apiKey,
  id
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(articleLinkValidator),
  });

  const onSubmitHandler = async () => {
    try {
      setIsLoading(true);
      const response = await axios.delete(`${BACKEND_URL}/article/${id}/${apiKey}`, {
      });
      toast.success("Article link deleted");
      setDeleteArticleLink(false);
    } catch (error) {
      toast.error("Something went wrong....");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Transition.Root show={openDeleteArticleLink} as={Fragment}>
      <Dialog className="relative z-10" onClose={setDeleteArticleLink}>
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
                      Delete Article Link
                    </h3>
                    <div
                      className="space-y-4 text-start w-full"
                    > 
                        <div>
                            <p>Delete article Link</p>
                        </div>
                      <div>
                        <div className="mt-5 sm:mt-7 flex gap-x-10 justify-between">
                          <button
                            type="submit"
                            onClick={onSubmitHandler}
                            className="inline-flex lig:w-[150px] justify-center rounded-md bg-red-700 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:col-start-2"
                          >
                            Delete
                          </button>
                          <button
                            type="button"
                            className="mt-3 inline-flex lg:w-[150px] justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
                            onClick={() => setDeleteArticleLink(false)}
                            data-autofocus
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
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

export default DeleteArticleLink;
