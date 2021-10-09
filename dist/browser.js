"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("./common");
const generateChart = (canvas, chart) => {
    // gap between cells (pixels)
    const gap = chart.gap;
    const maxItemTitleWidth = (0, common_1.getMaxTitleWidth)(chart);
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
    (0, common_1.setup)(canvas, chart);
    const ctx = canvas.getContext('2d');
    if (!ctx) {
        throw new Error('Missing canvas context.');
    }
    ctx.fillStyle = ('#e9e9e9');
    insertCoverImages(canvas, chart, cellSize, gap, maxItemTitleWidth, chartTitleMargin);
    return canvas;
};
const insertCoverImages = (canvas, chart, cellSize, gap, maxTitleWidth, chartTitleMargin) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) {
        throw new Error('Canvas ctx not found');
    }
    const insertTitle = (item, index, coords, maxWidth) => {
        const titleString = item.creator ? `${item.creator} - ${item.title}` : item.title;
        ctx.fillText(titleString, canvas.width - maxWidth + 10, (25 * index) + (30 + gap) + ((coords.y % (index + 1)) * 35) + chartTitleMargin);
    };
    chart.items.forEach((item, index) => {
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
        insertImage(item, coords, cellSize, gap, ctx, chartTitleMargin);
        if (chart.showTitles) {
            ctx.font = '16pt "Ubuntu Mono"';
            ctx.textAlign = 'left';
            insertTitle(item, index, coords, maxTitleWidth);
        }
    });
};
const insertImage = (item, coords, cellSize, gap, ctx, chartTitleMargin) => {
    const dimensions = (0, common_1.getScaledDimensions)(item.coverImg, cellSize);
    (0, common_1.drawCover)(item.coverImg, coords, cellSize, gap, dimensions, ctx, chartTitleMargin);
};
exports.default = generateChart;
