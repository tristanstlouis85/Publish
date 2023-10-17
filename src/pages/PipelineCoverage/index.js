import React, { useEffect, useState } from "react";
import { Col, Container, Row, Card, CardBody, Label } from "reactstrap";

import InputBlock from "./InputBlock";

export default function PipelineCoverage() {
  const [totalValue, setTotalValue] = useState(0);
  const [salesTarget, setSalesTarget] = useState(0);
  const [winRate, setWinRate] = useState(0); // Initialize to 0%
  const [coverage, setCoverage] = useState(0);
  const [addedAmount, setAddedAmount] = useState(0);
  const [allFieldsFilled, setAllFieldsFilled] = useState(false);

  document.title = "Pipeline Coverage | Salespulse";   


  useEffect(() => {
    if (totalValue > 0 && salesTarget > 0 && winRate >= 0 && winRate <= 100) {
      const winRatePercentage = winRate / 100; // Convert to a decimal between 0 and 1
      const pipelineCoverage = (totalValue * winRatePercentage) / salesTarget;
      setCoverage(pipelineCoverage.toFixed(2));
      setAddedAmount((salesTarget * (3 / winRatePercentage) - totalValue).toFixed(2));
      setAllFieldsFilled(true); // Set to true when all fields are filled
    } else {
      setAllFieldsFilled(false); // Set to false if any field is not filled
    }
  }, [totalValue, salesTarget, winRate]);

  return (
    <Container fluid>
    <div className="page-content">
      <h5>Pipeline Coverage</h5>
      <Card className="mx-4 d-flex flex-row p-4 rounded-4 ">
        <CardBody className="p-4 w-50 d-flex flex-column gap-4 flex-1">
          <InputBlock
            label="Total Value of Opportunity in Pipeline"
            value={totalValue}
            onChange={setTotalValue}
          />
          <InputBlock
            label="Sales Target"
            value={salesTarget}
            onChange={setSalesTarget}
          />
          <InputBlock
            label="Win Rate"
            value={winRate}
            onChange={setWinRate}
            variant="rate"
          />
        </CardBody>
        <div className="flex-1 d-flex flex-column justify-content-center align-items-center">
  <div className="dark-box">
    <Label className="mx-4 fs-2">Sales Pipeline Coverage</Label>
    <Label className={`mx-4 fs-2 ${coverage >= 3 ? "text-success" : "text-danger"}`}>
      {`${coverage}x`}
    </Label>
  </div>
</div>
      </Card>
      {allFieldsFilled && coverage >= 3 ? (
        <Label className="w-100 mx-4 fs-2 text-success text-center">
          Your sales pipeline coverage is healthy
        </Label>
      ) : (
        <Label className="w-100 mx-4 fs-2 text-black text-center">
          {allFieldsFilled
            ? `Add $${parseFloat(addedAmount).toLocaleString()} to your pipeline to achieve 3.0x pipeline coverage`
            : "Fill out all fields to calculate coverage"}
        </Label>
      )}
      
    </div></Container>
  );
}
