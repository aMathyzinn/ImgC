"use client"

import { useState, useEffect } from "react"
import { X, RotateCw, Download, Check, AlertCircle, Eye, EyeOff, SlidersHorizontal } from "lucide-react"
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
  const [showAfter, setShowAfter] = useState(false)

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
    if (format === "tiff" || format === "ico") {
      dispatch({
        type: "ADD_TOAST",
        payload: { type: "info", message: "Saída TIFF/ICO limitada no navegador. Pode usar PNG internamente." },
      })
    }
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

      // Output scale presets first
      if (file.options.outputScale !== "original" && file.originalDimensions) {
        const scale = file.options.outputScale === "half" ? 0.5 : (file.options.customScalePercent || 100) / 100
        const width = Math.max(1, Math.round(file.originalDimensions.width * scale))
        const height = Math.max(1, Math.round(file.originalDimensions.height * scale))
        const resizedBlob = await resizeImage(file.file, { ...file.resizeSettings, enabled: true, width, height }, (p) => {
          dispatch({ type: "UPDATE_PROGRESS", payload: { id: file.id, progress: p * 0.3 } })
        })
        sourceBlob = resizedBlob
      }

      // Se resize manual está habilitado, redimensionar
      if (file.resizeSettings.enabled) {
        const resizedBlob = await resizeImage(file.file, file.resizeSettings, (progress) => {
          dispatch({
            type: "UPDATE_PROGRESS",
            payload: { id: file.id, progress: 30 + progress * 0.2 },
          })
        })
        sourceBlob = resizedBlob
      }

      // Converter formato
      const blob = await convertImage(
        sourceBlob,
        file.targetFormat,
        (progress) => {
          const base = file.resizeSettings.enabled || file.options.outputScale !== "original" ? 50 : 0
          dispatch({ type: "UPDATE_PROGRESS", payload: { id: file.id, progress: base + progress * 0.5 } })
        },
        file.options.qualityPreset,
      )

      dispatch({
        type: "COMPLETE_CONVERSION",
        payload: { id: file.id, blob },
      })

      // history
      dispatch({
        type: "ADD_HISTORY",
        payload: {
          id: file.id,
          name: file.file.name,
          from: file.file.type,
          to: file.targetFormat,
          sizeIn: file.file.size,
          sizeOut: blob.size,
          date: Date.now(),
        },
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
      {/* Thumbnail with before/after toggle */}
      <div className="relative">
        <img
          src={showAfter && file.convertedBlob ? URL.createObjectURL(file.convertedBlob) : file.preview || "/placeholder.svg"}
          alt={file.file.name}
          className="w-full h-32 object-cover rounded-lg"
        />
        <div className="absolute top-2 left-2 flex gap-2">
          <button
            onClick={() => setShowAfter((v) => !v)}
            className="px-2 py-1 bg-slate-900/70 hover:bg-slate-900/90 text-white rounded-md text-xs backdrop-blur border border-slate-600"
            aria-pressed={showAfter}
          >
            {showAfter ? (
              <span className="inline-flex items-center gap-1"><EyeOff className="w-3 h-3" /> Antes</span>
            ) : (
              <span className="inline-flex items-center gap-1"><Eye className="w-3 h-3" /> Depois</span>
            )}
          </button>
        </div>
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

      {/* Options: quality + output scale */}
      <div className="flex items-center gap-2">
        <div className="flex-1">
          <label className="block text-xs text-slate-300 mb-1">Qualidade</label>
          <select
            value={file.options.qualityPreset}
            onChange={(e) =>
              dispatch({ type: "SET_OPTIONS", payload: { id: file.id, options: { qualityPreset: e.target.value as any } } })
            }
            className="w-full px-2 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-xs"
          >
            <option value="high">Alta</option>
            <option value="medium">Média</option>
            <option value="low">Baixa</option>
          </select>
        </div>
        <div className="flex-1">
          <label className="block text-xs text-slate-300 mb-1">Resolução</label>
          <select
            value={file.options.outputScale}
            onChange={(e) =>
              dispatch({ type: "SET_OPTIONS", payload: { id: file.id, options: { outputScale: e.target.value as any } } })
            }
            className="w-full px-2 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-xs"
          >
            <option value="original">Original</option>
            <option value="half">50%</option>
            <option value="custom">Custom</option>
          </select>
        </div>
        {file.options.outputScale === "custom" && (
          <div className="w-24">
            <label className="block text-xs text-slate-300 mb-1">% </label>
            <input
              type="number"
              min={1}
              max={400}
              value={file.options.customScalePercent ?? 100}
              onChange={(e) =>
                dispatch({
                  type: "SET_OPTIONS",
                  payload: { id: file.id, options: { customScalePercent: Number.parseInt(e.target.value) || 100 } },
                })
              }
              className="w-full px-2 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-xs"
            />
          </div>
        )}
      </div>

      {/* Progress Bar */}
      {file.status === "converting" && (
        <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
          <div
            className="bg-blue-500 h-2 rounded-full transition-[width] duration-300 ease-out"
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
          <SlidersHorizontal className="w-4 h-4" />
          <span>Opções</span>
        </button>
      </div>
    </div>
  )
}
