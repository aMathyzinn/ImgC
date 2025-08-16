"use client"

import { ChevronDown } from "lucide-react"
import type { ImageFormat } from "@/contexts/ImageConverterContext"

interface FormatDropdownProps {
  value: ImageFormat
  onChange: (format: ImageFormat) => void
  disabled?: boolean
}

const formats: { value: ImageFormat | "tiff" | "ico"; label: string; icon: string }[] = [
  { value: "jpeg", label: "JPG", icon: "🖼️" },
  { value: "png", label: "PNG", icon: "🖼️" },
  { value: "webp", label: "WebP", icon: "🌐" },
  { value: "bmp", label: "BMP", icon: "🖼️" },
  { value: "avif", label: "AVIF", icon: "⚡" },
  { value: "tiff", label: "TIFF", icon: "📄" },
  { value: "ico", label: "ICO", icon: "🔷" },
]

export default function FormatDropdown({ value, onChange, disabled }: FormatDropdownProps) {
  const selectedFormat = formats.find((f) => f.value === value)

  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as ImageFormat)}
        disabled={disabled}
        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm appearance-none cursor-pointer hover:border-slate-500 focus:border-blue-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {formats.map((format) => (
          <option key={format.value} value={format.value}>
            {format.icon} {format.label}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
    </div>
  )
}
