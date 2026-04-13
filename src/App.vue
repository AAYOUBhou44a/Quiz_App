<template>
  <div class="relative min-h-screen font-body text-slate-900">
    <div class="pointer-events-none absolute inset-0 overflow-hidden">
      <div class="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-cyan-200/35 blur-3xl" />
      <div class="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-blue-200/30 blur-3xl" />
    </div>
    <router-view />
  </div>
</template>
