import {BrowserRouter, Routes, Route} from "react-router-dom";
import Home from "./pages/home";
import Size from "./pages/analysis_main";


export default function Routing() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/Analysis" element={<Size/>}/>  // using Size here instead of separate Analysis and Analysis_xxs
            </Routes>
        </BrowserRouter>
    );
}
