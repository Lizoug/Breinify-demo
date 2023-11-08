import React from "react";
import {useMediaQuery} from "react-responsive";
import Home_Xxs from "./home_xxs";
import Home_Xs from "./home_xs";
//import Home_M from "./home_m";
//import Home_L from "./home_l";
//import Home_Xl from "./home_xl";



export default function Size_home() {
    const size_xxs = useMediaQuery({query: "(max-device-width: 479px)"});
    const size_xs = useMediaQuery({query: "(min-device-width: 480px) and (max-device-width: 768px)"});
    const size_m = useMediaQuery({query: "(min-device-width: 769px) and (max-device-width: 1024px"});
    const size_l = useMediaQuery({query: "(min-device-width: 1025px) and (max-device-width: 1599px)"});
    const size_xl= useMediaQuery({query: "(min-device-width: 1600px) and (max-device-width: 1919px)"});

    if (size_xxs) return <Home_Xxs />;
    if (size_xs) return <Home_Xs />;
    //if (size_m) return <Home_M />;
    //if (size_l) return <Home_L />;
    //if (size_xl) return <Home_Xl />
    return <Home_Xs />;
}
