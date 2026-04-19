export function useDonateModal() {
  const isOpen = useState('donate-open', () => false)
  const open = () => (isOpen.value = true)
  const close = () => (isOpen.value = false)
  return { isOpen, open, close }
}
