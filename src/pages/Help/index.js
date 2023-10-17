import React from "react";
import { Container, Input, Label } from "reactstrap";


const HelpPage = () => {
  document.title = "Help | SalesPulse360";

  return (
    <React.Fragment>
      <div className="page-content">
        <Container>
            <h2 className="text-center">Contact Customer Support</h2>
            <p className="text-center">Tell us how we can help.</p>
            <div className="mb-3">
                <Label htmlFor="subject" className="form-label">Subject</Label>
                    <Input type="text" className="form-control" id="subject"/>
            </div>
            <div className="mb-3">
                <Label htmlFor="company" className="form-label">Company</Label>
                    <Input type="text" className="form-control" id="company"/>
            </div>
            <div className="mb-3">
                <Label htmlFor="name" className="form-label">Name</Label>
                    <Input type="text" className="form-control" id="name"/>
            </div>
            <div className="mb-3">
                <Label htmlFor="email" className="form-label">Email</Label>
                    <Input type="text" className="form-control" id="email"/>
            </div>
            <div className="mb-3">
                <Label htmlFor="message" className="form-label">Message</Label>
                    <textarea className="form-control" rows="5" id="message"/>
            </div>
                <div className="text-end">
                    <button type="submit" className="btn btn-primary">Submit</button>
            </div>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default HelpPage;