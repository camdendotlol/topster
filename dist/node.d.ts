import { Canvas } from 'canvas';
import { NodeChart } from './common';
declare const generateChart: (canvas: Canvas, chart: NodeChart) => Promise<Canvas>;
export default generateChart;
