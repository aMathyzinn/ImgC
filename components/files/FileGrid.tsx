"use client"

import { useImageConverter } from "@/contexts/ImageConverterContext"
import FileCard from "./FileCard"

export default function FileGrid() {
  const { state, dispatch } = useImageConverter()

  if (state.files.length === 0) {
    return null
  }

  const completed = state.files.filter((f) => f.status === "completed").length

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <h2 className="text-2xl font-semibold text-white">Arquivos Selecionados ({state.files.length})</h2>
        <div className="flex items-center gap-2">
          <span className="text-xs px-2 py-1 rounded-full border border-slate-600 bg-slate-700 text-slate-200">Concluídos: {completed}</span>
          <label className="text-xs text-slate-300">Padrão de nome: </label>
          <input
            placeholder="ex: img_{n} (usa {name} e {n})"
            value={state.renamePattern || ""}
            onChange={(e) => dispatch({ type: "SET_RENAME_PATTERN", payload: e.target.value })}
            className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-xs w-64"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {state.files.map((file) => (
          <FileCard key={file.id} file={file} />
        ))}
      </div>
    </div>
  )
}
