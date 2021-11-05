"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("./common");
const generateChart = (canvas, chart) => {
    const canvasInfo = (0, common_1.setup)(canvas, chart);
    (0, common_1.drawBackground)(canvas, chart);
    (0, common_1.drawTitle)(canvas, chart);
    insertCoverImages(canvas, chart, canvasInfo.cellSize, chart.gap, canvasInfo.maxItemTitleWidth, canvasInfo.chartTitleMargin);
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
        insertImage(canvas, item, coords, cellSize, gap, chartTitleMargin);
        if (chart.showTitles) {
            ctx.font = '16pt "Ubuntu Mono"';
            ctx.textAlign = 'left';
            insertTitle(item, index, coords, maxTitleWidth);
        }
    });
};
const insertImage = (canvas, item, coords, cellSize, gap, chartTitleMargin) => {
    const dimensions = (0, common_1.getScaledDimensions)(item.coverImg, cellSize);
    (0, common_1.drawCover)(canvas, item.coverImg, coords, cellSize, gap, dimensions, chartTitleMargin);
};
exports.default = generateChart;
