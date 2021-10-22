"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.drawTitle = exports.drawBackground = exports.setup = exports.drawCover = exports.getScaledDimensions = void 0;
// The sidebar containing the titles of chart items should only be as
// wide as the longest title, plus a little bit of margin.
const getMaxTitleWidth = (chart) => {
    let maxTitleWidth = 0;
    if (chart.showTitles) {
        for (let x = 0; x < chart.items.length; x++) {
            const item = chart.items[x];
            if (item) {
                const name = item.creator ? `${item.creator} - ${item.title}` : item.title;
                // node-canvas's measureText method is broken
                // so we need to use this weird hardcoded method
                // each pixel of 14px Ubuntu Mono is roughly 11px wide
                // this could use some improvement but it keeps the text from getting cut off
                // extremely long album titles (e.g. The Idler Wheel) get more padding than they should
                const width = (name.length * 11) + chart.gap + 10;
                if (width > maxTitleWidth) {
                    maxTitleWidth = width;
                }
            }
        }
    }
    return maxTitleWidth;
};
// Finds how many pixels the horizontal and/or vertical margin should be
// in order to center the cover within its cell.
const findCenteringOffset = (dimension, cellSize) => {
    if (dimension < cellSize) {
        return Math.floor((cellSize - dimension) / 2);
    }
    else {
        return 0;
    }
};
const getScaledDimensions = (img, cellSize) => {
    let differencePercentage = 1;
    if (img.width > cellSize && img.height > cellSize) {
        differencePercentage = Math.min((cellSize / img.width), (cellSize / img.height));
    }
    else if (img.width > cellSize) {
        differencePercentage = cellSize / img.width;
    }
    else if (img.height > cellSize) {
        differencePercentage = cellSize / img.height;
    }
    else if (img.width < cellSize && img.height < cellSize) {
        differencePercentage = Math.min((cellSize / img.width), (cellSize / img.height));
    }
    return {
        height: Math.floor(img.height * differencePercentage),
        width: Math.floor(img.width * differencePercentage)
    };
};
exports.getScaledDimensions = getScaledDimensions;
const drawCover = (canvas, cover, coords, cellSize, gap, dimensions, chartTitleMargin) => {
    const ctx = getContext(canvas);
    ctx.drawImage(
    // We have to cast this as HTMLImageElement even if it's a Node Canvas Image,
    // because ctx doesn't know what to do with the latter.
    cover, (coords.x * (cellSize + gap)) + gap + findCenteringOffset(dimensions.width, cellSize), (coords.y * (cellSize + gap)) + gap + findCenteringOffset(dimensions.height, cellSize) + chartTitleMargin, dimensions.width, dimensions.height);
};
exports.drawCover = drawCover;
const isHTMLImage = (img) => {
    if (img.addEventListener) {
        return true;
    }
    else {
        return false;
    }
};
// Just calculates some data and sets the size of the chart
const setup = (canvas, chart) => {
    const gap = chart.gap;
    const maxItemTitleWidth = getMaxTitleWidth(chart);
    // height/width of each square cell
    const cellSize = 260;
    const chartTitleMargin = chart.title === '' ? 0 : 60;
    const pixelDimensions = {
        // room for each cell + gap between cells + margins
        x: (chart.size.x * (cellSize + gap)) + gap + maxItemTitleWidth,
        y: (chart.size.y * (cellSize + gap)) + gap + chartTitleMargin
    };
    canvas.width = pixelDimensions.x;
    canvas.height = pixelDimensions.y;
    return {
        width: pixelDimensions.x,
        height: pixelDimensions.y,
        cellSize,
        chartTitleMargin,
        maxItemTitleWidth
    };
};
exports.setup = setup;
// Initial setup for the chart.
// Fills in the background, adds title, etc.
const drawBackground = (canvas, chart) => {
    const ctx = getContext(canvas);
    ctx.fillStyle = ('#e9e9e9');
    ctx.beginPath();
    ctx.fillStyle = chart.color;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
};
exports.drawBackground = drawBackground;
const drawTitle = (canvas, chart) => {
    const ctx = getContext(canvas);
    ctx.font = '38pt "Ubuntu Mono"';
    ctx.fillStyle = '#e9e9e9';
    ctx.textAlign = 'center';
    ctx.fillText(chart.title, canvas.width / 2, ((chart.gap + 90) / 2));
};
exports.drawTitle = drawTitle;
const getContext = (canvas) => {
    let ctx;
    // TypeScript gets confused when these types are together for some reason,
    // but it's okay when we split them up. Very annoying!
    if (isNodeCanvas(canvas)) {
        ctx = canvas.getContext('2d');
    }
    else {
        ctx = canvas.getContext('2d');
    }
    if (!ctx) {
        throw new Error('Missing canvas context.');
    }
    return ctx;
};
// Type guard to see whether we're dealing with a Node canvas or
// an HTML canvas. Only an HTML canvas has the addEventListener
// property so it's a good choice for this.
const isNodeCanvas = (canvas) => {
    if (canvas.addEventListener) {
        return false;
    }
    else {
        return true;
    }
};
