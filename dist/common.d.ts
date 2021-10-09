import { Canvas, Image, NodeCanvasRenderingContext2D } from 'canvas';
import { Chart } from './browser';
export declare const getMaxTitleWidth: (chart: Chart) => number;
export declare const getScaledDimensions: (img: HTMLImageElement | Image, cellSize: number) => {
    height: number;
    width: number;
};
export declare const drawCover: (cover: Image | HTMLImageElement, coords: {
    x: number;
    y: number;
}, cellSize: number, gap: number, dimensions: {
    height: number;
    width: number;
}, ctx: CanvasRenderingContext2D | NodeCanvasRenderingContext2D, chartTitleMargin: number) => void;
export declare const setup: (canvas: Canvas | HTMLCanvasElement, chart: Chart) => void;
