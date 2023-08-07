import { VizScatter2D, VizScatter3D } from "../../visualization/charts";
import "../../App.css";
import React, { useState, useEffect } from "react";
import { Row, Col, Slider } from 'antd';
import '../../App.css';


// Analysis is a React component for visualizing data based on different algorithms and parameters
export default function Analysis() {
    // Initialize state variables using the useState hook
    const [data, setData] = useState<[number, number, number][]>([]);
    const [currentData, setCurrentData] = useState<{ data: [number, number][]; algoName: string; n_component: number } | null>(null);
    const [filteredData, setFilteredData] = useState<{ data: [number, number, number][]; algoName: string; n_component: number } | null>(null);
    const [history, setHistory] = useState<{ data: [number, number][]; algoName: string; n_component: number }[]>([]);
    const [algorithm, setAlgorithm] = useState<string>("umap");
    const [n, setN] = useState<number>(2);
    const [lastButtonPressed, setLastButtonPressed] = useState<string>("");

    const handleAlgorithmChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setAlgorithm(event.target.value);
    };

    const handleNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(event.target.value);
        setN(value);
    };

    // Function to fetch data when "Visualize" button is clicked
    const handleVisualizeClick = () => {
        setLastButtonPressed("visualize");
        const apiUrl = `http://localhost:8000/visualization/?algo_name=${algorithm}&n=${n}`;
        fetchData(apiUrl);
    };


    const fetchData = async (url: string) => {
        const response = await fetch(url);
        const fetchedData = await response.json();

        // Assume the fetchedData is of structure: [[component1, component2], ...]
        const newData: [number, number][] = fetchedData;

        // currentData and history keep [number, number] data structure
        if (newData.some(entry => entry[0] !== 0 && entry[1] !== 0)) {
            setHistory(prevHistory => [currentData, ...prevHistory].filter(entry => entry !== null) as any);
            setCurrentData({data: newData, algoName: algorithm, n_component: n});
        }
    };

    useEffect(() => {
        const apiUrl = `http://localhost:8000/visualization/?algo_name=${algorithm}&n=${n}`;
        fetchData(apiUrl);
    }, []);

    const [days, setDays] = useState<[number, number]>([0, 30]);
    const [weeks, setWeeks] = useState<[number, number]>([0, 52]);
    const [months, setMonths] = useState<[number, number]>([0, 12]);
    const [hours, setHours] = useState<[number, number]>([0, 24]);

    const handleHoursChange = (value: [number, number]) => {
        setHours(value);
    };

    const handleDaysChange = (value: [number, number]) => {
        setDays(value);
    };

    const handleWeeksChange = (value: [number, number]) => {
        setWeeks(value);
    };

    const handleMonthsChange = (value: [number, number]) => {
        setMonths(value);
    };

    // Function to fetch filtered data when "Filter" button is clicked
    const handleFilterClick = () => {
        setLastButtonPressed("filter");
        const hoursParams = hours.map(hour => `hours=${hour}`).join('&');
        const daysParams = days.map(day => `days=${day}`).join('&');
        const weeksParams = weeks.map(week => `weeks=${week}`).join('&');
        const monthsParams = months.map(month => `months=${month}`).join('&');
        const apiUrl = `http://localhost:8000/visualization/time/?algo_name=${algorithm}&n=${n}&${hoursParams}&${daysParams}&${weeksParams}&${monthsParams}`;
        console.log('Fetch URL:', apiUrl);
        fetchFilteredData(apiUrl);
    };

    const fetchFilteredData = async (url: string) => {
        const response = await fetch(url);
        const fetchedData = await response.json();

        // Assume the fetchedData is of structure: [[component1, component2, filter], ...]
        const newData: [number, number, number][] = fetchedData.map((data: [number, number, number]) => [...data]);

        console.log('Fetched data:', fetchedData);
        if (newData.some(entry => entry[0] !== 0 && entry[1] !== 0 && entry[2] !== 0)) {
            setFilteredData({data: newData, algoName: algorithm, n_component: n});
        }

        setData(newData);
        console.log('New data state:', newData);
    };




    return (
        <Row justify="space-evenly" className="container">
            <Col span={12} className="A-main Box-Design">
                <h2 className="section-title">Main Visualization</h2>
                {/* Make sure to render correct data depending on the last button pressed */}
                {
                    lastButtonPressed === "visualize" && currentData ?
                        <VizScatter2D data={currentData.data} fsize={7} algoName={currentData.algoName} n_component={currentData.n_component} includeToolbox={true}/> :
                        lastButtonPressed === "filter" && filteredData ?
                            <VizScatter3D data={filteredData.data} fsize={7} algoName={filteredData.algoName} n_component={filteredData.n_component} includeToolbox={true}/> :
                            null
                }
            </Col>
            <Col span={6} className="B-history Box-Design">
                <h2 className="section-title">History</h2>
                {history.map((entry, index) => (
                    <div onClick={() => setCurrentData(entry)}>
                        <VizScatter2D key={index} data={entry.data} fsize={5} algoName={entry.algoName}
                                    n_component={entry.n_component} includeToolbox={false}/>
                    </div>
                ))}
            </Col>
            <Col span={5} className="C-option Box-Design">
                <h2 className="section-title">Event Parameters</h2>
                <Row className="input-row">
                    <label className="input-label">Algorithm:</label>
                    <select id="algorithm" value={algorithm} onChange={handleAlgorithmChange}
                            className="custom-select">
                        <option value="pca">PCA</option>
                        <option value="umap">UMAP</option>
                        <option value="tsne">t-SNE</option>
                    </select>
                </Row>

                <Row className="input-row">
                    <label className="input-label">Number of Components:</label>
                    <input
                        type="number"
                        id="n"
                        value={n}
                        onChange={handleNumberChange}
                        className="custom-input"
                    />
                </Row>

                <Row className="input-row">
                    <button onClick={handleVisualizeClick} className="custom-button">Visualize</button>
                </Row>

                <Row className="input-row">
                    <label className="input-label">Hours:</label>
                    <Slider
                        range
                        min={0}
                        max={24}
                        onChange={handleHoursChange}
                        value={hours}
                        className="custom-input"
                    />
                </Row>

                <Row className="input-row">
                    <label className="input-label">Days:</label>
                    <Slider
                        range
                        min={0}
                        max={31}
                        onChange={handleDaysChange}
                        value={days}
                        className="custom-input"
                    />
                </Row>

                <Row className="input-row">
                    <label className="input-label">Weeks:</label>
                    <Slider
                        range
                        min={0}
                        max={52}
                        onChange={handleWeeksChange}
                        value={weeks}
                        className="custom-input"
                    />
                </Row>

                <Row className="input-row">
                    <label className="input-label">Months:</label>
                    <Slider
                        range
                        min={0}
                        max={12}
                        onChange={handleMonthsChange}
                        value={months}
                        className="custom-input"
                    />
                </Row>


                <Row className="input-row">
                    <button onClick={handleFilterClick} className="custom-button">Filter</button>
                </Row>
            </Col>
        </Row>
    );
}
