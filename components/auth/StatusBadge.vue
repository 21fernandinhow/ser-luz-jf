<template>
  <span :class="config.classes" class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium">
    <span :class="config.dot" class="w-2 h-2 rounded-full" />
    {{ config.label }}
  </span>
</template>

<script setup lang="ts">
const props = defineProps<{
  status: 'pending' | 'approved' | 'rejected'
}>()

const config = computed(() => {
  switch (props.status) {
    case 'approved':
      return {
        label: 'Aprovado',
        classes: 'bg-green-50 text-green-700 border border-green-200',
        dot: 'bg-green-500',
      }
    case 'rejected':
      return {
        label: 'Reprovado',
        classes: 'bg-red-50 text-red-700 border border-red-200',
        dot: 'bg-red-500',
      }
    default:
      return {
        label: 'Aguardando aprovação',
        classes: 'bg-yellow-50 text-yellow-700 border border-yellow-200',
        dot: 'bg-yellow-500',
      }
  }
})
</script>
