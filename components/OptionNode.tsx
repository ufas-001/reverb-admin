import React, { memo } from "react";
import { Handle, Position } from "reactflow";

interface OptionNodeProps {
  data: {
    option: {
      id: string;
      text: string;
      nextQuestionId: string | null;
    };
    questionId: string;
    addQuestion: (
      parentQuestionId: string | null,
      parentOptionId: string | null
    ) => void;
  };
}

const OptionNode: React.FC<OptionNodeProps> = memo(({ data }) => {
  const { option, questionId, addQuestion } = data;

  return (
    <>
      <Handle type="target" position={Position.Top} />
      <div className="p-2 border rounded-lg bg-gray-100 shadow-sm">
        <span className="mr-2">{option.text}</span>
        <button
          onClick={() => addQuestion(questionId, option.id)}
          className="text-blue-600 hover:underline text-sm"
        >
          Add nested question
        </button>
      </div>
      <Handle type="source" position={Position.Bottom} />
    </>
  );
});

export default OptionNode;
