import React from 'react';
import { Row, Col } from 'antd';

export default function Home() {
    return (
        <div className="babyblue-body">
            <div className="babyblue-body">
                <div className="page-container">
                    <Row justify={"space-around"}>
                        <Col className="title-col first-title-col" span={11}>
                            <h2 className="page-h2">TEST?</h2>
                        </Col>
                        <Col className="title-col" span={11}>
                            <h2 className="page-h2">TEST?</h2>
                        </Col>
                    </Row>
                    <Row justify={"space-around"}>
                        <Col span={11}>
                            <div className="page-box page-box-text">
                                <p className="page-p">
                                    <br /><br />
                                </p>
                            </div>
                        </Col>

                        <Col span={11}>

                            <div className="page-box page-box-text">
                                <p className="page-p">
                                    <br /><br />
                                </p>
                            </div>
                        </Col>
                    </Row>
                </div>
            </div>
        </div>
    );
}
