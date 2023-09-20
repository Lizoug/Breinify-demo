// Import all exports from the 'echarts' module as 'echarts'
// Import the 'EChartsOption' type from the 'echarts' module
import { EChartsOption } from 'echarts';


// Define a function that generates options for a 3D scatter plot
export function optionVizScatter(data: number[][], fsize: number, algoName: string, n_component: number, includeToolbox: boolean) : EChartsOption {
    // Define the colors for the points (assuming 0 corresponds to 'red' and 1 corresponds to 'blue')
    const colors = ['red', 'blue'];
    const mask_blue = data.map(item => item[2] === 1);
    const mask_red = data.map(item => item[2] === 0)
    const data_blue = data.filter((item, i) => mask_blue[i]);
    const data_red = data.filter((item, i) => mask_red[i]);

    // Define the option for the scatter plot
    const option: EChartsOption = {
        // Set the title of the plot
        title: {
            text: `${algoName} (${n_component} components)`,
            left: 'center'
        },
        xAxis: {},
        yAxis: {},
        series: [
            {
                // Set the size of each symbol (dot) in the scatter plot
                symbolSize: fsize,
                // Transform the data to a format expected by ECharts and set the color of each point
                data: data_blue.map(point => ({
                    value: [point[0], point[1]],
                    itemStyle: {
                        color: colors[1], // color based on filter value
                    },
                })),
                // Set the type of plot as 'scatter'
                type: 'scatter'
            },
            {
                // Set the size of each symbol (dot) in the scatter plot
                symbolSize: fsize,
                // Transform the data to a format expected by ECharts and set the color of each point
                data: data_red.map(point => ({
                    value: [point[0], point[1]],
                    itemStyle: {
                        color: colors[0], // color based on filter value
                    },
                })),
                // Set the type of plot as 'scatter'
                type: 'scatter'
            }
        ],
        // Conditionally include the toolbox based on the 'includeToolbox' argument
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
            type: 'scroll'
        }
    };
    // Return the option
    return option;
}