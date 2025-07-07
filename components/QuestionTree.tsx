"use client";
// QuestionTree.tsx
import React, { useState, useCallback } from "react";
import ReactFlow, {
  Node,
  Edge,
  addEdge,
  Connection,
  useNodesState,
  useEdgesState,
  ReactFlowProvider,
} from "reactflow";
import "reactflow/dist/style.css";
import QuestionNode from "./QuestionNode";
import OptionNode from "./OptionNode";
import QuestionModal from "./QuestionModal";
import { Question } from "../lib/types";

const nodeTypes = {
  questionNode: QuestionNode,
  optionNode: OptionNode,
};

const QuestionTree: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [currentQuestion, setCurrentQuestion] = useState<{
    parentQuestionId: string | null;
    parentOptionId: string | null;
  } | null>(null);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const addQuestion = (
    parentQuestionId: string | null,
    parentOptionId: string | null
  ) => {
    setModalVisible(true);
    setCurrentQuestion({ parentQuestionId, parentOptionId });
  };

  const saveQuestion = (questionText: string, options: string[]) => {
    const newQuestionId = `q${questions.length + 1}`;
    const newQuestion: Question = {
      id: newQuestionId,
      text: questionText,
      parentQuestionId: currentQuestion?.parentQuestionId || null,
      parentOptionId: currentQuestion?.parentOptionId || null,
      options: options.map((option, index) => ({
        id: `${newQuestionId}-o${index + 1}`,
        text: option,
        nextQuestionId: null,
      })),
    };

    setQuestions((prevQuestions) => [...prevQuestions, newQuestion]);

    const newNodes: Node[] = [
      {
        id: newQuestionId,
        type: "questionNode",
        data: { question: newQuestion, addQuestion },
        position: { x: 0, y: 0 },
      },
      ...newQuestion.options.map((option, index) => ({
        id: option.id,
        type: "optionNode",
        data: { option, questionId: newQuestionId, addQuestion },
        position: { x: 0, y: (index + 1) * 100 },
      })),
    ];

    setNodes((nds) => [...nds, ...newNodes]);

    const newEdges: Edge[] = [
      ...(currentQuestion?.parentOptionId
        ? [
            {
              id: `e${currentQuestion.parentOptionId}-${newQuestionId}`,
              source: currentQuestion.parentOptionId,
              target: newQuestionId,
              type: "smoothstep",
            },
          ]
        : []),
      ...newQuestion.options.map((option) => ({
        id: `e${newQuestionId}-${option.id}`,
        source: newQuestionId,
        target: option.id,
        type: "smoothstep",
      })),
    ];

    setEdges((eds) => [...eds, ...newEdges]);

    setModalVisible(false);
    setCurrentQuestion(null);
  };

  return (
    <ReactFlowProvider>
      <div style={{ width: "100vw", height: "100vh" }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
        >
          {nodes.length === 0 && (
            <div style={{ position: "absolute", left: 10, top: 10, zIndex: 4 }}>
              <button
                onClick={() => addQuestion(null, null)}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Add First Question
              </button>
            </div>
          )}
        </ReactFlow>
        {modalVisible && (
          <QuestionModal
            onSave={(questionText, options) => {
              saveQuestion(questionText, options);
            }}
            onClose={() => setModalVisible(false)}
          />
        )}
      </div>
    </ReactFlowProvider>
  );
};

export default QuestionTree;
