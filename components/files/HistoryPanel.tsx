"use client"

import { useImageConverter } from "@/contexts/ImageConverterContext"

export default function HistoryPanel() {
  const { state } = useImageConverter()

  if (state.history.length === 0) return null

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-white font-semibold">Últimas conversões</h3>
          <span className="text-xs text-slate-400">{state.history.length} itens</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {state.history.slice(0, 9).map((h) => (
            <div key={h.id + h.date} className="rounded-lg border border-slate-700 bg-slate-900/60 p-3">
              <div className="text-sm text-white truncate" title={h.name}>{h.name}</div>
              <div className="text-xs text-slate-400">
                {new Date(h.date).toLocaleString()} • {(h.sizeIn / 1024).toFixed(1)}KB → {(h.sizeOut || 0 / 1024).toFixed(1)}KB
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}