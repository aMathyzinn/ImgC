"use client"

import { useState } from "react"
import { RotateCw, Trash2, Maximize2 } from "lucide-react"
import { useImageConverter } from "@/contexts/ImageConverterContext"
import { convertImage, resizeImage } from "@/utils/imageUtils"
import GlobalResizeModal from "./GlobalResizeModal"

export default function GlobalActions() {
  const { state, dispatch } = useImageConverter()
  const [showGlobalResize, setShowGlobalResize] = useState(false)

  const pendingFiles = state.files.filter((f) => f.status === "pending")
  const hasFiles = state.files.length > 0

  const handleConvertAll = async () => {
    if (pendingFiles.length === 0 || state.isConverting) return

    dispatch({ type: "SET_GLOBAL_CONVERTING", payload: true })
    dispatch({ type: "SET_GLOBAL_PROGRESS", payload: 0 })

    let completed = 0
    const total = pendingFiles.length

    for (const file of pendingFiles) {
      try {
        dispatch({ type: "START_CONVERSION", payload: file.id })

        let sourceBlob = file.file

        // Se resize está habilitado, redimensionar primeiro
        if (file.resizeSettings.enabled) {
          sourceBlob = await resizeImage(file.file, file.resizeSettings, (progress) => {
            dispatch({
              type: "UPDATE_PROGRESS",
              payload: { id: file.id, progress: progress * 0.5 },
            })
          })
        }

        const blob = await convertImage(sourceBlob, file.targetFormat, (progress) => {
          const baseProgress = file.resizeSettings.enabled ? 50 : 0
          dispatch({
            type: "UPDATE_PROGRESS",
            payload: { id: file.id, progress: baseProgress + progress * 0.5 },
          })
        })

        dispatch({
          type: "COMPLETE_CONVERSION",
          payload: { id: file.id, blob },
        })

        completed++
        dispatch({
          type: "SET_GLOBAL_PROGRESS",
          payload: Math.round((completed / total) * 100),
        })
      } catch (error) {
        dispatch({
          type: "ERROR_CONVERSION",
          payload: {
            id: file.id,
            error: error instanceof Error ? error.message : "Erro desconhecido",
          },
        })
      }
    }

    dispatch({ type: "SET_GLOBAL_CONVERTING", payload: false })
    dispatch({
      type: "ADD_TOAST",
      payload: {
        type: "success",
        message: `${completed} arquivo(s) convertido(s) com sucesso!`,
      },
    })
  }

  const handleClearAll = () => {
    dispatch({ type: "CLEAR_ALL" })
    dispatch({
      type: "ADD_TOAST",
      payload: {
        type: "info",
        message: "Todos os arquivos foram removidos",
      },
    })
  }

  if (!hasFiles) return null

  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-center">
      <button
        onClick={handleConvertAll}
        disabled={pendingFiles.length === 0 || state.isConverting}
        className="px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
      >
        <RotateCw className={`w-5 h-5 ${state.isConverting ? "animate-spin" : ""}`} />
        <span>
          {state.isConverting ? `Convertendo... (${state.globalProgress}%)` : `Converter Tudo (${pendingFiles.length})`}
        </span>
      </button>

      <button
        onClick={() => setShowGlobalResize(true)}
        disabled={state.isConverting}
        className="px-8 py-3 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
      >
        <Maximize2 className="w-5 h-5" />
        <span>Resize Global</span>
      </button>

      <button
        onClick={handleClearAll}
        disabled={state.isConverting}
        className="px-8 py-3 bg-slate-600 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
      >
        <Trash2 className="w-5 h-5" />
        <span>Limpar Tudo</span>
      </button>

      {showGlobalResize && <GlobalResizeModal onClose={() => setShowGlobalResize(false)} />}
    </div>
  )
}
