import { Field, FieldProps } from "react-final-form";
import { FormControl } from "./FormControl";
import InfoTooltip from "../InfoTooltip";

export interface RadioControlType extends FieldProps<any, any, any, any> {
  validations?: any;
  icon?: string;
  name: string;
  disabled?: boolean;
  blur?: boolean;
  value?: string;
  label: string;
  tooltipText?: string;
}

export function RadioControl({
  label,
  icon,
  disabled,
  blur,
  value,
  name,
  tooltipText,
  ...rest
}: RadioControlType) {
  return (
    <div className="wrap-raido-btn">
      <label className="d-flex gap-1 radio-container">
        <Field
          name={name}
          component="input"
          type="radio"
          value={value}
          {...rest}
        />
        {label}
        <span className="checkmarks"></span>
        {tooltipText ? <InfoTooltip text={tooltipText} /> : null}
      </label>
    </div>
  );
}
