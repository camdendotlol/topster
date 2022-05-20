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
    showNumbers: boolean;
    showTitles: boolean;
    gap: number;
    font?: string;
    textColor?: string;
    shadows?: boolean;
}
interface TitleMap {
    [key: number]: string;
}
export interface CanvasInfo {
    width: number;
    height: number;
    cellSize: number;
    chartTitleMargin: number;
    maxItemTitleWidth: number;
    titles: TitleMap;
    ctx: CanvasRenderingContext2D;
}
export declare const getScaledDimensions: (img: HTMLImageElement, cellSize: number) => {
    height: number;
    width: number;
};
export declare const drawCover: (cover: HTMLImageElement, coords: {
    x: number;
    y: number;
}, gap: number, canvasInfo: CanvasInfo) => void;
export declare const getMinimumHeight: (chart: Chart, ctx: CanvasRenderingContext2D, titleMargin: number) => number;
export declare const buildTitles: (chart: Chart) => TitleMap;
export declare const insertTitles: (canvasInfo: CanvasInfo, chart: Chart, titles: TitleMap) => void;
export declare const setup: (canvas: HTMLCanvasElement, chart: Chart) => CanvasInfo;
export declare const drawBackground: (canvasInfo: CanvasInfo, chart: Chart) => void;
export declare const drawTitle: (canvasInfo: CanvasInfo, chart: Chart) => void;
export declare const insertCoverImages: (chart: Chart, canvasInfo: CanvasInfo) => void;
export {};
