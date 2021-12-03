interface ChartSize {
    x: number;
    y: number;
}
export declare enum BackgroundTypes {
    Color = "color",
    Image = "image"
}
export interface ChartItem {
    title: string;
    creator?: string;
    coverURL: string;
    coverImg: HTMLImageElement;
}
export interface Chart {
    title: string;
    items: Array<ChartItem | null>;
    size: ChartSize;
    background: {
        type: BackgroundTypes;
        value: string;
        img: HTMLImageElement | null;
    };
    showTitles: boolean;
    gap: number;
    font?: string;
    textColor?: string;
}
interface CanvasInfo {
    width: number;
    height: number;
    cellSize: number;
    chartTitleMargin: number;
    maxItemTitleWidth: number;
}
export declare const getScaledDimensions: (img: HTMLImageElement, cellSize: number) => {
    height: number;
    width: number;
};
export declare const drawCover: (canvas: HTMLCanvasElement, cover: HTMLImageElement, coords: {
    x: number;
    y: number;
}, cellSize: number, gap: number, dimensions: {
    height: number;
    width: number;
}, chartTitleMargin: number) => void;
export declare const setup: (canvas: HTMLCanvasElement, chart: Chart) => CanvasInfo;
export declare const drawBackground: (canvas: HTMLCanvasElement, chart: Chart) => void;
export declare const drawTitle: (canvas: HTMLCanvasElement, chart: Chart) => void;
export {};
