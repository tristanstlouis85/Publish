const forecastData = (totalForecastAmount, currentStock) => {
    return {
        id: 1,
        cardColor: "secondary",
        label: "forecast",
        badgeClass: "success",
        stock: currentStock,
        percentage: '',
        counter: totalForecastAmount,
        bgcolor: "success",
        icon: "las la-dollar-sign",
        up:"las la-angle-up",
        down: "las la-angle-down",
        decimals: 2,
        prefix: "$", 
        separator: ",",
        suffix: ""
    };
};

const YTDLeads = (totalYtdLeads, currentStock) => {
    return {
        id: 2,
        cardColor: "primary",
        label: "leads",
        badgeClass: "success",
        stock: currentStock,
        percentage: '',
        counter: totalYtdLeads,
        bgcolor: "info",
        icon: "las la-shopping-cart",
        up:"las la-angle-up",
        down: "las la-angle-down",
        
        prefix: "", 
        separator: ",",
        suffix: ""
    };
};

const YTDOpportunities = (totalYtdOpportunities, currentStock) => {
    return {
        id: 3,
        cardColor: "secondary",
        label: "opportunities",
        badgeClass: "success",
        stock: currentStock,
        percentage: '',
        counter: totalYtdOpportunities,
        bgcolor: "warning",
        icon: "las la-user",
        up:"las la-angle-up",
        down: "las la-angle-down",
        
        prefix: "", 
        separator: ",",
        suffix: ""
    };
};

const WinRate = (winRate, currentStock) => {
    return {
        id: 4,
        cardColor: "secondary",
        label: "WIN RATE",
        badgeClass: "success",
        stock: currentStock,
        percentage: '',
        counter: winRate,
        bgcolor: "primary",
        icon: "las la-archive",
        up:"las la-angle-up",
        down: "las la-angle-down",
        decimals: 2,
        prefix: "", 
        separator: ",",
        suffix: "%"
    };
};

export {
    forecastData,
    WinRate,
    YTDLeads,
    YTDOpportunities
};