import { Canvas, loadImage, registerFont } from 'canvas'
import path from 'path'

import {
  getScaledDimensions,
  drawCover,
  setup,
  NodeChart,
  NodeChartItem,
  drawTitle,
  drawBackground
} from './common'

registerFont(path.join(__dirname, 'UbuntuMono-Regular.ttf'), { family: 'Ubuntu Mono' })

const generateChart = async (
  canvas: Canvas,
  chart: NodeChart,
): Promise<Canvas> => {
  const canvasInfo = setup(canvas, chart)

  await drawBackground(canvas, chart)

  drawTitle(canvas, chart)

  await insertCoverImages(
    canvas,
    chart,
    canvasInfo.cellSize,
    chart.gap,
    canvasInfo.maxItemTitleWidth,
    canvasInfo.chartTitleMargin
  )

  return canvas
}

const insertCoverImages = async (
  canvas: Canvas,
  chart: NodeChart,
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
    item: NodeChartItem,
    coords: { x: number, y: number }
  ) => {
    const cover = await loadImage(item.coverURL)

    const dimensions = getScaledDimensions(cover, cellSize)

    drawCover(
      canvas,
      cover,
      coords,
      cellSize,
      gap,
      dimensions,
      chartTitleMargin
    )
  }

  const insertTitle = (item: NodeChartItem, index: number, coords: { x: number, y: number }, maxWidth: number) => {
    const titleString = item.creator ? `${item.creator} - ${item.title}` : item.title
    ctx.fillText(
      titleString,
      canvas.width - maxWidth + 10,
      (25 * index) + (30 + gap) + ((coords.y % (index + 1)) * 35) + chartTitleMargin
    )
  }

  for (const { item, index } of chart.items.map((item, index) => ({ item, index }))) {
    // If a cell is null, that means it's empty, so we can pass over it.
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

export default generateChart
