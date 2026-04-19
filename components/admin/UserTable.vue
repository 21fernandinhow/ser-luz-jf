<template>
  <div>
    <div v-if="loading" class="flex justify-center py-12">
      <svg class="w-6 h-6 text-brand-blue animate-spin" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
      </svg>
    </div>

    <div v-else-if="users.length === 0" class="text-center py-12 text-gray-500 text-sm">
      Nenhum usuário encontrado com este filtro.
    </div>

    <div v-else class="overflow-x-auto">
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b border-gray-200 text-left text-xs text-gray-500 font-semibold uppercase tracking-wide">
            <th class="pb-3 pr-4">Nome</th>
            <th class="pb-3 pr-4 hidden sm:table-cell">E-mail</th>
            <th class="pb-3 pr-4 hidden lg:table-cell">Bairro</th>
            <th class="pb-3 pr-4">Status</th>
            <th class="pb-3 pr-4 hidden md:table-cell">Cadastro</th>
            <th class="pb-3" />
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr v-for="user in users" :key="user.id" class="hover:bg-gray-50 transition-colors">
            <td class="py-3 pr-4 font-medium text-gray-900">
              {{ user.full_name || '—' }}
            </td>
            <td class="py-3 pr-4 text-gray-500 hidden sm:table-cell">
              {{ user.email }}
            </td>
            <td class="py-3 pr-4 text-gray-500 hidden lg:table-cell">
              {{ user.neighborhood || '—' }}
            </td>
            <td class="py-3 pr-4">
              <span
                class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border"
                :class="{
                  'bg-yellow-50 text-yellow-700 border-yellow-200': user.status === 'pending',
                  'bg-green-50 text-green-700 border-green-200': user.status === 'approved',
                  'bg-red-50 text-red-700 border-red-200': user.status === 'rejected',
                }"
              >
                {{ user.status === 'approved' ? 'Aprovado' : user.status === 'rejected' ? 'Reprovado' : 'Pendente' }}
              </span>
            </td>
            <td class="py-3 pr-4 text-gray-500 hidden md:table-cell">
              {{ formatDate(user.created_at) }}
            </td>
            <td class="py-3 text-right">
              <NuxtLink
                :to="`/admin/users/${user.id}`"
                class="text-brand-blue hover:underline text-xs font-medium"
              >
                Ver →
              </NuxtLink>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
interface UserRow {
  id: string
  email: string
  full_name: string | null
  status: 'pending' | 'approved' | 'rejected'
  neighborhood?: string | null
  created_at: string
}

defineProps<{ users: UserRow[]; loading?: boolean }>()

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('pt-BR')
}
</script>
