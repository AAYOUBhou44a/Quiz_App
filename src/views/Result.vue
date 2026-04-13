<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useQuizStore } from '@/stores/quiz'

const quizStore = useQuizStore()
const router = useRouter()

const isWin = computed(() => quizStore.status === 'won')

function tryAgain() {
  quizStore.restartQuiz()
  router.push('/')
}

function returnHome() {
  quizStore.restartQuiz()
  router.push('/')
}

function viewLeaderboard() {
  alert('Leaderboard integration placeholder')
}
</script>

<template>
  <section
    class="relative mx-auto grid min-h-screen max-w-5xl place-items-center px-4 py-10 md:px-6"
    :class="isWin ? 'bg-gradient-to-b from-cyan-50/40 to-white' : 'bg-slate-900/20'"
  >
    <div v-if="isWin" class="pointer-events-none absolute inset-0 overflow-hidden">
      <span class="absolute left-[10%] top-4 h-3 w-3 rounded-full bg-brand-cyan animate-confetti" />
      <span class="absolute left-[45%] top-2 h-2 w-2 rounded-full bg-brand-success animate-confetti [animation-delay:0.3s]" />
      <span class="absolute right-[12%] top-5 h-3 w-3 rounded-full bg-brand-deep animate-confetti [animation-delay:0.6s]" />
    </div>

    <div
      class="relative w-full rounded-3xl border p-8 text-center shadow-xl md:p-12"
      :class="isWin ? 'border-cyan-200 bg-white/95 shadow-cyan-100' : 'border-slate-300 bg-white/95 shadow-slate-300'"
    >
      <div class="mx-auto mb-4 grid h-20 w-20 place-items-center rounded-2xl text-4xl" :class="isWin ? 'bg-amber-100' : 'bg-rose-100'">
        {{ isWin ? '🏆' : '🛑' }}
      </div>

      <h1 class="font-display text-4xl font-black" :class="isWin ? 'text-brand-deep' : 'text-brand-danger'">
        {{ isWin ? 'YOU WIN !!' : 'GAME OVER' }}
      </h1>

      <p class="mx-auto mt-3 max-w-xl text-slate-600">
        {{ isWin ? 'Assessment completed successfully!' : quizStore.finalMessage }}
      </p>

      <p class="mt-5 text-xl font-bold text-slate-800">Final Score: {{ quizStore.totalScore }} / 600</p>

      <div class="mt-8 flex flex-wrap items-center justify-center gap-3">
        <button
          v-if="!isWin"
          class="rounded-xl bg-brand-deep px-5 py-3 font-semibold text-white transition hover:bg-blue-800"
          @click="tryAgain"
        >
          TRY AGAIN
        </button>
        <button
          class="rounded-xl bg-slate-200 px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-300"
          @click="returnHome"
        >
          RETURN HOME
        </button>
        <button
          v-if="isWin"
          class="rounded-xl bg-brand-success px-5 py-3 font-semibold text-white transition hover:bg-emerald-700"
          @click="viewLeaderboard"
        >
          VIEW LEADERBOARD
        </button>
      </div>
    </div>
  </section>
</template>
