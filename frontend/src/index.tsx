import 'antd/dist/reset.css';
import './css/index.css';
import React from 'react';
import PageFooter from "./components/footer";
import Routing from "./components/router";
import {PageHeader} from "./components/header";


export default function App() {
    return (
        <div className="app-container">
            <PageHeader/>
            <Routing/>
            <PageFooter/>
        </div>
    );
}
