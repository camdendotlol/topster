"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lib_1 = require("./lib");
const generateChart = (canvas, chart, cellSize = 260) => {
    const canvasInfo = (0, lib_1.setup)(canvas, chart, cellSize);
    (0, lib_1.drawBackground)(canvasInfo, chart);
    // Default bahavior is to not include shadows, so we won't use them if chart.shadows is undefined.
    if (chart.shadows === true) {
        canvasInfo.ctx.shadowOffsetX = 2;
        canvasInfo.ctx.shadowOffsetY = 2;
        canvasInfo.ctx.shadowBlur = 4;
        canvasInfo.ctx.shadowColor = 'rgba(0,0,0,0.6)';
    }
    // Set up the request text color--default is white.
    if (chart.textColor && /^#[0-9A-F]{6}$/i.test(chart.textColor)) {
        canvasInfo.ctx.fillStyle = chart.textColor;
    }
    else {
        canvasInfo.ctx.fillStyle = 'white';
    }
    // Draw the title at the top
    if (chart.title !== '') {
        (0, lib_1.drawTitle)(canvasInfo, chart);
    }
    (0, lib_1.insertCoverImages)(chart, canvasInfo);
    if (chart.showTitles) {
        (0, lib_1.buildTitles)(chart);
        (0, lib_1.insertTitles)(canvasInfo, chart, canvasInfo.titles);
    }
    return canvas;
};
exports.default = generateChart;
