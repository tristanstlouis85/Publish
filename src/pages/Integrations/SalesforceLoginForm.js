import React from "react";
import { Form, FormGroup, Label, Input } from "reactstrap";

export default function SalesforceLoginForm(props) {
    const { clientId, clientSecret, domainURL, setDomainURL, setClientId, setClientSecret } = props;
    return (
        <Form style={{ marginTop: '20px' }} >
            <FormGroup>
                <Label htmlFor="clientId">Client ID</Label>
                <Input
                    type="text"
                    id="clientId"
                    value={clientId}
                    onChange={(e) => setClientId(e.target.value)}
                    placeholder='Enter your client ID'
                    required
                />
            </FormGroup>
            <FormGroup>
                <Label htmlFor="clientSecret">Client Secret</Label>
                <Input
                    type="text"
                    id="clientSecret"
                    value={clientSecret}
                    onChange={(e) => setClientSecret(e.target.value)}
                    placeholder='Enter your client secret'
                    required
                />
            </FormGroup>
            <FormGroup>
                <Label htmlFor="domainURL">Domain URL</Label>
                <Input
                    type="text"
                    id="domainURL"
                    value={domainURL}
                    onChange={(e) => setDomainURL(e.target.value)}
                    placeholder='Enter your Domain URL'
                    required
                />
            </FormGroup>
        </Form>
    );
}