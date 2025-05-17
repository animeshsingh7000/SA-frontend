import { Field, useField } from "react-final-form";
import { FormControl } from "../../FormElements/FormControl";
import { composeValidators, required } from "../../../validations";
import { Dropdown } from "react-bootstrap";
import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";

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
  
export default function EditTenthForm({
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
                Keys
            </p>

            <div className="row">

                <div className="col-12 col-md-12">
                    <FormControl
                        label="Please provide details of the keys you will provide. Fobs, pass cards, garage access, parking passes etc*"
                        name="keys.keyDetail"
                        type="textarea"
                        placeholder="Your answer"
                        disabled={disabled}
                        validate={composeValidators(
                            required
                        )}
                    />
                </div>

                <div className="col-12 col-md-12">
                    <FormControl
                        label="How many sets of keys will you provide? *"
                        name="keys.setOfKeys"
                        type="mobile"
                        placeholder="Your answer"
                        disabled={disabled}
                        validate={composeValidators(
                            required
                        )}
                    />
                </div>

                <div className="col-12 col-md-12 custom-select-form">
                    {
                        disabled ? 
                            <FormControl
                                label="Will a key be required to access the building? Please detail the code if there is an electronic lock.*"
                                name="keys.isKeyRequiredToAccessBuilding"
                                type="text"
                                disabled={disabled}
                                placeholder="Your answer"
                            />
                        :
                        <DropdownField name="keys.isKeyRequiredToAccessBuilding" label="Will a key be required to access the building? Please detail the code if there is an electronic lock.*" defaultName="No" value="No" required={true}>
                            <MyDropdownItem newValue="Yes" onChange={handleSubmit}>Yes</MyDropdownItem>
                            <MyDropdownItem newValue="No" onChange={handleSubmit}>No</MyDropdownItem>
                        </DropdownField>
                    }
                </div>

                <div className="col-12 col-md-12 custom-select-form">
                    {
                        disabled ? 
                            <FormControl
                                label="Will you be providing a garage door opener?*"
                                name="keys.isGarageDoorOpener"
                                type="text"
                                disabled={disabled}
                                placeholder="Your answer"
                            />
                        :
                        <DropdownField name="keys.isGarageDoorOpener" label="Will you be providing a garage door opener?*" defaultName="No" value="No" required={true}>
                            <MyDropdownItem newValue="Yes" onChange={handleSubmit}>Yes</MyDropdownItem>
                            <MyDropdownItem newValue="No" onChange={handleSubmit}>No</MyDropdownItem>
                        </DropdownField>
                    }
                </div>

                <div className="col-12 col-md-12 custom-select-form">
                    {
                        disabled ? 
                            <FormControl
                                label="Is a key required to access the mail?*"
                                name="keys.isKeyRequiredToAccessMailBox"
                                type="text"
                                disabled={disabled}
                                placeholder="Your answer"
                            />
                        :
                        <DropdownField name="keys.isKeyRequiredToAccessMailBox" label="Is a key required to access the mail?*" defaultName="No" value="No" required={true}>
                            <MyDropdownItem newValue="Yes" onChange={handleSubmit}>Yes</MyDropdownItem>
                            <MyDropdownItem newValue="No" onChange={handleSubmit}>No</MyDropdownItem>
                        </DropdownField>
                    }
                </div>
            </div>
        </>
    );
}

const MyDropdownItem: React.FC<MyDropdownItemProps> = ({ children, newValue, onChange = () => {} }) => (
    <Dropdown.Item onClick={() => onChange(newValue)}>{children}</Dropdown.Item>
);
