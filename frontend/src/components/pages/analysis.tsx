import VizScatter from "../../visualization/charts";
import { Row, Col, Slider } from 'antd';
import {GetEmbeddingData} from "../../visualization/chart_data";
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { Switch, Space } from 'antd';
import React, { useState, useEffect, useContext, createContext } from "react";

interface ViewportProviderProps {
    children: React.ReactNode;
}

interface ViewportContextValue {
    width: number;
    height: number;
}

// Responsive design context and hooks
// Context provides a way to pass data through the component tree without
// having to pass props down manually at every level
const viewportContext = createContext<ViewportContextValue | undefined>(undefined);

export const ViewportProvider: React.FC<ViewportProviderProps> = ({ children }) => {
    const [width, setWidth] = useState(window.innerWidth);
    const [height, setHeight] = useState(window.innerHeight);

    const handleWindowResize = () => {
        setWidth(window.innerWidth);
        setHeight(window.innerHeight);
    };
    //  remove the previously added event listener, ensuring no lingering effects that could lead
    //  to unexpected behavior or memory leaks
    useEffect(() => {
        window.addEventListener("resize", handleWindowResize);
        return () => window.removeEventListener("resize", handleWindowResize);
    }, []);

    return (
        // the value being provided to the children is { width, height },
        // which are the current width and height of the viewport
        <viewportContext.Provider value={{ width, height }}>
            {children}
        </viewportContext.Provider>
    );
};

const useViewport = (): ViewportContextValue => {
    const context = useContext(viewportContext);
    if (!context) {
        throw new Error("useViewport must be used within a ViewportProvider");
    }
    return context;
};


const MOBILE_BREAKPOINT = 620;
const TABLET_BREAKPOINT = 1024;

// Analysis is a React component for visualizing data based on different algorithms and parameters
export default function Analysis() {
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

    const { width } = useViewport();

    let mainVisualizationSpan = 12;
    let historySpan = 6;
    let optionsSpan = 5;

    if (width <= MOBILE_BREAKPOINT) {
        mainVisualizationSpan = 24;
        historySpan = 24;
        optionsSpan = 24;
    } else if (width <= TABLET_BREAKPOINT) {
        mainVisualizationSpan = 10;
        historySpan = 10;
        optionsSpan = 20;
    }

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


    return (
        <ViewportProvider>
            <Row justify="space-evenly" className="container">
                <Col span={mainVisualizationSpan} className="A-main Box-Design">
                    <h2 className="section-title">Main Visualization</h2>
                    <VizScatter
                        data={mainVisualizationData}
                        fsize={12}
                        algoName={algoName}
                        n_component={n}
                        includeToolbox={true}
                    />
                </Col>
                <Col span={historySpan} className="B-history Box-Design">
                    <h2 className="section-title">History</h2>
                    {[...history].reverse().map((entry, index) => (
                        <div
                            key={index}
                            onClick={() => {
                                setMainVisualizationData(entry.data);
                                setAlgorithm(entry.algoName);
                                setN(entry.n_component);
                            }}
                        >
                            <VizScatter
                                data={entry.data}
                                fsize={5}
                                algoName={entry.algoName}
                                n_component={entry.n_component}
                                includeToolbox={false}
                            />
                        </div>
                    ))}
                </Col>
                <Col span={optionsSpan} className="C-option Box-Design">
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
                    <Row>
                        <label>Filter  </label>
                    </Row>
                    <Row className="space-below">
                        <Space direction="vertical">
                            <Switch
                                checked={filterToggle}
                                checkedChildren={<CheckOutlined />}
                                unCheckedChildren={<CloseOutlined />}
                                onChange={(checked) => setFilterToggle(checked)}
                                defaultChecked
                            />
                        </Space>
                    </Row>
                    {filterToggle && <>
                        <Row className="input-row">
                            <label className="input-label">Hours:</label>
                        </Row>
                        <Row>
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
                        </Row>
                        <Row>
                            <Slider
                                range
                                min={0}
                                max={6}
                                onChange={handleDaysChange}
                                value={days}
                                className="custom-input"
                            />
                        </Row>

                        <Row className="input-row">
                            <label className="input-label">Weeks:</label>
                        </Row>
                        <Row>
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
                        </Row>
                        <Row>
                            <Slider
                                range
                                min={0}
                                max={12}
                                onChange={handleMonthsChange}
                                value={months}
                                className="custom-input"
                            />
                        </Row>
                    </>
                    }
                    <Row className="input-row">
                        <button onClick={handleFilterClick} className="custom-button">Visualize</button>
                    </Row>

                </Col>
            </Row>
        </ViewportProvider>
    );
    }