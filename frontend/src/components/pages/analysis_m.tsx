import VizScatter from "../../visualization/charts";
import React, { useState } from "react";
import { Row, Col, Slider } from 'antd';
import {GetEmbeddingData} from "../../visualization/chart_data";
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { Switch, Space } from 'antd';
import { useEffect } from "react";



// Analysis is a React component for visualizing data based on different algorithms and parameters
export default function Analysis_xs() {
    const [algorithm, setAlgorithm] = useState<string>("umap");
    const [n, setN] = useState<number>(2);
    const [days, setDays] = useState<[number, number]>([0, 6]);
    const [weeks, setWeeks] = useState<[number, number]>([0, 52]);
    const [months, setMonths] = useState<[number, number]>([0, 12]);
    const [hours, setHours] = useState<[number, number]>([0, 24]);
    const [rndValue, setRndValue] = useState<number>(0)
    const [filterToggle, setFilterToggle] = useState<boolean>(false)


    const {data, history, algoName} = GetEmbeddingData(algorithm, n, hours, days, weeks, months, rndValue);

    const [mainVisualizationData, setMainVisualizationData] = useState<number[][]>([[]]);

    // whenever data changes, the mainVisualizationData state variable is updated with the new data
    useEffect(() => {
        setMainVisualizationData(data);
    }, [data]);

    const handleFilterClick = () => {
        setRndValue(Math.random())
    }


    const handleAlgorithmChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setAlgorithm(event.target.value);
    };

    const handleNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(event.target.value);
        setN(value);
    };

    const handleHoursChange = (value: [number, number]) => {
        setHours(value);
        console.log(hours)
    };

    const handleDaysChange = (value: [number, number]) => {
        setDays(value);
        console.log(days)
    };

    const handleWeeksChange = (value: [number, number]) => {
        setWeeks(value);
        console.log(weeks)
    };

    const handleMonthsChange = (value: [number, number]) => {
        setMonths(value);
        console.log(months)
    };
    // switching the filter switch off
    const [originalHours, setOriginalHours] = useState<[number, number]>(hours);
    const [originalDays, setOriginalDays] = useState<[number, number]>(days);
    const [originalWeeks, setOriginalWeeks] = useState<[number, number]>(weeks);
    const [originalMonths, setOriginalMonths] = useState<[number, number]>(months);

    const handleFilterToggle = (checked: boolean) => {
        if (checked) {
            // Filter is on; save the data "Original"
            setOriginalHours(hours);
            setOriginalDays(days);
            setOriginalWeeks(weeks);
            setOriginalMonths(months);
            setFilterToggle(true);
        } else {
            // Filter is off; restore the original condition
            setHours(originalHours);
            setDays(originalDays);
            setWeeks(originalWeeks);
            setMonths(originalMonths);
            setFilterToggle(false);
        }
    };
    return (
        <div>
            <Row justify="space-around" className=" padding-top-20">
                <Col span={23} className="Box-Design">
                    <Row justify={"space-between"}>
                        <Col span={10}>
                            <label className="input-label">Algorithm:</label>
                            <select id="algorithm" value={algorithm} onChange={handleAlgorithmChange} className="custom-select">
                                <option value="pca">PCA</option>
                                <option value="umap">UMAP</option>
                                <option value="tsne">t-SNE</option>
                            </select>
                        </Col>

                        <Col span={10}>
                            <label className="input-label">Components:</label>
                            <input
                                type="number"
                                id="n"
                                value={n}
                                onChange={handleNumberChange}
                                className="custom-input"
                            />
                        </Col>
                    </Row>
                </Col>
            </Row>

            <Row justify="center" className="padding-top-20">
                <Col span={23}>
                    <Row className="Box-Design">
                        <Col span={2}>
                            <label className="input-label">Filter</label>
                        </Col>
                        <Col className="space-below">
                            <Switch
                                checked={filterToggle}
                                checkedChildren={<CheckOutlined />}
                                unCheckedChildren={<CloseOutlined />}
                                onChange={handleFilterToggle}
                                defaultChecked
                            />
                        </Col>
                    </Row>
                </Col>
            </Row>


            {filterToggle && (
                <div>
                    <Row justify={"center"} className="padding-top-20 ">
                        <Col span={23} className="Box-Design">
                            <Row justify="space-around">
                                <Col span={23}>
                                    <Row justify="space-between" className="input-row">
                                        <Col><label className="input-label">Hours:</label></Col>
                                        <Col span={9}>
                                            <Slider
                                                range min={0}
                                                max={24}
                                                onChange={handleHoursChange}
                                                value={hours}
                                                className="custom-input" />
                                        </Col>
                                        <Col><label className="input-label">Days:</label></Col>
                                        <Col span={9}>
                                            <Slider
                                                range min={0}
                                                max={6}
                                                onChange={handleDaysChange}
                                                value={days}
                                                className="custom-input" />
                                        </Col>
                                    </Row>

                                    <Row justify="space-between" className="input-row">
                                        <Col><label className="input-label">Weeks:</label></Col>
                                        <Col span={9}>
                                            <Slider
                                                range min={0}
                                                max={52}
                                                onChange={handleWeeksChange}
                                                value={weeks}
                                                className="custom-input" />
                                        </Col>
                                        <Col><label className="input-label">Months:</label></Col>
                                        <Col span={9}>
                                            <Slider
                                                range min={0}
                                                max={12}
                                                onChange={handleMonthsChange}
                                                value={months}
                                                className="custom-input" />
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </div>
            )}

            <Row className="input-row padding-top-20">
                <button onClick={handleFilterClick} className="custom-button">Visualize</button>
            </Row>


            <Col span={24}>
                <Row justify={"space-around"} className="input-row">
                    <Col span={13} className="Box-Design">
                        <h2 className="section-title">Main Visualization</h2>
                        <div style={{height: "400px"}}>
                            <VizScatter
                                data={mainVisualizationData}
                                fsize={12}
                                algoName={algoName}
                                n_component={n}
                                includeToolbox={true}
                            />
                        </div>
                    </Col>

                    <Col span={9} className="Box-Design">
                        <h2 className="section-title">History</h2>
                        <div className="history-wrapper">
                            {[...history].reverse().map((entry, index) => (
                                <div className="history-container"
                                     key={index}
                                     onClick={() => {
                                         setMainVisualizationData(entry.data);
                                         setAlgorithm(entry.algoName);
                                         setN(entry.n_component);
                                     }}
                                >
                                    <div style={{height: "250px"}}>
                                        <VizScatter
                                            data={entry.data}
                                            fsize={10}
                                            algoName={entry.algoName}
                                            n_component={entry.n_component}
                                            includeToolbox={false}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Col>
                </Row>
            </Col>

        </div>
    );
}