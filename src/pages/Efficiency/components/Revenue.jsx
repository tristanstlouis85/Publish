import React from 'react';
import { CardBody, CardTitle, Table, Alert, Row, Col } from 'reactstrap';

export default function Revenue({ revData, totalRevenue }) {
    return (
        <CardBody>
            <CardTitle tag={"h3"} style={{ marginBottom: "2rem"}}>Revenue</CardTitle>
            <Table responsive striped bordered>
                <thead>
                    <tr>
                        <th>Rep Name</th>
                        <th>Revenue</th>
                        <th>Revenue Per Lead</th>
                        <th>Revenue Per Opportunity</th>
                        <th>Revenue Per Customer</th>
                        <th>Estimated Revenue</th>
                    </tr>
                </thead>
                {
                    (revData.length > 0 && totalRevenue) ? (
                        <tbody>
                            {revData?.map((item, idx) => (
                                <React.Fragment key={idx}>
                                    <tr>
                                        <td>{item.Name}</td>
                                        <td>${item.Revenue}</td>
                                        <td>${item.RevenuePerLead}</td>
                                        <td>${item.RevenuePerOpportunity}</td>
                                        <td>${item.RevenuePerCustomer}</td>
                                        <td>${item.EstimatedRevenueWithTeamAverageLeads}</td>
                                    </tr>
                                </React.Fragment>
                            ))}
                            <tr>
                                <td>{totalRevenue.Name}</td>
                                <td>${((totalRevenue.avgRevenue) / 3).toFixed(2)}</td>
                                <td>${((totalRevenue.avgLeads) / 3).toFixed(2)}</td>
                                <td>${((totalRevenue.avgOpportunity) / 3).toFixed(2)}</td>
                                <td>${((totalRevenue.avgPerCustomer) / 3).toFixed(2)}</td>
                                <td>${((totalRevenue.avgEstimated) / 3).toFixed(2)}</td>
                            </tr>
                            <tr>
                                <td>Total Revenues</td>
                                <td>${totalRevenue.avgRevenue}</td>
                                <td>${totalRevenue.avgLeads}</td>
                                <td>${totalRevenue.avgOpportunity}</td>
                                <td>${totalRevenue.avgPerCustomer}</td>
                                <td>${totalRevenue.avgEstimated}</td>
                            </tr>
                        </tbody>
                    ) : (
                        <tbody>
                            <tr>
                                <td>Please wait...</td>
                            </tr>
                        </tbody>
                    )
                }
            </Table>
            <Row className="justify-content-center">
                <Col xs="12" md="14">
                    <Alert color={'success'} className="text-center">
                        Note: By balancing the top of the lead funnel, you could increase revenue by $9,985
                    </Alert>
                </Col>
            </Row>
        </CardBody>
    )
}