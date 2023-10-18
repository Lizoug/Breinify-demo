import React from "react";
import {useMediaQuery} from "react-responsive";
import Analysis from "./analysis";
import Analysis_xxs from "./analysis_xxs";

export default function Size() {
    const size_xxs= useMediaQuery({query: "(max-device-width: 479px)"});

    if (size_xxs) {
        return <Analysis_xxs />;
    } else {
        return <Analysis />;
    }
}
