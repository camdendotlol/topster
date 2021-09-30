# Topster

Topster is a node package that generates a topster-style chart using HTML Canvas.

It accepts various parameters for customization, and works on both frontend and backend.

Topster exposes a single function that you can import:

```js
import generateChart from 'topster'
```

`generateChart` expects two arguments.

1. A canvas. If you're using Topster in a browser, it should be of the `HTMLCanvasElement` type. If you're calling from Node, it should be the `Canvas` type from [node-canvas](https://www.npmjs.com/package/canvas). It doesn't matter whether you send a blank canvas or one with stuff drawn on it, but keep in mind that Topster will resize the canvas to match the chart content.

2. An object of type `Chart` containing chart data.

```ts
interface Chart {
  // Title of the chart, to be displayed centered on the top
  title: string,
  // Array of items in the chart - these can be whatever you want as long as it conforms to the ChartItem type
  items: ChartItem[],
  // The dimensions of the chart grid, e.g. 5x5
  size: { x: number, y: number },
  // Background color, should be a hex code
  color: string,
  // Whether to display the titles of each item on the righthand side of the chart
  showTitles: boolean
}
```

Here is what the `ChartItem` type looks like:

```ts
interface ChartItem {
  // Title of the item (e.g., the title of a book or album)
  title: string,
  // Creator of the item.
  // Sometimes it doesn't make sense to credit a creator, so you can leave this field blank.
  creator?: string,
  // the browser can pass an image element in
  coverImg: HTMLImageElement,
  // on node, we fetch the cover image from a URL instead
  coverURL: string
}
```

There are still a few chart properties that you can't customize yet. These will come in a later release.
