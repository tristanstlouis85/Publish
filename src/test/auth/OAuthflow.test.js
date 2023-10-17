// Define a common function to fetch the access token
const fetchAccessToken = async (clientId, clientSecret, domainURL, param, redirectURL) => {
    const fetchURL = `https://${domainURL}/services/oauth2/token`;

    const bodyData = {
        grant_type: "authorization_code",
        code: param,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectURL,
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
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
            },
            body: formBody,
        });

        if (response.status === 200) {
            const parsedRes = await response.json();
            if (parsedRes.access_token) {
                return parsedRes.access_token;
            }
        }
    } catch (error) {
        console.log("Error in Request: ", error);
    }
    return null;
};

// Development test cases.
describe("This function should return access token in development mode", () => {
    it("should return a token if successful", async () => {
        
        const clientId =".....";
        const clientSecret ="....";
        const domainURL = "......";
        const param ="...";
        const redirectURL = "http://localhost:3000";

        const token = await fetchAccessToken(clientId, clientSecret, domainURL, param, redirectURL);

        expect(token).toBeDefined();
    });
});

// Production test cases
describe("This function should return access token in production mode", () => {
    it("should return a token if successful", async () => {

        const clientId =".....";
        const clientSecret ="....";
        const domainURL = "....";
        const param ="....";
        const redirectURL = "....";

        const token = await fetchAccessToken(clientId, clientSecret, domainURL, param, redirectURL);

        expect(token).toBeDefined();
    });
});
