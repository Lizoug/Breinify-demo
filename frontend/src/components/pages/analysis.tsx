import VizScatter from "../../visualization/charts";
import React, { useState } from "react";
import { Row, Col, Slider } from 'antd';
import {GetEmbeddingData} from "../../visualization/chart_data";
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { Switch, Space } from 'antd';
import { useEffect } from "react";



// Analysis is a React component for visualizing data based on different algorithms and parameters
export default function Analysis_xxl() {
    const [algorithm, setAlgorithm] = useState<string>("umap");
    const [n, setN] = useState<number>(2);
    const [days, setDays] = useState<[number, number]>([0, 6]);
    const [weeks, setWeeks] = useState<[number, number]>([0, 52]);
    const [months, setMonths] = useState<[number, number]>([0, 12]);
    const [hours, setHours] = useState<[number, number]>([0, 24]);
    const [rndValue, setRndValue] = useState<number>(0)
    const [filterToggle, setFilterToggle] = useState<boolean>(false)


    const { data, history, algoName } = GetEmbeddingData(algorithm, n, hours, days, weeks, months, rndValue);

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
        <Row justify="space-evenly" className="container_l">
            <Col span={11} className="A-main Box-Design_l">
                <h2 className="section-title">Main Visualization</h2>
                <div style={{height: "900px"}}>
                    <VizScatter
                        data={mainVisualizationData}
                        fsize={16}
                        algoName={algoName}
                        n_component={n}
                        includeToolbox={true}
                    />
                </div>



            </Col>
            <Col span={7} className="Box-Design_l B-history_xl">
                <h2 className="section-title">History</h2>
                <div className="history-wrapper_xl">
                    {[...history].reverse().map((entry, index) => (
                        <div style={{height: "600px"}}
                            key={index}
                            onClick={() => {
                                setMainVisualizationData(entry.data);
                                setAlgorithm(entry.algoName);
                                setN(entry.n_component);
                            }}
                        >
                            <VizScatter
                                data={entry.data}
                                fsize={14}
                                algoName={entry.algoName}
                                n_component={entry.n_component}
                                includeToolbox={false}

                            />
                        </div>
                    ))}
                </div>

            </Col>
            <Col span={5} className="C-option_l Box-Design_l">
                <h2 className="section-title">Event Parameters</h2>
                <Row className="input-row_l">
                    <label className="input-label_l">Algorithm:</label>
                    <select id="algorithm" value={algorithm} onChange={handleAlgorithmChange}
                            className="custom-select_l">
                        <option value="pca">PCA</option>
                        <option value="umap">UMAP</option>
                        <option value="tsne">t-SNE</option>
                    </select>
                </Row>

                <Row className="input-row_l">
                    <label className="input-label_l">Number of Components:</label>
                    <input
                        type="number"
                        id="n"
                        value={n}
                        onChange={handleNumberChange}
                        className="custom-input_l"
                    />
                </Row>
                <Row>
                    <label>Filter  </label>
                </Row>
                <Row className="space-below_l">
                    <Space direction="vertical">
                        <Switch
                            checked={filterToggle}
                            checkedChildren={<CheckOutlined />}
                            unCheckedChildren={<CloseOutlined />}
                            onChange={handleFilterToggle}
                            defaultChecked
                        />
                    </Space>
                </Row>
                {filterToggle && <>
                    <Row className="input-row_l">
                        <label className="input-label_l">Hours:</label>
                    </Row>
                    <Row>
                        <Slider
                            range
                            min={0}
                            max={24}
                            onChange={handleHoursChange}
                            value={hours}
                            className="custom-input_l"
                        />
                    </Row>

                    <Row className="input-row_l">
                        <label className="input-label_l">Days:</label>
                    </Row>
                    <Row>
                        <Slider
                            range
                            min={0}
                            max={6}
                            onChange={handleDaysChange}
                            value={days}
                            className="custom-input_l"
                        />
                    </Row>

                    <Row className="input-row_l">
                        <label className="input-label_l">Weeks:</label>
                    </Row>
                    <Row>
                        <Slider
                            range
                            min={0}
                            max={52}
                            onChange={handleWeeksChange}
                            value={weeks}
                            className="custom-input_l"
                        />
                    </Row>

                    <Row className="input-row_l">
                        <label className="input-label_l">Months:</label>
                    </Row>
                    <Row>
                        <Slider
                            range
                            min={0}
                            max={12}
                            onChange={handleMonthsChange}
                            value={months}
                            className="custom-input_l"
                        />
                    </Row>
                </>
                }
                <Row className="input-row_l">
                    <button onClick={handleFilterClick} className="custom-button_l">Visualize</button>
                </Row>

            </Col>
        </Row>
    );
}