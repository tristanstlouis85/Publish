import React, { useEffect, useRef, useState } from 'react';
import { Card, CardBody, CardTitle, Col, Container, Row } from "reactstrap";
import logoSmall from "../../assets/images/sflogo.png"
import outreachlogo from "../../assets/images/outreachlogo.png"
import hubspotlogo from "../../assets/images/hubspotlogo.png"
import salesloftlogo from "../../assets/images/salesloftlogo.png"
import SalesforceLoginForm from './SalesforceLoginForm.js';
import { loginAuth, redirectURL } from './config';
import { useAuth } from './Auth';

export default function Integrations() {
    const [showLoginForm, setShowLoginForm] = useState(false);
    const [clientId, setClientId] = useState("");
    const [clientSecret, setClientSecret] = useState("");
    const [domainURL, setDomainURL] = useState("");
    const {
        checkExistingToken,
        setCurrentToken,
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
                <h2 className="integrations-title">Integrations</h2>
            
                <p>Connect your CRM and other sales apps to SalesPulse. Tracking the most important Sales analytics has never been easier.  Select your system below or <span className="helper-links"><a href="https://www.salespulse360.com/contact" target="_blank">Request a New Integration</a></span></p>
                <Row className="align items start">
                    <Col sm={6} md={4} lg={3}>
                        <Card>
                            <CardBody className="text-center">
                                <img
                                    src={logoSmall}
                                    alt=""
                                    className="mb-3"
                                    height="40"
                                />
                                <CardTitle>Connect to Salesforce</CardTitle>
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
                                <span 
                                    onClick={handleSalesforceConnect}  
                                    className="badge badge-soft-primary" 
                                    type="submit"
                                >
                                    Connect to Salesforce
                                </span>
                            </CardBody>
                        </Card>
                    </Col>
                    <Col sm={6} md={4} lg={3}>
                        <Card>
                            <CardBody className="text-center">
                                
                                <img
                                    src={outreachlogo}
                                    alt=""
                                    className="mb-3"
                                    height="40"
                                />
                                <CardTitle>Connect to Outreach.io</CardTitle>
                                <span className="badge badge-soft-primary" type="submit">Coming Soon</span>
                            </CardBody>
                        </Card>
                    </Col>

                    <Col sm={6} md={4} lg={3}>
                        <Card>
                            <CardBody className="text-center">
                                
                                <img
                                    src={hubspotlogo}
                                    alt=""
                                    className="mb-3"
                                    height="40"
                                />
                                <CardTitle>Connect to Hubspot</CardTitle>
                                <span className="badge badge-soft-primary" type="submit">Coming Soon</span>
                            </CardBody>
                        </Card>
                    </Col>
                    <Col sm={6} md={4} lg={3}>
                        <Card>
                            <CardBody className="text-center">
                                
                                <img
                                    src={salesloftlogo}
                                    alt=""
                                    className="mb-3"
                                    height="40"
                                />
                                <CardTitle>Connect to Salesloft</CardTitle>
                                <span className="badge badge-soft-primary" type="submit">Coming Soon</span>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
        </React.Fragment>
    );
};