// api.ts

const API_URL = "http://localhost:8000"; // Your NestJS backend URL

export async function createQuestionNode(apiKey: string, questionData: any) {
  const response = await fetch(`${API_URL}/api/question-node/${apiKey}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(questionData),
  });
  return response.json();
}

export async function fetchQuestionNodes(apiKey: string) {
  const response = await fetch(`${API_URL}/api/question-node/${apiKey}`);
  return response.json();
}

export async function updateQuestionNode(
  id: string,
  apiKey: string,
  questionData: any
) {
  const response = await fetch(`${API_URL}/api/question-node/${id}/${apiKey}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(questionData),
  });
  return response.json();
}

export async function deleteQuestionNode(id: string, apiKey: string) {
  const response = await fetch(`${API_URL}/api/question-node/${id}/${apiKey}`, {
    method: "DELETE",
  });
  return response.json();
}
