import React from "react";
import {useMediaQuery} from "react-responsive";
import Analysis from "./analysis";
import Analysis_xxs from "./analysis_xxs";
import Analysis_xs from "./analysis_xs";
import Analysis_m from "./analysis_m";


export default function Size() {
    const size_xxs = useMediaQuery({query: "(max-device-width: 479px)"});
    const size_xs = useMediaQuery({query: "(min-device-width: 480px) and (max-device-width: 768px)"});
    const size_m = useMediaQuery({query: "(min-device-width: 769px) and (max-device-width: 1024px"})
    if (size_xxs) {
        return <Analysis_xxs />;

    }
    else if (size_xs) {
        return <Analysis_xs />;
    }

    else if (size_m) {
        return <Analysis_m />
    }
    else {
        return <Analysis />;
    }
}
