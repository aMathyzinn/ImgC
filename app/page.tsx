"use client"

import { useEffect } from "react"
import { ImageConverterProvider } from "@/contexts/ImageConverterContext"
import AppLayout from "@/components/layout/AppLayout"
import UploadArea from "@/components/upload/UploadArea"
import FileGrid from "@/components/files/FileGrid"
import GlobalActions from "@/components/actions/GlobalActions"
import ProgressOverlay from "@/components/feedback/ProgressOverlay"
import NotificationToast from "@/components/feedback/NotificationToast"
import HistoryPanel from "@/components/files/HistoryPanel"

export default function HomePage() {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().includes("MAC")
      const openCombo = (isMac && e.metaKey && e.key.toLowerCase() === "o") || (!isMac && e.ctrlKey && e.key.toLowerCase() === "o")
      const convertCombo = (isMac && e.metaKey && e.key === "Enter") || (!isMac && e.ctrlKey && e.key === "Enter")
      if (openCombo) {
        e.preventDefault()
        document.querySelector<HTMLInputElement>('input[type="file"]')?.click()
      }
      if (convertCombo) {
        e.preventDefault()
        const btn = Array.from(document.querySelectorAll("button")).find((b) => b.textContent?.includes("Converter Tudo")) as HTMLButtonElement | undefined
        btn?.click()
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  return (
    <ImageConverterProvider>
      <AppLayout>
        <div className="container mx-auto px-4 py-8 space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-white to-slate-400">
              Conversor de Imagens Profissional
            </h1>
            <p className="text-slate-300/90 text-lg max-w-3xl mx-auto">
              Converta, redimensione e otimize suas imagens diretamente no navegador com qualidade e privacidade.
            </p>
          </div>

          <UploadArea />
          <FileGrid />
          <GlobalActions />
          <HistoryPanel />
        </div>

        <ProgressOverlay />
        <NotificationToast />
      </AppLayout>
    </ImageConverterProvider>
  )
}
