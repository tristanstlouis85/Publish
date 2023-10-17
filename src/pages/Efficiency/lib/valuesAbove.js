import Query from "./clsQuery";

export const repValueMetrics = async (token, revenueObj, avg) => {
    try {
        const repData = [];

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
            const revenue = await query.repRevenueQuery(repName);
            const newCustomersCount = await query.repNewCustomer(repName);

            let revenueAboueValue = 0;

            if (revenue === null || (revenue / leadsCount) === 0) {
                revenueAboueValue = 0;
            } else {
                revenueAboueValue = revenue / leadsCount;
            }

            // Calculate VARP
            const VARP = (revenueAboueValue * (avg.avgLeads / 3)) - (revenueObj.avgRevenue / 3);

            let conversion = opportunitiesCount / leadsCount;
            let winRate = newCustomersCount / opportunitiesCount;

            const avgConversion = avg.avgConversion;
            let Note = "";
            
            if (isNaN(conversion)) {
                conversion = 0;
            }
            
            if (winRate === Infinity) {
                winRate = 0;

            }

            if (conversion < (avgConversion / 3)) {
                Note += "below average lead to opportunity conversion rate.</br>";
            } else if (conversion > (avgConversion / 3)) {
                Note += "above average lead to opportunity conversion rate.</br>";
            }

            let avgWinRate = avg.avgWin;

            if (winRate <= (avgWinRate / 3)) {
                Note += "</br> below average opportunity to deal win rate";
            } else if (winRate >= (avgWinRate / 3)) {
                Note += "</br> above average opportunity to deal win rate";
            }
            
            const color = (conversion > 0 && winRate) ? "green" : "red";

            // Store the metrics in an object with notes
            const repInfo = {
                Name: repName,
                VARP: VARP,
                WinRateNote: Note,
                colors: color
            };

            Note = "";

            // Add the repInfo to the array
            repData.push(repInfo);
        }

        return repData;
    } catch (error) {
       console.log(error);
    }
}
