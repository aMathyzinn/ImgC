"use client"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

export interface Toast {
  id: string
  type: "success" | "error" | "info"
  message: string
}

interface ToastProps {
  toast: Toast
  onClose: (id: string) => void
}

export function Toast({ toast, onClose }: ToastProps) {
  const getIcon = (type: string) => {
    switch (type) {
      case "success":
        return "✓"
      case "error":
        return "✕"
      case "info":
        return "ℹ"
      default:
        return ""
    }
  }

  const getBackgroundColor = (type: string) => {
    switch (type) {
      case "success":
        return "bg-green-900/90 border-green-700"
      case "error":
        return "bg-red-900/90 border-red-700"
      case "info":
        return "bg-blue-900/90 border-blue-700"
      default:
        return "bg-slate-800/90 border-slate-700"
    }
  }

  return (
    <div className={cn("border rounded-lg p-4 max-w-sm shadow-lg backdrop-blur-sm", getBackgroundColor(toast.type))}>
      <div className="flex items-start space-x-3">
        <span className="text-lg">{getIcon(toast.type)}</span>
        <div className="flex-1">
          <p className="text-white text-sm font-medium">{toast.message}</p>
        </div>
        <button onClick={() => onClose(toast.id)} className="text-slate-400 hover:text-white transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
