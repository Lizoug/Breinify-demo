import React from "react";
import {useMediaQuery} from "react-responsive";
import Analysis from "./analysis";
import Analysis_xxs from "./analysis_xxs";
import Analysis_xs from "./analysis_xs";


export default function Size() {
    const size_xxs = useMediaQuery({query: "(max-device-width: 479px)"});
    const size_xs = useMediaQuery({query: "(min-device-width: 480px) and (max-device-width: 768px)"});

    if (size_xxs) {
        return <Analysis_xxs />;

    }
    else if (size_xs) {
        return <Analysis_xs />;
    }
    else {
        return <Analysis />;
    }
}
