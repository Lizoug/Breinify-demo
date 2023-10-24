import VizScatter from "../../visualization/charts";
import React, { useState } from "react";
import { Row, Col, Slider } from 'antd';
import {GetEmbeddingData} from "../../visualization/chart_data";
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { Switch, Space } from 'antd';
import { useEffect } from "react";



// Analysis is a React component for visualizing data based on different algorithms and parameters
export default function Analysis_xxs() {
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