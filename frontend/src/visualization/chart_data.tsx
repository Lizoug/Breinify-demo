import React, { useState, useEffect } from "react";


export function getEmbeddingData(
    algorithm: string,
    n: number,
    hoursParams: number[],
    daysParams: number[],
    weeksParams: number[],
    monthsParams: number[]) {
    const [data, setData] = useState<number[][]>([[1, 1, 1]]);
    const apiUrl = `http://localhost:8000/visualization/time/?algo_name=${algorithm}&n=${n}&${hoursParams}&${daysParams}&${weeksParams}&${monthsParams}`;


    useEffect(() => {
        const fetchImage = async () => {
            try {
                const response = await fetch(apiUrl);
                if (!response.ok) {
                    throw new Error("Failed to fetch the image.");
                }
                const fetchedData = await response.json();
                setData(fetchedData);

            } catch (error) {
                console.error("Error fetching the image:", error);
                // You can add error handling logic here if needed
            }
        };

        // Call the fetchImage function
        fetchImage();
        // eslint-disable-next-line
    }, [apiUrl]);

    return data;
}