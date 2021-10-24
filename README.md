# Topster

Topster is a node package that generates a topster-style chart using HTML Canvas.

![example chart](/example_chart.png)

It accepts various parameters for customization, and works on both frontend (via the HTML Canvas API) and backend (using [node-canvas](https://www.npmjs.com/package/canvas)).

## How to use

Topster exposes a single function that you can import:

```js
import generateChart from 'topster'
```

`generateChart` expects two arguments.

1. A canvas. If you're using Topster in a browser, it should be of the `HTMLCanvasElement` type. If you're calling from Node, it should be the `Canvas` type from [node-canvas](https://www.npmjs.com/package/canvas). It doesn't matter whether you send a blank canvas or one with stuff drawn on it, but keep in mind that Topster will resize the canvas to match the chart content.

2. An object of type `Chart` containing chart data. The required properties are slightly different depending on whether you're using a browser or Node.

```ts
interface Chart {
  // Title of the chart, to be displayed centered on the top
  title: string,

  // Array of items in the chart - these can be whatever you want, not just music or movies.
  items: Array<BrowserChartItem | null> | Array<NodeChartItem | null>,

  // The dimensions of the chart grid, e.g. 5x5. There is no official limit to size, but I've only tested it at max 10x10.
  size: { x: number, y: number },

  // Background color, should be a hex code
  color: string,

  // Whether to display the titles of each item on the righthand side of the chart
  showTitles: boolean,

  // The gap between chart items, in pixels. Minimum is 0, and the max should in theory be the amount that brings
  // the canvas's size beyond the canvas size limit.
  gap: number
}
```

The `ChartItem` objects have slightly different requirements depending on whether you're using them in the browser or with Node.

You can include `null` elements in the array, and Topster will leave the corresponding grid area blank. This is useful for, e.g., drawing simple shapes on the grid or separating groups of items by inserting blank areas between them.

### BrowserChartItem types

Here is what `generateChart` expects in the `chart.items` field if you call it from a browser:

```ts
interface BrowserChartItem {
  // Title of the item (e.g., the title of a book or album).
  // This is currently a required field, but Topster will not add the top margin if the title is an empty string.
  // I will make it an optional property in the near future.
  title: string,

  // Creator of the item.
  // Sometimes it doesn't make sense to credit a creator, so you can leave this field blank.
  creator?: string,

  // an <img> element containing the cover image
  coverImg: HTMLImageElement,

  // the direct URL to the cover image
  coverURL: string
}
```

I know it's kind of messy to require both `coverImg` and `coverURL` at the same time. I plan to simplify the API in the future.

### NodeChartItem types

When calling the function from Node, you don't need to include the `coverImg` field.

```ts
interface BrowserChartItem {
  // Title of the item (e.g., the title of a book or album)
  title: string,

  // Creator of the item.
  // Sometimes it doesn't make sense to credit a creator, so you can leave this field blank.
  creator?: string,

  // the direct URL to the cover image
  coverURL: string
}
```

There are still a few chart properties that you can't customize yet. These will come in a later release.
