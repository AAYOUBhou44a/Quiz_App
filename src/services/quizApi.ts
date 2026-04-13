import { mockQuestions } from '@/data/mockQuestions'
import type { QuizQuestion, QuizQuestionApi } from '@/types/quiz'

const API_URL = '/api/questions'

function mapApiQuestion(question: QuizQuestionApi): QuizQuestion {
  return {
    id: question.id,
    question: question.question,
    choices: question.choices,
    correctAnswer: question.correct_answer,
    level: question.level,
    type: question.type ?? 'multiple',
    codeSnippet: question.code_snippet,
    placeholder: question.placeholder,
  }
}

export async function fetchQuizQuestions(): Promise<QuizQuestion[]> {
  try {
    const response = await fetch(API_URL)

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`)
    }

    const data = (await response.json()) as QuizQuestionApi[]
    return data.map(mapApiQuestion)
  } catch {
    // Fallback mock to keep the app testable without backend.
    await new Promise((resolve) => setTimeout(resolve, 300))
    return mockQuestions.map(mapApiQuestion)
  }
}
