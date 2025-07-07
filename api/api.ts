import axios from "axios";

const API_BASE_URL = "http://localhost:8000";
const API_KEY = "712f76f3-1a2b-43f9-9ef5-62f2fccc75ed";

export const saveQuestionTree = async (questionTree: any) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/question-node/${API_KEY}`,
      questionTree
    );
    return response.data;
  } catch (error) {
    console.error("Error saving question tree:", error);
    throw error;
  }
};
