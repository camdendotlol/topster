import { Canvas, Image, loadImage, registerFont } from 'canvas'
import path from 'path'

import {
  getMaxTitleWidth,
  getScaledDimensions,
  drawCover,
  setup
} from './common'

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
  showTitles: boolean,
  gap: number
}

registerFont(path.join(__dirname, 'UbuntuMono-Regular.ttf'), { family: 'Ubuntu Mono' })

const insertCoverImages = async (
  canvas: Canvas,
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

  const insertImage = async (
    item: ChartItem,
    coords: { x: number, y: number }
  ) => {
    const cover = await loadImage(item.coverURL)

    const dimensions = getScaledDimensions(cover, cellSize)

    drawCover(
      cover,
      coords,
      cellSize,
      gap,
      dimensions,
      ctx,
      chartTitleMargin
    )
  }

  const insertTitle = (item: ChartItem, index: number, coords: { x: number, y: number }, maxWidth: number) => {
    const titleString = item.creator ? `${item.creator} - ${item.title}` : item.title
    ctx.fillText(
      titleString,
      canvas.width - maxWidth + 10,
      (25 * index) + (30 + gap) + ((coords.y % (index + 1)) * 35) + chartTitleMargin
    )
  }

  for (const { item, index } of chart.items.map((item, index) => ({ item, index }))) {
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

    await insertImage(item, coords)

    if (chart.showTitles) {
      ctx.font = '16pt "Ubuntu Mono"'
      ctx.textAlign = 'left'
      insertTitle(item, index, coords, maxTitleWidth)
    }
  }
}

const generateChart = async (
  canvas: Canvas,
  chart: Chart,
): Promise<Canvas> => {
  // gap between cells (pixels)
  const gap = chart.gap
  const maxItemTitleWidth = getMaxTitleWidth(chart)

  // height/width of each square cell
  const cellSize = 260

  const chartTitleMargin = chart.title === '' ? 0 : 60

  const pixelDimensions = {
    // room for each cell + 10px gap between cells + margins
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

  await insertCoverImages(canvas, chart, cellSize, gap, maxItemTitleWidth, chartTitleMargin)

  return canvas
}

export default generateChart
