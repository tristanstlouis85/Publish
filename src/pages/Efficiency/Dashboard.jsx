import React, { useEffect, useState } from 'react';
import { Card, Row } from 'reactstrap';
import { repMetrics } from './lib/LeadsOpportunityQuery';
import LeadsConversiontable from './components/leadsConversiontable';
import Revenue from './components/Revenue';
import ValuseAbove from './components/valuseAbove';
import { repRevenueMetrics } from './lib/Revenue';
import { repValueMetrics } from './lib/valuesAbove';

export default function Efficiency() {

    const [resData, setResData] = useState([]);
    const [revData, setRevData] = useState([]);
    const [valData, setValData] = useState([]);
    const [loading, setLoading] = useState(true);

    /** Revenue */
    const [avg, setAvg] = useState([]);
    const [totalRevenue, setTotalRevenue] = useState([]);
    

    const token = localStorage.getItem("token");
    document.title = "Efficiency | Salespulse";

    const getData = async () => {
        try {
            const { repData, avg } = await repMetrics(token);
            const { repRevenueData, avgRevenueObj } = await repRevenueMetrics(token, avg);
            const valuseAbove = await repValueMetrics(token, avgRevenueObj, avg);
            
            setResData(repData);
            setAvg(avg);

            setRevData(repRevenueData);
            setTotalRevenue(avgRevenueObj);

            setValData(valuseAbove);
            setLoading(false);
            
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getData();
    }, [])
    
    return (
        <React.Fragment>
            <div className="page-content">
                {
                    (token) ? (
                        <>
                            <Card>
                                <LeadsConversiontable resData={resData} avg={avg} />
                            </Card>
                            <Card>
                                <Revenue revData={revData} totalRevenue={totalRevenue} />
                            </Card>
                            <Card>
                                <ValuseAbove valData={valData} />
                            </Card>
                        </>
                    ) : "Please wait..."
                }
            </div>
        </React.Fragment>
    );
}