import {
  setup,
  Chart,
  drawTitle,
  drawBackground,
  insertTitles,
  insertCoverImages
} from './lib'

const generateChart = (canvas: HTMLCanvasElement, chart: Chart): HTMLCanvasElement => {
  const canvasInfo = setup(canvas, chart)

  drawBackground(canvasInfo, chart)

  // Default bahavior is to include shadows, so we still use them if chart.shadows is undefined.
  if (chart.shadows !== false) {
    canvasInfo.ctx.shadowOffsetX = 2
    canvasInfo.ctx.shadowOffsetY = 2
    canvasInfo.ctx.shadowBlur = 4
    canvasInfo.ctx.shadowColor = 'rgba(0,0,0,0.6)'
  }

  // Set up the request text color--default is white.
  if (chart.textColor && /^#[0-9A-F]{6}$/i.test(chart.textColor)) {
    canvasInfo.ctx.fillStyle = chart.textColor
  } else {
    canvasInfo.ctx.fillStyle = 'white'
  }

  // Draw the title at the top
  if (chart.title !== '') {
    drawTitle(canvasInfo, chart)
  }

  insertCoverImages(
    chart,
    canvasInfo
  )

  if (chart.showTitles) {
    insertTitles(
      canvasInfo,
      chart
    )
  }

  return canvas
}

export default generateChart
