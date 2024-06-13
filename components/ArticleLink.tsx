'use client'
import { useEffect, useState } from "react";
import CreateArticleLink from "./modals/createArticleLink";
import axios from "axios";
import { BACKEND_URL } from "@/lib/constant";

const people = [
  {
    name: "",
    title: "",
    email: "lindsay.walton@example.com",
    role: "Member",
  },
  // More people...
];

interface CreateArticleLinkProps {
  apiKey: string
}

interface ArticleLink {
  id: number;
  header: string;
  link: string;
  createdAt: Date;
  updatedAt: Date;
  userId: number;
}

const ArticleLink: React.FC<CreateArticleLinkProps> = ({apiKey}) => {
  const [createArticleLink, setCreateArticleLink] = useState(false)
  const [articleLinks, setArticleLinks] = useState<(ArticleLink | null)[]>()
  useEffect(() => {
    const getArticleLinks = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/article/${apiKey}`)
        setArticleLinks(response.data)
      } catch (error) {
        console.error(error)
      }
    }
    getArticleLinks()
  }, [createArticleLink, apiKey])
  
  return (
    <div className="px-4 py-16 sm:px-6 lg:px-20 lg:py-20">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">
            Article Links
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of articles to be displayed on your user widget.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
            type="button"
            className="block rounded-md bg-gray-950 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            onClick={() => setCreateArticleLink(true)}
          >
            Create Article Link
          </button>
        </div>
      </div>
      <div className="mt-12 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table className="min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                  >
                    Header
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Link
                  </th>
                  <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                    <span className="sr-only">Edit</span>
                  </th>
                  <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                    <span className="sr-only">delete</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {articleLinks?.map((article, index) => (
                  <tr key={index}>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-1">
                      {article?.header}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {article?.link}
                    </td>
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                      <a
                        href="#"
                        className="text-gray-700 hover:text-gray-950"
                      >
                        Edit<span className="sr-only">, edit</span>
                      </a>
                    </td>
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-1">
                      <a
                        href="#"
                        className="text-red-400 hover:text-red-700"
                      >
                        delete<span className="sr-only">, delete</span>
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {
          (
            (!articleLinks || articleLinks.length < 5) && (
              <div className="text-center mt-3 font-medium text-sm text-red-600">Minimum of 5 article Links is required</div>
            )
          )
        }
      </div>
      <CreateArticleLink openCreateArticleLink={createArticleLink} setCreateArticleLink={setCreateArticleLink} apiKey={apiKey} />
    </div>
  );
}

export default ArticleLink