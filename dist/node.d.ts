import { Canvas } from 'canvas';
import { Chart } from './common';
declare const generateChart: (canvas: Canvas, chart: Chart) => Promise<Canvas>;
export default generateChart;
