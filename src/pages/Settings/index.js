import React from "react";
import { Button, Card, CardHeader, Col, Container, Input, Label } from "reactstrap";

const SettingsPage = () => {
  document.title = "Settings | SalesPulse";

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
            <h2>Settings</h2>
            <Card>
                <CardHeader><h4>Notification preferences</h4></CardHeader>
                <div className="mx-3">
                    <div className="form-check form-switch form-switch-lg mb-2 mt-3" dir="ltr">
                        <Label className="form-check-label" for="newSalesSwitch">New Sales</Label>
                        <Input type="checkbox" className="form-check-input" id="newSalesSwitch" defaultChecked=""/>
                    </div>
                    <div className="form-check form-switch form-switch-lg mb-2" dir="ltr">
                        <Label className="form-check-label" for="newPipeLineItemsSwitch">New Pipeline Items</Label>
                        <Input type="checkbox" className="form-check-input" id="newPipeLineItemsSwitch" defaultChecked=""/>
                    </div>
                    <div className="form-check form-switch form-switch-lg mb-3" dir="ltr">
                        <Label className="form-check-label" for="newEfficiencyLeadersSwitch">New Efficiency Leaders</Label>
                        <Input type="checkbox" className="form-check-input" id="newEfficiencyLeadersSwitch" defaultChecked=""/>
                    </div>
                </div>
            </Card>
            <Card>
                <CardHeader><h4>Email notification frequency</h4></CardHeader>
                <div className="mx-3">
                    <div className="form-check form-switch form-switch-lg mt-3 mb-2" dir="ltr">
                        <Label className="form-check-label" for="dailySwitch">Daily (5pm Eastern)</Label>
                        <Input type="checkbox" className="form-check-input" id="dailySwitch" defaultChecked=""/>
                    </div>
                    <div className="form-check form-switch form-switch-lg mb-3" dir="ltr">
                        <Label className="form-check-label" for="weeklySwitch">Weekly (Every Friday at 5pm Eastern)</Label>
                        <Input type="checkbox" className="form-check-input" id="weeklySwitch" defaultChecked=""/>
                    </div>
                </div>
            </Card>
            
        </Container>
      </div>
    </React.Fragment>
  );
};

export default SettingsPage;