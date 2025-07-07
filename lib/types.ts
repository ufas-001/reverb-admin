export interface Option {
  id: string;
  text: string;
  nextQuestionId: string | null;
}

export interface Question {
  id: string;
  text: string;
  parentQuestionId: string | null;
  parentOptionId: string | null;
  options: Option[];
}
