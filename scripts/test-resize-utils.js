// Testes unitários para as funções de redimensionamento
import {
  calculateDimensions,
  calculateFitDimensions,
  calculateFillDimensions,
  validateDimensions,
} from "../utils/resizeUtils.js"

console.log("🧪 Executando testes das funções de redimensionamento...\n")

// Teste 1: calculateDimensions - manter aspect ratio
console.log("Teste 1: calculateDimensions")
const original = { width: 1920, height: 1080 }

const result1 = calculateDimensions(original, { width: 960 })
console.log(`Original: 1920x1080, Target width: 960 → ${result1.width}x${result1.height}`)
console.assert(result1.width === 960 && result1.height === 540, "Falha no cálculo por largura")

const result2 = calculateDimensions(original, { height: 540 })
console.log(`Original: 1920x1080, Target height: 540 → ${result2.width}x${result2.height}`)
console.assert(result2.width === 960 && result2.height === 540, "Falha no cálculo por altura")

// Teste 2: calculateFitDimensions
console.log("\nTeste 2: calculateFitDimensions")
const container = { width: 800, height: 600 }

const fitResult1 = calculateFitDimensions(original, container)
console.log(`Original: 1920x1080, Container: 800x600 → Fit: ${fitResult1.width}x${fitResult1.height}`)

const tallImage = { width: 600, height: 1200 }
const fitResult2 = calculateFitDimensions(tallImage, container)
console.log(`Original: 600x1200, Container: 800x600 → Fit: ${fitResult2.width}x${fitResult2.height}`)

// Teste 3: calculateFillDimensions
console.log("\nTeste 3: calculateFillDimensions")
const fillResult1 = calculateFillDimensions(original, container)
console.log(`Original: 1920x1080, Container: 800x600 → Fill: ${fillResult1.width}x${fillResult1.height}`)

const fillResult2 = calculateFillDimensions(tallImage, container)
console.log(`Original: 600x1200, Container: 800x600 → Fill: ${fillResult2.width}x${fillResult2.height}`)

// Teste 4: validateDimensions
console.log("\nTeste 4: validateDimensions")
console.log(`Válido (800x600): ${validateDimensions({ width: 800, height: 600 })}`)
console.log(`Inválido (0x600): ${validateDimensions({ width: 0, height: 600 })}`)
console.log(`Inválido (800x15000): ${validateDimensions({ width: 800, height: 15000 })}`)

console.log("\n✅ Todos os testes concluídos!")
