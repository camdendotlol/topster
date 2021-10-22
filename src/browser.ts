import {
  getScaledDimensions,
  drawCover,
  setup,
  BrowserChartItem,
  BrowserChart,
  drawBackground,
  drawTitle
} from './common'

const generateChart = (canvas: HTMLCanvasElement, chart: BrowserChart): HTMLCanvasElement => {
  const canvasInfo = setup(canvas, chart)

  drawBackground(canvas, chart)
  drawTitle(canvas, chart)

  insertCoverImages(
    canvas,
    chart,
    canvasInfo.cellSize,
    chart.gap,
    canvasInfo.maxItemTitleWidth,
    canvasInfo.chartTitleMargin
  )

  return canvas
}

const insertCoverImages = (
  canvas: HTMLCanvasElement,
  chart: BrowserChart,
  cellSize: number,
  gap: number,
  maxTitleWidth: number,
  chartTitleMargin: number
) => {
  const ctx = canvas.getContext('2d')

  if (!ctx) {
    throw new Error('Canvas ctx not found')
  }

  const insertTitle = (item: BrowserChartItem, index: number, coords: { x: number, y: number }, maxWidth: number) => {
    const titleString = item.creator ? `${item.creator} - ${item.title}` : item.title
    ctx.fillText(
      titleString,
      canvas.width - maxWidth + 10,
      (25 * index) + (30 + gap) + ((coords.y % (index + 1)) * 35) + chartTitleMargin
    )
  }

  chart.items.forEach((item: BrowserChartItem | null, index: number) => {
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

    insertImage(
      canvas,
      item,
      coords,
      cellSize,
      gap,
      chartTitleMargin
    )

    if (chart.showTitles) {
      ctx.font = '16pt "Ubuntu Mono"'
      ctx.textAlign = 'left'
      insertTitle(item, index, coords, maxTitleWidth)
    }
  })
}

const insertImage = (
  canvas: HTMLCanvasElement,
  item: BrowserChartItem,
  coords: { x: number, y: number },
  cellSize: number,
  gap: number,
  chartTitleMargin: number
) => {
  const dimensions = getScaledDimensions(item.coverImg, cellSize)

  drawCover(
    canvas,
    item.coverImg,
    coords,
    cellSize,
    gap,
    dimensions,
    chartTitleMargin
  )
}

export default generateChart
