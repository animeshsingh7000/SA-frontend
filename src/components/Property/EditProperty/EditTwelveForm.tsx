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
        return 'This field is Required';
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
  
export default function EditTwelveForm({
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
                Insurance
            </p>
            <p>
                Having insurance to cover building damage and or contents damage is a sound investment. If you do not currently have insurance, we can help you find a policy that works for many of our clients.
            </p>

            <div className="row">
                <div className="col-12 col-md-12 custom-select-form">
                    {
                        disabled ? 
                            <FormControl
                                label="Do you have home/building insurance?"
                                name="insurance.isHomeOrBuildingInsurance"
                                type="text"
                                disabled={disabled}
                                placeholder="Your answer"
                            />
                        :
                        <DropdownField name="insurance.isHomeOrBuildingInsurance" label="Do you have home/building insurance?" defaultName="No" value="No" required={false}>
                            <MyDropdownItem newValue="Yes" onChange={handleSubmit}>Yes</MyDropdownItem>
                            <MyDropdownItem newValue="No" onChange={handleSubmit}>No</MyDropdownItem>
                        </DropdownField>
                    }
                </div>

                <div className="col-12 col-md-12 custom-select-form">
                    {
                        disabled ? 
                            <FormControl
                                label="Do you have contents insurance?"
                                name="insurance.isContentInsuranceAvailable"
                                type="text"
                                disabled={disabled}
                                placeholder="Your answer"
                            />
                        :
                        <DropdownField name="insurance.isContentInsuranceAvailable" label="Do you have contents insurance?" defaultName="No" value="No" required={false}>
                            <MyDropdownItem newValue="Yes" onChange={handleSubmit}>Yes</MyDropdownItem>
                            <MyDropdownItem newValue="No" onChange={handleSubmit}>No</MyDropdownItem>
                        </DropdownField>
                    }
                </div>

                <div className="col-12 col-md-12 custom-select-form">
                    {
                        disabled ? 
                            <FormControl
                                label="Does the insurance company require contact before any repairs may be assessed?"
                                name="insurance.isInsuranceContentRequiredBeforeAnyRepair"
                                type="text"
                                disabled={disabled}
                                placeholder="Your answer"
                            />
                        :
                        <DropdownField name="insurance.isInsuranceContentRequiredBeforeAnyRepair" label="Does the insurance company require contact before any repairs may be assessed?" defaultName="No" value="No" required={false}>
                            <MyDropdownItem newValue="Yes" onChange={handleSubmit}>Yes</MyDropdownItem>
                            <MyDropdownItem newValue="No" onChange={handleSubmit}>No</MyDropdownItem>
                        </DropdownField>
                    }
                </div>

                <div className="col-12 col-md-12 custom-select-form">
                    {
                        disabled ? 
                            <FormControl
                                label="Do you authorize Attache to contact your insurer in case of emergency?"
                                name="insurance.isContentRequireByAttachToInsurer"
                                type="text"
                                disabled={disabled}
                                placeholder="Your answer"
                            />
                        :
                        <DropdownField name="insurance.isContentRequireByAttachToInsurer" label="Do you authorize Attache to contact your insurer in case of emergency?" defaultName="No" value="No" required={false}>
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
