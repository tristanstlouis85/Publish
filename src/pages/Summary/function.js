import axios from 'axios';
import { getYearDates } from "../../helpers/common_helper";
import { API } from '../Efficiency/lib/clsQuery';

// Get the base URL from local storage
const base_URL = localStorage.getItem("base_URL");

const getLeadConversionRate = async (token) => {

    const instance = axios.create({
        baseURL: `https://${base_URL}`,
        headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
        }
    });
    const currentDate = new Date();
    let yearDates = getYearDates(currentDate);
    const objectName = 'Lead';
    const dateField = 'CreatedDate';
    let currentStartDate = yearDates.currentYear.startDate;
    let currentEndDate = yearDates.currentYear.endDate;
    let currentYearStart = new Date(currentStartDate).toISOString();
   let currentYearEnd = new Date(currentEndDate).toISOString();
    let startDate = currentYearStart;
    let endDate = currentYearEnd;
    const leadQueryPeriod = `SELECT COUNT(Id) FROM ${objectName} WHERE ${dateField} >= ${startDate} AND ${dateField} <= ${endDate}`;
    const convertedQueryPeriod = `SELECT COUNT(Id)  FROM ${objectName} WHERE IsConverted=true AND ${dateField} >= ${currentYearStart} AND ${dateField} <= ${currentYearEnd}`;

    const leadApiEndPoint = `/services/data/v58.0/query?q=${encodeURIComponent(leadQueryPeriod)}`;
    const convertedApiEndPoint = `/services/data/v58.0/query?q=${encodeURIComponent(convertedQueryPeriod)}`;

    let [leadResponsePeriod, convertedResponsePeriod] = await Promise.all([
        instance.get(leadApiEndPoint),
        instance.get(convertedApiEndPoint)
    ]);
    /**** it is to sum amount based on year */
    let leadCount = 0;
    let convertedLeadCount = 0;
    if (typeof leadResponsePeriod !== 'undefined' && leadResponsePeriod.data.records.length > 0) {
        let recordsData = leadResponsePeriod.data.records;
        leadCount = recordsData[0].expr0;
    }
    if (typeof convertedResponsePeriod !== 'undefined' && convertedResponsePeriod.data.records.length > 0) {
        let recordsData = convertedResponsePeriod.data.records;
        convertedLeadCount = recordsData[0].expr0;
    }
    let leadConversionRate = (convertedLeadCount > 0 && leadCount > 0) ? (convertedLeadCount / leadCount) * 100 : 0;
       let leadConversionData = {
        id: 2,
        cardColor: "secondary",
        label: "YTD Lead Conversion Rate",
        badgeClass: "success",
       // percentage: leadConversionRate.toFixed(1),
      //  counter: leadCount,
      percentage: '',
        counter: leadConversionRate.toFixed(2),
        bgcolor: "info",
        icon: "las la-sync-alt",
        decimals: 2,
        prefix: "",
        separator: ",",
        suffix: "%"
    }
    return leadConversionData
}


let getNewCustomers = async (token) => {
    let newCustomers = 0;
    const instance = axios.create({
        baseURL: `https://${base_URL}`,
        headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
        }
    });
    const currentDate = new Date();
    const yearDates = getYearDates(currentDate);
    const objectName = 'Account';
    const dateField = 'CreatedDate';
    let currentYearStart = new Date(yearDates.currentYear.startDate).toISOString();
    let currentYearEnd = new Date(yearDates.currentYear.endDate).toISOString();
    // Modify the query to select accounts with 'customer' in the Type field (case-insensitive partial match)
    let currentQueryPeriod = `SELECT COUNT(Id) FROM ${objectName} WHERE ${dateField} >= ${currentYearStart} AND ${dateField} <= ${currentYearEnd}`;

    const currentApiEndPoint = `/services/data/v58.0/query?q=${encodeURIComponent(currentQueryPeriod)}`;
    let customerResponse = await instance.get(currentApiEndPoint);

    if (typeof customerResponse !== 'undefined' && customerResponse.data.records.length > 0) {
        let recordsData = customerResponse.data.records;
        newCustomers = recordsData[0].expr0;
    }

    let newCustomerData = {
        id: 3,
        cardColor: "success",
        label: "YTD New Customers",
        badge: "ri-arrow-right-up-line",
        badgeClass: "success",
        // percentage: "+29.08",
        counter: newCustomers,
        link: "See details",
        bgcolor: "warning",
        icon: "las la-building",
        decimals: '',
        prefix: "",
        suffix: ""
    }
    return newCustomerData;
}

let getSales = async (token) => {
    const instance = axios.create({
        baseURL: `https://${base_URL}`,
        headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
        }
    });
    const currentDate = new Date();
    const yearDates = getYearDates(currentDate);
    const objectName = 'Opportunity';
    const dateField = 'CloseDate';
    const prevYearStart = yearDates.previousYear.startDate;
    const prevYearEnd = yearDates.previousYear.endDate;
    const currentYearStart = yearDates.currentYear.startDate;
    const currentYearEnd = yearDates.currentYear.endDate;
    const startDate = prevYearStart;
    const endDate = prevYearEnd;
    const previousQueryPeriod = `SELECT SUM(Amount) FROM ${objectName} WHERE ${dateField} >= ${startDate} AND ${dateField} <= ${endDate} AND StageName = 'Closed Won'`;
    const currentQueryPeriod = `SELECT SUM(Amount)  FROM ${objectName} WHERE ${dateField} >= ${currentYearStart} AND ${dateField} <= ${currentYearEnd} AND StageName = 'Closed Won'`;

    const prevApiEndPoint = `/services/data/v58.0/query?q=${encodeURIComponent(previousQueryPeriod)}`;
    const currentApiEndPoint = `/services/data/v58.0/query?q=${encodeURIComponent(currentQueryPeriod)}`;
    async function getSalesData() {
        try {
            let [prevResponsePeriod, currentResponsePeriod] = await Promise.all([
                instance.get(prevApiEndPoint),
                instance.get(currentApiEndPoint)
            ]);
            /**** it is to sum amount based on year */
            let prevSalesAmount = 0;
            let currentSalesAmount = 0;
            if (typeof prevResponsePeriod !== 'undefined' && prevResponsePeriod.data.records.length > 0) {
                let recordsData = prevResponsePeriod.data.records;
                prevSalesAmount = recordsData[0].expr0;
            }
            if (typeof currentResponsePeriod !== 'undefined' && currentResponsePeriod.data.records.length > 0) {
                let recordsData = currentResponsePeriod.data.records;
                currentSalesAmount = recordsData[0].expr0;
            }
            /*** end it is to sum amount based on year */
            let percentageChange = ((currentSalesAmount - prevSalesAmount) / prevSalesAmount) * 100;
            let changeType = percentageChange > 0 ? '+' : '-';
            let percentageBadge = percentageChange > 0 ? 'success' : 'danger';
            let percentage_text = `${changeType}${Math.abs(percentageChange.toFixed(2))}`;
            return {
                'revenue': currentSalesAmount,
                'percentage': percentage_text,
                'badge': percentageBadge,
                'prev_year_sale': prevSalesAmount
            }
        } catch (error) {
            return {
                'revenue': error,
                'percentage': '',
                'badge': '',
                'prev_year_sale': ''
            }
        }
    }

    let result = await getSalesData();
    // console.log(result);
    let badgeClass = result.badge;
    let percentageText = result.percentage;
    let revenueText = result.revenue;
    let newSalesRevenueData = {
        id: 1,
        cardColor: "primary",
        label: "YTD Sales Revenue",
        badgeClass: badgeClass,
        percentage: percentageText,
        counter: revenueText,
        link: "View Sales Revenue",
        bgcolor: "success",
        icon: "las la-dollar-sign",
        decimals: 0,
        prefix: "$",
        
    }
    return newSalesRevenueData;
}

let getAverageDealSize = async (token) => {
    let averageDealSize = 0;

    const currentDate = new Date();
    const yearDates = getYearDates(currentDate);
    const prevYearStart = yearDates.previousYear.startDate;
    const prevYearEnd = yearDates.previousYear.endDate;
    const startDate = prevYearStart;
    const endDate = prevYearEnd;

    const totalRevenue = `SELECT SUM(Amount) FROM Opportunity`;
    const RevenueWithStageWon = `SELECT COUNT(Id) FROM Opportunity WHERE StageName = 'Closed Won'`;

    const resTotalRevenue = `/services/data/v58.0/query?q=${encodeURIComponent(totalRevenue)}`;
    const resRevenueWithStageWon = `/services/data/v58.0/query?q=${encodeURIComponent(RevenueWithStageWon)}`;

    const apitotalRevenueResponse = await API(token).get(resTotalRevenue);
    const apiClosedWonResponse = await API(token).get(resRevenueWithStageWon);

    const total = apitotalRevenueResponse.data.records[0].expr0;
    const stageWon = apiClosedWonResponse.data.records[0].expr0;

    averageDealSize = total / stageWon;

    let AverageDealSizeObj = {
        id: 4,
        cardColor: "info",
        label: "YTD Average Deal Size",
        badgeClass: "muted",
        percentage: "",
        counter: averageDealSize,
        link: "Average Deal Size",
        bgcolor: "primary",
        icon: "las la-search-dollar",
        decimals: 0,
        prefix: "$",
    }

    return AverageDealSizeObj;
}
export { getAverageDealSize, getSales,getNewCustomers,getLeadConversionRate}