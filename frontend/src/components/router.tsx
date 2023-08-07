import {BrowserRouter, Routes, Route} from "react-router-dom";
import Home from "./pages/home";
import Analysis from "./pages/analysis"


export default function Routing() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/Analysis" element={<Analysis/>}/>
            </Routes>
        </BrowserRouter>
    );
}