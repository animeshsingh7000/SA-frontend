import { Field, useField } from "react-final-form";
import { Dropdown } from "react-bootstrap";
import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { FormControl } from "../../FormElements/FormControl";

interface MyDropdownItemProps {
    children: React.ReactNode;
    newValue: any;
    onChange?: (newValue: any) => void;
}
  
const DropdownField = ({ name, label, defaultName, value, children, required } : {name: any, label:any; defaultName:any; value:any; children:any, required:any}) => {
    const { input, meta } = useField(name);
  
    const validate = (value:any) => {
      if (required && !value) {
        return 'This field is required';
      }
    };
    return (
      <Dropdown className="common-dropdown">
        <label className="form-label">{label}</label>
        <Dropdown.Toggle variant="success">
            <Field
                name={name}
                validate={validate}
                defaultValue={value}
                render={({ input, meta }) => (
                <>
                {input.value ? (
                    // Render the label of the selected option
                    children.find((child:any) => child.props.newValue === input.value)?.props.children || input.value
                ) : (
                    // Render the default name if no option is selected
                    defaultName
                )}
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
  
export default function EditFourthForm({
    handleSubmit,
    disabled = false
} : {
    handleSubmit: () => void;
    disabled?: boolean
}) {

    const { pathname } = useLocation();
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return (
        <>
            <p className="edit-property-heading">
                Outside space, if applicable
            </p>
            <p>
                Please provide details of any shared or private outside space attributed to this listing. This might include a yard, patio, balcony, and/or terrace associated with this listing or even connections and private entrances to other buildings.
            </p>

            <div className="row">
                {
                        disabled ? 
                            <FormControl
                                label="Does your property have a yard or outside area?"
                                name="outsideSpace.isYardOrOutsideAreaAvailable"
                                type="text"
                                disabled={disabled}
                                placeholder="Your answer"
                            />
                        :
                        <div className="col-12 col-md-12 custom-select-form">
                            <DropdownField name="outsideSpace.isYardOrOutsideAreaAvailable" label="Does your property have a yard or outside area?" defaultName="No" value="No" required={false}>
                                <MyDropdownItem newValue="Yes" onChange={handleSubmit}>Yes</MyDropdownItem>
                                <MyDropdownItem newValue="No" onChange={handleSubmit}>No</MyDropdownItem>
                            </DropdownField>
                        </div>
                }
            </div>
        </>
    );
}

const MyDropdownItem: React.FC<MyDropdownItemProps> = ({ children, newValue, onChange = () => {} }) => (
    <Dropdown.Item onClick={() => onChange(newValue)}>{children}</Dropdown.Item>
);
