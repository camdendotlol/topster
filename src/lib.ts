interface ChartSize {
  x: number,
  y: number
}

export enum BackgroundTypes {
  Color = 'color',
  Image = 'image'
}

export interface ChartItem {
  title: string,
  creator?: string,
  coverURL: string,
  coverImg: HTMLImageElement
}

export interface Chart {
  title: string,
  items: Array<ChartItem | null>,
  size: ChartSize,
  background: {
    type: BackgroundTypes,
    value: string,
    img: HTMLImageElement | null
  },
  showNumbers: boolean,
  showTitles: boolean,
  gap: number,
  font?: string,
  textColor?: string,
  shadows?: boolean
}

interface TitleMap {
  [key: number]: string
}

export interface CanvasInfo {
  width: number,
  height: number,
  cellSize: number,
  chartTitleMargin: number,
  maxItemTitleWidth: number,
  titles: TitleMap,
  ctx: CanvasRenderingContext2D
}

// The sidebar containing the titles of chart items should only be as
// wide as the longest title, plus a little bit of margin.
const getMaxTitleWidth = (chart: Chart, titles: TitleMap, ctx: CanvasRenderingContext2D): number => {
  let maxTitleWidth = 0
  ctx.font = `16pt ${chart.font ? chart.font : 'monospace'}`
  if (chart.textColor && /^#[0-9A-F]{6}$/i.test(chart.textColor)) {
    ctx.fillStyle = chart.textColor
  } else {
    ctx.fillStyle = 'white'
  }

  Object.keys(titles).forEach((key) => {
    const width = ctx.measureText(titles[parseInt(key)]).width
    if (width > maxTitleWidth) {
      maxTitleWidth = width
    }
  })

  // A minimum margin of 20px keeps titles from being right up against the sides.
  return maxTitleWidth + 20 + chart.gap
}

// Finds how many pixels the horizontal and/or vertical margin should be
// in order to center the cover within its cell.
const findCenteringOffset = (dimension: number, cellSize: number) => {
  if (dimension < cellSize) {
    return Math.floor((cellSize - dimension) / 2)
  } else {
    return 0
  }
}

export const getScaledDimensions = (img: HTMLImageElement, cellSize: number): { height: number, width: number } => {
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
  cover: HTMLImageElement,
  coords: { x: number, y: number },
  gap: number,
  canvasInfo: CanvasInfo
): void => {
  const dimensions = getScaledDimensions(cover, canvasInfo.cellSize)

  canvasInfo.ctx.drawImage(
    // We have to cast this as HTMLImageElement even if it's a Node Canvas Image,
    // because ctx doesn't know what to do with the latter.
    cover as HTMLImageElement,
    (coords.x * (canvasInfo.cellSize + gap)) + gap + findCenteringOffset(dimensions.width, canvasInfo.cellSize),
    (coords.y * (canvasInfo.cellSize + gap)) + gap + findCenteringOffset(dimensions.height, canvasInfo.cellSize) + canvasInfo.chartTitleMargin,
    dimensions.width,
    dimensions.height
  )
}

// Calculate the height required by album titles to make
// sure that the ones on the bottom don't get cut off if
// they go below the bottom row of chart items.
export const getMinimumHeight = (
  chart: Chart,
  ctx: CanvasRenderingContext2D,
  titleMargin: number
): number => {
  const itemsInScope = chart.items.slice(0, chart.size.x * chart.size.y)

  ctx.font = `16pt ${chart.font ? chart.font : 'monospace'}`

  let height = (chart.gap * 2) + titleMargin

  for (let i = 0; i < itemsInScope.length; i++) {
    if (itemsInScope[i]) {
      height = height + 25
      if (i % chart.size.x === 0 && i !== 0) {
        height = height + 25
      }
    }
  }

  return height
}

export const buildTitles = (chart: Chart): TitleMap => {
  const titles: TitleMap = {}

  const itemsInScope = chart.items.slice(0, chart.size.x * chart.size.y)
  let count = 0

  itemsInScope.forEach((item, index) => {
    if (item) {
      count += 1
      let titleString = item.title

      if (item.creator) {
        titleString = `${item.creator} - ${titleString}`
      }

      if (chart.showNumbers) {
        titleString = `${count}. ${titleString}`
      }

      titles[index] = titleString
    }
  })

  return titles
}

export const insertTitles = (
  canvasInfo: CanvasInfo,
  chart: Chart,
  titles: TitleMap
): void => {
  const itemsInScope = chart.items.slice(0, chart.size.x * chart.size.y)

  canvasInfo.ctx.font = `16pt ${chart.font ? chart.font : 'monospace'}`
  canvasInfo.ctx.textAlign = 'left'
  canvasInfo.ctx.lineWidth = 0.3
  canvasInfo.ctx.strokeStyle = 'black'

  // Increment this below with each successive title
  let currentHeight = canvasInfo.chartTitleMargin + chart.gap

  itemsInScope.forEach((item, index) => {
    // Keep a margin to correspond with rows
    if (index % chart.size.x === 0 && index !== 0) {
      currentHeight = currentHeight + 25
    }

    if (!item) {
      return null
    }

    const titleString = titles[index]

    currentHeight = currentHeight + 25

    canvasInfo.ctx.strokeText(
      titleString,
      canvasInfo.width - canvasInfo.maxItemTitleWidth + 10,
      currentHeight
    )

    canvasInfo.ctx.fillText(
      titleString,
      canvasInfo.width - canvasInfo.maxItemTitleWidth + 10,
      currentHeight
    )
  })
}

// Just calculates some data and sets the size of the chart
export const setup = (
  canvas: HTMLCanvasElement,
  chart: Chart,
  cellSize: number
): CanvasInfo => {
  const gap = chart.gap
  const ctx = canvas.getContext('2d', { alpha: false })

  if (!ctx) {
    throw new Error('Rendering context not found, try reloading!')
  }

  let maxItemTitleWidth = 0
  let titles: TitleMap = {}
  if (chart.showTitles) {
    titles = buildTitles(chart)
    maxItemTitleWidth = getMaxTitleWidth(chart, titles, ctx)
  }

  const chartTitleMargin = chart.title === '' ? 0 : 60

  const pixelDimensions = {
    // room for each cell + gap between cells + margins
    x: (chart.size.x * (cellSize + gap)) + gap + maxItemTitleWidth,
    y: (chart.size.y * (cellSize + gap)) + gap + chartTitleMargin
  }

  if (chart.showTitles) {
    const minimumHeight = getMinimumHeight(chart, ctx, chartTitleMargin)
    if (pixelDimensions.y < minimumHeight) {
      pixelDimensions.y = minimumHeight
    }
  }

  canvas.width = pixelDimensions.x
  canvas.height = pixelDimensions.y

  return {
    width: pixelDimensions.x,
    height: pixelDimensions.y,
    cellSize,
    chartTitleMargin,
    maxItemTitleWidth,
    titles,
    ctx
  }
}

export const drawBackground = (
  canvasInfo: CanvasInfo,
  chart: Chart
): void => {
  const ctx = canvasInfo.ctx

  if (chart.background.type === BackgroundTypes.Color) {
    ctx.beginPath()
    ctx.fillStyle = chart.background.value
    ctx.fillRect(0, 0, canvasInfo.width, canvasInfo.height)
  } else {
    if (chart.background.img?.complete) {
      const imageRatio = chart.background.img.height / chart.background.img.width
      const canvasRatio = canvasInfo.height / canvasInfo.width

      if (imageRatio > canvasRatio) {
        const height = canvasInfo.width * imageRatio
        ctx.drawImage(
          chart.background.img,
          0,
          Math.floor((canvasInfo.height - height) / 2),
          canvasInfo.width,
          height
        )
      } else {
        const width = canvasInfo.width * canvasRatio / imageRatio
        ctx.drawImage(
          chart.background.img,
          Math.floor((canvasInfo.width - width) / 2),
          0,
          width,
          canvasInfo.height
        )
      }
    }
  }
}

export const drawTitle = (
  canvasInfo: CanvasInfo,
  chart: Chart
): void => {
  const ctx = canvasInfo.ctx
  ctx.font = `38pt ${chart.font ? chart.font : 'monospace'}`
  if (chart.textColor && /^#[0-9A-F]{6}$/i.test(chart.textColor)) {
    ctx.fillStyle = chart.textColor
  } else {
    ctx.fillStyle = 'white'
  }
  ctx.textAlign = 'center'

  ctx.lineWidth = 0.2
  ctx.strokeStyle = 'black'
  ctx.fillText(chart.title, canvasInfo.width / 2, ((chart.gap + 90) / 2))
  ctx.strokeText(chart.title, canvasInfo.width / 2, ((chart.gap + 90) / 2))
}

export const insertCoverImages = (
  chart: Chart,
  canvasInfo: CanvasInfo
): void => {
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

    drawCover(
      item.coverImg,
      coords,
      chart.gap,
      canvasInfo
    )
  })
}
