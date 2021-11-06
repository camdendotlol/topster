"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.drawTitle = exports.drawBackground = exports.setup = exports.drawCover = exports.getScaledDimensions = exports.BackgroundTypes = void 0;
var BackgroundTypes;
(function (BackgroundTypes) {
    BackgroundTypes["Color"] = "color";
    BackgroundTypes["Image"] = "image";
})(BackgroundTypes = exports.BackgroundTypes || (exports.BackgroundTypes = {}));
// The sidebar containing the titles of chart items should only be as
// wide as the longest title, plus a little bit of margin.
const getMaxTitleWidth = (chart, ctx) => {
    let maxTitleWidth = 0;
    ctx.font = '16pt "Ubuntu Mono"';
    // Don't need to adjust the size for items that aren't visible on the chart
    const totalItemsOnChart = chart.size.x * chart.size.y;
    if (chart.showTitles) {
        for (let x = 0; x < totalItemsOnChart; x++) {
            const item = chart.items[x];
            if (item) {
                const name = item.creator ? `${item.creator} - ${item.title}` : item.title;
                const width = ctx.measureText(name).width;
                if (width > maxTitleWidth) {
                    maxTitleWidth = width;
                }
            }
        }
    }
    // A minimum margin of 20px keeps titles from being right up against the sides.
    return maxTitleWidth + 20 + chart.gap;
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
// Just calculates some data and sets the size of the chart
const setup = (canvas, chart) => {
    const gap = chart.gap;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) {
        throw new Error('Rendering context not found, try reloading!');
    }
    const maxItemTitleWidth = getMaxTitleWidth(chart, ctx);
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
const drawBackground = (canvas, chart) => {
    var _a;
    if (chart.background.type === BackgroundTypes.Color) {
        const ctx = getContext(canvas);
        ctx.beginPath();
        ctx.fillStyle = chart.background.value;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    else {
        if ((_a = chart.background.img) === null || _a === void 0 ? void 0 : _a.complete) {
            const ctx = getContext(canvas);
            const imageRatio = chart.background.img.height / chart.background.img.width;
            const canvasRatio = canvas.height / canvas.width;
            if (imageRatio > canvasRatio) {
                const height = canvas.width * imageRatio;
                ctx.drawImage(chart.background.img, 0, Math.floor((canvas.height - height) / 2), canvas.width, height);
            }
            else {
                const width = canvas.width * canvasRatio / imageRatio;
                ctx.drawImage(chart.background.img, Math.floor((canvas.width - width) / 2), 0, width, canvas.height);
            }
        }
    }
};
exports.drawBackground = drawBackground;
const drawTitle = (canvas, chart) => {
    const ctx = getContext(canvas);
    ctx.font = '38pt "Ubuntu Mono"';
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    // Set up text formatting for titles.
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    ctx.shadowBlur = 4;
    ctx.shadowColor = 'rgba(0,0,0,0.6)';
    ctx.lineWidth = 0.2;
    ctx.strokeStyle = 'black';
    ctx.fillText(chart.title, canvas.width / 2, ((chart.gap + 90) / 2));
    ctx.strokeText(chart.title, canvas.width / 2, ((chart.gap + 90) / 2));
};
exports.drawTitle = drawTitle;
const getContext = (canvas) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) {
        throw new Error('Missing canvas context.');
    }
    return ctx;
};
