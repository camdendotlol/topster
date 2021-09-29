"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("./common");
const generateChart = (blankCanvas, chart) => {
    const canvas = (0, common_1.setup)(blankCanvas, chart);
    const ctx = canvas.getContext('2d');
    if (!ctx) {
        throw new Error('Missing canvas context.');
    }
    const maxTitleWidth = (0, common_1.getMaxTitleWidth)(chart);
    // gap between cells (pixels)
    const gap = 10;
    const pixelDimensions = {
        // room for each cell + 10px gap between cells + margins
        x: (chart.size.x * (260 + gap)) + 100 + maxTitleWidth,
        y: (chart.size.y * (260 + gap)) + 160
    };
    canvas.width = pixelDimensions.x;
    canvas.height = pixelDimensions.y;
    if (!ctx) {
        throw new Error('Canvas ctx not found');
    }
    ctx.fillStyle = ('#e9e9e9');
    // height/width of each square cell
    const cellSize = 260;
    insertCoverImages(canvas, chart, cellSize, gap, maxTitleWidth);
    return canvas;
};
const insertCoverImages = (canvas, chart, cellSize, gap, maxTitleWidth) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) {
        throw new Error('Canvas ctx not found');
    }
    const insertTitle = (item, index, coords, maxWidth) => {
        const titleString = item.creator ? `${item.creator} - ${item.title}` : item.title;
        ctx.fillText(titleString, canvas.width - maxWidth, (25 * index) + 110 + ((coords.y % (index + 1)) * 50));
    };
    chart.items.forEach((item, index) => {
        // Don't overflow outside the bounds of the chart
        // This way, items will be saved if the chart is too big for them
        // and the user can just expand the chart and they'll fill in again
        if (index + 1 > chart.size.x * chart.size.y) {
            return null;
        }
        const coords = {
            x: index % chart.size.x,
            y: Math.floor(index / chart.size.x)
        };
        insertImage(item, coords, cellSize, gap, ctx);
        if (chart.showTitles) {
            ctx.font = '16pt "Ubuntu Mono"';
            ctx.textAlign = 'left';
            insertTitle(item, index, coords, maxTitleWidth);
        }
    });
};
const insertImage = (item, coords, cellSize, gap, ctx) => {
    const dimensions = (0, common_1.getScaledDimensions)(item.coverImg, cellSize);
    (0, common_1.drawCover)(item.coverImg, coords, cellSize, gap, dimensions, ctx);
};
exports.default = generateChart;
