import Query from "./clsQuery";

export const repRevenueMetrics = async (token, avg) => {
    try {
        const repRevenueData = [];
        let avgRevenueObj = {};

        let SRevenue = 0;
        let SRevenuePerLead = 0;
        let SRevenuePerOpportunity = 0;
        let SRevenuePerCustomer = 0;
        let SEstimated = 0;

        let reven = 0;

        /** Query Class */
        const query = new Query(token);

        /** Queries */
        const repNamesData = await query.repNamesQuery();
        
        for (const record of repNamesData) {

            // RepName Opportunity
            const repName = record.Name;
            
            /** Queries */
            const leadsCount = await query.repLeadsQuery(repName);
            const opportunitiesCount = await query.repOpportunityQuery(repName);
            const newCustomersCount = await query.repNewCustomer();
            const revenue = await query.repRevenueQuery(repName);
            
            if (revenue === null) {
                reven = 0;
            } else {
                reven = revenue;
            }
            
            // Calculate Lead to Opp Conversion Rate (%)
            const conversionRate = (opportunitiesCount > 0 ? ((opportunitiesCount / leadsCount) * 100).toFixed(2) : Number(0).toFixed(2));

            // Calculate Revenue per lead
            const revenuePerLead = (reven > 0 ? (reven / leadsCount).toFixed(2) : Number(0).toFixed(2));

            // Calculate Revenue per Opportunity
            const revenuePerOpportunity = (reven > 0 ? (reven / opportunitiesCount).toFixed(2) : Number(0).toFixed(2));

            // Calculate Revenue per Customer (New Accounts)
            const revenuePerCustomer = (reven > 0 ? (reven / newCustomersCount).toFixed(2) : Number(0).toFixed(2));

            // Calculate Estimated Revenue with Team Average Leads
            const estimatedRevenue = ((avg.avgLeads / 3) * (conversionRate / 100) * (revenuePerCustomer)).toFixed(2);

            // Store the metrics in an object
            const repInfo = {
                Name: repName,
                Revenue: reven,
                RevenuePerLead: revenuePerLead,
                RevenuePerOpportunity: revenuePerOpportunity,
                RevenuePerCustomer: revenuePerCustomer,
                EstimatedRevenueWithTeamAverageLeads: estimatedRevenue,
            };

            SRevenue += reven;
            SRevenuePerLead += Math.floor(revenuePerLead);
            SRevenuePerOpportunity += Math.floor(revenuePerOpportunity);
            SRevenuePerCustomer += Math.floor(revenuePerCustomer);
            SEstimated += Math.floor(estimatedRevenue);

            avgRevenueObj = {
                Name: "Averages",
                avgRevenue: SRevenue,
                avgLeads: SRevenuePerLead,
                avgOpportunity: SRevenuePerOpportunity,
                avgPerCustomer: SRevenuePerCustomer,
                avgEstimated: SEstimated,
            };

            // Add the repInfo to the array
            repRevenueData.push(repInfo);
        }

        return { repRevenueData, avgRevenueObj };
    } catch (error) {
        console.log(error);
        return [];
    }
};