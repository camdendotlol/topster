import { Canvas, Image } from 'canvas';
export interface NodeChart extends BaseChart {
    items: Array<NodeChartItem | null>;
}
export interface BrowserChart extends BaseChart {
    items: Array<BrowserChartItem | null>;
}
export interface NodeChartItem {
    title: string;
    creator?: string;
    coverURL: string;
}
export interface BrowserChartItem extends NodeChartItem {
    coverImg: HTMLImageElement;
}
interface ChartSize {
    x: number;
    y: number;
}
declare enum BackgroundTypes {
    Color = "color",
    Image = "image"
}
interface BaseChart {
    title: string;
    size: ChartSize;
    background: {
        type: BackgroundTypes;
        value: string;
    };
    showTitles: boolean;
    gap: number;
}
declare type Chart = NodeChart | BrowserChart;
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
