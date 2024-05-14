"use client";
import { useRef } from "react";
import { Button } from "./ui/button";

const TextMessage = () => {
  const scrollDownRef = useRef<HTMLDivElement>(null);
  return (
    <div className="flex-1 justify-between flex flex-col h-full pb-12 px-4">
      <div
        id="messages"
        ref={scrollDownRef}
        className="flex h-full flex-1 flex-col-reverse gap-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch"
      >
        <div className="flex flex-col-reverse gap-y-4">
          <div className="justify-end flex items-end">
            <div className="flex flex-col space-y-2 text-base max-w-xs mx-2">
              <p className=" bg-blue-900  text-white px-4 py-2 rounded-lg inline-block rounded-br-none">
                Hello
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-2 flex flex-col gap-y-3">
        <textarea
          rows={4}
          name="comment"
          className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-0 focus:ring-gray-100 sm:text-sm sm:leading-6"
        />
        <Button className="text-white bg-green-600 self-end">Send</Button>
      </div>
    </div>
  );
};

export default TextMessage;
