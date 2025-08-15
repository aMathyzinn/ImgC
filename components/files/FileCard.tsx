"use client"

import { useState, useEffect } from "react"
import { X, RotateCw, Download, Check, AlertCircle, Maximize2 } from "lucide-react"
import { useImageConverter, type ImageFile, type ImageFormat } from "@/contexts/ImageConverterContext"
import FormatDropdown from "./FormatDropdown"
import { convertImage, downloadBlob, resizeImage } from "@/utils/imageUtils"
import ResizePanel from "./ResizePanel"

interface FileCardProps {
  file: ImageFile
}

export default function FileCard({ file }: FileCardProps) {
  const { dispatch } = useImageConverter()
  const [isConverting, setIsConverting] = useState(false)
  const [showResizePanel, setShowResizePanel] = useState(false)

  useEffect(() => {
    if (!file.originalDimensions) {
      const img = new Image()
      img.onload = () => {
        dispatch({
          type: "SET_ORIGINAL_DIMENSIONS",
          payload: {
            id: file.id,
            dimensions: { width: img.width, height: img.height },
          },
        })
      }
      img.src = file.preview
    }
  }, [file, dispatch])

  const handleRemove = () => {
    dispatch({ type: "REMOVE_FILE", payload: file.id })
  }

  const handleFormatChange = (format: ImageFormat) => {
    dispatch({
      type: "UPDATE_TARGET_FORMAT",
      payload: { id: file.id, format },
    })
  }

  const handleConvert = async () => {
    if (isConverting) return

    setIsConverting(true)
    dispatch({ type: "START_CONVERSION", payload: file.id })

    try {
      let sourceBlob: Blob = file.file

      // Se resize está habilitado, redimensionar primeiro
      if (file.resizeSettings.enabled) {
        dispatch({ type: "START_RESIZE", payload: file.id })

        const resizedBlob = await resizeImage(file.file, file.resizeSettings, (progress) => {
          dispatch({
            type: "UPDATE_PROGRESS",
            payload: { id: file.id, progress: progress * 0.5 }, // 50% para resize
          })
        })

        dispatch({
          type: "COMPLETE_RESIZE",
          payload: { id: file.id, blob: resizedBlob },
        })

        sourceBlob = resizedBlob
      }

      // Converter formato
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

      dispatch({
        type: "ADD_TOAST",
        payload: {
          type: "success",
          message: `${file.file.name} ${file.resizeSettings.enabled ? "redimensionado e " : ""}convertido com sucesso!`,
        },
      })
    } catch (error) {
      dispatch({
        type: "ERROR_CONVERSION",
        payload: {
          id: file.id,
          error: error instanceof Error ? error.message : "Erro desconhecido",
        },
      })

      dispatch({
        type: "ADD_TOAST",
        payload: {
          type: "error",
          message: `Erro ao ${file.resizeSettings.enabled ? "redimensionar/" : ""}converter ${file.file.name}`,
        },
      })
    } finally {
      setIsConverting(false)
    }
  }

  const handleDownload = () => {
    if (file.convertedBlob) {
      const fileName = file.file.name.replace(/\.[^/.]+$/, "") + `-convertido.${file.targetFormat}`
      downloadBlob(file.convertedBlob, fileName)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const getStatusIcon = () => {
    switch (file.status) {
      case "converting":
        return <RotateCw className="w-4 h-4 animate-spin text-blue-400" />
      case "completed":
        return <Check className="w-4 h-4 text-green-400" />
      case "error":
        return <AlertCircle className="w-4 h-4 text-red-400" />
      default:
        return null
    }
  }

  const getStatusText = () => {
    switch (file.status) {
      case "converting":
        return "Convertendo..."
      case "completed":
        return "Convertido"
      case "error":
        return "Erro"
      default:
        return "Pendente"
    }
  }

  const getStatusColor = () => {
    switch (file.status) {
      case "converting":
        return "text-blue-400"
      case "completed":
        return "text-green-400"
      case "error":
        return "text-red-400"
      default:
        return "text-slate-400"
    }
  }

  return (
    <div className="bg-slate-800 rounded-xl p-4 space-y-4 border border-slate-700 hover:border-slate-600 transition-colors">
      {/* Thumbnail */}
      <div className="relative">
        <img
          src={file.preview || "/placeholder.svg"}
          alt={file.file.name}
          className="w-full h-32 object-cover rounded-lg"
        />
        <button
          onClick={handleRemove}
          className="absolute top-2 right-2 p-1 bg-red-500 hover:bg-red-600 rounded-full text-white transition-colors"
          aria-label="Remover arquivo"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* File Info */}
      <div className="space-y-2">
        <h3 className="text-white font-medium text-sm truncate" title={file.file.name}>
          {file.file.name}
        </h3>
        {file.originalDimensions && (
          <p className="text-slate-400 text-xs">
            {file.originalDimensions.width} × {file.originalDimensions.height}px
            {file.resizeSettings.enabled && file.resizeSettings.width && file.resizeSettings.height && (
              <span className="text-purple-400">
                {" → "}
                {file.resizeSettings.width} × {file.resizeSettings.height}px
              </span>
            )}
          </p>
        )}
        <p className="text-slate-400 text-xs">{formatFileSize(file.file.size)}</p>
      </div>

      {/* Format Selection */}
      <FormatDropdown value={file.targetFormat} onChange={handleFormatChange} disabled={file.status === "converting"} />
      {showResizePanel && <ResizePanel file={file} onClose={() => setShowResizePanel(false)} />}

      {/* Progress Bar */}
      {file.status === "converting" && (
        <div className="w-full bg-slate-700 rounded-full h-2">
          <div
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${file.progress}%` }}
          />
        </div>
      )}

      {/* Status */}
      <div className={`flex items-center space-x-2 text-sm ${getStatusColor()}`}>
        {getStatusIcon()}
        <span>{getStatusText()}</span>
      </div>

      {/* Actions */}
      <div className="flex space-x-2">
        {file.status === "completed" ? (
          <button
            onClick={handleDownload}
            className="flex-1 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Download</span>
          </button>
        ) : (
          <button
            onClick={handleConvert}
            disabled={file.status === "converting"}
            className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-2"
          >
            <RotateCw className={`w-4 h-4 ${file.status === "converting" ? "animate-spin" : ""}`} />
            <span>Converter</span>
          </button>
        )}
        <button
          onClick={() => setShowResizePanel(!showResizePanel)}
          className="px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-2"
        >
          <Maximize2 className="w-4 h-4" />
          <span>Resize</span>
        </button>
      </div>
    </div>
  )
}
