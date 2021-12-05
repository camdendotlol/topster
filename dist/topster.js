"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lib_1 = require("./lib");
const generateChart = (canvas, chart) => {
    const canvasInfo = (0, lib_1.setup)(canvas, chart);
    (0, lib_1.drawBackground)(canvasInfo, chart);
    // Default bahavior is to include shadows, so we still use them if chart.shadows is undefined.
    if (chart.shadows !== false) {
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
        (0, lib_1.insertTitles)(canvasInfo, chart);
    }
    return canvas;
};
exports.default = generateChart;
