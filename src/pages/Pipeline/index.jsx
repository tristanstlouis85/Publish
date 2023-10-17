import React, { useEffect, useState } from "react";
import { Row, Container, Col } from "reactstrap";
import WidgetsPipeLine from "./component/widgetPipeLine";
import ChartPipeline from './component/chartPipe';
import LeadingOpportunity from './component/LeadingOpportunity';
import InfoTableLeading from "./component/AgeingLeads";
import QueryPipeline from "./lib/cls";

export default function Pipeline() {
    const [widgetData, setWidgetData] = useState([]);
    const [Opportunities, setOpportunities] = useState([]);
    const [ageingLeadsData, setAgeingLeadsData] = useState([]);
    const [leadingOpportunity, setLeadingOpportunity] = useState([]);
    const [loading, setLoading] = useState(false);

    const token = localStorage.getItem("token");
    document.title = "Pipeline | Salespulse";
    
    /** SF Queries */
    const objectName = "Opportunity";
    const Query = new QueryPipeline(token, objectName);
    
    const retriveDataFromToken = async () => {
        try {
            if(token && token !== "") {
                const [
                    forecastData, 
                    YTDLeads, 
                    YTDOpportunities, 
                    WinRate, 
                    totalOpportunities, 
                    data, 
                    leadingOpportunity
                ] = await Promise.all(
                    [
                        Query.forecastQuery(),
                        Query.leadsQuery(),
                        Query.opportunitiesQuery(),
                        Query.winOpportunities(),
                        Query.ordersOpportunities(),
                        Query.ageingLeads(),
                        Query.leadingOpportunity()
                    ]
                );
    
                setLoading(true);
                setOpportunities(totalOpportunities);
                setAgeingLeadsData(data);
                setLeadingOpportunity(leadingOpportunity);   
                setWidgetData([forecastData, YTDLeads, YTDOpportunities, WinRate]);
            }
        } catch (error) {
            console.log('Main Funtion Error: ', error);
        }
    };

    useEffect(() => { 
        retriveDataFromToken();
    }, []);

    return (
       <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <Row>
                        {
                            (!loading) 
                            ? 
                            (
                                <Row>Please wait...</Row>
                            )
                            :
                            (
                                <React.Fragment>
                                   <Col>
                                        <Row>
                                            <WidgetsPipeLine widgetData={widgetData} />
                                        </Row>
                                        <Row>
                                            <ChartPipeline Opportunities={Opportunities} />
                                        </Row>
                                        <Row>
                                            <InfoTableLeading ageingLeadsData={ageingLeadsData} />
                                        </Row>
                                        <Row>
                                            <LeadingOpportunity leadingOpportunity={leadingOpportunity} />
                                        </Row>
                                   </Col>
                                </React.Fragment>
                            )
                        }
                    </Row>
                </Container>
            </div>
       </React.Fragment>
    );
}