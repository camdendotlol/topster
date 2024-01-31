"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.insertCoverImages = exports.drawTitle = exports.drawBackground = exports.setup = exports.insertTitles = exports.buildTitles = exports.getMinimumHeight = exports.drawCover = exports.getScaledDimensions = exports.BackgroundTypes = void 0;
var BackgroundTypes;
(function (BackgroundTypes) {
    BackgroundTypes["Color"] = "color";
    BackgroundTypes["Image"] = "image";
})(BackgroundTypes = exports.BackgroundTypes || (exports.BackgroundTypes = {}));
// The sidebar containing the titles of chart items should only be as
// wide as the longest title, plus a little bit of margin.
const getMaxTitleWidth = (chart, titles, ctx) => {
    let maxTitleWidth = 0;
    ctx.font = `16pt ${chart.font ? chart.font : 'monospace'}`;
    if (chart.textColor && /^#[0-9A-F]{6}$/i.test(chart.textColor)) {
        ctx.fillStyle = chart.textColor;
    }
    else {
        ctx.fillStyle = 'white';
    }
    Object.keys(titles).forEach((key) => {
        const width = ctx.measureText(titles[parseInt(key)]).width;
        if (width > maxTitleWidth) {
            maxTitleWidth = width;
        }
    });
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
const drawCover = (cover, coords, gap, canvasInfo) => {
    const dimensions = (0, exports.getScaledDimensions)(cover, canvasInfo.cellSize);
    canvasInfo.ctx.drawImage(
    // We have to cast this as HTMLImageElement even if it's a Node Canvas Image,
    // because ctx doesn't know what to do with the latter.
    cover, (coords.x * (canvasInfo.cellSize + gap)) + gap + findCenteringOffset(dimensions.width, canvasInfo.cellSize), (coords.y * (canvasInfo.cellSize + gap)) + gap + findCenteringOffset(dimensions.height, canvasInfo.cellSize) + canvasInfo.chartTitleMargin, dimensions.width, dimensions.height);
};
exports.drawCover = drawCover;
// Calculate the height required by album titles to make
// sure that the ones on the bottom don't get cut off if
// they go below the bottom row of chart items.
const getMinimumHeight = (chart, ctx, titleMargin) => {
    const itemsInScope = chart.items.slice(0, chart.size.x * chart.size.y);
    ctx.font = `16pt ${chart.font ? chart.font : 'monospace'}`;
    let height = (chart.gap * 2) + titleMargin;
    for (let i = 0; i < itemsInScope.length; i++) {
        if (itemsInScope[i]) {
            height = height + 25;
            if (i % chart.size.x === 0 && i !== 0) {
                height = height + 25;
            }
        }
    }
    return height;
};
exports.getMinimumHeight = getMinimumHeight;
const buildTitles = (chart) => {
    const titles = {};
    const itemsInScope = chart.items.slice(0, chart.size.x * chart.size.y);
    let count = 0;
    itemsInScope.forEach((item, index) => {
        if (item) {
            count += 1;
            let titleString = item.title;
            if (item.creator) {
                titleString = `${item.creator} - ${titleString}`;
            }
            if (chart.showNumbers) {
                titleString = `${count}. ${titleString}`;
            }
            titles[index] = titleString;
        }
    });
    return titles;
};
exports.buildTitles = buildTitles;
const insertTitles = (canvasInfo, chart, titles) => {
    const itemsInScope = chart.items.slice(0, chart.size.x * chart.size.y);
    canvasInfo.ctx.font = `16pt ${chart.font ? chart.font : 'monospace'}`;
    canvasInfo.ctx.textAlign = 'left';
    canvasInfo.ctx.lineWidth = 0.3;
    canvasInfo.ctx.strokeStyle = 'black';
    // Increment this below with each successive title
    let currentHeight = canvasInfo.chartTitleMargin + chart.gap;
    itemsInScope.forEach((item, index) => {
        // Keep a margin to correspond with rows
        if (index % chart.size.x === 0 && index !== 0) {
            currentHeight = currentHeight + 25;
        }
        if (!item) {
            return null;
        }
        const titleString = titles[index];
        currentHeight = currentHeight + 25;
        canvasInfo.ctx.strokeText(titleString, canvasInfo.width - canvasInfo.maxItemTitleWidth + 10, currentHeight);
        canvasInfo.ctx.fillText(titleString, canvasInfo.width - canvasInfo.maxItemTitleWidth + 10, currentHeight);
    });
};
exports.insertTitles = insertTitles;
// Just calculates some data and sets the size of the chart
const setup = (canvas, chart, cellSize) => {
    const gap = chart.gap;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) {
        throw new Error('Rendering context not found, try reloading!');
    }
    let maxItemTitleWidth = 0;
    let titles = {};
    if (chart.showTitles) {
        titles = (0, exports.buildTitles)(chart);
        maxItemTitleWidth = getMaxTitleWidth(chart, titles, ctx);
    }
    const chartTitleMargin = chart.title === '' ? 0 : 60;
    const pixelDimensions = {
        // room for each cell + gap between cells + margins
        x: (chart.size.x * (cellSize + gap)) + gap + maxItemTitleWidth,
        y: (chart.size.y * (cellSize + gap)) + gap + chartTitleMargin
    };
    if (chart.showTitles) {
        const minimumHeight = (0, exports.getMinimumHeight)(chart, ctx, chartTitleMargin);
        if (pixelDimensions.y < minimumHeight) {
            pixelDimensions.y = minimumHeight;
        }
    }
    canvas.width = pixelDimensions.x;
    canvas.height = pixelDimensions.y;
    return {
        width: pixelDimensions.x,
        height: pixelDimensions.y,
        cellSize,
        chartTitleMargin,
        maxItemTitleWidth,
        titles,
        ctx
    };
};
exports.setup = setup;
const drawBackground = (canvasInfo, chart) => {
    var _a;
    const ctx = canvasInfo.ctx;
    if (chart.background.type === BackgroundTypes.Color) {
        ctx.beginPath();
        ctx.fillStyle = chart.background.value;
        ctx.fillRect(0, 0, canvasInfo.width, canvasInfo.height);
    }
    else {
        if ((_a = chart.background.img) === null || _a === void 0 ? void 0 : _a.complete) {
            const imageRatio = chart.background.img.height / chart.background.img.width;
            const canvasRatio = canvasInfo.height / canvasInfo.width;
            if (imageRatio > canvasRatio) {
                const height = canvasInfo.width * imageRatio;
                ctx.drawImage(chart.background.img, 0, Math.floor((canvasInfo.height - height) / 2), canvasInfo.width, height);
            }
            else {
                const width = canvasInfo.width * canvasRatio / imageRatio;
                ctx.drawImage(chart.background.img, Math.floor((canvasInfo.width - width) / 2), 0, width, canvasInfo.height);
            }
        }
    }
};
exports.drawBackground = drawBackground;
const drawTitle = (canvasInfo, chart) => {
    const ctx = canvasInfo.ctx;
    ctx.font = `38pt ${chart.font ? chart.font : 'monospace'}`;
    if (chart.textColor && /^#[0-9A-F]{6}$/i.test(chart.textColor)) {
        ctx.fillStyle = chart.textColor;
    }
    else {
        ctx.fillStyle = 'white';
    }
    ctx.textAlign = 'center';
    ctx.lineWidth = 0.2;
    ctx.strokeStyle = 'black';
    ctx.fillText(chart.title, canvasInfo.width / 2, ((chart.gap + 90) / 2));
    ctx.strokeText(chart.title, canvasInfo.width / 2, ((chart.gap + 90) / 2));
};
exports.drawTitle = drawTitle;
const insertCoverImages = (chart, canvasInfo) => {
    chart.items.forEach((item, index) => {
        if (!item) {
            return null;
        }
        // Don't overflow outside the bounds of the chart
        // This way, items will be saved if the chart is too big for them
        // and the user can just expand the chart and they'll fill in again
        if (index + 1 > chart.size.x * chart.size.y) {
            return null;
        }
        const coords = {
            x: (index % chart.size.x),
            y: Math.floor(index / chart.size.x)
        };
        (0, exports.drawCover)(item.coverImg, coords, chart.gap, canvasInfo);
    });
};
exports.insertCoverImages = insertCoverImages;
