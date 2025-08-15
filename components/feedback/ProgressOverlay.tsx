"use client"

import { useImageConverter } from "@/contexts/ImageConverterContext"

export default function ProgressOverlay() {
  const { state } = useImageConverter()

  if (!state.isConverting) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-slate-800 rounded-xl p-8 max-w-md w-full mx-4 border border-slate-700">
        <div className="text-center space-y-4">
          <h3 className="text-xl font-semibold text-white">Convertendo Imagens</h3>

          <div className="w-full bg-slate-700 rounded-full h-3">
            <div
              className="bg-blue-500 h-3 rounded-full transition-all duration-300"
              style={{ width: `${state.globalProgress}%` }}
            />
          </div>

          <p className="text-slate-400">{state.globalProgress}% concluído</p>

          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
          </div>
        </div>
      </div>
    </div>
  )
}
