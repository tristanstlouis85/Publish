import React from 'react';
import { Card, CardBody, Col, Row } from 'reactstrap';

const ChartPipeline = ({ Opportunities }) => {
    return (
        <React.Fragment>
            <Col>
                <Card>
                    <CardBody>
                        <h4 className='text-center mb-4'>Pipeline By Stage</h4>
                        <div className='flex flex-col'>
                            {Opportunities.map(({ pro, stage, num }, idx) => (
                                <Row key={idx} 
                                    style={{ 
                                        width: `${100 - idx * 10}%`,
                                        margin: '0 auto 1.1px',
                                    }}
                                >
                                    <span className="btn btn-primary" type="span" style={{
                                        fontSize: "1rem",
                                        color: "white",
                                        cursor: "default",
                                        boxShadow: "0px 15px 10px -15px #111"
                                    }}>
                                        {`${pro}% - ${stage}: $${num.toLocaleString()}`}
                                    </span>
                                </Row>
                            ))}
                        </div>
                    </CardBody>
                </Card>    
            </Col>
        </React.Fragment>
    );
};

export default ChartPipeline;
