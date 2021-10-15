import {
  getMaxTitleWidth,
  getScaledDimensions,
  drawCover,
  setup
} from './common'
import { Chart, ChartItem } from './common'

const generateChart = (canvas: HTMLCanvasElement, chart: Chart): HTMLCanvasElement => {
  // gap between cells (pixels)
  const gap = chart.gap
  const maxItemTitleWidth = getMaxTitleWidth(chart)

  // height/width of each square cell
  const cellSize = 260

  const chartTitleMargin = chart.title === '' ? 0 : 60

  const pixelDimensions = {
    // room for each cell + gap between cells + margins
    x: (chart.size.x * (cellSize + gap)) + gap + maxItemTitleWidth,
    y: (chart.size.y * (cellSize + gap)) + gap + chartTitleMargin
  }

  canvas.width = pixelDimensions.x
  canvas.height = pixelDimensions.y

  setup(canvas, chart)

  const ctx = canvas.getContext('2d')

  if (!ctx) {
    throw new Error('Missing canvas context.')
  }

  ctx.fillStyle = ('#e9e9e9')

  insertCoverImages(canvas, chart, cellSize, gap, maxItemTitleWidth, chartTitleMargin)

  return canvas
}

const insertCoverImages = (
  canvas: HTMLCanvasElement,
  chart: Chart,
  cellSize: number,
  gap: number,
  maxTitleWidth: number,
  chartTitleMargin: number
) => {
  const ctx = canvas.getContext('2d')

  if (!ctx) {
    throw new Error('Canvas ctx not found')
  }

  const insertTitle = (item: ChartItem, index: number, coords: { x: number, y: number }, maxWidth: number) => {
    const titleString = item.creator ? `${item.creator} - ${item.title}` : item.title
    ctx.fillText(
      titleString,
      canvas.width - maxWidth + 10,
      (25 * index) + (30 + gap) + ((coords.y % (index + 1)) * 35) + chartTitleMargin
    )
  }

  chart.items.forEach((item: ChartItem | null, index: number) => {
    if (!item) {
      return null
    }

    // Don't overflow outside the bounds of the chart
    // This way, items will be saved if the chart is too big for them
    // and the user can just expand the chart and they'll fill in again
    if (index + 1 > chart.size.x * chart.size.y) {
      return null
    }

    const coords = {
      x: (index % chart.size.x),
      y: Math.floor(index / chart.size.x)
    }

    insertImage(item, coords, cellSize, gap, ctx, chartTitleMargin)
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
  ctx: CanvasRenderingContext2D,
  chartTitleMargin: number
) => {
  const dimensions = getScaledDimensions(item.coverImg, cellSize)

  drawCover(
    item.coverImg,
    coords,
    cellSize,
    gap,
    dimensions,
    ctx,
    chartTitleMargin
  )
}

export default generateChart
