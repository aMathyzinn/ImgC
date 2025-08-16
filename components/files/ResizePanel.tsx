"use client"

import { useState, useEffect } from "react"
import { Lock, Unlock, X, Check } from "lucide-react"
import { useImageConverter, type ImageFile, type ResizeSettings } from "@/contexts/ImageConverterContext"
import { calculateDimensions } from "@/utils/resizeUtils"

interface ResizePanelProps {
  file: ImageFile
  onClose: () => void
}

export default function ResizePanel({ file, onClose }: ResizePanelProps) {
  const { dispatch } = useImageConverter()
  const [settings, setSettings] = useState<ResizeSettings>(file.resizeSettings)
  const [dimensions, setDimensions] = useState({
    width: file.resizeSettings.width || file.originalDimensions?.width || 0,
    height: file.resizeSettings.height || file.originalDimensions?.height || 0,
  })

  useEffect(() => {
    // Carregar dimensões originais se não existirem
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
        setDimensions({ width: img.width, height: img.height })
      }
      img.src = file.preview
    }
  }, [file, dispatch])

  const handleDimensionChange = (dimension: "width" | "height", value: number) => {
    if (!file.originalDimensions) return

    const newDimensions = { ...dimensions }
    newDimensions[dimension] = value

    if (settings.maintainAspectRatio && file.originalDimensions) {
      const calculated = calculateDimensions(
        file.originalDimensions,
        dimension === "width" ? { width: value } : { height: value },
      )
      newDimensions.width = calculated.width
      newDimensions.height = calculated.height
    }

    setDimensions(newDimensions)
  }

  const handleApply = () => {
    const newSettings: ResizeSettings = {
      ...settings,
      width: dimensions.width,
      height: dimensions.height,
      enabled: true,
    }

    dispatch({
      type: "UPDATE_RESIZE_SETTINGS",
      payload: { id: file.id, settings: newSettings },
    })

    dispatch({
      type: "ADD_TOAST",
      payload: {
        type: "success",
        message: "Configurações de redimensionamento aplicadas",
      },
    })

    onClose()
  }

  const handleDisable = () => {
    dispatch({
      type: "UPDATE_RESIZE_SETTINGS",
      payload: { id: file.id, settings: { enabled: false } },
    })
    onClose()
  }

  if (!file.originalDimensions) {
    return (
      <div className="bg-slate-700 rounded-lg p-4 mt-2 border border-slate-600">
        <div className="flex items-center justify-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-500" />
          <span className="ml-2 text-slate-400">Carregando dimensões...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-slate-700 rounded-lg p-4 mt-2 border border-slate-600 space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-white font-medium flex items-center space-x-2">
          <span>Redimensionar Imagem</span>
        </h4>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white transition-colors"
          aria-label="Fechar painel de redimensionamento"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor={`width-${file.id}`} className="block text-sm font-medium text-slate-300 mb-1">
            Largura (px)
          </label>
          <input
            id={`width-${file.id}`}
            type="number"
            min="1"
            max="10000"
            value={dimensions.width}
            onChange={(e) => handleDimensionChange("width", Number.parseInt(e.target.value) || 0)}
            className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded-lg text-white text-sm focus:border-purple-500 focus:outline-none"
            aria-describedby={`width-help-${file.id}`}
          />
        </div>

        <div>
          <label htmlFor={`height-${file.id}`} className="block text-sm font-medium text-slate-300 mb-1">
            Altura (px)
          </label>
          <input
            id={`height-${file.id}`}
            type="number"
            min="1"
            max="10000"
            value={dimensions.height}
            onChange={(e) => handleDimensionChange("height", Number.parseInt(e.target.value) || 0)}
            className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded-lg text-white text-sm focus:border-purple-500 focus:outline-none"
            aria-describedby={`height-help-${file.id}`}
          />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <button
          onClick={() => setSettings({ ...settings, maintainAspectRatio: !settings.maintainAspectRatio })}
          className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            settings.maintainAspectRatio
              ? "bg-purple-600 hover:bg-purple-700 text-white"
              : "bg-slate-600 hover:bg-slate-500 text-slate-300"
          }`}
          aria-pressed={settings.maintainAspectRatio}
        >
          {settings.maintainAspectRatio ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
          <span>Manter proporção</span>
        </button>

        <select
          value={settings.mode}
          onChange={(e) => setSettings({ ...settings, mode: e.target.value as "fit" | "fill" })}
          className="px-3 py-2 bg-slate-600 border border-slate-500 rounded-lg text-white text-sm focus:border-purple-500 focus:outline-none"
          aria-label="Modo de ajuste"
        >
          <option value="fit">Fit (Encaixar)</option>
          <option value="fill">Fill (Preencher)</option>
        </select>
      </div>

      <div className="text-xs text-slate-400 space-y-1">
        <p>
          Original: {file.originalDimensions.width} × {file.originalDimensions.height}px
        </p>
        <p>
          Novo: {dimensions.width} × {dimensions.height}px
        </p>
        <p className="text-purple-400">
          {settings.mode === "fit"
            ? "Encaixa dentro da área, mantendo proporção"
            : "Preenche toda a área, pode cortar bordas"}
        </p>
      </div>

      <div className="flex space-x-2">
        <button
          onClick={handleApply}
          disabled={dimensions.width < 1 || dimensions.height < 1}
          className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-2"
        >
          <Check className="w-4 h-4" />
          <span>Aplicar</span>
        </button>

        {file.resizeSettings.enabled && (
          <button
            onClick={handleDisable}
            className="px-4 py-2 bg-slate-600 hover:bg-slate-500 text-white rounded-lg text-sm font-medium transition-colors"
          >
            Desabilitar
          </button>
        )}
      </div>
    </div>
  )
}
