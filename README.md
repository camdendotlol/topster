# Topster

Topster is a library that generates a topster-style chart using HTML Canvas.

![example chart](/example_chart.png)

It accepts various parameters for customization.

## How to use

Topster exposes a single function that you can import:

```js
import generateChart from 'topster'
```

`generateChart` expects two arguments.

1. A canvas. It should be a standard HTML Canvas element of the `HTMLCanvasElement` type. It doesn't matter whether you send a blank canvas or one with stuff drawn on it, but keep in mind that Topster will resize the canvas to match the chart content.

2. An object of type `Chart` containing chart data.

```ts
interface Chart {
  // Title of the chart, to be displayed centered on the top
  title: string,

  // Array of items in the chart - these can be whatever you want, not just music or movies.
  items: Array<ChartItem | null>,

  // The dimensions of the chart grid, e.g. 5x5. There is no official limit to size, but I've only tested it at max 10x10.
  size: { x: number, y: number },

  // Information about the chart background.
  background: {
    // Topster accepts either a color hex code or an image.
    type: 'color' | 'image',
    // The value field is either a hex code or an image URL,
    // depending on the value of the above type field.
    value: string,
    // If the background is an image, Topster expects an <img>
    // element in the img field. Otherwise, you can leave it null.
    img: HTMLImageElement | null
  }

  // Whether to display the titles of each item on the righthand side of the chart
  showTitles: boolean,

  // The gap between chart items, in pixels. Minimum is 0, and the max should in theory be the amount that brings
  // the canvas's size beyond the canvas size limit.
  gap: number
}
```

You can include `null` elements in the items array, and Topster will leave the corresponding grid area blank. This is useful for, e.g., drawing simple shapes on the grid or separating groups of items by inserting blank areas between them.

### ChartItem types

Here is what `generateChart` expects in the `chart.items` field:

```ts
interface ChartItem {
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

There are still a few chart properties that you can't customize yet. These will come in a later release.

### Note

In the past, this package supported Node via node-canvas with a separate entry point. Eventually an update to the application for which I created this library removed my need for the Node version of Topster. Without using it myself, I can't properly support it. So Topster is now browser-only.

If you would like to use Topster with Node, I would be happy to accept contributions from someone who is interested in maintaining a Node version.
