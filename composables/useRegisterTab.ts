export type RegisterTab = 'beneficiary' | 'volunteer'

export function useRegisterTab() {
  const route = useRoute()
  const router = useRouter()

  const activeTab = computed<RegisterTab>(() => {
    const type = route.query.type
    return type === 'volunteer' ? 'volunteer' : 'beneficiary'
  })

  function setTab(tab: RegisterTab) {
    router.replace({ query: { ...route.query, type: tab } })
  }

  return { activeTab, setTab }
}
