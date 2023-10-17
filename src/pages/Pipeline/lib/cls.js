import axios from "axios";
import { getYearDates } from '../../../helpers/common_helper';
import { WinRate, YTDLeads, YTDOpportunities, forecastData } from "./objs";

/** Get the base URL from local storage */
const base_URL = localStorage.getItem("base_URL");

/** Dates */
const currentDate = new Date();
const yearDates = getYearDates(currentDate);
const preStartDate = yearDates.previousYear.startDate;
const preEndDate = yearDates.previousYear.endDate;
const currentStartDate = yearDates.currentYear.startDate;
const currentEndDate = yearDates.currentYear.endDate;

/** YTD */
const currentYearStart = new Date(currentStartDate).toISOString();
const currentYearEnd = new Date(currentEndDate).toISOString();
const previousYearStart = new Date(preStartDate).toISOString();
const previousYearEnd = new Date(preEndDate).toISOString();

export default class QueryPipeline {
    constructor(token, objectName) {
        this.token = token;
        this.objectName = objectName;
    };

    API() {
        return axios.create({
            baseURL: `https://${base_URL}`,
            headers: {
                'Authorization': 'Bearer ' + this.token,
                'Content-Type': 'application/json'
            }
        });
    };

    async forecastQuery() {
        try {
            /** Queries forecast */
            const forecastOpenOpportunities= `SELECT SUM(Amount) FROM ${this.objectName} WHERE StageName = 'Open'`;
            const forecastClosedOpportunities= `SELECT SUM(Amount) FROM ${this.objectName} WHERE StageName = 'Closed Won'`;
            const forecastApiEndPointOpen = `/services/data/v58.0/query?q=${encodeURIComponent(forecastOpenOpportunities)}`;
            const forecastApiEndPointClose = `/services/data/v58.0/query?q=${encodeURIComponent(forecastClosedOpportunities)}`;
            const forecastResponseOpen = await this.API(this.token).get(forecastApiEndPointOpen);
            const forecastResponseClosed = await this.API(this.token).get(forecastApiEndPointClose);

            const previousYearYTDLeadsQuery = `SELECT SUM(Amount) FROM ${this.objectName} WHERE CreatedDate >= ${previousYearStart} AND CreatedDate <= ${previousYearEnd}`;
            const currentYearYTDLeadsQuery = `SELECT SUM(Amount) FROM ${this.objectName} WHERE CreatedDate >= ${currentYearStart} AND CreatedDate <= ${currentYearEnd}`;
            const PreAPIEndingPoint = `/services/data/v58.0/query?q=${encodeURIComponent(previousYearYTDLeadsQuery)}`;
            const CurrentAPIEndingPoint = `/services/data/v58.0/query?q=${encodeURIComponent(currentYearYTDLeadsQuery)}`;
            const previousYearYTDLeadsResponse = await this.API(this.token).get(PreAPIEndingPoint);
            const currentYearYTDLeadsResponse = await this.API(this.token).get(CurrentAPIEndingPoint);

            let previousYearYTDLeadsCount = 0;
            let currentYearYTDLeadsCount = 0;
            let totalForecastAmount = 0;

            /** Checks if data object exist */
            if (previousYearYTDLeadsResponse.data && previousYearYTDLeadsResponse.data.totalSize > 0) {
                previousYearYTDLeadsCount = previousYearYTDLeadsResponse.data.records[0].expr0;
            }

            if (currentYearYTDLeadsResponse.data && currentYearYTDLeadsResponse.data.totalSize > 0) {
                currentYearYTDLeadsCount = currentYearYTDLeadsResponse.data.records[0].expr0;
            }

            if (forecastResponseOpen.data && forecastResponseClosed.data) {
                const openOpportunityAmount = forecastResponseOpen.data.totalSize > 0 ? forecastResponseOpen.data.records[0].expr0 : 0;
                const closedOpportunityAmount = forecastResponseClosed.data.totalSize > 0 ? forecastResponseClosed.data.records[0].expr0 : 0;
                totalForecastAmount = openOpportunityAmount + closedOpportunityAmount;
            }

            /** Get Current Stock  */
            const currentStock = (((currentYearYTDLeadsCount - previousYearYTDLeadsCount) / previousYearYTDLeadsCount) * 100).toFixed(2);

            return forecastData(totalForecastAmount, currentStock);
        } catch (error) {
            console.log('Error Forecast: ', error);
        }
    }

    async leadsQuery() {
        try {
            /** Lead Queries */
            const YTDLeadsQuery = `SELECT COUNT(Id) FROM Lead WHERE CreatedDate >= ${currentYearStart} AND CreatedDate <= ${currentYearEnd}`;
            const leadApiEndPoint = `/services/data/v58.0/query?q=${encodeURIComponent(YTDLeadsQuery)}`;
            const leadResponse = await this.API(this.token).get(leadApiEndPoint);

            /** Stock Queries */
            const previousYearYTDLeadsQuery = `SELECT COUNT(Id) FROM Lead WHERE CreatedDate >= ${currentYearStart} AND CreatedDate <= ${currentYearEnd}`;
            const currentYearYTDLeadsQuery = `SELECT COUNT(Id) FROM Lead WHERE CreatedDate >= ${currentYearStart}`;
            const PreAPIEndingPoint = `/services/data/v58.0/query?q=${encodeURIComponent(previousYearYTDLeadsQuery)}`;
            const CurrentAPIEndingPoint = `/services/data/v58.0/query?q=${encodeURIComponent(currentYearYTDLeadsQuery)}`;
            const previousYearYTDLeadsResponse = await this.API(this.token).get(PreAPIEndingPoint);
            const currentYearYTDLeadsResponse = await this.API(this.token).get(CurrentAPIEndingPoint);

            let previousYearYTDLeadsCount = 0;
            let currentYearYTDLeadsCount = 0;
            let totalYtdLeads = 0;

            /** Checks for if data exist */
            if (previousYearYTDLeadsResponse.data && previousYearYTDLeadsResponse.data.totalSize > 0) {
                previousYearYTDLeadsCount = previousYearYTDLeadsResponse.data.records[0].expr0;
            }

            if (currentYearYTDLeadsResponse.data && currentYearYTDLeadsResponse.data.totalSize > 0) {
                currentYearYTDLeadsCount = currentYearYTDLeadsResponse.data.records[0].expr0;
            }

            if (leadResponse.data && leadResponse.data.records && leadResponse.data.records.length > 0) {
                totalYtdLeads = leadResponse.data.records[0].expr0;
            }

            /** Current stock */
            const currentStock = (((currentYearYTDLeadsCount - previousYearYTDLeadsCount) / previousYearYTDLeadsCount) * 100).toFixed(2);
            
            return YTDLeads(totalYtdLeads, currentStock);
        } catch (error) {
            console.log('Error Leads: ', error);
        }
    }

    async opportunitiesQuery() {
        try {
            /** Opportunities Queries */
            const YTDOpportunitiesQuery = `SELECT COUNT(Id) FROM ${this.objectName} WHERE CreatedDate >= ${currentYearStart} AND CreatedDate <= ${currentYearEnd}`;
            const YTDOpportunitiesApiEndPoint = `/services/data/v58.0/query?q=${encodeURIComponent(YTDOpportunitiesQuery)}`;
            const YTDOpportunitiesResponse = await this.API(this.token).get(YTDOpportunitiesApiEndPoint);
            
            /** stock Queries */
            const previousYearYTDOpportunitiesQuery = `SELECT SUM(Amount) FROM ${this.objectName} WHERE CreatedDate >= ${currentYearStart} AND CreatedDate <= ${currentYearEnd}`;
            const currentYearYTDOpportunitiesQuery = `SELECT SUM(Amount) FROM ${this.objectName} WHERE CreatedDate >= ${currentYearStart}`;
            const PreAPIEndingPoint = `/services/data/v58.0/query?q=${encodeURIComponent(previousYearYTDOpportunitiesQuery)}`;
            const CurrentAPIEndingPoint = `/services/data/v58.0/query?q=${encodeURIComponent(currentYearYTDOpportunitiesQuery)}`;
            const previousYearYTDResponse = await this.API(this.token).get(PreAPIEndingPoint);
            const currentYearYTDResponse = await this.API(this.token).get(CurrentAPIEndingPoint);

            let previousYearYTDCount = 0;
            let currentYearYTDCount = 0;
            let totalYtdOpportunities = 0;

            /** Checks if data exist */
            if (previousYearYTDResponse.data && previousYearYTDResponse.data.totalSize > 0) {
                previousYearYTDCount = previousYearYTDResponse.data.records[0].expr0;
            }

            if (currentYearYTDResponse.data && currentYearYTDResponse.data.totalSize > 0) {
                currentYearYTDCount = currentYearYTDResponse.data.records[0].expr0;
            }

            if (YTDOpportunitiesResponse.data && YTDOpportunitiesResponse.data.totalSize > 0) {
                totalYtdOpportunities = YTDOpportunitiesResponse.data.records[0].expr0;
            }
        
            /** Current Stock */ 
            const currentStock = (((currentYearYTDCount - previousYearYTDCount) / previousYearYTDCount) * 100).toFixed(2);

            return YTDOpportunities(totalYtdOpportunities, currentStock);
        } catch (error) {
            console.log('Error Opportunities: ', error);
        }
    }

    async winOpportunities() {
        try {
            /** Opportunities Queries */
            const closedWonOpportunitiesQuery = `SELECT SUM(Amount) FROM ${this.objectName} WHERE IsClosed = true AND StageName = 'Closed Won' AND CreatedDate >= ${currentYearStart} AND CreatedDate <= ${currentYearEnd}`;
            const totalOpportunitiesQuery = `SELECT SUM(Amount) FROM ${this.objectName} WHERE CreatedDate >= ${currentYearStart} AND CreatedDate <= ${currentYearEnd}`;
            const closeWonAPIEndingPoint = `/services/data/v58.0/query?q=${encodeURIComponent(closedWonOpportunitiesQuery)}`;
            const totalOpportunitiesAPIEndingPoint = `/services/data/v58.0/query?q=${encodeURIComponent(totalOpportunitiesQuery)}`;
            const closedWonOpportunitiesResponse = await this.API(this.token).get(closeWonAPIEndingPoint);
            const totalOpportunitiesResponse = await this.API(this.token).get(totalOpportunitiesAPIEndingPoint);
        
            /** Stock calculation */
            const previousYearClosedWonOpportunitiesQuery = `SELECT SUM(Amount) FROM ${this.objectName} WHERE IsClosed = true AND StageName = 'Closed Won' AND CreatedDate >= ${previousYearStart} AND CreatedDate <= ${previousYearEnd}`;
            const currentYearTotalOpportunitiesQuery = `SELECT SUM(Amount) FROM ${this.objectName} WHERE CreatedDate >= ${currentYearStart}`;
            const PreAPIEndingPoint = `/services/data/v58.0/query?q=${encodeURIComponent(previousYearClosedWonOpportunitiesQuery)}`;
            const CurrentAPIEndingPoint = `/services/data/v58.0/query?q=${encodeURIComponent(currentYearTotalOpportunitiesQuery)}`;
            const PreYearResponse = await this.API(this.token).get(PreAPIEndingPoint);
            const CurrentYearResponse = await this.API(this.token).get(CurrentAPIEndingPoint);

            let preYearCount = 0;
            let currentYearCount = 0;
            let winRate = 0;

            /** Checks for data */
            if (PreYearResponse.data && PreYearResponse.data.totalSize > 0) {
                preYearCount = PreYearResponse.data.records[0].expr0;
            }

            if (CurrentYearResponse.data && CurrentYearResponse.data.totalSize > 0) {
                currentYearCount = CurrentYearResponse.data.records[0].expr0;
            }

            if (closedWonOpportunitiesResponse.data.totalSize > 0 && totalOpportunitiesResponse.data.totalSize > 0) {
                const closedWonCount = closedWonOpportunitiesResponse.data.records[0].expr0;
                const totalOpportunitiesCount = totalOpportunitiesResponse.data.records[0].expr0;
    
                // Calculate Win Rate
                winRate = (closedWonCount / totalOpportunitiesCount) * 100;
            }

            /** Current stock */
            const currentStock = (((currentYearCount - preYearCount) / preYearCount) * 100).toFixed(2);

            return WinRate(winRate, currentStock);
        } catch (error) {
            console.log('Error win Rate: ', error);
        }
    }

    async ordersOpportunities() {
        try {
            const totalOpportunities = [];
            
            /** order */
            const YTDOpportunitiesOrder = `SELECT Id, Name, StageName, Amount, Probability FROM ${this.objectName} WHERE CreatedDate >= ${currentYearStart} AND CreatedDate <= ${currentYearEnd} ORDER BY Probability ASC LIMIT 8`;
            const YTDOpportunitiesApiEndPointOrder = `/services/data/v58.0/query?q=${encodeURIComponent(YTDOpportunitiesOrder)}`;
            const YTDOpportunitiesResponseOrder = await this.API(this.token).get(YTDOpportunitiesApiEndPointOrder);
        
            const opportunities = YTDOpportunitiesResponseOrder.data.records;
            const t = opportunities.sort((a, b) => b.Probability < a.Probability);

            t.forEach((item) => {
                totalOpportunities.push({ pro: item.Probability, stage: item.StageName, num: item.Amount });
            });

            return totalOpportunities;
        } catch (error) {
            console.log('Orders Error: ', error);
        }
    }

    async ageingLeads() {
        try {
            const agingLeadsQuery = `SELECT Name, Company, CreatedDate FROM Lead WHERE CreatedDate >= ${currentYearStart} AND CreatedDate <= ${currentYearEnd} LIMIT 12`;
    
            const agingLeadsApiEndpoint = `/services/data/v58.0/query?q=${encodeURIComponent(agingLeadsQuery)}`;
            const agingLeadsResponse = await this.API(this.token).get(agingLeadsApiEndpoint);
    
            const data = agingLeadsResponse.data.records;
            return data;
        } catch (error) {
            console.log("Ageing Leads Error: ", error);
        }
    }

    async leadingOpportunity() {
        try {
            const query = `SELECT Account.Name, Name, CreatedDate FROM ${this.objectName} WHERE CreatedDate >= ${currentYearStart} AND CreatedDate <= ${currentYearEnd} LIMIT 12`;
            
            const apiEndpoint = `/services/data/v58.0/query?q=${encodeURIComponent(query)}`;
            const response = await this.API(this.token).get(apiEndpoint);
            const leadingOpp = response.data.records;

            return leadingOpp; 
        } catch (error) {
            console.log("Leading Opportunity Error: ", error);
        }
    }
}