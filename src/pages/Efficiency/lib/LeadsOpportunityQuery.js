import Query from "./clsQuery";

/** Leads total number */
export const repMetrics = async (token) => {
    try {
        const repData = [];
        let avg = {};
        
        let SLeads = 0;
        let SOpportunity = 0;
        let SConversion = 0;
        let SCustomer = 0;
        let SWin = 0;
                
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
            
            let conversionRate = 0;
            let winRate = 0;

            if (opportunitiesCount > 0 && leadsCount > 0) {
                // Calculate Lead to Opp Conversion Rate (%)
                conversionRate = (Number(opportunitiesCount / leadsCount) * 100).toFixed(2);
            } else {
                conversionRate = 0;
            }

            if (newCustomersCount > 0 && opportunitiesCount > 0) {
                // Calculate Win Rate (%)
                winRate = (Number(newCustomersCount / opportunitiesCount) * 100).toFixed(2);
            }

            // Store the metrics in an object
            const repInfo = {
                Name: repName,
                Leads: leadsCount,
                Opportunities: opportunitiesCount,
                Conversion: conversionRate,
                Customer: newCustomersCount,
                WinRate: winRate,
            };

            SLeads += leadsCount;
            SOpportunity += opportunitiesCount;
            SConversion += Math.floor(conversionRate);
            SCustomer += newCustomersCount;
            SWin += Math.floor(winRate);

            avg = {
                avgName: "Averages",
                avgLeads: SLeads,
                avgOpportunity: SOpportunity,
                avgConversion: SConversion,
                avgCustomer: SCustomer,
                avgWin: SWin,
            };

            repData.push(repInfo);
        }

        return { repData, avg };
    } catch (error) {
        console.log(error);
        return {};
    }
};