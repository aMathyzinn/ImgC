export default function Footer() {
  return (
    <footer className="bg-slate-800 border-t border-slate-700 py-6">
      <div className="container mx-auto px-4 text-center">
        <p className="text-slate-400 text-sm">Feito com ❤️ em Next.js</p>
        <div className="flex justify-center space-x-6 mt-2">
          <a href="#" className="text-slate-400 hover:text-white text-sm transition-colors">
            Sobre
          </a>
          <a href="#" className="text-slate-400 hover:text-white text-sm transition-colors">
            Licença
          </a>
        </div>
      </div>
    </footer>
  )
}
