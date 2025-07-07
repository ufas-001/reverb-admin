"use client"
import React, { useState } from "react";

interface QuestionModalProps {
  onSave: (questionText: string, options: string[]) => void;
  onClose: () => void;
}

const QuestionModal: React.FC<QuestionModalProps> = ({ onSave, onClose }) => {
  const [questionText, setQuestionText] = useState<string>("");
  const [options, setOptions] = useState<string[]>(["", ""]);
  const [error, setError] = useState<string | null>(null);

  const addOption = () => setOptions([...options, ""]);

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSave = () => {
    if (questionText.trim() === "") {
      setError("Please enter a question");
      return;
    }
    if (options.some((opt) => opt.trim() === "")) {
      setError("Please fill in all options");
      return;
    }
    onSave(
      questionText,
      options.filter((opt) => opt.trim() !== "")
    );
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white p-6 rounded shadow-lg max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">Create Question</h2>
        {error && <p className="text-red-500 mb-2">{error}</p>}
        <label htmlFor="question-text" className="block mb-2">
          Question:
        </label>
        <input
          id="question-text"
          value={questionText}
          onChange={(e) => setQuestionText(e.target.value)}
          placeholder="Enter question"
          className="border p-2 w-full mb-4"
          aria-label="Question text"
        />
        {options.map((option, index) => (
          <div key={index}>
            <label htmlFor={`option-${index}`} className="block mb-2">
              Option {index + 1}:
            </label>
            <input
              id={`option-${index}`}
              value={option}
              onChange={(e) => handleOptionChange(index, e.target.value)}
              placeholder="Enter option"
              className="border p-2 w-full mb-2"
              aria-label={`Option ${index + 1}`}
            />
          </div>
        ))}
        <button
          onClick={addOption}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          aria-label="Add another option"
        >
          Add Option
        </button>
        <div className="mt-4 flex justify-end">
          <button
            onClick={handleSave}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mr-2"
            aria-label="Save question"
          >
            Save
          </button>
          <button
            onClick={onClose}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            aria-label="Close modal without saving"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuestionModal;
