import { EChartsOption } from 'echarts';

/**
 * Computes a histogram for an array of numbers.
 * @param data - Input data, an array of numbers.
 * @param binCount - Number of bins/categories the data should be divided into.
 * @returns - An array representing the frequency (count) of numbers in each bin.
 */
function computeHistogram(data: number[], binCount: number): number[] {
    // Find the smallest and largest numbers in the dataset
    let minValue = Math.min(...data);
    let maxValue = Math.max(...data);

    // Determine the width/size of each bin based on the range of the data and the desired number of bins.
    const binSize = (maxValue - minValue) / binCount;

    // Initialize an array of zeros for the bins
    const bins = Array(binCount).fill(0);

    // For each number in the data, find its appropriate bin and increment the count for that bin.
    data.forEach(val => {
        const binIndex = Math.min(binCount - 1, Math.floor((val - minValue) / binSize));
        bins[binIndex]++;
    });

    return bins;
}

/**
 * Prepares configuration options for a scatter plot visualization, augmented with histograms.
 * @param data - Data points for the scatter plot, where:
 *               item[0] is the x-coordinate,
 *               item[1] is the y-coordinate,
 *               item[2] indicates the color group (1 for blue, 0 for red).
 * @param fsize - Size of each data point in the scatter plot.
 * @param algoName - Name of the algorithm used to generate the data.
 * @param n_component - Number of components/features in the data.
 * @param includeToolbox - Whether to include interactive tools in the visualization.
 * @returns - Configuration options for the ECharts scatter plot.
 */
export function optionVizScatter(data: number[][], fsize: number, algoName: string, n_component: number, includeToolbox: boolean): EChartsOption {
    // Color assignments for the two groups
    const colors = ['red', 'blue'];

    // Extract masks for each group based on item[2] of each data point
    const mask_blue = data.map(item => item[2] === 1);  // Mask where data belongs to the blue group
    const mask_red = data.map(item => item[2] === 0);   // Mask where data belongs to the red group

    // Using masks, separate the data into two groups: blue and red
    const data_blue = data.filter((_, i) => mask_blue[i]);
    const data_red = data.filter((_, i) => mask_red[i]);

    // Determine number of bins for histograms
    const binCount = 10;

    // Compute histograms for the x-coordinates and y-coordinates for each group
    const xHistogramBlue = computeHistogram(data_blue.map(d => d[0]), binCount);
    const xHistogramRed = computeHistogram(data_red.map(d => d[0]), binCount);
    const yHistogramBlue = computeHistogram(data_blue.map(d => d[1]), binCount);
    const yHistogramRed = computeHistogram(data_red.map(d => d[1]), binCount);

    // Configuration options for the ECharts visualization
    const option: EChartsOption = {
        // Setting up the title of the chart, centered at the top
        title: {
            text: `${algoName} (${n_component} components)`,
            left: 'center',
            textStyle: {
                fontSize: fsize,
                height: 50
            }
        },
        // Define three grid areas for the main scatter plot, and two histograms (top and right)
        grid: [
            { left: '10%', width: '73%', bottom: '15%', height: '62%' },  // Main scatter plot area
            { left: '10%', width: '73%', top: '7%', height: '15%' },     // Top histogram area
            { left: '85%', width: '15%', bottom: '15%', height: '62%' }   // Right histogram area
        ],
        xAxis: [
            { gridIndex: 0,
                min: "dataMin",
                max: "dataMax"
            },
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
            { gridIndex: 0,
                min: "dataMin",
                max: "dataMax"},
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
                barWidth: '99.3%',
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
                barWidth: '99.3%',
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
                barWidth: '99.3%',
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
                barWidth: '99.3%',
                data: yHistogramRed
            }
        ],
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            },
            formatter: function(params) {
                let tooltipText = "";

                // Handle the case when params is an array
                if (Array.isArray(params)) {
                    params.forEach(param => {
                        tooltipText += `${param.seriesName}: ${param.data} points<br>`;
                    });
                } else { // Handle the case when params is a single object
                    tooltipText = `${params.seriesName}: ${params.data} points<br>`;
                }

                return tooltipText;
            }
        },
        toolbox: includeToolbox ? {
            bottom: "0%",
            show: true,
            feature: {
                dataZoom: {},      // Tool for zooming in/out
                dataView: {readOnly: false},  // Tool for viewing raw data
                restore: {},       // Tool for restoring to original view
                saveAsImage: {},    // Tool for saving visualization as an image

            }
        } : {},
        // Legend configuration (not shown in this visualization)
        legend: {
            show: false,
        }
    };

    return option;
}