import { Field, useField } from "react-final-form";
import { FormControl } from "../../FormElements/FormControl";
import { Dropdown } from "react-bootstrap";
import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";

interface MyDropdownItemProps {
    children: React.ReactNode;
    newValue: any;
    onChange?: (newValue: any) => void;
}
  
const DropdownField = ({ name, label, defaultName, value, children, required } : {name: any, label:any; defaultName:any; value:any, children:any, required:any}) => {
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
  
export default function EditSecondForm({
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
                Owner Goals
            </p>
            <p>
                What are your goals/expectations by renting your property with Attache?
            </p>

            <div className="row">
                
                <div className="col-12 col-md-12">
                    <FormControl
                        label="What is your expected annual rental income? "
                        name="ownerGoals.expectedAnnualRentalIncome"
                        type="text"
                        disabled={disabled}
                        placeholder="Your answer"
                    />
                </div>
                <div className="col-12 col-md-12">
                    <FormControl
                        label="Property usage/schedule?"
                        name="ownerGoals.propertyUsageOrSchedule"
                        type="textarea"
                        disabled={disabled}
                        placeholder="Your answer"
                    />
                </div>
                
                <div className="col-12 col-md-12">
                    <FormControl
                        label="What is the lead time required/requested from finalizing this questionnaire to us listing your property for rental?"
                        name="ownerGoals.leadTimeRequireToListProperty"
                        type="text"
                        disabled={disabled}
                        placeholder="Your answer"
                    />
                </div>

                <div className="col-12 col-md-12">
                    <FormControl
                        label="What is happening with the property between now and the available date? "
                        name="ownerGoals.propertyBtwNowAndAvailabilityDate"
                        type="textarea"
                        disabled={disabled}
                        placeholder="Your answer"
                    />
                </div>

                <div className="col-12 col-md-12 custom-select-form">
                    {
                        disabled ? 
                            <FormControl
                                label="Do you plan to have a locked closet at the property for personal belongings?"
                                name="ownerGoals.lockedClosetPropertyBelongings"
                                type="text"
                                disabled={disabled}
                                placeholder="Your answer"
                            />
                        :
                        <DropdownField name="ownerGoals.lockedClosetPropertyBelongings" label="Do you plan to have a locked closet at the property for personal belongings?" defaultName="No" value="No" required={false}>
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
