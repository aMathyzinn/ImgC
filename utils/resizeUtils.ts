export interface Dimensions {
  width: number
  height: number
}

export interface PartialDimensions {
  width?: number
  height?: number
}

export function calculateDimensions(original: Dimensions, target: PartialDimensions): Dimensions {
  const aspectRatio = original.width / original.height

  if (target.width && target.height) {
    return { width: target.width, height: target.height }
  }

  if (target.width) {
    return {
      width: target.width,
      height: Math.round(target.width / aspectRatio),
    }
  }

  if (target.height) {
    return {
      width: Math.round(target.height * aspectRatio),
      height: target.height,
    }
  }

  return original
}

export function calculateFitDimensions(original: Dimensions, container: Dimensions): Dimensions {
  const originalRatio = original.width / original.height
  const containerRatio = container.width / container.height

  if (originalRatio > containerRatio) {
    // Imagem é mais larga, ajustar pela largura
    return {
      width: container.width,
      height: Math.round(container.width / originalRatio),
    }
  } else {
    // Imagem é mais alta, ajustar pela altura
    return {
      width: Math.round(container.height * originalRatio),
      height: container.height,
    }
  }
}

export function calculateFillDimensions(original: Dimensions, container: Dimensions): Dimensions {
  const originalRatio = original.width / original.height
  const containerRatio = container.width / container.height

  if (originalRatio > containerRatio) {
    // Imagem é mais larga, ajustar pela altura
    return {
      width: Math.round(container.height * originalRatio),
      height: container.height,
    }
  } else {
    // Imagem é mais alta, ajustar pela largura
    return {
      width: container.width,
      height: Math.round(container.width / originalRatio),
    }
  }
}

export function validateDimensions(dimensions: PartialDimensions): boolean {
  if (dimensions.width && (dimensions.width < 1 || dimensions.width > 10000)) {
    return false
  }
  if (dimensions.height && (dimensions.height < 1 || dimensions.height > 10000)) {
    return false
  }
  return true
}
