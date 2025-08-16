"use client"

import type React from "react"

import { createContext, useContext, useReducer, type ReactNode, useEffect } from "react"
import { get, set } from "idb-keyval"

export type ImageFormat = "jpeg" | "png" | "webp" | "bmp" | "avif" | "tiff" | "ico"
export type ConversionStatus = "pending" | "converting" | "completed" | "error"
export type ResizeMode = "fit" | "fill"

export interface ResizeSettings {
  width?: number
  height?: number
  maintainAspectRatio: boolean
  mode: ResizeMode
  enabled: boolean
}

export interface ConversionOptions {
  qualityPreset: "high" | "medium" | "low"
  outputScale: "original" | "half" | "custom"
  customScalePercent?: number
}

export interface HistoryItem {
  id: string
  name: string
  from: string
  to: string
  sizeIn: number
  sizeOut?: number
  date: number
}

export interface ImageFile {
  id: string
  file: File
  preview: string
  targetFormat: ImageFormat
  status: ConversionStatus
  progress: number
  convertedBlob?: Blob
  error?: string
  resizeSettings: ResizeSettings
  resizedBlob?: Blob
  originalDimensions?: { width: number; height: number }
  options: ConversionOptions
}

interface State {
  files: ImageFile[]
  isConverting: boolean
  globalProgress: number
  toasts: { id: string; type: "success" | "error" | "info"; message: string }[]
  isDarkMode: boolean
  history: HistoryItem[]
  renamePattern: string | null
  autoQuickMode: boolean
}

type Action =
  | { type: "ADD_FILES"; payload: File[] }
  | { type: "REMOVE_FILE"; payload: string }
  | { type: "CLEAR_ALL" }
  | { type: "UPDATE_TARGET_FORMAT"; payload: { id: string; format: ImageFormat } }
  | { type: "UPDATE_RESIZE_SETTINGS"; payload: { id: string; settings: Partial<ResizeSettings> } }
  | { type: "SET_GLOBAL_RESIZE_SETTINGS"; payload: ResizeSettings }
  | { type: "START_RESIZE"; payload: string }
  | { type: "COMPLETE_RESIZE"; payload: { id: string; blob: Blob } }
  | { type: "ERROR_RESIZE"; payload: { id: string; error: string } }
  | { type: "SET_ORIGINAL_DIMENSIONS"; payload: { id: string; dimensions: { width: number; height: number } } }
  | { type: "START_CONVERSION"; payload: string }
  | { type: "UPDATE_PROGRESS"; payload: { id: string; progress: number } }
  | { type: "COMPLETE_CONVERSION"; payload: { id: string; blob: Blob } }
  | { type: "ERROR_CONVERSION"; payload: { id: string; error: string } }
  | { type: "SET_GLOBAL_CONVERTING"; payload: boolean }
  | { type: "SET_GLOBAL_PROGRESS"; payload: number }
  | { type: "ADD_TOAST"; payload: Omit<{ id: string; type: "success" | "error" | "info"; message: string }, "id"> }
  | { type: "REMOVE_TOAST"; payload: string }
  | { type: "TOGGLE_DARK_MODE" }
  | { type: "SET_OPTIONS"; payload: { id: string; options: Partial<ConversionOptions> } }
  | { type: "ADD_HISTORY"; payload: HistoryItem }
  | { type: "SET_HISTORY"; payload: HistoryItem[] }
  | { type: "SET_RENAME_PATTERN"; payload: string | null }
  | { type: "TOGGLE_AUTO_QUICK"; payload: boolean }

const initialState: State = {
  files: [],
  isConverting: false,
  globalProgress: 0,
  toasts: [],
  isDarkMode: true,
  history: [],
  renamePattern: null,
  autoQuickMode: false,
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "ADD_FILES":
      const newFiles = action.payload.map((file) => ({
        id: Math.random().toString(36).substr(2, 9),
        file,
        preview: URL.createObjectURL(file),
        targetFormat: "webp" as ImageFormat,
        status: "pending" as ConversionStatus,
        progress: 0,
        resizeSettings: {
          maintainAspectRatio: true,
          mode: "fit" as ResizeMode,
          enabled: false,
        },
        options: {
          qualityPreset: "high",
          outputScale: "original",
        },
      }))
      return { ...state, files: [...state.files, ...newFiles] }

    case "REMOVE_FILE":
      const fileToRemove = state.files.find((f) => f.id === action.payload)
      if (fileToRemove) {
        URL.revokeObjectURL(fileToRemove.preview)
      }
      return {
        ...state,
        files: state.files.filter((f) => f.id !== action.payload),
      }

    case "CLEAR_ALL":
      state.files.forEach((file) => URL.revokeObjectURL(file.preview))
      return { ...state, files: [] }

    case "UPDATE_TARGET_FORMAT":
      return {
        ...state,
        files: state.files.map((file) =>
          file.id === action.payload.id ? { ...file, targetFormat: action.payload.format, status: "pending" } : file,
        ),
      }

    case "UPDATE_RESIZE_SETTINGS":
      return {
        ...state,
        files: state.files.map((file) =>
          file.id === action.payload.id
            ? { ...file, resizeSettings: { ...file.resizeSettings, ...action.payload.settings }, status: "pending" }
            : file,
        ),
      }

    case "SET_GLOBAL_RESIZE_SETTINGS":
      return {
        ...state,
        files: state.files.map((file) => ({
          ...file,
          resizeSettings: { ...action.payload },
          status: "pending",
        })),
      }

    case "START_RESIZE":
      return {
        ...state,
        files: state.files.map((file) =>
          file.id === action.payload ? { ...file, status: "converting", progress: 0 } : file,
        ),
      }

    case "COMPLETE_RESIZE":
      return {
        ...state,
        files: state.files.map((file) =>
          file.id === action.payload.id ? { ...file, resizedBlob: action.payload.blob, progress: 50 } : file,
        ),
      }

    case "ERROR_RESIZE":
      return {
        ...state,
        files: state.files.map((file) =>
          file.id === action.payload.id ? { ...file, status: "error", error: action.payload.error } : file,
        ),
      }

    case "SET_ORIGINAL_DIMENSIONS":
      return {
        ...state,
        files: state.files.map((file) =>
          file.id === action.payload.id ? { ...file, originalDimensions: action.payload.dimensions } : file,
        ),
      }

    case "START_CONVERSION":
      return {
        ...state,
        files: state.files.map((file) =>
          file.id === action.payload ? { ...file, status: "converting", progress: 0 } : file,
        ),
      }

    case "UPDATE_PROGRESS":
      return {
        ...state,
        files: state.files.map((file) =>
          file.id === action.payload.id ? { ...file, progress: action.payload.progress } : file,
        ),
      }

    case "COMPLETE_CONVERSION":
      return {
        ...state,
        files: state.files.map((file) =>
          file.id === action.payload.id
            ? { ...file, status: "completed", progress: 100, convertedBlob: action.payload.blob }
            : file,
        ),
      }

    case "ERROR_CONVERSION":
      return {
        ...state,
        files: state.files.map((file) =>
          file.id === action.payload.id ? { ...file, status: "error", error: action.payload.error } : file,
        ),
      }

    case "SET_GLOBAL_CONVERTING":
      return { ...state, isConverting: action.payload }

    case "SET_GLOBAL_PROGRESS":
      return { ...state, globalProgress: action.payload }

    case "ADD_TOAST":
      const toast = { ...action.payload, id: Math.random().toString(36).substr(2, 9) }
      return { ...state, toasts: [...state.toasts, toast] }

    case "REMOVE_TOAST":
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.payload),
      }

    case "TOGGLE_DARK_MODE":
      return { ...state, isDarkMode: !state.isDarkMode }

    case "SET_OPTIONS":
      return {
        ...state,
        files: state.files.map((file) =>
          file.id === action.payload.id ? { ...file, options: { ...file.options, ...action.payload.options } } : file,
        ),
      }

    case "ADD_HISTORY":
      return { ...state, history: [action.payload, ...state.history].slice(0, 50) }

    case "SET_HISTORY":
      return { ...state, history: action.payload }

    case "SET_RENAME_PATTERN":
      return { ...state, renamePattern: action.payload }

    case "TOGGLE_AUTO_QUICK":
      return { ...state, autoQuickMode: !state.autoQuickMode }

    default:
      return state
  }
}

const ImageConverterContext = createContext<{
  state: State
  dispatch: React.Dispatch<Action>
} | null>(null)

export function ImageConverterProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  useEffect(() => {
    get("imgc_history").then((h) => {
      if (Array.isArray(h)) dispatch({ type: "SET_HISTORY", payload: h as HistoryItem[] })
    })
    get("imgc_rename").then((p) => {
      if (typeof p === "string") dispatch({ type: "SET_RENAME_PATTERN", payload: p })
    })
  }, [])

  useEffect(() => {
    void set("imgc_history", state.history)
  }, [state.history])

  useEffect(() => {
    void set("imgc_rename", state.renamePattern)
  }, [state.renamePattern])

  return <ImageConverterContext.Provider value={{ state, dispatch }}>{children}</ImageConverterContext.Provider>
}

export function useImageConverter() {
  const context = useContext(ImageConverterContext)
  if (!context) {
    throw new Error("useImageConverter must be used within ImageConverterProvider")
  }
  return context
}
