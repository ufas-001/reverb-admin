// QuestionNode.tsx
import React, { memo } from "react";
import { Handle, Position } from "reactflow";
import { Question } from "../lib/types";

interface QuestionNodeProps {
  data: {
    question: Question;
    addQuestion: (
      parentQuestionId: string | null,
      parentOptionId: string | null
    ) => void;
  };
}

const QuestionNode: React.FC<QuestionNodeProps> = memo(({ data }) => {
  const { question } = data;

  return (
    <>
      <Handle type="target" position={Position.Top} />
      <div className="p-4 border rounded-lg bg-white shadow-md">
        <p className="font-bold mb-2">{question.text}</p>
      </div>
      <Handle type="source" position={Position.Bottom} />
    </>
  );
});

export default QuestionNode;
