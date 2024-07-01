"use client"
import { useState, CSSProperties } from "react";
import BeatLoader from "react-spinners/BeatLoader";

interface LoadingProps {
    loading: boolean
}

const Loading: React.FC<LoadingProps> = ({loading}) =>  {
  const [color, setColor] = useState("#090606");

  return (
    <div className="flex flex-col items-center justify-center w-full h-screen">
      <BeatLoader
        color={color}
        loading={loading}
        size={15}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
    </div>
  );
}

export default Loading
