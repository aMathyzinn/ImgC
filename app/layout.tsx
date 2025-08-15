import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "ImgConvert - Conversor de Imagens Profissional",
  description:
    "Converta suas imagens entre diferentes formatos diretamente no navegador. Suporte para JPG, PNG, WebP, BMP e AVIF."
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
