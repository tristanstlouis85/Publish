import React, { useEffect, useState } from 'react';
import { Col, Container, Row } from "reactstrap";
import Widgets from '../DashboardEcommerce/Widgets';
import SalesBYMonth from './SalesByMonth';
import TeamMembers from './TeamMembers';
import SalesforceLoginForm from '../Integrations/SalesforceLoginForm.js';
import { loginAuth, redirectURL } from '../Integrations/config';
import { useAuth } from '../Integrations/Auth';

export default function Summary() {
    const [showLoginForm, setShowLoginForm] = useState(false);
    const [clientId, setClientId] = useState("");
    const [clientSecret, setClientSecret] = useState("");
    const [domainURL, setDomainURL] = useState("");
    const {
        checkExistingToken,
        setCurrentToken,
        currentToken,
        widgetData
    } = useAuth();
    
    document.title = "Summary Dashboard | Salespulse";

    const SalesForceURL = `${loginAuth}?client_id=${clientId}&redirect_uri=${redirectURL}&response_type=code`;

    const handleSalesforceConnect = (e) => {
        e.preventDefault();
        setShowLoginForm(true);

        if (clientId && clientSecret && domainURL) {
            localStorage.removeItem('token');

            // Store new user credentials
            localStorage.setItem("client_id", clientId);
            localStorage.setItem("client_key", clientSecret);

            // Store identity URL for the user. 
            localStorage.setItem("base_URL", domainURL);
            
            setCurrentToken("");
            setShowLoginForm(false);
            window.open(SalesForceURL, "_self");
        }
    };

    useEffect( () => {
        checkExistingToken();
    }, []);
    
    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <Row>
                        <Col>
                        <h4>SUMMARY</h4>
                            <div className="h-100">
                                {
                                    (currentToken === '') 
                                    ?
                                    (
                                        <Row>
                                            {showLoginForm && (
                                                <div className="salesforce-login-form">
                                                    <SalesforceLoginForm 
                                                        clientId={clientId}
                                                        clientSecret={clientSecret}
                                                        domainURL={domainURL}
                                                        setDomainURL={setDomainURL}
                                                        setClientId={setClientId} 
                                                        setClientSecret={setClientSecret}
                                                    />
                                                </div>
                                            )}
                                            <button 
                                                onClick={handleSalesforceConnect} 
                                                className="btn btn-primary mt-3" 
                                                type="submit"
                                            >
                                                Connect to Salesforce
                                            </button>
                                        </Row>
                                    )
                                    : ((currentToken === 'waiting') ? (<Row>Please wait...</Row>) : (
                                        <React.Fragment>
                                            <Row>
                                                <Widgets widgetData={widgetData} />
                                            </Row>
                                            <Row>
                                                <Col>
                                                    <SalesBYMonth />
                                                </Col>
                                            </Row>
                                            <Row>
                                                <TeamMembers />
                                            </Row>
                                        </React.Fragment>
                                    ))
                                }
                                
                                <Row>
                                    {/* <StoreVisits />
                                    <RecentOrders /> */}
                                </Row>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    )
}
