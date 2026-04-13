<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { QuizQuestion } from '@/types/quiz'

const props = defineProps<{
  question: QuizQuestion
  selectedAnswer: string | null
  textAnswer: string
  answerSubmitted: boolean
  isCorrect: boolean | null
}>()

const emit = defineEmits<{
  choose: [value: string]
  submitText: [value: string]
}>()

const textModel = ref(props.textAnswer)

watch(
  () => props.textAnswer,
  (value) => {
    textModel.value = value
  },
)

const isTextType = computed(() => props.question.type === 'text')

function answerClass(choice: string) {
  if (!props.answerSubmitted) {
    return 'border-slate-200 bg-white text-slate-700 hover:border-brand-cyan hover:bg-cyan-50'
  }

  if (choice === props.question.correctAnswer) {
    return 'border-brand-success bg-emerald-50 text-emerald-700'
  }

  if (choice === props.selectedAnswer) {
    return 'border-brand-danger bg-rose-50 text-rose-700'
  }

  return 'border-slate-200 bg-slate-100 text-slate-500'
}

function handleTextSubmit() {
  if (!textModel.value.trim()) return
  emit('submitText', textModel.value)
}
</script>

<template>
  <article class="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-xl shadow-slate-200/70 backdrop-blur">
    <p class="mb-3 text-sm font-semibold uppercase tracking-wider text-cyan-600">Technical Question</p>
    <h2 class="text-xl font-bold leading-snug text-slate-900 md:text-2xl">{{ question.question }}</h2>

    <pre
      v-if="question.codeSnippet"
      class="mt-4 overflow-x-auto rounded-2xl bg-slate-900 p-4 text-sm text-cyan-200"
    ><code>{{ question.codeSnippet }}</code></pre>

    <div v-if="!isTextType" class="mt-6 grid gap-3">
      <button
        v-for="choice in question.choices"
        :key="choice"
        class="flex items-center justify-between rounded-2xl border px-4 py-3 text-left text-base font-semibold transition"
        :class="answerClass(choice)"
        :disabled="answerSubmitted"
        @click="emit('choose', choice)"
      >
        <span>{{ choice }}</span>
        <span v-if="answerSubmitted && choice === question.correctAnswer" class="text-lg">✓</span>
      </button>
    </div>

    <div v-else class="mt-6 space-y-3">
      <input
        v-model="textModel"
        type="text"
        class="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-800 outline-none ring-brand-cyan transition focus:ring-2"
        :placeholder="question.placeholder ?? 'define....'"
        :disabled="answerSubmitted"
      />
      <button
        class="rounded-2xl bg-brand-deep px-5 py-3 font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-50"
        :disabled="answerSubmitted"
        @click="handleTextSubmit"
      >
        SUBMIT ANSWER
      </button>
      <p
        v-if="answerSubmitted"
        class="rounded-xl border px-3 py-2 text-sm font-semibold"
        :class="isCorrect ? 'border-brand-success bg-emerald-50 text-emerald-700' : 'border-brand-danger bg-rose-50 text-rose-700'"
      >
        Correct answer: {{ question.correctAnswer }}
      </p>
    </div>
  </article>
</template>
