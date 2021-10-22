import { Canvas, Image } from 'canvas';
export interface ChartItem {
    title: string;
    creator?: string;
    coverURL: string;
}
export interface ChartSize {
    x: number;
    y: number;
}
export interface BaseChart {
    title: string;
    size: ChartSize;
    color: string;
    showTitles: boolean;
    gap: number;
}
export interface NodeChart extends BaseChart {
    items: Array<ChartItem | null>;
}
export interface BrowserChart extends BaseChart {
    items: Array<BrowserChartItem | null>;
}
export interface BrowserChartItem extends ChartItem {
    coverImg: HTMLImageElement;
}
export declare type Chart = NodeChart | BrowserChart;
interface CanvasInfo {
    width: number;
    height: number;
    cellSize: number;
    chartTitleMargin: number;
    maxItemTitleWidth: number;
}
export declare const getScaledDimensions: (img: HTMLImageElement | Image, cellSize: number) => {
    height: number;
    width: number;
};
export declare const drawCover: (canvas: Canvas | HTMLCanvasElement, cover: Image | HTMLImageElement, coords: {
    x: number;
    y: number;
}, cellSize: number, gap: number, dimensions: {
    height: number;
    width: number;
}, chartTitleMargin: number) => void;
export declare const setup: (canvas: Canvas | HTMLCanvasElement, chart: Chart) => CanvasInfo;
export declare const drawBackground: (canvas: Canvas | HTMLCanvasElement, chart: Chart) => void;
export declare const drawTitle: (canvas: Canvas | HTMLCanvasElement, chart: Chart) => void;
export {};
