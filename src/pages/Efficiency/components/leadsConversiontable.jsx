import React from 'react';
import { CardBody, CardTitle, Row, Table } from 'reactstrap';

export default function LeadsConversiontable({ resData, avg }) {
    return (
        <CardBody>
            <CardTitle tag={"h3"} style={{ marginBottom: "2rem"}}>Lead/Opportunity Conversion Rates</CardTitle>
            <Table responsive striped bordered>
                <thead>
                    <tr>
                        <th>Rep Name</th>
                        <th>Leads</th>
                        <th>Opportunities</th>
                        <th>
                            Lead to Opp
                            Conversion Rate %
                        </th>
                        <th>NewCustomers</th>
                        <th>Win Rate %</th>
                    </tr>
                </thead>
                {
                    (resData.length > 0 && avg) ? (
                        <tbody>
                            {/** Query Info per column */}
                            {resData?.map((item, idx) => (
                                <React.Fragment key={idx}>
                                    <tr>
                                        <td>{item.Name}</td>
                                        <td>{item.Leads}</td>
                                        <td>{item.Opportunities}</td>
                                        <td>{item.Conversion} %</td>
                                        <td>{item.Customer}</td>
                                        <td>{item.WinRate} %</td>
                                    </tr>
                                </React.Fragment>
                            ))}
                            <tr>
                                <td>{avg.avgName}</td>
                                <td>{(avg.avgLeads) / 3}</td>
                                <td>{((avg.avgOpportunity) / 3).toFixed(2)}</td>
                                <td>{((avg.avgConversion) / 3).toFixed(2)} %</td>
                                <td>{(avg.avgCustomer) / 3}</td>
                                <td>{((avg.avgWin) / 3).toFixed(2)} %</td>
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
        </CardBody>
    );
}