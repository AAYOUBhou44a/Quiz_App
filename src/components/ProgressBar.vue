<script setup lang="ts">
const props = defineProps<{
  value: number
  label?: string
}>()
</script>

<template>
  <div class="w-full">
    <div class="mb-2 flex items-center justify-between">
      <p class="text-sm font-semibold text-slate-600">{{ label ?? 'Progress' }}</p>
      <p class="text-sm font-bold text-brand-deep">{{ value }}%</p>
    </div>
    <div class="h-3 w-full overflow-hidden rounded-full bg-slate-200">
      <div
        class="h-full rounded-full bg-gradient-to-r from-brand-deep to-brand-cyan transition-all duration-500"
        :style="{ width: `${value}%` }"
      />
    </div>
  </div>
</template>
