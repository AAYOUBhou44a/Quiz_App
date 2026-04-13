<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useQuizStore } from '@/stores/quiz'

const router = useRouter()
const quizStore = useQuizStore()

async function startAssessment() {
  await quizStore.initializeQuiz()
  if (quizStore.error) return

  quizStore.startQuiz()
  router.push('/quiz')
}
</script>

<template>
  <section class="mx-auto grid min-h-screen max-w-6xl place-items-center px-4 py-10 md:px-6">
    <div class="w-full rounded-3xl border border-slate-200 bg-white/90 p-8 shadow-xl shadow-slate-200 md:p-12">
      <div class="grid items-center gap-10 md:grid-cols-[1.1fr_0.9fr]">
        <div>
          <p class="mb-3 inline-flex rounded-full bg-cyan-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-cyan-700">
            Tech / SaaS Assessment
          </p>
          <h1 class="font-display text-4xl font-extrabold leading-tight text-slate-900 md:text-6xl">
            TECHNICAL QUIZ APP
          </h1>
          <p class="mt-4 max-w-xl text-lg text-slate-600">
            Evaluez vos competences sur 3 niveaux progressifs. 5 minutes au total.
          </p>

          <div class="mt-8">
            <button
              class="group relative overflow-hidden rounded-2xl bg-brand-deep px-8 py-4 text-lg font-bold text-white shadow-glow transition hover:-translate-y-0.5"
              @click="startAssessment"
            >
              <span class="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-cyan-300/35 to-transparent transition duration-700 group-hover:translate-x-full" />
              <span class="relative">START ASSESSMENT</span>
            </button>
            <p v-if="quizStore.error" class="mt-3 text-sm font-semibold text-brand-danger">{{ quizStore.error }}</p>
          </div>
        </div>

        <div class="grid gap-4">
          <div class="animate-floaty rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <p class="text-sm text-slate-500">Workflow</p>
            <p class="font-display text-2xl font-bold text-slate-900">3 Levels / 15 Questions</p>
          </div>
          <div class="rounded-2xl border border-slate-200 bg-white p-5">
            <div class="flex items-center gap-3 text-3xl">
              <span>💡</span><span>{ }</span><span>⚙️</span>
            </div>
            <p class="mt-3 text-sm text-slate-600">Code, logique metier, API et TypeScript en conditions reelles.</p>
          </div>
          <div class="rounded-2xl border border-cyan-200 bg-cyan-50 p-5">
            <p class="text-sm font-semibold text-cyan-700">Timer global</p>
            <p class="text-3xl font-black text-cyan-900">05:00</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
