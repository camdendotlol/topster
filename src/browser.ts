import {
  getMaxTitleWidth,
  getScaledDimensions,
  drawCover,
  setup
} from "./common"

export interface ChartItem {
  title: string,
  creator?: string,
  coverImg: HTMLImageElement,
  coverURL: string
}

export interface ChartSize {
  x: number,
  y: number
}

export interface Chart {
  title: string,
  items: ChartItem[],
  size: ChartSize,
  color: string,
  showTitles: boolean
}

const generateChart = (blankCanvas: HTMLCanvasElement, chart: Chart): HTMLCanvasElement => {
  const canvas = setup(blankCanvas, chart) as HTMLCanvasElement
  const ctx = canvas.getContext('2d')

  if (!ctx) {
    throw new Error('Missing canvas context.')
  }

  const maxTitleWidth = getMaxTitleWidth(chart)

  // gap between cells (pixels)
  const gap = 10

  const pixelDimensions = {
    // room for each cell + 10px gap between cells + margins
    x: (chart.size.x * (260 + gap)) + 100 + maxTitleWidth,
    y: (chart.size.y * (260 + gap)) + 160
  }

  canvas.width = pixelDimensions.x
  canvas.height = pixelDimensions.y

  if (!ctx) {
    throw new Error('Canvas ctx not found')
  }

  ctx.beginPath()
  ctx.fillStyle = chart.color
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  ctx.font = '36pt "Ubuntu Mono"'
  ctx.fillStyle = '#e9e9e9'
  ctx.textAlign = 'center'
  ctx.fillText(chart.title, canvas.width / 2, 60)

  ctx.fillStyle = ('#e9e9e9')

  // height/width of each square cell
  const cellSize = 260
  insertCoverImages(canvas, chart, cellSize, gap, maxTitleWidth)

  return canvas
}

const insertCoverImages = (
  canvas: HTMLCanvasElement,
  chart: Chart,
  cellSize: number,
  gap: number,
  maxTitleWidth: number
) => {
  const ctx = canvas.getContext('2d')

  if (!ctx) {
    throw new Error('Canvas ctx not found')
  }

  const insertTitle = (item: ChartItem, index: number, coords: { x: number, y: number }, maxWidth: number) => {
    const titleString = item.creator ? `${item.creator} - ${item.title}` : item.title
    ctx.fillText(
      titleString,
      canvas.width - maxWidth,
      (25 * index) + 110 + ((coords.y % (index + 1)) * 50)
    )
  }

  chart.items.forEach((item: ChartItem, index: number) => {
    // Don't overflow outside the bounds of the chart
    // This way, items will be saved if the chart is too big for them
    // and the user can just expand the chart and they'll fill in again
    if (index + 1 > chart.size.x * chart.size.y) {
      return null
    }

    const coords = {
      x: index % chart.size.x,
      y: Math.floor(index / chart.size.x)
    }

    insertImage(item, coords, cellSize, gap, ctx)
    if (chart.showTitles) {
      ctx.font = '16pt "Ubuntu Mono"'
      ctx.textAlign = 'left'
      insertTitle(item, index, coords, maxTitleWidth)
    }
  })
}

const insertImage = (
  item: ChartItem,
  coords: { x: number, y: number },
  cellSize: number,
  gap: number,
  ctx: CanvasRenderingContext2D
) => {
  const dimensions = getScaledDimensions(item.coverImg, cellSize)

  drawCover(
    item.coverImg,
    coords,
    cellSize,
    gap,
    dimensions,
    ctx
  )
}

export default generateChart
