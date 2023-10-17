import React from 'react';
import { CardBody, CardTitle, Table } from 'reactstrap';

export default function ValuseAbove({ valData }) {
    return (
        <CardBody>
            <CardTitle tag={"h3"} style={{ marginBottom: "2rem"}}>Value Above Replacement</CardTitle>
            <Table responsive striped bordered>
                <thead>
                    <tr>
                        <th>Rep Name</th>
                        <th>VARP</th>
                        <th>Notes</th>
                    </tr>
                </thead>
                {
                    (valData.length > 0) ? (
                        <tbody>
                            {valData?.map((item, idx) => (
                                console.log(item),
                                <React.Fragment key={idx}>
                                    <tr>
                                        <td>{item.Name}</td>
                                        <td style={{ color: `${item.colors}`}}>{(item.VARP).toFixed(2)}$</td>
                                        <td dangerouslySetInnerHTML={{ __html: item.WinRateNote }}></td>
                                    </tr>
                                </React.Fragment>
                            ))}
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
    )
}