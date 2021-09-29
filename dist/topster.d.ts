import { Canvas } from 'canvas';
export interface ChartItem {
    title: string;
    creator?: string;
    coverImg: HTMLImageElement;
    coverURL: string;
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
declare const generateChart: (canvas: Canvas, chart: Chart) => Promise<Canvas>;
export default generateChart;
