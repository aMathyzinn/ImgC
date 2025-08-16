import type { ImageFormat, ResizeSettings } from "@/contexts/ImageConverterContext"
import { calculateFitDimensions, calculateFillDimensions, type Dimensions } from "./resizeUtils"
import JSZip from "jszip"

function getMimeAndQuality(format: ImageFormat, qualityPreset?: "high" | "medium" | "low") {
  const mime =
    format === "jpeg"
      ? "image/jpeg"
      : format === "png"
      ? "image/png"
      : format === "webp"
      ? "image/webp"
      : format === "avif"
      ? "image/avif"
      : format === "bmp"
      ? "image/bmp"
      : // Canvas doesn't natively support TIFF/ICO export, fallback to PNG
        "image/png"

  let quality: number | undefined
  if (mime === "image/jpeg" || mime === "image/webp" || mime === "image/avif") {
    quality = qualityPreset === "low" ? 0.6 : qualityPreset === "medium" ? 0.8 : 0.92
  }
  return { mime, quality }
}

export async function convertImage(
  source: File | Blob,
  targetFormat: ImageFormat,
  onProgress?: (progress: number) => void,
  qualityPreset?: "high" | "medium" | "low",
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = "anonymous"

    img.onload = () => {
      try {
        const canvas = document.createElement("canvas")
        const ctx = canvas.getContext("2d")

        if (!ctx) {
          reject(new Error("Não foi possível criar contexto do canvas"))
          return
        }

        canvas.width = img.width
        canvas.height = img.height

        onProgress?.(25)
        ctx.drawImage(img, 0, 0)
        onProgress?.(50)

        const { mime, quality } = getMimeAndQuality(targetFormat, qualityPreset)

        onProgress?.(75)

        canvas.toBlob(
          (blob) => {
            if (blob) {
              onProgress?.(100)
              resolve(blob)
            } else {
              reject(new Error("Falha na conversão da imagem"))
            }
          },
          mime,
          quality,
        )
      } catch (error) {
        reject(error)
      }
    }

    img.onerror = () => {
      reject(new Error("Erro ao carregar a imagem"))
    }

    img.src = URL.createObjectURL(source)
  })
}

export async function resizeImage(
  file: File | Blob,
  settings: ResizeSettings,
  onProgress?: (progress: number) => void,
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = "anonymous"

    img.onload = () => {
      try {
        if (!settings.width || !settings.height) {
          reject(new Error("Dimensões de destino não especificadas"))
          return
        }

        const canvas = document.createElement("canvas")
        const ctx = canvas.getContext("2d")

        if (!ctx) {
          reject(new Error("Não foi possível criar contexto do canvas"))
          return
        }

        onProgress?.(25)

        const original: Dimensions = { width: img.width, height: img.height }
        const target: Dimensions = { width: settings.width, height: settings.height }

        // Configurar canvas com dimensões alvo
        canvas.width = target.width
        canvas.height = target.height

        onProgress?.(50)

        if (settings.mode === "fit") {
          // Modo Fit: encaixar dentro da área
          const fitDimensions = calculateFitDimensions(original, target)
          const offsetX = (target.width - fitDimensions.width) / 2
          const offsetY = (target.height - fitDimensions.height) / 2

          // Preencher fundo com transparente
          ;(ctx as CanvasRenderingContext2D).clearRect(0, 0, canvas.width, canvas.height)

          // Desenhar imagem centralizada
          ;(ctx as CanvasRenderingContext2D).drawImage(img, offsetX, offsetY, fitDimensions.width, fitDimensions.height)
        } else {
          // Modo Fill: preencher toda a área
          const fillDimensions = calculateFillDimensions(original, target)
          const offsetX = (target.width - fillDimensions.width) / 2
          const offsetY = (target.height - fillDimensions.height) / 2

          // Desenhar imagem (pode ser cortada)
          ;(ctx as CanvasRenderingContext2D).drawImage(img, offsetX, offsetY, fillDimensions.width, fillDimensions.height)
        }

        onProgress?.(75)

        // Converter para blob mantendo qualidade
        canvas.toBlob(
          (blob) => {
            if (blob) {
              onProgress?.(100)
              resolve(blob)
            } else {
              reject(new Error("Falha no redimensionamento da imagem"))
            }
          },
          file instanceof File ? file.type : "image/png",
          0.95, // Alta qualidade
        )
      } catch (error) {
        reject(error)
      }
    }

    img.onerror = () => {
      reject(new Error("Erro ao carregar a imagem para redimensionamento"))
    }

    img.src = URL.createObjectURL(file)
  })
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export async function zipAndDownload(files: { blob: Blob; filename: string }[], zipName = "convertidos.zip") {
  const zip = new JSZip()
  files.forEach(({ blob, filename }) => {
    zip.file(filename, blob)
  })
  const content = await zip.generateAsync({ type: "blob" })
  downloadBlob(content, zipName)
}
