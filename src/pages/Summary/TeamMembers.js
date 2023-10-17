import React, { useEffect, useState } from 'react';
import axios, { Axios } from 'axios';
import { getYearDates, getQuarterDates, dateToYmd, getPreviousNthDate, getCurrentMonthStartDate, getPreviousMonthStartEndDate } from '../../helpers/common_helper';
import { Card, CardHeader, Col, DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from 'reactstrap';
import { validateAndRefreshToken } from '../../helpers/validateApiToken';
import { useSelector } from 'react-redux';
import avatar_img_path from '../../../src/assets/images/users/avatar-1.jpg';

// import { teamMembers } from '../../common/data';
// import { TeamMembersCharts } from './DashboardProjectCharts';

const TeamMembers = () => {
    const [SalesRepData, setSalesRepData] = useState([]);
    const [SalesRepDataRes, setSalesRepDataRes] = useState('');
    const [seletedMonth, setSeletedMonth] = useState("Current Year");

    
    // Get the base URL from local storage
    const base_URL = localStorage.getItem("base_URL");

    let dateArr = [
        { key: 'today', value: 'Today' },
        { key: 'seven', value: 'Last 7 Days' },
        { key: 'thirty', value: 'Last 30 Days' },
        { key: 'current_month', value: 'This Month' },
        { key: 'last_month', value: 'Last Month' },
        { key: 'current_quarter', value: 'Current Quarter' },
        { key: 'current_year', value: 'Current Year' },
        
    ];
    let callAPI = async (date_filter = 'current_year') => {
        if (localStorage.getItem('token')) {
            let token = localStorage.getItem('token');
            let validateToken = await validateAndRefreshToken(token);
            if(validateToken && validateToken !== '') {
                let repData = await getSalesRepData(token, date_filter);
                if (repData) {
                    let repDataSort = repData.sort((a, b) =>  parseFloat(b.amount_num) - parseFloat(a.amount_num));
                    setSalesRepDataRes('api_response');
                    setSalesRepData(repDataSort);
                }
            }
            
        }
    }
    let getSalesRepData = async (token, date_filter) => {
        let userObject = [];
        const currentDate = new Date();
        let startDate = currentDate;
        let endDate = currentDate;
        const instance = axios.create({
            baseURL: `https://${base_URL}`,
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            }
        });

        if (date_filter == 'current_quarter') {
            const quarterDates = getQuarterDates(currentDate);
            startDate = quarterDates.currentQuarter.startDate;
            endDate = quarterDates.currentQuarter.endDate;
        } else if (date_filter == 'today') {
            startDate = dateToYmd(currentDate);
            endDate = dateToYmd(currentDate);
        } else if (date_filter == 'seven') {
            startDate = dateToYmd(getPreviousNthDate(6));
            endDate = dateToYmd(currentDate);
        } else if (date_filter == 'thirty') {
            startDate = dateToYmd(getPreviousNthDate(29));
            endDate = dateToYmd(currentDate);
        } else if (date_filter == 'current_month') {
            startDate = dateToYmd(getCurrentMonthStartDate());
            endDate = dateToYmd(currentDate);
        } else if (date_filter == 'last_month') {
            let prevData = getPreviousMonthStartEndDate();
            startDate = dateToYmd(prevData.startDate);
            endDate = dateToYmd(prevData.endDate);
        } else if (date_filter == 'current_year') {
            const yearDates = getYearDates(currentDate);
            startDate = yearDates.currentYear.startDate;
            endDate = yearDates.currentYear.endDate;
        }
        const objectName = 'Opportunity';
        const dateField = 'CloseDate';
        //  const query = `SELECT Id, Amount, OwnerId, ${dateField} FROM ${objectName} WHERE OwnerId = '${OwnerId}' AND ${dateField} >= ${startDate} AND ${dateField} <= ${endDate}`;
        //  const query = "SELECT Id, Name, Amount,OwnerId FROM Opportunity where OwnerId = '005Hp00000bo8pxIAA'";
        const query = `SELECT Id,Name,Email FROM User WHERE User.Department='Sales'`;
       // const query = `SELECT Id,Name,Email FROM User`;
        const apiEndpoint = `/services/data/v58.0/query?q=${encodeURIComponent(query)}`;
        const response = await instance.get(apiEndpoint);
        if (response.data.records) {
            let records = response.data.records;
            const allPromises = []

            


            for (let index = 0; index < records.length; index++) {
                const user = records[index];

                let userData = {};
                let saleAmount = 0;
                let OwnerId = user.Id;
               // OwnerId = '005Hp00000boDknIAE';
                let userName = user.Name;
                userData['name'] = userName;
                let opportunityQuery = `SELECT SUM(Amount) FROM ${objectName} WHERE OwnerId = '${OwnerId}' AND ${dateField} >= ${startDate} AND ${dateField} <= ${endDate} AND StageName = 'Closed Won'`;
                let apiOpportunityEndpoint = `/services/data/v58.0/query?q=${encodeURIComponent(opportunityQuery)}`;
                const op_responsePromise = instance.get(apiOpportunityEndpoint)
                allPromises.push(op_responsePromise);
            }

            if(allPromises.length > 0) {
                const allOpResponses = await Promise.all(allPromises);
               
            if(allOpResponses && typeof allOpResponses !== 'undefined') {
                for (let i = 0; i < allOpResponses.length; i++) {
                    const op_response = allOpResponses[i];
                    const user = records[i];
                    let userData = {};
                    let saleAmount = 0;
                    let userName = user.Name;
                    let user_id = user.Id;
                    userData['user_id'] = user_id;
                    userData['name'] = userName;
    
                    if (typeof op_response.data.records !== 'undefined' && op_response.data.records.length > 0) {
                        let recordsData = op_response.data.records;
                        saleAmount = recordsData[0].expr0;
                    }
                    userData['amount'] = (saleAmount > 0) ? `$${saleAmount.toLocaleString()}` : '-';
                    userData['amount_num'] = (saleAmount > 0) ? saleAmount : 0;
                    userObject.push(userData);
    
                }

            }
            }
            
        }
        return userObject;
    }

    useEffect(() => {
        callAPI();
    }, []);

    const onChangeChartPeriod = async (e) => {
        setSeletedMonth(e.target.value);
        setSalesRepData([]);
        await callAPI(e.target.id)
    };

    return (
        <React.Fragment>
            <Col xxl={12}>
                <Card>
                    <CardHeader className="align-items-center d-flex">
                        <h4 className="card-title mb-0 flex-grow-1">Team Members</h4>
                        <div className="flex-shrink-0">
                            <UncontrolledDropdown direction='start'>
                                <span className="fw-semibold text-uppercase fs-12">Sort by: </span><DropdownToggle tag="button" className="btn btn-soft-primary btn-sm" >
                                    <span className="text-uppercase">{seletedMonth}<i className="mdi mdi-chevron-down align-middle ms-1"></i></span>
                                </DropdownToggle>
                                <DropdownMenu className="dropdown-menu dropdown-menu-end">
                                    {
                                        dateArr.map(data => {
                                            let key_name = data.key;
                                            let text_name = data.value;
                                            return <DropdownItem key = {key_name} onClick={e => onChangeChartPeriod(e)} className={seletedMonth === key_name ? "active" : ""} id={key_name} value={text_name}>{text_name}</DropdownItem>
                                        })
                                    }
                                </DropdownMenu>
                            </UncontrolledDropdown>
                        </div>
                    </CardHeader>

                    <div className="card-body">
                        <div className="table-responsive table-card">
                            <table className="table table-borderless table-nowrap align-middle mb-0">
                                <thead className="table-light text-muted">
                                    <tr>
                                        <th scope="col">Sales Rep</th>
                                        <th scope="col">Amount</th>
                                        {/* <th scope="col">Tasks</th>
                                        <th scope="col">Status</th> */}
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        (SalesRepData.length > 0 ) ? SalesRepData.map((item,index) => (
                                            <tr key={index}>
                                                <td className="d-flex">
                                                    <img src={avatar_img_path} alt="" className="avatar-xs rounded-3 me-2" />
                                                    <div>
                                                        <h5 className="fs-13 mb-0">{item.name}</h5>
                                                    </div>
                                                </td>
                                                <td style={{ width: "5%" }}>
                                                    <div>
                                                        <h5 className="fs-13 mb-0">{item.amount}</h5>
                                                    </div>
                                                </td>
                                            </tr> 
                                            )) : (SalesRepDataRes == 'api_response') ?   <tr><td colSpan={2}>No data found</td></tr> :
                                            <tr><td colSpan={2}>Please wait</td></tr>
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </Card>
            </Col>
        </React.Fragment>
    );
};

export default TeamMembers;