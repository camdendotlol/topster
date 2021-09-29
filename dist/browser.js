"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const generateChart = (canvas, title, items, chartSize, color, showTitles) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) {
        throw new Error('Missing canvas context.');
    }
    const getMaxTitleWidth = () => {
        let maxTitleWidth = 0;
        if (showTitles) {
            for (let x = 0; x < items.length; x++) {
                const item = items[x];
                const name = item.creator ? `${item.creator} - ${item.title}` : item.title;
                const width = name.length * 12;
                if (width > maxTitleWidth) {
                    maxTitleWidth = width;
                }
            }
        }
        return maxTitleWidth;
    };
    const maxTitleWidth = getMaxTitleWidth();
    const pixelDimensions = {
        // room for each cell + 10px gap between cells + margins
        x: (chartSize.x * 270) + 100 + maxTitleWidth,
        y: (chartSize.y * 270) + 160
    };
    canvas.width = pixelDimensions.x;
    canvas.height = pixelDimensions.y;
    if (!ctx) {
        throw new Error('Canvas ctx not found');
    }
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = '36pt "Ubuntu Mono"';
    ctx.fillStyle = '#e9e9e9';
    ctx.textAlign = 'center';
    ctx.fillText(title, canvas.width / 2, 60);
    ctx.fillStyle = ('#e9e9e9');
    // height/width of each square cell
    const cellSize = 260;
    // gap between cells (pixels)
    const gap = 10;
    insertCoverImages(canvas, items, cellSize, chartSize, gap, maxTitleWidth, showTitles);
    return canvas;
};
const insertCoverImages = (canvas, items, cellSize, dimensions, gap, maxTitleWidth, showTitles) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) {
        throw new Error('Canvas ctx not found');
    }
    const getScaledDimensions = (img) => {
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
    const findCenteringOffset = (dimension) => {
        if (dimension < cellSize) {
            return Math.floor((cellSize - dimension) / 2);
        }
        else {
            return 0;
        }
    };
    const insertImage = (item, coords) => {
        const dimensions = getScaledDimensions(item.coverImg);
        ctx.drawImage(item.coverImg, ((coords.x * cellSize) + 55 + (coords.x * gap)) + findCenteringOffset(dimensions.width), ((coords.y * cellSize) + 80 + (coords.y * gap)) + findCenteringOffset(dimensions.height), dimensions.width, dimensions.height);
    };
    const insertTitle = (item, index, coords, maxWidth) => {
        const titleString = item.creator ? `${item.creator} - ${item.title}` : item.title;
        ctx.fillText(titleString, canvas.width - maxWidth, (25 * index) + 110 + ((coords.y % (index + 1)) * 50));
    };
    items.forEach((item, index) => {
        // Don't overflow outside the bounds of the chart
        // This way, items will be saved if the chart is too big for them
        // and the user can just expand the chart and they'll fill in again
        if (index + 1 > dimensions.x * dimensions.y) {
            return null;
        }
        const coords = {
            x: index % dimensions.x,
            y: Math.floor(index / dimensions.x)
        };
        insertImage(item, coords);
        if (showTitles) {
            ctx.font = '16pt "Ubuntu Mono"';
            ctx.textAlign = 'left';
            insertTitle(item, index, coords, maxTitleWidth);
        }
    });
};
exports.default = generateChart;
