import React from 'react';
import { createRoot } from "react-dom/client";

import PageFooter from "./components/footer";
import Routing from "./components/router";
import PageHeader from "./components/header";

import 'antd/dist/reset.css';
import './css/index.css';

const root = createRoot(document.getElementById("root")!);

root.render(
    <div className="app-container">
        <PageHeader/>
        <Routing/>
        <PageFooter/>
    </div>
);