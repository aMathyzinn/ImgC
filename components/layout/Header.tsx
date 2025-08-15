"use client"

import { Moon, Sun, Github } from "lucide-react"
import { useImageConverter } from "@/contexts/ImageConverterContext"

export default function Header() {
  const { state, dispatch } = useImageConverter()

  return (
    <header className="bg-slate-800 border-b border-slate-700">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <img 
            src="/imgc-logo.png" 
            alt="ImgConvert Logo" 
            className="w-8 h-8 rounded-lg"
          />
          <h1 className="text-xl font-bold text-white">ImgConvert</h1>
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={() => dispatch({ type: "TOGGLE_DARK_MODE" })}
            className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 transition-colors"
            aria-label="Toggle dark mode"
          >
            {state.isDarkMode ? (
              <Sun className="w-5 h-5 text-yellow-400" />
            ) : (
              <Moon className="w-5 h-5 text-slate-400" />
            )}
          </button>

          <a
            href="https://github.com/aMathyzin"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 transition-colors text-white"
          >
            <Github className="w-4 h-4" />
            <span className="hidden sm:inline">GitHub</span>
          </a>
        </div>
      </div>
    </header>
  )
}
