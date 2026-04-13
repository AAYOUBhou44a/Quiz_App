export type QuestionType = 'multiple' | 'text'

export interface QuizQuestionApi {
  id: number
  question: string
  choices: string[]
  correct_answer: string
  level: 1 | 2 | 3
  type?: QuestionType
  code_snippet?: string
  placeholder?: string
}

export interface QuizQuestion {
  id: number
  question: string
  choices: string[]
  correctAnswer: string
  level: 1 | 2 | 3
  type: QuestionType
  codeSnippet?: string
  placeholder?: string
}

export type QuizStatus = 'idle' | 'in-progress' | 'won' | 'lost'

export interface LevelRequirement {
  level: 1 | 2 | 3
  minimumScore: number
}
