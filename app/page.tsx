"use client"

import { ImageConverterProvider } from "@/contexts/ImageConverterContext"
import AppLayout from "@/components/layout/AppLayout"
import UploadArea from "@/components/upload/UploadArea"
import FileGrid from "@/components/files/FileGrid"
import GlobalActions from "@/components/actions/GlobalActions"
import ProgressOverlay from "@/components/feedback/ProgressOverlay"
import NotificationToast from "@/components/feedback/NotificationToast"

export default function HomePage() {
  return (
    <ImageConverterProvider>
      <AppLayout>
        <div className="container mx-auto px-4 py-8 space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-white">Conversor de Imagens Profissional</h1>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Converta suas imagens entre diferentes formatos diretamente no navegador. Suporte para JPG, PNG, WebP, BMP
              e AVIF.
            </p>
          </div>

          <UploadArea />
          <FileGrid />
          <GlobalActions />
        </div>

        <ProgressOverlay />
        <NotificationToast />
      </AppLayout>
    </ImageConverterProvider>
  )
}
