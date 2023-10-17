import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardBody, CardHeader, Col, Row } from 'reactstrap';
import { AudiencesCharts } from './DashboardProjectCharts';
import { validateAndRefreshToken } from '../../helpers/validateApiToken';

const SalesBYMonth = () => {
    const [chartData, setchartData] = useState([]);

    // Get the base URL from local storage
    const base_URL = localStorage.getItem("base_URL");

    let getSalesChartsData = async (currentToken) => {
        const d = new Date();
        let currentMonthData = [];
        let prevMonthData = [];
        let currentYear = d.getFullYear();
        const previousYear =  currentYear-1;
        const instance = axios.create({
            baseURL: `https://${base_URL}`,
            headers: {
                'Authorization': 'Bearer ' + currentToken,
              'Content-Type': 'application/json'
            }
          });
        const objectName = 'Opportunity';
        const dateField = 'CloseDate';
        const previousYearStart = previousYear+'-01-01';
        const previousYearEnd = previousYear+'-12-31';
        const currentYearStart = currentYear+'-01-01';
        const currentYearEnd = currentYear+'-12-31';
        const startDate = previousYearStart;
        const endDate = previousYearEnd;
       // console.log(startDate, endDate, currentYearStart, currentYearEnd);
        const previousYearQuery = `SELECT CALENDAR_MONTH(CloseDate), SUM(Amount) FROM ${objectName} WHERE ${dateField} >= ${startDate} AND ${dateField} <= ${endDate}  GROUP BY CALENDAR_MONTH(CloseDate) order by CALENDAR_MONTH(CloseDate) asc`;
        const currentYearQuery = `SELECT CALENDAR_MONTH(CloseDate), SUM(Amount) FROM ${objectName} WHERE ${dateField} >= ${currentYearStart} AND ${dateField} <= ${currentYearEnd}  GROUP BY CALENDAR_MONTH(CloseDate) order by CALENDAR_MONTH(CloseDate) asc`;;

        const apiPreviousYear = `/services/data/v58.0/query?q=${encodeURIComponent(previousYearQuery)}`;
        const apiCurrentYear = `/services/data/v58.0/query?q=${encodeURIComponent(currentYearQuery)}`;
        async function getChartData() {
            try {
                let [responsePreviousYear, responseCurrentYear] = await Promise.all([
                    instance.get(apiPreviousYear),
                    instance.get(apiCurrentYear)
                ]);
                let tempCurrentMonthData = [];
                let tempPrevMonthData = [];
               if (typeof responseCurrentYear !== 'undefined') {
                let current_records = responseCurrentYear.data.records;
                current_records.forEach(sale => {
                    let month_number = sale.expr0;
                    let month_value = sale.expr1;
                    tempCurrentMonthData[month_number] = month_value;
                });
                }
                if (typeof responsePreviousYear !== 'undefined') {
                    let prevRecords = responsePreviousYear.data.records;
                    prevRecords.forEach(sale => {
                        let month_number = sale.expr0;
                        let month_value = sale.expr1;
                        tempPrevMonthData[month_number] = month_value;
                    });
                }
                /*** make 12 month data */
                for(var start = 0 ; start < 12 ; start ++) {
                    let monthStart = start + 1;
                    currentMonthData[start] = (tempCurrentMonthData[monthStart]) ? tempCurrentMonthData[monthStart]  : 0;
                    prevMonthData[start] = (tempPrevMonthData[monthStart]) ? tempPrevMonthData[monthStart]  : 0;
                }
                /*** end make 12 month data */
                let last_year = {
                    name: 'Last Year',
                    data: prevMonthData
                }
                let currentMonth = {
                    name: 'Current Year',
                    data: currentMonthData
                }
                let currentChart = [
                    last_year,currentMonth
                ];
                return {
                    'currentChart': currentChart
                }
            } catch (error) {
                return {
                    'currentChart': currentChart
                }
            }
        }
        let result = await getChartData();
        return result;

    }
    let callChartApi = async () => {
        if(localStorage.getItem('token')) {
            let token = localStorage.getItem('token');
            let validateToken = await validateAndRefreshToken(token);
            if(validateToken && validateToken !== '') {
                let chartRes =  await getSalesChartsData(validateToken);
                setchartData(chartRes.currentChart);
            }
        }
        
    }
    useEffect( () => {
        callChartApi();
    }, []);
   

    return (
        <React.Fragment>
            <Col xl={12}>
                <Card>
                    <CardHeader className="border-0 align-items-center d-flex">
                        <h4 className="card-title mb-0 flex-grow-1">Sales By Month</h4>
                    </CardHeader>
                    <CardBody className="p-0 pb-2">
                        {
                            (chartData && chartData.length > 0) ?  <div><AudiencesCharts series={chartData} dataColors='["--vz-primary", "--vz-light"]' /></div> : <div className="border-0 align-items-center d-flex">Please wait... </div>
                        }
                    </CardBody>
                </Card>
            </Col>
        </React.Fragment>
    );
};

export default SalesBYMonth;