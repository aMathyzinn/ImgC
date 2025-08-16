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

          <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={state.globalProgress}>
            <div
              className="h-3 rounded-full transition-[width] duration-300 ease-out"
              style={{
                width: `${state.globalProgress}%`,
                background:
                  "linear-gradient(90deg, rgba(59,130,246,1) 0%, rgba(99,102,241,1) 50%, rgba(168,85,247,1) 100%)",
              }}
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
