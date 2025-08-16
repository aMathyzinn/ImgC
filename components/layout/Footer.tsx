export default function Footer() {
  return (
    <footer className="bg-slate-900/80 backdrop-blur border-t border-slate-800 py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center gap-4">
          <p className="text-slate-400 text-sm">Feito com ❤️ em Next.js</p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-2xl">
            <a
              href="#"
              className="rounded-xl border border-slate-700 bg-slate-800/60 hover:bg-slate-800 text-slate-200 text-sm px-4 py-3 transition-colors text-center"
            >
              Sobre
            </a>
            <a
              href="#"
              className="rounded-xl border border-slate-700 bg-slate-800/60 hover:bg-slate-800 text-slate-200 text-sm px-4 py-3 transition-colors text-center"
            >
              Licença
            </a>
            <a
              href="https://github.com/aMathyzin/ImgC"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl border border-slate-700 bg-slate-800/60 hover:bg-slate-800 text-slate-200 text-sm px-4 py-3 transition-colors text-center"
            >
              GitHub
            </a>
            <a
              href="#"
              className="rounded-xl border border-slate-700 bg-slate-800/60 hover:bg-slate-800 text-slate-200 text-sm px-4 py-3 transition-colors text-center"
            >
              Política
            </a>
          </div>

          <div className="flex flex-wrap justify-center gap-2 mt-2">
            <span className="px-2 py-1 text-xs bg-slate-800/60 border border-slate-700 rounded-full text-slate-300">PWA-ready</span>
            <span className="px-2 py-1 text-xs bg-slate-800/60 border border-slate-700 rounded-full text-slate-300">Offline-first</span>
            <span className="px-2 py-1 text-xs bg-slate-800/60 border border-slate-700 rounded-full text-slate-300">100% local</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
