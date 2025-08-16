"use client"

import type React from "react"

import { useCallback, useRef, useState, useEffect } from "react"
import { Upload, ImageIcon } from "lucide-react"
import { useImageConverter } from "@/contexts/ImageConverterContext"

const ACCEPTED_TYPES = ["image/png", "image/jpeg", "image/webp", "image/bmp", "image/avif"]

export default function UploadArea() {
  const { dispatch } = useImageConverter()
  const [isDragOver, setIsDragOver] = useState(false)
  const [isHovering, setIsHovering] = useState(false)
  const inputRef = useRef<HTMLInputElement | null>(null)

  const handleFiles = useCallback(
    (files: FileList | File[]) => {
      const fileList = Array.from(files as FileList)
      const validFiles = fileList.filter((file) => {
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
      if (e.dataTransfer?.files?.length) handleFiles(e.dataTransfer.files)
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
        e.target.value = ""
      }
    },
    [handleFiles],
  )

  // Paste from clipboard support
  useEffect(() => {
    const onPaste = async (e: ClipboardEvent) => {
      const items = e.clipboardData?.items
      if (!items) return
      const files: File[] = []
      for (const item of items) {
        if (item.type.startsWith("image/")) {
          const file = item.getAsFile()
          if (file) files.push(file)
        }
      }
      if (files.length) handleFiles(files)
    }
    window.addEventListener("paste", onPaste as any)
    return () => window.removeEventListener("paste", onPaste as any)
  }, [handleFiles])

  return (
    <div
      className={`relative rounded-2xl p-12 text-center transition-all duration-300 focus-within:ring-2 focus-within:ring-blue-500/50 group overflow-hidden
        border border-slate-600/60 bg-slate-800/60 backdrop-blur-xl
        ${isDragOver ? "ring-2 ring-blue-400/60 shadow-[0_0_0_4px_rgba(96,165,250,0.15)]" : "hover:border-blue-500/60"}
      `}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      aria-label="Área de upload por arrastar e soltar"
      role="region"
    >
      {/* Animated gradient blob */}
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-0 opacity-30 transition-opacity duration-300 ${
          isDragOver ? "opacity-60" : "opacity-30"
        }`}
        style={{
          background:
            "radial-gradient(600px circle at 0% 0%, rgba(59,130,246,0.25), transparent 40%), radial-gradient(600px circle at 100% 0%, rgba(168,85,247,0.25), transparent 40%), radial-gradient(800px circle at 50% 100%, rgba(34,197,94,0.2), transparent 40%)",
        }}
      />

      <input
        ref={inputRef}
        type="file"
        multiple
        accept={ACCEPTED_TYPES.join(",")}
        onChange={handleFileInput}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        aria-label="Selecionar arquivos de imagem"
      />

      <div className="relative space-y-5">
        <div className="flex justify-center">
          <div
            className={`p-5 rounded-full transition-all duration-300 ${
              isDragOver ? "bg-blue-500/30 scale-110" : "bg-blue-500/20"
            } shadow-inner`}
          >
            {isDragOver ? (
              <Upload className="w-12 h-12 text-blue-300 animate-bounce" />
            ) : (
              <ImageIcon className="w-12 h-12 text-blue-300" />
            )}
          </div>
        </div>

        <div>
          <h3 className="text-2xl font-extrabold tracking-tight text-white mb-2">
            {isDragOver ? "Solte suas imagens aqui" : "Arraste suas imagens aqui"}
          </h3>
          <p className="text-slate-300/80 mb-5">ou clique para selecionar arquivos</p>
        </div>

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault()
            setIsHovering(true)
          }}
          onDragLeave={() => setIsHovering(false)}
          onDrop={(e) => {
            e.preventDefault()
            setIsHovering(false)
            if (e.dataTransfer?.files?.length) handleFiles(e.dataTransfer.files)
          }}
          className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 shadow-lg inline-flex items-center justify-center gap-2
            ${isHovering ? "bg-blue-500 text-white scale-[1.02]" : "bg-blue-600 hover:bg-blue-700 text-white"}
            focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500 ring-offset-slate-900`}
          aria-label="Selecionar arquivos para upload"
        >
          <Upload className="w-4 h-4" />
          Selecionar Arquivos
        </button>

        <p className="text-xs text-slate-400">Suporte para JPG, PNG, WebP, BMP e AVIF</p>
      </div>
    </div>
  )
}
