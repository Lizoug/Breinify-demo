import { EChartsOption } from 'echarts';

function computeHistogram(data: number[], binCount: number): number[] {
    let minValue = Math.min(...data);
    let maxValue = Math.max(...data);

    const binSize = (maxValue - minValue) / binCount;
    const bins = Array(binCount).fill(0);

    data.forEach(val => {
        const binIndex = Math.min(binCount - 1, Math.floor((val - minValue) / binSize));
        bins[binIndex]++;
    });

    return bins;
}

export function optionVizScatter(data: number[][], fsize: number, algoName: string, n_component: number, includeToolbox: boolean): EChartsOption {
    const colors = ['red', 'blue'];
    const mask_blue = data.map(item => item[2] === 1);
    const mask_red = data.map(item => item[2] === 0);
    const data_blue = data.filter((_, i) => mask_blue[i]);
    const data_red = data.filter((_, i) => mask_red[i]);

    const binCount = 10;
    const xHistogramBlue = computeHistogram(data_blue.map(d => d[0]), binCount);
    const xHistogramRed = computeHistogram(data_red.map(d => d[0]), binCount);
    const yHistogramBlue = computeHistogram(data_blue.map(d => d[1]), binCount);
    const yHistogramRed = computeHistogram(data_red.map(d => d[1]), binCount);

    const option: EChartsOption = {
        title: {
            text: `${algoName} (${n_component} components)`,
            left: 'center'
        },
        grid: [
            { left: '10%', width: '60%', bottom: '10%', height: '60%' },  // Main scatter plot grid
            { left: '10%', width: '60%', top: '15%', height: '15%' },  // Moved this to the top
            { left: '70%', width: '15%', bottom: '10%', height: '60%' }  // Right histogram grid
        ],
        xAxis: [
            { gridIndex: 0 },
            {
                gridIndex: 1,
                type: 'category',
                show: false,
                axisLabel: { show: false },
                axisLine: { show: false },
                axisTick: { show: false },
                splitLine: { show: false }
            },  // Hide everything for the histogram at the top
            {
                gridIndex: 2,
                type: 'value',
                show: false,
                axisLabel: { show: false },
                axisLine: { show: false },
                axisTick: { show: false },
                splitLine: { show: false }
            }   // Hide everything for the histogram on the right
        ],
        yAxis: [
            { gridIndex: 0 },
            {
                gridIndex: 1,
                show: false,
                axisLabel: { show: false },
                axisLine: { show: false },
                axisTick: { show: false },
                splitLine: { show: false }
            },  // Hide everything for the histogram at the top
            {
                gridIndex: 2,
                type: 'category',
                show: false,
                axisLabel: { show: false },
                axisLine: { show: false },
                axisTick: { show: false },
                splitLine: { show: false }
            }  // Hide everything for the histogram on the right
        ],
        series: [
            {
                name: 'Scatter Blue',
                symbolSize: fsize,
                data: data_blue.map(point => ({
                    value: [point[0], point[1]],
                    itemStyle: { color: colors[1] },
                })),
                type: 'scatter',
                xAxisIndex: 0,
                yAxisIndex: 0
            },
            {
                name: 'Scatter Red',
                symbolSize: fsize,
                data: data_red.map(point => ({
                    value: [point[0], point[1]],
                    itemStyle: { color: colors[0] },
                })),
                type: 'scatter',
                xAxisIndex: 0,
                yAxisIndex: 0
            },
            // Histograms
            {
                name: 'Blue X',
                type: 'bar',
                stack: 'x',
                xAxisIndex: 1,
                yAxisIndex: 1,
                itemStyle: {
                    color: 'blue'
                },
                data: xHistogramBlue
            },
            {
                name: 'Red X',
                type: 'bar',
                stack: 'x',
                xAxisIndex: 1,
                yAxisIndex: 1,
                itemStyle: {
                    color: 'red'
                },
                data: xHistogramRed
            },
            {
                name: 'Blue Y',
                type: 'bar',
                stack: 'y',
                xAxisIndex: 2,
                yAxisIndex: 2,
                itemStyle: {
                    color: 'blue'
                },
                data: yHistogramBlue
            },
            {
                name: 'Red Y',
                type: 'bar',
                stack: 'y',
                xAxisIndex: 2,
                yAxisIndex: 2,
                itemStyle: {
                    color: 'red'
                },
                data: yHistogramRed
            }
        ],
        toolbox: includeToolbox ? {
            show: true,
            feature: {
                dataZoom: {},
                dataView: {readOnly: false},
                restore: {},
                saveAsImage: {}
            }
        } : {},
        legend: {
            show: false,
        }
    };

    return option;
}
