"use client"

import { useState } from "react"
import { X, Lock, Unlock, Check } from "lucide-react"
import { useImageConverter, type ResizeSettings } from "@/contexts/ImageConverterContext"

interface GlobalResizeModalProps {
  onClose: () => void
}

export default function GlobalResizeModal({ onClose }: GlobalResizeModalProps) {
  const { state, dispatch } = useImageConverter()
  const [settings, setSettings] = useState<ResizeSettings>({
    width: 1920,
    height: 1080,
    maintainAspectRatio: true,
    mode: "fit",
    enabled: true,
  })

  const handleApply = () => {
    dispatch({
      type: "SET_GLOBAL_RESIZE_SETTINGS",
      payload: settings,
    })

    dispatch({
      type: "ADD_TOAST",
      payload: {
        type: "success",
        message: `Resize aplicado a ${state.files.length} arquivo(s)`,
      },
    })

    onClose()
  }

  const presets = [
    { name: "HD", width: 1920, height: 1080 },
    { name: "4K", width: 3840, height: 2160 },
    { name: "Instagram Square", width: 1080, height: 1080 },
    { name: "Instagram Story", width: 1080, height: 1920 },
    { name: "Facebook Cover", width: 1200, height: 630 },
    { name: "Twitter Header", width: 1500, height: 500 },
  ]

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-800 rounded-xl max-w-md w-full border border-slate-700">
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <h3 className="text-xl font-semibold text-white">Resize Global</h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
            aria-label="Fechar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="space-y-4">
            <h4 className="text-white font-medium">Presets Populares</h4>
            <div className="grid grid-cols-2 gap-2">
              {presets.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() =>
                    setSettings({
                      ...settings,
                      width: preset.width,
                      height: preset.height,
                    })
                  }
                  className="px-3 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm transition-colors text-left"
                >
                  <div className="font-medium">{preset.name}</div>
                  <div className="text-xs text-slate-400">
                    {preset.width} × {preset.height}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="global-width" className="block text-sm font-medium text-slate-300 mb-1">
                Largura (px)
              </label>
              <input
                id="global-width"
                type="number"
                min="1"
                max="10000"
                value={settings.width || ""}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    width: Number.parseInt(e.target.value) || undefined,
                  })
                }
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm focus:border-purple-500 focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="global-height" className="block text-sm font-medium text-slate-300 mb-1">
                Altura (px)
              </label>
              <input
                id="global-height"
                type="number"
                min="1"
                max="10000"
                value={settings.height || ""}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    height: Number.parseInt(e.target.value) || undefined,
                  })
                }
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm focus:border-purple-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <button
              onClick={() =>
                setSettings({
                  ...settings,
                  maintainAspectRatio: !settings.maintainAspectRatio,
                })
              }
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                settings.maintainAspectRatio
                  ? "bg-purple-600 hover:bg-purple-700 text-white"
                  : "bg-slate-600 hover:bg-slate-500 text-slate-300"
              }`}
            >
              {settings.maintainAspectRatio ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
              <span>Manter proporção</span>
            </button>

            <select
              value={settings.mode}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  mode: e.target.value as "fit" | "fill",
                })
              }
              className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm focus:border-purple-500 focus:outline-none"
            >
              <option value="fit">Fit (Encaixar)</option>
              <option value="fill">Fill (Preencher)</option>
            </select>
          </div>

          <div className="text-xs text-slate-400 bg-slate-700 rounded-lg p-3">
            <p className="font-medium text-purple-400 mb-1">
              Modo selecionado: {settings.mode === "fit" ? "Fit" : "Fill"}
            </p>
            <p>
              {settings.mode === "fit"
                ? "Encaixa a imagem dentro das dimensões, mantendo proporção. Pode deixar espaços vazios."
                : "Preenche toda a área das dimensões. Pode cortar partes da imagem para manter proporção."}
            </p>
          </div>
        </div>

        <div className="flex space-x-3 p-6 border-t border-slate-700">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-slate-600 hover:bg-slate-500 text-white rounded-lg font-medium transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleApply}
            disabled={!settings.width || !settings.height || settings.width < 1 || settings.height < 1}
            className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
          >
            <Check className="w-4 h-4" />
            <span>Aplicar a Todos</span>
          </button>
        </div>
      </div>
    </div>
  )
}
