import React, { useEffect, useRef } from 'react';
import { optionVizScatter2D, optionVizScatter3D } from "./charts_option";
import * as echarts from 'echarts';
import 'echarts-for-react';

// Define a function component for scatter plots visualization
function VizScatter({ data, fsize, algoName, n_component, includeToolbox, dim }: { data: [number, number][] | [number, number, number][], fsize: number, algoName: string, n_component: number, includeToolbox: boolean, dim: 2 | 3 }) {
    // Create a ref to hold a reference to the HTML div element that will contain the chart
    const chartRef = useRef<HTMLDivElement | null>(null);
    // Create a ref to hold a reference to the ECharts instance
    const chartInstance = useRef<echarts.ECharts | null>(null);

    // Generate chart options based on the dimension of the data (2D or 3D)
    const option = dim === 2 ? optionVizScatter2D(data as [number, number][], fsize, algoName, n_component, includeToolbox) :
        optionVizScatter3D(data as [number, number, number][], fsize, algoName, n_component, includeToolbox);

    // Use useEffect hook to initialize the ECharts instance and update the chart when the component mounts or updates
    useEffect(() => {
        // Check if the chart ref is not null
        if (chartRef.current !== null) {
            // If the chart instance ref is null, initialize a new ECharts instance
            if (chartInstance.current === null) {
                chartInstance.current = echarts.init(chartRef.current);
            }
            // If the chart instance ref is not null, set the option for the chart
            if (chartInstance.current !== null) {
                console.log("Setting option for chart", option);
                chartInstance.current.setOption(option);
            }
        }
    }, [data, fsize, algoName, n_component, includeToolbox, dim]); // dependencies of the effect

    // Render a div element that will contain the chart
    return (
        <div ref={chartRef} style={{ width: "100%", height: 400 }} />
    );
}

// Define a function component for 2D scatter plots
export function VizScatter2D(props: { data: [number, number][], fsize: number, algoName: string, n_component: number, includeToolbox: boolean }) {
    // Render the VizScatter component with 'dim' set to 2
    return <VizScatter {...props} dim={2} />;
}

// Define a function component for 3D scatter plots
export function VizScatter3D(props: { data: [number, number, number][], fsize: number, algoName: string, n_component: number, includeToolbox: boolean }) {
    // Render the VizScatter component with 'dim' set to 3
    return <VizScatter {...props} dim={3} />;
}
