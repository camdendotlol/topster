"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const canvas_1 = require("canvas");
const path_1 = __importDefault(require("path"));
const common_1 = require("./common");
(0, canvas_1.registerFont)(path_1.default.join(__dirname, 'UbuntuMono-Regular.ttf'), { family: 'Ubuntu Mono' });
const generateChart = (canvas, chart) => __awaiter(void 0, void 0, void 0, function* () {
    const canvasInfo = (0, common_1.setup)(canvas, chart);
    yield (0, common_1.drawBackground)(canvas, chart);
    (0, common_1.drawTitle)(canvas, chart);
    yield insertCoverImages(canvas, chart, canvasInfo.cellSize, chart.gap, canvasInfo.maxItemTitleWidth, canvasInfo.chartTitleMargin);
    return canvas;
});
const insertCoverImages = (canvas, chart, cellSize, gap, maxTitleWidth, chartTitleMargin) => __awaiter(void 0, void 0, void 0, function* () {
    const ctx = canvas.getContext('2d');
    if (!ctx) {
        throw new Error('Canvas ctx not found');
    }
    const insertImage = (item, coords) => __awaiter(void 0, void 0, void 0, function* () {
        const cover = yield (0, canvas_1.loadImage)(item.coverURL);
        const dimensions = (0, common_1.getScaledDimensions)(cover, cellSize);
        (0, common_1.drawCover)(canvas, cover, coords, cellSize, gap, dimensions, chartTitleMargin);
    });
    const insertTitle = (item, index, coords, maxWidth) => {
        const titleString = item.creator ? `${item.creator} - ${item.title}` : item.title;
        ctx.fillText(titleString, canvas.width - maxWidth + 10, (25 * index) + (30 + gap) + ((coords.y % (index + 1)) * 35) + chartTitleMargin);
    };
    for (const { item, index } of chart.items.map((item, index) => ({ item, index }))) {
        // If a cell is null, that means it's empty, so we can pass over it.
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
            x: index % chart.size.x,
            y: Math.floor(index / chart.size.x)
        };
        yield insertImage(item, coords);
        if (chart.showTitles) {
            ctx.font = '16pt "Ubuntu Mono"';
            ctx.textAlign = 'left';
            insertTitle(item, index, coords, maxTitleWidth);
        }
    }
});
exports.default = generateChart;
