import React, { useMemo } from "react";
import { Field, FieldProps } from "react-final-form";
import Select, { ActionMeta, MultiValue, StylesConfig } from "react-select";
import { DropDownOption, DropDownOptions } from "../../types/rental.type";
import InfoTooltip from "../InfoTooltip";

interface FormControlProps extends FieldProps<any, any, any, any> {
  label?: string;
  value?: any;
  disabled?:boolean;
  icon?: string;
  blur?: boolean;
  options: DropDownOptions;
  isSearchable?: boolean;
  isMulti?: true;
  toolTipInfo?: string;
  updateFilterCategoryId?: (query: object) => void;
}

const colourStyles: StylesConfig<any, true> = {
  placeholder: (styles) => ({
    ...styles,
    fontFamily: "montserratmedium, sans-serif",
    fontSize: "15px",
    marginLeft: 0,
  }),
  control: (styles, { isDisabled, isFocused }) => ({
    ...styles,
    borderWidth: 0,
    borderColor: "#f9f9f9",
    backgroundColor: "#f9f9f9",
    boxShadow: "none",
    borderRadius: 0,
    ":hover": {
      borderWidth: 0,
      ...styles[":hover"],
      borderColor: "#f9f9f9",
    },
    ":focus": {
      borderWidth: 0,
      ...styles[":focus"],
      borderColor: "#f9f9f9",
      boxShadow: "none",
    },
    ":active": {
      borderWidth: 0,
      ...styles[":active"],
      borderColor: "#f9f9f9",
    },
  }),
  valueContainer: (styles) => ({
    ...styles,
    padding: 0,
  }),
  option: (styles, { data, isDisabled, isFocused, isSelected }) => ({
    ...styles,
    backgroundColor: !isDisabled ? (isSelected ? "#3ca160" : undefined) : undefined,
    color: !isDisabled ? (isSelected ? "white" : "black") : "#ddd",
    zIndex: 999,
    cursor: isDisabled ? "not-allowed" : "default",
    ":active": {
      backgroundColor: !isDisabled ? "#3ca160" : "#ddd",
      color: !isDisabled ? "white" : "black",
    },
    ":hover": {
      backgroundColor: !isDisabled ? "#3ca160" : "#ddd",
      color: !isDisabled ? "white" : "black",
    },
  }),
  menu: (styles) => ({
    ...styles,
    marginTop: 0,
    marginLeft: "-20px",
    zIndex: 999,
    fontSize: "13px",
    fontFamily: "montserratmedium, sans-serif",
    borderRadius: 0,
    boxShadow: "none",
    border: "1px solid rgba(0, 0, 0, 0.175)",
  }),
  multiValue: (styles) => ({
    ...styles,
    backgroundColor: "#edf6f0",
  }),
  multiValueLabel: (styles) => ({
    ...styles,
    color: "#3ca160",
  }),
  multiValueRemove: (styles) => ({
    ...styles,
    ":hover": {
      backgroundColor: undefined,
      color: "#1a1b29",
    },
  }),
  indicatorSeparator: (styles) => ({
    ...styles,
    display: "none",
  }),
  dropdownIndicator: (base) => ({
    ...base,
    color: "hsl(0, 0%, 60%)",
    padding: 0,
    marginTop: "-20px",
  }),
};

export const SearchSelectWithForm = React.memo(function SearchSelectWithForm({
  label,
  options,
  value,
  disabled,
  isSearchable = false,
  isMulti,
  placeholder,
  toolTipInfo,
  ...rest
}: FormControlProps) {
  return (
    <Field
      {...rest}
      subscription={{ value: true, touched: true, error: true }}
      render={({ input, meta }) => (
        <div className="text-start form-field">
          {label && <label className="form-label">{label}{toolTipInfo && <InfoTooltip text={toolTipInfo} />}</label>}
          <div className="input-group2">
            <SearchSelect
              options={options}
              isSearchable={isSearchable}
              isMulti={isMulti}
              placeholder={placeholder}
              onChange={(value, actionMeta) => {
                input.onChange(value);
                if (rest.onChange) rest.onChange(value, actionMeta); // Call parent component's onChange
              }}
              value={input.value ? input.value : value}
              disabled={disabled}
            />
          </div>
          {meta.touched && meta.error && <span className="error">{meta.error}</span>}
        </div>
      )}
    />
  );
});

export default function SearchSelect({
  options,
  isSearchable = false,
  isMulti,
  placeholder,
  value,
  disabled,
  onChange,
}: {
  options: DropDownOptions;
  isSearchable?: boolean;
  isMulti?: true;
  placeholder?: string;
  value?: any;
  disabled?:any;
  onChange?: (
    newValue: MultiValue<DropDownOption>,
    actionMeta: ActionMeta<any>
  ) => void;
}) {
  const matchedValue = useMemo(() => {
    if (value && isMulti) {
      return value.map((val: any) => {
        const matchedVal = options.find((option) => option.value === val);
        return matchedVal ? matchedVal : { value: val, label: val };
      });
    }
    else {
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        value = value.value
      }
    }
    return isMulti ? [] : options.find((option) => option.value === value);
  }, [options, value]);

  return (
    <Select
      isSearchable={isSearchable}
      options={options}
      isMulti={isMulti}
      noOptionsMessage={() => "No Result Found"}
      className="form-control pb-1"
      classNamePrefix="react-select"
      styles={colourStyles}
      placeholder={placeholder}
      defaultValue={
        isMulti ? matchedValue?.map((ele: any) => ele) : value ? matchedValue : options[0]
      }
      onChange={onChange}
      isDisabled={disabled}
    />
  );
}