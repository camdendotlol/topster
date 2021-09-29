import { Canvas, Image, NodeCanvasRenderingContext2D } from 'canvas'
import { Chart, ChartItem } from './topster'

export const getMaxTitleWidth = (chart: Chart) => {
  let maxTitleWidth = 0

  if (chart.showTitles) {
    for (let x = 0; x < chart.items.length; x++) {
      const item = chart.items[x]
      const name = item.creator ? `${item.creator} - ${item.title}` : item.title
        // node-canvas's measureText method is broken
        // so we need to use this weird hardcoded method
        // each pixel of 14px Ubuntu Mono is roughly 18px wide
        // this could use some improvement but it keeps the text from getting cut off
        // extremely long album titles (e.g. The Idler Wheel) get more padding than they should
      const width = name.length * 12
      if (width > maxTitleWidth) {
        maxTitleWidth = width
      }
    }
  }

  return maxTitleWidth
}

const findCenteringOffset = (dimension: number, cellSize: number) => {
  if (dimension < cellSize) {
    return Math.floor((cellSize - dimension) / 2)
  } else {
    return 0
  }
}

export const getScaledDimensions = (img: Image | HTMLImageElement, cellSize: number) => {
  let differencePercentage = 1

  if (img.width > cellSize && img.height > cellSize) {
    differencePercentage = Math.min((cellSize / img.width), (cellSize / img.height))
  } else if (img.width > cellSize) {
    differencePercentage = cellSize / img.width
  } else if (img.height > cellSize) {
    differencePercentage = cellSize / img.height
  } else if (img.width < cellSize && img.height < cellSize) {
    differencePercentage = Math.min((cellSize / img.width), (cellSize / img.height))
  }

  return {
    height: Math.floor(img.height * differencePercentage),
    width: Math.floor(img.width * differencePercentage)
  }
}

export const drawCover = (
  cover: Image | HTMLImageElement,
  coords: { x: number, y: number },
  cellSize: number,
  gap: number,
  dimensions: { height: number, width: number },
  ctx: CanvasRenderingContext2D | NodeCanvasRenderingContext2D
) => {

  ctx.drawImage(
    // Lying to TS here!
    // Node-canvas and HTML Canvas have different sets of CTX & Image types.
    // TS doesn't know we've ensured that this is always called with compatible types.
    cover as HTMLImageElement,
    ((coords.x * cellSize) + 55 + (coords.x * gap)) + findCenteringOffset(dimensions.width, cellSize),
    ((coords.y * cellSize) + 80 + (coords.y * gap)) + findCenteringOffset(dimensions.height, cellSize),
    dimensions.width,
    dimensions.height
  )
}

export const setup = (
  canvas: Canvas | HTMLCanvasElement,
  chart: Chart
) => {
  const ctx = canvas.getContext('2d')

  if (!ctx) {
    throw new Error('Missing canvas context.')
  }

  const tsCompatCtx = ctx as NodeCanvasRenderingContext2D

  tsCompatCtx.beginPath()
  tsCompatCtx.fillStyle = chart.color
  tsCompatCtx.fillRect(0, 0, canvas.width, canvas.height)

  tsCompatCtx.font = '36pt "Ubuntu Mono"'
  tsCompatCtx.fillStyle = '#e9e9e9'
  tsCompatCtx.textAlign = 'center'
  tsCompatCtx.fillText(chart.title, canvas.width / 2, 60)
  return canvas
}