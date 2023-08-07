import { useState, useEffect } from "react";


export function GetEmbeddingData(
    algorithm: string,
    n: number,
    hours: number[],
    days: number[],
    weeks: number[],
    months: number[],
    rndValue: number
)
{
    const [data, setData] = useState<number[][]>([[1, 1, 1]]);
    const [history, setHistory] = useState<{ data: number[][]; algoName: string; n_component: number }[]>([{data: data, algoName: algorithm, n_component: n }]);

    const hoursParams = hours.map(hour => `hours=${hour}`).join('&');
    const daysParams = days.map(day => `days=${day}`).join('&');
    const weeksParams = weeks.map(week => `weeks=${week}`).join('&');
    const monthsParams = months.map(month => `months=${month}`).join('&');
    const apiUrl = `http://localhost:8000/visualization/time/?algo_name=${algorithm}&n=${n}&${hoursParams}&${daysParams}&${weeksParams}&${monthsParams}`;

    console.log(hoursParams, weeksParams, daysParams, monthsParams)
    console.log(apiUrl)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(apiUrl);
                if (!response.ok) {
                    throw new Error("Failed to fetch the image.");
                }
                const fetchedData = await response.json();
                setData(fetchedData);
                //console.log(fetchedData)
                setHistory(prevHistory => [data, ...prevHistory].filter(entry => entry !== null) as any);

            } catch (error) {
                console.error("Error fetching the image:", error);
                // You can add error handling logic here if needed
            }
        };

        // Call the fetchImage function
        fetchData();
        // eslint-disable-next-line
    }, [rndValue]);

    return {
        "data": data,
        "history": history
    };
}
