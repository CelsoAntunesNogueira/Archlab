import { useEffect, useState } from 'react'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export function usePWA() {
  const [installable, setInstallable] = useState(false)
  const [installed, setInstalled] = useState(false)
  const promptRef = { current: null as BeforeInstallPromptEvent | null }

  useEffect(() => {
    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js', { scope: '/' })
        .then((reg) => {
          console.log('[ArchLab PWA] SW registered:', reg.scope)
        })
        .catch((err) => {
          console.warn('[ArchLab PWA] SW registration failed:', err)
        })
    }

    // Listen for install prompt
    const onPrompt = (e: Event) => {
      e.preventDefault()
      promptRef.current = e as BeforeInstallPromptEvent
      setInstallable(true)
    }

    const onInstalled = () => {
      setInstalled(true)
      setInstallable(false)
    }

    window.addEventListener('beforeinstallprompt', onPrompt)
    window.addEventListener('appinstalled', onInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt)
      window.removeEventListener('appinstalled', onInstalled)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const install = async () => {
    if (!promptRef.current) return
    await promptRef.current.prompt()
    const { outcome } = await promptRef.current.userChoice
    if (outcome === 'accepted') setInstalled(true)
    promptRef.current = null
    setInstallable(false)
  }

  return { installable, installed, install }
}
