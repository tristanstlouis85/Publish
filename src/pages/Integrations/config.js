export const config = {
    redirectToProduction: process.env.REACT_APP_REDIRECT_TO_PRODUCTION,
    productionRedirectUrl: process.env.REACT_APP_PRODUCTION_REDIRECT_URL,
    localRedirectUrl: process.env.REACT_APP_LOCAL_REDIRECT_URL,
};

export const loginAuth = 'https://login.salesforce.com/services/oauth2/authorize';

export const redirectURL = (config.redirectToProduction === "1")
        ? config.productionRedirectUrl
        : config.localRedirectUrl;