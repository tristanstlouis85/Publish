
import axios from 'axios';

const refreshToken  = (localStorage.getItem('refreshToken')) 
? localStorage.getItem('refreshToken') 
: '';

// Get the user's credentials from local storage
const client_id = localStorage.getItem("client_id");
const client_secret = localStorage.getItem("client_key");
const base_URL = localStorage.getItem("base_URL");

async function checkAccessTokenValidity(accessToken) {
    const instance = axios.create({
        baseURL: `https://${base_URL}`,
        headers: {
            'Authorization': 'Bearer ' + accessToken,
            'Content-Type': 'application/json'
        }
    });

    const query = "SELECT Id, Name FROM User";
    const apiEndpoint = `/services/data/v58.0/query?q=${encodeURIComponent(query)}`;
            
        try {
            const response = await instance.get(apiEndpoint);
            return response.status === 200;
        } catch (error) {
            return false;
        }
    }
  
    // Refresh access token using refresh token
    async function refreshAccessToken(refreshToken) {
        const data = new URLSearchParams({
            grant_type: 'refresh_token',
            client_id: client_id,
            client_secret: client_secret,
            refresh_token: refreshToken,
        });
  
        try {
            const response = await axios.post(oauthUrl, data);
            return response.data.access_token;
        } catch (error) {
            return null;
        }
    }
  
    // Main function to handle token validation and refresh
    async function validateAndRefreshToken(accessToken) {

        const isValid = await checkAccessTokenValidity(accessToken);
        if (!isValid) {
            const newAccessToken = await refreshAccessToken(refreshToken);
        
            if (newAccessToken) {
                return newAccessToken;
            } else {
                return '';
            }
        } else {
            return accessToken;
        }
    }
  
export { validateAndRefreshToken }