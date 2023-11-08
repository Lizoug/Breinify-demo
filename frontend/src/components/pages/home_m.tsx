import React from 'react';
import { Row, Col } from 'antd';


export default function Home_M() {
    return (
        <div className="">
            <Row className="Box-Design">
                <h2 className="titleStyle-home-l">Embeddings</h2>
            </Row>
            <Row justify={"space-around"}>
                <Col span={11}>
                    <p className="Box-Design_l">
                        In the bustling world of e-commerce, where countless products compete for attention, gaining a competitive edge is essential. That's where embeddings come into play, igniting a revolution in how businesses understand and engage with their customers. Picture this: a digital key that unlocks the hidden secrets of each customer interaction, enabling businesses to create tailored experiences that captivate and convert. Embeddings are like magical fingerprints, unique representations of customer behavior that capture their intrinsic characteristics and relationships. By utilizing advanced algorithms and machine learning techniques, e-commerce platforms can transform mundane event data into rich, multidimensional embeddings. These embeddings hold the power to reveal the nuances, preferences, and hidden connections between products in a way that was once unimaginable.

                        In different publications we exhibit the performance of embeddings for different challenges in e-commerce.
                        <br />
                        <br />
                        Recommendation:
                        <ul>
                            <li>- <a href="https://doi.org/10.1109/HPCC-DSS-SmartCity-DependSys53884.2021.00195" target="_blank" rel="noopener noreferrer">https://doi.org/10.1109/HPCC-DSS-SmartCity-DependSys53884.2021.00195</a></li>
                            <li>- <a href="https://doi.org/10.5220/0010400706100617" target="_blank" rel="noopener noreferrer">https://doi.org/10.5220/0010400706100617</a></li>
                        </ul>
                        Purchase Prediction:
                        <ul>
                            <li>- <a href="https://doi.org/10.1145/3511808.3557127" target="_blank" rel="noopener noreferrer">https://doi.org/10.1145/3511808.3557127</a></li>
                            <li>- <a href="https://doi.org/10.3390/jtaer18030070" target="_blank" rel="noopener noreferrer">https://doi.org/10.3390/jtaer18030070</a></li>
                        </ul>
                        More to come in the future.
                    </p>
                </Col>
                <Col span={11}>
                    {/*<h2 className="">TEST?</h2>*/}
                    <p className="Box-Design_l">
                        Our embedding visualization tool opens doors to the world of embedding representation and allows you to engage with the embeddings and discover insights and knowledge. Let's delve into the captivating world of embeddings and uncover why they are a game-changer for e-commerce.
                        <br />
                        <br />
                        Unlike natural language, which is the basis for the embedding methodology used here, e-commerce is a rapidly changing industry that requires quick marketing decisions and a deep understanding of customer behavior. It's essential to understand the role of embeddings and how they represent critical data points. This demonstrator provides the initial steps towards a better understanding of embeddings by utilizing real data from a consumer packaged goods retailer. Embedding brings customer behavior into a 32-dimensional space that cannot be directly represented. To create a representation, we have reduced the dimensions to two using methods such as UMAP, T-SNE, or PCA. The demonstrator provides some filters to investigate the activities.
                        <br />
                        <br />
                        The demonstrator is still work in progress and new features will be added in the future.
                    </p>
                </Col>
            </Row>
        </div>
    );
}
