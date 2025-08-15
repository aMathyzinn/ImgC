"use client"

import type React from "react"

import { useCallback, useState } from "react"
import { Upload, ImageIcon } from "lucide-react"
import { useImageConverter } from "@/contexts/ImageConverterContext"

const ACCEPTED_TYPES = ["image/png", "image/jpeg", "image/webp", "image/bmp", "image/avif"]

export default function UploadArea() {
  const { dispatch } = useImageConverter()
  const [isDragOver, setIsDragOver] = useState(false)

  const handleFiles = useCallback(
    (files: FileList) => {
      const validFiles = Array.from(files).filter((file) => {
        if (!ACCEPTED_TYPES.includes(file.type)) {
          dispatch({
            type: "ADD_TOAST",
            payload: {
              type: "error",
              message: `Formato não suportado: ${file.name}`,
            },
          })
          return false
        }
        return true
      })

      if (validFiles.length > 0) {
        dispatch({ type: "ADD_FILES", payload: validFiles })
        dispatch({
          type: "ADD_TOAST",
          payload: {
            type: "success",
            message: `${validFiles.length} arquivo(s) adicionado(s)`,
          },
        })
      }
    },
    [dispatch],
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragOver(false)
      handleFiles(e.dataTransfer.files)
    },
    [handleFiles],
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        handleFiles(e.target.files)
      }
    },
    [handleFiles],
  )

  return (
    <div
      className={`
        relative border-2 border-dashed rounded-xl p-12 text-center transition-all duration-200
        ${isDragOver ? "border-blue-400 bg-blue-500/10" : "border-slate-600 hover:border-blue-500"}
      `}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      <input
        type="file"
        multiple
        accept={ACCEPTED_TYPES.join(",")}
        onChange={handleFileInput}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        aria-label="Selecionar arquivos de imagem"
      />

      <div className="space-y-4">
        <div className="flex justify-center">
          <div className="p-4 bg-blue-500/20 rounded-full">
            {isDragOver ? (
              <Upload className="w-12 h-12 text-blue-400" />
            ) : (
              <ImageIcon className="w-12 h-12 text-blue-400" />
            )}
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold text-white mb-2">
            {isDragOver ? "Solte suas imagens aqui" : "Arraste suas imagens aqui"}
          </h3>
          <p className="text-slate-400 mb-4">ou clique para selecionar arquivos</p>
        </div>

        <button
          type="button"
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors shadow-lg hover:shadow-xl"
        >
          Selecionar Arquivos
        </button>

        <p className="text-xs text-slate-500">Suporte para JPG, PNG, WebP, BMP e AVIF</p>
      </div>
    </div>
  )
}
