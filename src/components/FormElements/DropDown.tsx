import React from "react";
import { Dropdown } from "react-bootstrap";
import { Field, useField } from "react-final-form";

interface MyDropdownItemProps {
  children: React.ReactNode;
  newValue: any;
  onChange: (newValue: any) => void;
}

export const MyDropdownItem: React.FC<MyDropdownItemProps> = ({
  children,
  newValue,
  onChange = () => {},
}) => (
  <Dropdown.Item onClick={() => onChange(newValue)}>{children}</Dropdown.Item>
);

const DropdownField = ({
  name,
  label,
  defaultName,
  children,
}: {
  name: any;
  label: any;
  defaultName: any;
  children: any;
}) => {
  const { input, meta } = useField(name);

  const validate = (value: any) => {
    if (!value) {
      return "Required";
    }
  };
  return (
    <Dropdown className="common-dropdown">
      <label className="form-label">{label}</label>
      <Dropdown.Toggle variant="success">
        <Field
          name={name}
          validate={validate}
          render={({ input, meta }) => (
            <>
              {input.value
                ? // Render the label of the selected option
                  children.find(
                    (child: any) => child.props.newValue === input.value
                  )?.props.children || input.value
                : // Render the default name if no option is selected
                  defaultName}
              {/* No error message rendered here */}
            </>
          )}
        />
      </Dropdown.Toggle>
      <Dropdown.Menu>
        {React.Children.map(children, (child) =>
          React.cloneElement(child, { onChange: input.onChange })
        )}
      </Dropdown.Menu>
      {meta.touched && meta.error && <div className="error">{meta.error}</div>}
    </Dropdown>
  );
};

export default DropdownField;
