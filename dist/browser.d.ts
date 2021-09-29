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
declare const generateChart: (canvas: HTMLCanvasElement, chart: Chart) => HTMLCanvasElement;
export default generateChart;
