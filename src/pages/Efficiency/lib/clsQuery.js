
import axios from "axios";

/** Get the base URL from local storage */
const base_URL = localStorage.getItem("base_URL");

/** Years to calculate the pre and the current stock  */
const currentYear = new Date().getFullYear();
const YTD = new Date(currentYear, 0, 1, 0, 0, 0, 0).toISOString();

/** API Ending point/JWT Auth */
export const API = (token) => {
    return axios.create({
        baseURL: `https://${base_URL}`,
        headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
        }
    });
};

/** Class for all queries */
export default class Query {

    /** Acceptes a token */
    constructor(token) {
        this.token = token;
    };

    /** RepNames */
    async repNamesQuery() {
        const repNames = `SELECT Name FROM User WHERE User.Department='Sales' LIMIT 3`;
        const repNamesAPIEndpoint = `/services/data/v58.0/query?q=${encodeURIComponent(repNames)}`;
        const response = await API(this.token).get(repNamesAPIEndpoint);
        const repNamesData = response.data.records;
        return repNamesData;
    };

    /** RepLeads */
    async repLeadsQuery(repName) {
        const leadsQuery = `SELECT COUNT(Id) FROM Lead WHERE Owner.Name = '${repName}'`;
        const leadsAPIEndpoint = `/services/data/v58.0/query?q=${encodeURIComponent(leadsQuery)}`;
        const leadsResponse = await API(this.token).get(leadsAPIEndpoint);
        const leadsCount = leadsResponse.data.records[0].expr0;
        return leadsCount;
    };

    /** RepOpportunity */
    async repOpportunityQuery(repName) {
        const opportunitiesQuery = `SELECT COUNT(Id) FROM Opportunity WHERE Owner.Name = '${repName}' AND CreatedDate >= ${YTD}`;
        const opportunitiesAPIEndpoint = `/services/data/v58.0/query?q=${encodeURIComponent(opportunitiesQuery)}`;
        const opportunitiesResponse = await API(this.token).get(opportunitiesAPIEndpoint);
        const opportunitiesCount = opportunitiesResponse.data.records[0].expr0;
        return opportunitiesCount;
    };

    /** RepNewCustomer */
    async repNewCustomer() {
        const newCustomersQuery = `SELECT COUNT(Id) FROM Account WHERE CreatedDate >= ${YTD}`;
        const newCustomersAPIEndpoint = `/services/data/v58.0/query?q=${encodeURIComponent(newCustomersQuery)}`;
        const newCustomersResponse = await API(this.token).get(newCustomersAPIEndpoint);
        const newCustomersCount = newCustomersResponse.data.records[0].expr0;
        return newCustomersCount;
    };

    /** RepRevenue */
    async repRevenueQuery(repName) {
        const revenueQuery = `SELECT SUM(Amount) FROM Opportunity WHERE Owner.Name = '${repName}'`;
        const revenueAPIEndpoint = `/services/data/v58.0/query?q=${encodeURIComponent(revenueQuery)}`;
        const revenueResponse = await API(this.token).get(revenueAPIEndpoint);
        const revenue = revenueResponse.data.records[0].expr0;
        return revenue;
    };
}