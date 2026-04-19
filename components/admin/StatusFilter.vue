<template>
  <div class="flex gap-2 flex-wrap">
    <button
      v-for="opt in options"
      :key="opt.value"
      class="px-4 py-1.5 rounded-full text-sm font-medium border transition-colors"
      :class="
        modelValue === opt.value
          ? 'bg-brand-blue text-white border-brand-blue'
          : 'bg-white text-gray-600 border-gray-200 hover:border-brand-blue hover:text-brand-blue'
      "
      @click="$emit('update:modelValue', opt.value)"
    >
      {{ opt.label }}
    </button>
  </div>
</template>

<script setup lang="ts">
defineProps<{ modelValue: string }>()
defineEmits<{ 'update:modelValue': [value: string] }>()

const options = [
  { value: '', label: 'Todos' },
  { value: 'pending', label: 'Pendentes' },
  { value: 'approved', label: 'Aprovados' },
  { value: 'rejected', label: 'Rejeitados' },
]
</script>
