<script setup lang="ts">
import { computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import ProgressBar from '@/components/ProgressBar.vue'
import QuestionCard from '@/components/QuestionCard.vue'
import { useQuizStore } from '@/stores/quiz'

const router = useRouter()
const quizStore = useQuizStore()

const levelTitle = computed(() => {
  if (quizStore.currentLevel === 1) return 'LEVEL 1: FOUNDATIONS'
  if (quizStore.currentLevel === 2) return 'LEVEL 2: INTERMEDIATE'
  return 'LEVEL 3: ADVANCED'
})

const timerClasses = computed(() => {
  if (quizStore.timerTone === 'danger') return 'text-brand-danger'
  if (quizStore.timerTone === 'warning') return 'text-brand-warning'
  return 'text-brand-deep'
})

const questionLabel = computed(() => `Question ${quizStore.currentQuestionIndex + 1}/5`)

function handleChoice(value: string) {
  quizStore.submitChoice(value)
}

function handleText(value: string) {
  quizStore.textAnswer = value
  quizStore.submitTextAnswer()
}

function goNext() {
  quizStore.nextQuestion()
}

watch(
  () => quizStore.status,
  (status) => {
    if (status === 'won' || status === 'lost') {
      router.push('/result')
    }
  },
  { immediate: true },
)
</script>

<template>
  <section class="mx-auto min-h-screen max-w-6xl px-4 py-8 md:px-6">
    <div class="rounded-3xl border border-slate-200 bg-white/90 p-5 shadow-xl shadow-slate-200 md:p-8">
      <header class="mb-6 grid gap-4 md:grid-cols-[1fr_auto] md:items-center">
        <div>
          <h1 class="font-display text-2xl font-extrabold text-slate-900 md:text-3xl">{{ levelTitle }}</h1>
          <p class="text-sm font-medium text-slate-500">Minimum requis: {{ quizStore.currentLevelRequirement }}/100</p>
        </div>
        <div class="flex items-center gap-3">
          <span class="rounded-xl bg-slate-100 px-3 py-2 text-sm font-bold text-slate-600">Score: {{ quizStore.totalScore }}</span>
          <span class="rounded-xl bg-amber-50 px-3 py-2 text-lg font-black" :class="timerClasses">{{ quizStore.formattedTime }}</span>
        </div>
      </header>

      <ProgressBar :value="quizStore.currentLevelProgress" :label="questionLabel" />

      <QuestionCard
        v-if="quizStore.currentQuestion"
        class="mt-6"
        :question="quizStore.currentQuestion"
        :selected-answer="quizStore.selectedAnswer"
        :text-answer="quizStore.textAnswer"
        :answer-submitted="quizStore.answerSubmitted"
        :is-correct="quizStore.lastAnswerCorrect"
        @choose="handleChoice"
        @submit-text="handleText"
      />

      <div class="mt-5 flex items-center justify-between">
        <p
          v-if="quizStore.answerSubmitted"
          class="rounded-lg border px-3 py-2 text-sm font-semibold"
          :class="quizStore.lastAnswerCorrect ? 'border-brand-success bg-emerald-50 text-emerald-700' : 'border-brand-danger bg-rose-50 text-rose-700'"
        >
          {{ quizStore.lastAnswerCorrect ? 'Bonne reponse.' : 'Mauvaise reponse.' }}
        </p>
        <span v-else class="text-sm text-slate-500">Selectionnez une reponse pour continuer.</span>

        <button
          class="rounded-xl bg-brand-deep px-5 py-2.5 font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-50"
          :disabled="!quizStore.answerSubmitted"
          @click="goNext"
        >
          NEXT
        </button>
      </div>
    </div>
  </section>
</template>
