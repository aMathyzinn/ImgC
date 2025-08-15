"use client"

import { useImageConverter } from "@/contexts/ImageConverterContext"
import FileCard from "./FileCard"

export default function FileGrid() {
  const { state } = useImageConverter()

  if (state.files.length === 0) {
    return null
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold text-white">Arquivos Selecionados ({state.files.length})</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {state.files.map((file) => (
          <FileCard key={file.id} file={file} />
        ))}
      </div>
    </div>
  )
}
