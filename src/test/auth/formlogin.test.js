
import { render, screen } from '@testing-library/react';
import SalesforceLoginForm from '../../pages/Integrations/SalesforceLoginForm';

describe("This function should accept client, secret, and domain credentials from users", () => {
    it("should return true if the paramters exist", () => {
        
        const clientId = "SUUaiosjdwu2908jsc.auinwu2nisncUNADIUMQ";
        const clientSecret = "IASJODINQ1-92jeinoincaspom29-8tnvunvnvn.i";
        const domainURL = "test-dev-ed.develop.my.salesforce.com";

        render(
            <SalesforceLoginForm 
                clientId={clientId}
                clientSecret={clientSecret}
                domainURL={domainURL}
            />
        );
        
        const clientIdInput = screen.getByLabelText(/client id/i);
        const clientSecretInput = screen.getByLabelText(/client secret/i);
        const domainURLInput = screen.getByLabelText(/domain url/i);
        

        expect(clientIdInput).toBeInTheDocument();
        expect(clientIdInput).toHaveValue(clientId);

        expect(clientSecretInput).toBeInTheDocument();
        expect(clientSecretInput).toHaveValue(clientSecret);

        expect(domainURLInput).toBeInTheDocument();
        expect(domainURLInput).toHaveValue(domainURL);
    });
});
