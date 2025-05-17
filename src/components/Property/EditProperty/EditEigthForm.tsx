import { Field, useField, useForm } from "react-final-form";
import { FormControl } from "../../FormElements/FormControl";
import { composeValidators, required, requiredSelect } from "../../../validations";
import { Dropdown } from "react-bootstrap";
import React, { useEffect, useRef, useState } from "react";
import { SearchSelectWithForm } from "../../SearchSelect/SearchSelect";
import { CheckboxControl } from "../../FormElements/CheckboxControl";
import { DatePickerControl } from "../../FormElements/DatePicker";
import { TagsInput } from "../../FormElements/TagsInput";
import { configuration } from "../../../api";
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
  
export default function EditEighthForm({
    handleSubmit,
    tags = [],
    disabled = false
} : {
    handleSubmit: () => void;
    tags: any;
    disabled?: boolean
}) {
    const { pathname } = useLocation();
    const effectRan = useRef(false);
    const [selectedOptions, setSelectedOptions] = useState<any[]>([]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    const [amenitiesList, setAmenitiesList] = useState<any>([]);

    const handleSelectChange = (selected: any) => {
        // Only save values (not labels)
        const values = selected.map((option: any) => option.value);
        setSelectedOptions(values); // Update the selected options
    };

    useEffect(() => {
        if (!effectRan.current) {
            configuration.getSharedAmenitiesV2().then((res: any) => {
                setAmenitiesList(res.data.map((item:any) => ({
                    label: item.label,
                    value: item.value
                })));
            });
        }
        return () => {
            effectRan.current = true;
        };
    }, [])

    return (
        <>
            <p className="edit-property-heading">
                Marketing and administration
            </p>
            <p>
                Please ensure that you forward 2-4 photos as a placeholder for this property to Attache. This will assist us in getting your property rented sooner. We recommend the exterior and the kitchen.
            </p>

            <div className="row">
                <div className="col-12 col-md-12 custom-select-form">
                    {
                        disabled ? 
                            <FormControl
                                label="Do you have a basic business licence?*"
                                name="marketingAndAdministration.isBusinessLicense"
                                type="text"
                                disabled={disabled}
                                placeholder="Your answer"
                            />
                        :
                        <DropdownField name="marketingAndAdministration.isBusinessLicense" label="Do you have a basic business licence?*" defaultName="No" value="No" required={true}>
                            <MyDropdownItem newValue="Yes" onChange={handleSubmit}>Yes</MyDropdownItem>
                            <MyDropdownItem newValue="No" onChange={handleSubmit}>No</MyDropdownItem>
                        </DropdownField>
                    }
                </div>

                <div className="col-12 col-md-12 custom-select-form">
                    {
                        disabled ? 
                            <FormControl
                                label="If no, do you need assistance in getting a basic business license?"
                                name="marketingAndAdministration.isAssistanceRequiredForBusinessLicense"
                                type="text"
                                disabled={disabled}
                                placeholder="Your answer"
                            />
                        :
                        <DropdownField name="marketingAndAdministration.isAssistanceRequiredForBusinessLicense" label="If no, do you need assistance in getting a basic business license?" defaultName="No" value="No" required={false}>
                            <MyDropdownItem newValue="Yes" onChange={handleSubmit}>Yes</MyDropdownItem>
                            <MyDropdownItem newValue="No" onChange={handleSubmit}>No</MyDropdownItem>
                        </DropdownField>
                    }
                </div>

                <div className="col-12 col-md-12 _strict-lease">
                    <CheckboxControl name="marketingAndAdministration.isStrictMinimumLeaseTerm"  disabled={disabled} label="Strict Minimum Lease Term"/>
                </div>

                <div className="col-12 col-md-12">
                    <FormControl
                        label="Minimum Reservation Term"
                        name="marketingAndAdministration.minimumReservationTerm"
                        type="mobile"
                        disabled={disabled}
                        placeholder="Minimum length of a reservation allowed in number of days."
                        maxlength={3}
                    />
                </div>

                <div className="col-12 col-md-12">
                    
                    <DatePickerControl
                        label="Available from"
                        name="marketingAndAdministration.propertyAvailableFrom"
                        type={'dateTime'}
                        placeholder="MM-DD-YY"
                        disabled={disabled}
                    />
                </div>

                <div className="col-12 col-md-12">
                    <FormControl
                        label="What are the closest metro stops to your property?"
                        name="marketingAndAdministration.closestMetroStopsDesc"
                        type="textarea"
                        rows="3"
                        disabled={disabled}
                        placeholder="Your answer"
                    />
                </div>

                <div className="col-12 custom-select-form _shared-amenites">
                    {
                        amenitiesList.length ?
                            <Field
                                name="marketingAndAdministration.sharedAmenitiesDesc"
                                validate={composeValidators(requiredSelect)}
                            >
                                {({ input }) => (
                                    <SearchSelectWithForm
                                        {...input} // spread the input props
                                        label="Does your building have any shared amenities?*"
                                        options={amenitiesList}
                                        isMulti={true}
                                        placeholder="Select multiple"
                                        onChange={(selected:any) => {
                                            handleSelectChange(selected);
                                            // Only save the values to form
                                            input.onChange(selected.map((option: any) => option.value));
                                        }}
                                    />
                                )}
                            </Field>

                        :
                        null

                    }
                    
                </div>

                <div className="col-12 col-md-12 custom-select-form">
                    {
                        disabled ? 
                            <FormControl
                                label="Does your building have secure package acceptance?*"
                                name="marketingAndAdministration.isSecurePackageAcceptance"
                                type="text"
                                disabled={disabled}
                                placeholder="Your answer"
                            />
                        :
                        <DropdownField name="marketingAndAdministration.isSecurePackageAcceptance" label="Does your building have secure package acceptance?*" defaultName="No" value="No" required={true}>
                            <MyDropdownItem newValue="Yes" onChange={handleSubmit}>Yes</MyDropdownItem>
                            <MyDropdownItem newValue="No" onChange={handleSubmit}>No</MyDropdownItem>
                        </DropdownField>
                    }
                </div>

                <div className="col-12 col-md-12 custom-select-form">
                    {
                        disabled ? 
                            <FormControl
                                label="Do you have a floor plan to enhance your listing?*"
                                name="marketingAndAdministration.isFloorPlanAvailable"
                                type="text"
                                disabled={disabled}
                                placeholder="Your answer"
                            />
                        :
                        <DropdownField name="marketingAndAdministration.isFloorPlanAvailable" label="Do you have a floor plan to enhance your listing?*" defaultName="No" value="No" required={true}>
                            <MyDropdownItem newValue="Yes" onChange={handleSubmit}>Yes</MyDropdownItem>
                            <MyDropdownItem newValue="No" onChange={handleSubmit}>No</MyDropdownItem>
                        </DropdownField>
                    }
                </div>

                <div className="col-12 col-md-12 custom-select-form">
                    {
                        disabled ? 
                            <FormControl
                                label="If no, do you need assistance in getting a basic business license?"
                                name="marketingAndAdministration.isFloorAssistanceRequired"
                                type="text"
                                disabled={disabled}
                                placeholder="Your answer"
                            />
                        :
                        <DropdownField name="marketingAndAdministration.isFloorAssistanceRequired" label="If no, do you need assistance in getting a floor plan?" defaultName="No" value="No" required={false}>
                            <MyDropdownItem newValue="Yes" onChange={handleSubmit}>Yes</MyDropdownItem>
                            <MyDropdownItem newValue="No" onChange={handleSubmit}>No</MyDropdownItem>
                        </DropdownField>
                    }
                </div>

                <div className="col-12 custom-select-form _taginput">
                    <TagsInput 
                      label="Do you have any features you would like to highlight about your property?"
                      name="marketingAndAdministration.highlightFeaturesDesc"
                      // validate={composeValidators(
                      //   required
                      // )}
                      disabled={disabled}
                      tags={tags}
                      
                    />
                </div>
            </div>
        </>
    );
}

const MyDropdownItem: React.FC<MyDropdownItemProps> = ({ children, newValue, onChange = () => {} }) => (
    <Dropdown.Item onClick={() => onChange(newValue)}>{children}</Dropdown.Item>
);
