import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { fetchQuizQuestions } from '@/services/quizApi'
import type { LevelRequirement, QuizQuestion, QuizStatus } from '@/types/quiz'

const QUIZ_DURATION_SECONDS = 5 * 60
const LEVELS: Array<1 | 2 | 3> = [1, 2, 3]
const POINTS_PER_QUESTION = 20

const requirements: LevelRequirement[] = [
  { level: 1, minimumScore: 40 },
  { level: 2, minimumScore: 60 },
  { level: 3, minimumScore: 80 },
]

export const useQuizStore = defineStore('quiz', () => {
  const status = ref<QuizStatus>('idle')
  const loading = ref(false)
  const error = ref<string | null>(null)

  const allQuestions = ref<QuizQuestion[]>([])
  const currentLevel = ref<1 | 2 | 3>(1)
  const currentQuestionIndex = ref(0)

  const totalScore = ref(0)
  const levelScore = ref<Record<number, number>>({ 1: 0, 2: 0, 3: 0 })

  const selectedAnswer = ref<string | null>(null)
  const textAnswer = ref('')
  const answerSubmitted = ref(false)
  const lastAnswerCorrect = ref<boolean | null>(null)

  const timeLeft = ref(QUIZ_DURATION_SECONDS)
  const timer = ref<ReturnType<typeof setInterval> | null>(null)

  const finalMessage = ref('')

  const levelQuestions = computed(() =>
    allQuestions.value.filter((question) => question.level === currentLevel.value),
  )

  const currentQuestion = computed(() => levelQuestions.value[currentQuestionIndex.value] ?? null)

  const currentLevelRequirement = computed(() =>
    requirements.find((item) => item.level === currentLevel.value)?.minimumScore ?? 0,
  )

  const currentLevelProgress = computed(() => {
    const total = levelQuestions.value.length || 1
    return Math.round((currentQuestionIndex.value / total) * 100)
  })

  const formattedTime = computed(() => {
    const min = Math.floor(timeLeft.value / 60)
      .toString()
      .padStart(2, '0')
    const sec = (timeLeft.value % 60).toString().padStart(2, '0')
    return `${min}:${sec}`
  })

  const timerTone = computed(() => {
    if (timeLeft.value <= 90) return 'danger'
    if (timeLeft.value <= 180) return 'warning'
    return 'normal'
  })

  function resetState() {
    status.value = 'idle'
    loading.value = false
    error.value = null
    currentLevel.value = 1
    currentQuestionIndex.value = 0
    totalScore.value = 0
    levelScore.value = { 1: 0, 2: 0, 3: 0 }
    selectedAnswer.value = null
    textAnswer.value = ''
    answerSubmitted.value = false
    lastAnswerCorrect.value = null
    timeLeft.value = QUIZ_DURATION_SECONDS
    finalMessage.value = ''
  }

  function persistFinalScore() {
    localStorage.setItem(
      'technical-quiz-last-score',
      JSON.stringify({
        score: totalScore.value,
        status: status.value,
        timestamp: new Date().toISOString(),
      }),
    )
  }

  function stopTimer() {
    if (timer.value) {
      clearInterval(timer.value)
      timer.value = null
    }
  }

  function startTimer() {
    stopTimer()
    timer.value = setInterval(() => {
      if (timeLeft.value <= 0) {
        gameOver('Time Expired. You did not complete all levels.')
        return
      }

      timeLeft.value -= 1

      if (timeLeft.value <= 0) {
        gameOver('Time Expired. You did not complete all levels.')
      }
    }, 1000)
  }

  async function initializeQuiz() {
    loading.value = true
    error.value = null

    try {
      allQuestions.value = await fetchQuizQuestions()
      const valid = LEVELS.every((level) => allQuestions.value.filter((q) => q.level === level).length >= 5)

      if (!valid) {
        throw new Error('Each level must contain at least 5 questions.')
      }

      resetState()
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unknown error while loading quiz.'
    } finally {
      loading.value = false
    }
  }

  function startQuiz() {
    status.value = 'in-progress'
    startTimer()
  }

  function prepareNextQuestion() {
    selectedAnswer.value = null
    textAnswer.value = ''
    answerSubmitted.value = false
    lastAnswerCorrect.value = null
  }

  // Placeholder hooks for sound effects integration.
  function playCorrectSound() {
    // TODO: integrate audio asset for correct answer.
  }

  function playWrongSound() {
    // TODO: integrate audio asset for wrong answer.
  }

  function evaluateAnswer(answer: string) {
    if (!currentQuestion.value || answerSubmitted.value) return

    answerSubmitted.value = true
    selectedAnswer.value = answer

    const correct = answer.trim().toLowerCase() === currentQuestion.value.correctAnswer.trim().toLowerCase()
    lastAnswerCorrect.value = correct

    if (correct) {
      totalScore.value += POINTS_PER_QUESTION
      levelScore.value[currentLevel.value] += POINTS_PER_QUESTION
      playCorrectSound()
    } else {
      playWrongSound()
    }
  }

  function submitChoice(answer: string) {
    evaluateAnswer(answer)
  }

  function submitTextAnswer() {
    evaluateAnswer(textAnswer.value)
  }

  function gameOver(message: string) {
    stopTimer()
    status.value = 'lost'
    finalMessage.value = message
    persistFinalScore()
  }

  function winGame() {
    stopTimer()
    status.value = 'won'
    finalMessage.value = 'Assessment completed successfully!'
    persistFinalScore()
  }

  function validateLevel() {
    const requirement = requirements.find((item) => item.level === currentLevel.value)
    if (!requirement) return true

    return levelScore.value[currentLevel.value] >= requirement.minimumScore
  }

  function nextQuestion() {
    if (!currentQuestion.value || !answerSubmitted.value) return

    const isLastQuestionInLevel = currentQuestionIndex.value >= levelQuestions.value.length - 1

    if (!isLastQuestionInLevel) {
      currentQuestionIndex.value += 1
      prepareNextQuestion()
      return
    }

    const passedLevel = validateLevel()
    if (!passedLevel) {
      gameOver('Score insufficient to progress.')
      return
    }

    if (currentLevel.value === 3) {
      winGame()
      return
    }

    currentLevel.value = (currentLevel.value + 1) as 1 | 2 | 3
    currentQuestionIndex.value = 0
    prepareNextQuestion()
  }

  function restartQuiz() {
    stopTimer()
    resetState()
  }

  return {
    status,
    loading,
    error,
    currentLevel,
    currentQuestionIndex,
    totalScore,
    levelScore,
    selectedAnswer,
    textAnswer,
    answerSubmitted,
    lastAnswerCorrect,
    timeLeft,
    finalMessage,
    levelQuestions,
    currentQuestion,
    currentLevelRequirement,
    currentLevelProgress,
    formattedTime,
    timerTone,
    initializeQuiz,
    startQuiz,
    submitChoice,
    submitTextAnswer,
    nextQuestion,
    restartQuiz,
    gameOver,
  }
})
