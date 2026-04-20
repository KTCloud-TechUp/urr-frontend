import type { VQAQuestion } from "@/shared/types";

export const vqaQuestions: VQAQuestion[] = [
  {
    id: "vqa-cat",
    imageUrl: "/vqa/cat.svg",
    question: "이 동물은 무엇인가요?",
    answer: "고양이",
    acceptedAnswers: ["냐옹이", "야옹이", "cat", "kitty"],
  },
  {
    id: "vqa-dog",
    imageUrl: "/vqa/dog.svg",
    question: "이 동물은 무엇인가요?",
    answer: "강아지",
    acceptedAnswers: ["개", "멍멍이", "dog", "puppy"],
  },
  {
    id: "vqa-apple",
    imageUrl: "/vqa/apple.svg",
    question: "이 과일은 무엇인가요?",
    answer: "사과",
    acceptedAnswers: ["apple"],
  },
  {
    id: "vqa-bus",
    imageUrl: "/vqa/bus.svg",
    question: "이 교통수단은 무엇인가요?",
    answer: "버스",
    acceptedAnswers: ["bus"],
  },
  {
    id: "vqa-microphone",
    imageUrl: "/vqa/microphone.svg",
    question: "이 물건은 무엇인가요?",
    answer: "마이크",
    acceptedAnswers: ["microphone", "mic", "마이크로폰"],
  },
  {
    id: "vqa-guitar",
    imageUrl: "/vqa/guitar.svg",
    question: "이 악기는 무엇인가요?",
    answer: "기타",
    acceptedAnswers: ["guitar"],
  },
];

function normalize(input: string): string {
  return input.trim().toLowerCase().replace(/\s+/g, "");
}

export function checkAnswer(question: VQAQuestion, input: string): boolean {
  const user = normalize(input);
  if (!user) return false;
  if (normalize(question.answer) === user) return true;
  return (question.acceptedAnswers ?? []).some((a) => normalize(a) === user);
}

/**
 * Returns `count` random questions from the pool, shuffled.
 * Ensures no duplicates within a single selection.
 */
export function pickRandomQuestions(count: number = 1): VQAQuestion[] {
  const shuffled = [...vqaQuestions].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}
