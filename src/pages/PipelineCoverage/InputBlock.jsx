import { memo } from "react";
import { Input, InputGroup, InputGroupText, Label } from "reactstrap";

const InputBlock = ({ label, value, onChange, variant = "money" }) => {
  return (
    <div className="mb-3">
      <Label className="mb-0 fs-5">{label}</Label>
      <InputGroup>
        {variant === "rate" && <InputGroupText>%</InputGroupText>}
        {variant === "money" && <InputGroupText>$</InputGroupText>}
        <Input
          type="number"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={variant === "short" ? "short-input" : ""}
        />
      </InputGroup>
    </div>
  );
};

export default memo(InputBlock);
