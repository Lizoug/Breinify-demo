import {BrowserRouter, Routes, Route} from "react-router-dom";
import Home from "./pages/home";
import Analysis, { ViewportProvider } from "./pages/analysis"; // Ensure correct export/import

export default function Routing() {
    return (
        <BrowserRouter>
            <ViewportProvider>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/Analysis" element={<Analysis/>}/>
                </Routes>
            </ViewportProvider>
        </BrowserRouter>
    );
}
