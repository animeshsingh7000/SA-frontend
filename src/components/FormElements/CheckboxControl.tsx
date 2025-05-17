import { FieldProps } from "react-final-form";
import { FormControl } from "./FormControl";
import InfoTooltip from "../InfoTooltip";

export interface CheckboxControlType extends FieldProps<any, any, any, any> {
  validations?: any;
  name: string;
  label?: string;
  value?: boolean;
  tooltipText?: string;
}

export function CheckboxControl({
  validations,
  name = "isTermsAndConditionChecked",
  label,
  value,
  disabled,
  onChange,
  ...rest
}: CheckboxControlType) {
  return (
    <>
      <FormControl
        {...rest}
        name={name}
        type="checkbox"
        checked={value}
        disabled={disabled}
        onChange={(e:any) => onChange && onChange(e)}
        // validate={validations}
      />
      <p>{label}</p>
    </>
  );
}

export function CheckboxControlGlobal({
  name,
  label,
  value,
  tooltipText,
  onChange,
  ...rest
}: CheckboxControlType) {
  const handleGlobalChange = (e: any) => {
    if (onChange) {
      onChange(e); // Call the passed `onChange` function
    }
  };

  return (
    <div className="custom-checkbox-new">
      <CheckboxControl
        name={name}
        label={label}
        value={value}
        onChange={handleGlobalChange} // Pass the handler to CheckboxControl
        {...rest}
      />
      {tooltipText ? <InfoTooltip text={tooltipText} /> : null}
    </div>
  )
}
