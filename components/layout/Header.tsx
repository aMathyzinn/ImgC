"use client"

import { Moon, Sun, Github, Zap } from "lucide-react"
import { useImageConverter } from "@/contexts/ImageConverterContext"
import { useTheme } from "next-themes"

export default function Header() {
  const { state, dispatch } = useImageConverter()
  const { setTheme, resolvedTheme } = useTheme()

  const toggleTheme = () => {
    const next = state.isDarkMode ? "light" : "dark"
    dispatch({ type: "TOGGLE_DARK_MODE" })
    setTheme(next)
  }

  return (
    <header className="bg-slate-800/80 backdrop-blur border-b border-slate-700">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <img 
            src="/imgc-logo.png" 
            alt="ImgConvert Logo" 
            className="w-8 h-8 rounded-lg"
          />
          <h1 className="text-xl font-bold text-white">ImgConvert</h1>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => dispatch({ type: "TOGGLE_AUTO_QUICK" })}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors border ${state.autoQuickMode ? "bg-emerald-600/20 border-emerald-500 text-emerald-300" : "bg-slate-700 border-slate-600 text-slate-200 hover:bg-slate-600"}`}
            aria-pressed={state.autoQuickMode}
            aria-label="Auto conversão rápida"
            title="Auto conversão rápida (arrasta e já converte)"
          >
            <span className="inline-flex items-center gap-1"><Zap className="w-4 h-4" /> Auto</span>
          </button>

          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            aria-label="Alternar tema"
            aria-pressed={resolvedTheme === "dark"}
          >
            {resolvedTheme === "dark" ? (
              <Sun className="w-5 h-5 text-yellow-400 transition-transform duration-200 rotate-0" />
            ) : (
              <Moon className="w-5 h-5 text-slate-200 transition-transform duration-200" />
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
