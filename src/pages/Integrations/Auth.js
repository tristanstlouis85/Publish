import { useSearchParams } from 'react-router-dom';
import { validateAndRefreshToken } from '../../helpers/validateApiToken';
import { 
    getSales, 
    getAverageDealSize, 
    getLeadConversionRate, 
    getNewCustomers
} from '../Summary/function';
import { useState } from 'react';
import { redirectURL } from './config';

export function useAuth() {
    const [currentToken, setCurrentToken] = useState("");
    const [widgetData, setWidgetData] = useState([]);
    const [searchParams, setSearchParams] = useSearchParams();

    const retriveDataFromToken = async (paramCodeToken) => {
        
        // run the token through validation
        const validateToken = await validateAndRefreshToken(paramCodeToken);
        if(validateToken && validateToken !== "") {
            // Update after validation is success
            setCurrentToken(validateToken);

            // Wait for all the promises to resolve..
            const [getSalesData, getAverageDeals, conversationData, customersData] = await Promise.all([
                getSales(validateToken),
                getAverageDealSize(validateToken),
                getLeadConversionRate(validateToken),
                getNewCustomers(validateToken)
            ]);
            
            if (customersData && conversationData && getSalesData && getAverageDeals) {
                setWidgetData([conversationData, customersData, getSalesData, getAverageDeals])
            }
        } else {
            setCurrentToken("");
        }
    };

    const getCodeFromURLParam = async (parmCode) => {

        // Retrive the client's id and key after redirect
        const getClientID = localStorage.getItem("client_id");
        const getClientKey = localStorage.getItem("client_key");
        const getDomainURL = localStorage.getItem("base_URL");
        const fetchURL = `https://${getDomainURL}/services/oauth2/token`;
        setCurrentToken("waiting");
        
        const bodyData = {
            grant_type: "authorization_code",
            code: parmCode,
            client_id: getClientID,
            client_secret: getClientKey,
            redirect_uri: redirectURL
        };
        
        try {
            let formBody = [];
            for (const property in bodyData) {
                const encodedKey = encodeURIComponent(property);
                const encodedValue = encodeURIComponent(bodyData[property]);
                formBody.push(encodedKey + "=" + encodedValue);
            }

            formBody = formBody.join("&");

            const response = await fetch(fetchURL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
                },
                body: formBody
            });
            
            if (response.status === 200) {
                // Parse response body to access its props
                const parsedRes = await response.json();
                
                if (parsedRes.access_token) {
                    const access_token = parsedRes.access_token;

                    // Update the access_token
                    setCurrentToken(access_token);
                    localStorage.setItem('token', access_token);
                    localStorage.setItem('refreshToken', parsedRes.refresh_token);
                    retriveDataFromToken(access_token);
                }
            }
        } catch (error) {
            console.log("Error in Request: ", error);
        }        
    };

    const checkExistingToken = () => {
        const parmCode = searchParams.get('code');
        const token = localStorage.getItem('token');
        
        if (token) {
            retriveDataFromToken(token);
        } else {
            if (parmCode) {
                getCodeFromURLParam(parmCode);
            }
        }
    };

    return {
        checkExistingToken,
        setCurrentToken,
        currentToken,
        widgetData
    };
}
