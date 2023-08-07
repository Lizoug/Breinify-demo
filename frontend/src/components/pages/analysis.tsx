import VizScatter
import React, { useState, useEffect } from "react";
import { Row, Col, Slider } from 'antd';
import {getEmbeddingData} from "../../visualization/chart_data";


// Analysis is a React component for visualizing data based on different algorithms and parameters
export default function Analysis() {
    const [algorithm, setAlgorithm] = useState<string>("umap");
    const [n, setN] = useState<number>(2);
    const [days, setDays] = useState<[number, number]>([0, 30]);
    const [weeks, setWeeks] = useState<[number, number]>([0, 52]);
    const [months, setMonths] = useState<[number, number]>([0, 12]);
    const [hours, setHours] = useState<[number, number]>([0, 24]);

    const data = getEmbeddingData(algorithm, n, hours, days, weeks, months)


    const handleAlgorithmChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setAlgorithm(event.target.value);
    };

    const handleNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(event.target.value);
        setN(value);
    };

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

    return (
        <Row justify="space-evenly" className="container">
            <Col span={12} className="A-main Box-Design">
                <h2 className="section-title">Main Visualization</h2>
                <VizScatter data={} />
            </Col>
            <Col span={6} className="B-history Box-Design">
                <h2 className="section-title">History</h2>
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
