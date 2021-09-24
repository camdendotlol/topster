import { Canvas } from 'canvas';
export interface ChartItem {
    title: string;
    creator?: string;
    coverImg: HTMLImageElement;
}
export interface ChartSize {
    x: number;
    y: number;
}
export interface Chart {
    title: string;
    items: ChartItem[];
    size: ChartSize;
    color: string;
    showTitles: boolean;
}
declare const generateChart: (canvas: Canvas, title: string, items: ChartItem[], chartSize: {
    x: number;
    y: number;
}, color: string, showTitles: boolean) => Canvas;
export default generateChart;
