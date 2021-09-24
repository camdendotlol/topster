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
declare const generateChart: (canvas: HTMLCanvasElement, title: string, items: ChartItem[], chartSize: {
    x: number;
    y: number;
}, color: string, showTitles: boolean) => HTMLCanvasElement;
export default generateChart;
