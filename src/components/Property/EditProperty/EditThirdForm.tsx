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
  
const DropdownField = ({ name, label, defaultName, value, children, required } : {name: any, label:any; defaultName:any; value:any, children:any, required:any}) => {
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
  
export default function EditThirdForm({
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
                Property detailed information
            </p>
            <p>
                This section is to inform the details of your listing. The information you provide here will likely be included in the advertising we do on behalf of your property and help us gain better renters for you.
            </p>

            <div className="row">
                
                <div className="col-12 col-md-12">
                    <FormControl
                        label="What year was the property built (approximately)?"
                        name="propertyDetailInfo.propertyBuiltYear"
                        type="textarea-number"
                        disabled={disabled}
                        placeholder="Your answer"
                    />
                </div>
                <div className="col-12 col-md-12">
                    <FormControl
                        label="When was the property last renovated? Please describe what was renovated."
                        name="propertyDetailInfo.propertyLastRenovated"
                        type="textarea"
                        disabled={disabled}
                        placeholder="Your answer"
                    />
                </div>
                <div className="col-12 col-md-12 custom-select-form">
                    {
                        disabled ? 
                            <FormControl
                                label="Do any of the bedrooms currently not have a bed? *"
                                name="propertyDetailInfo.isBedroomsWithoutBed"
                                type="text"
                                disabled={disabled}
                                placeholder="Your answer"
                            />
                        :
                        <DropdownField name="propertyDetailInfo.isBedroomsWithoutBed" label="Do any of the bedrooms currently not have a bed? *" defaultName="No" value="No" required={true}>
                            <MyDropdownItem newValue="Yes" onChange={handleSubmit}>Yes</MyDropdownItem>
                            <MyDropdownItem newValue="No" onChange={handleSubmit}>No</MyDropdownItem>
                        </DropdownField>
                    }
                </div>
                <div className="col-12 col-md-12 custom-select-form">
                    {
                        disabled ? 
                            <FormControl
                                label="Does your property have a den or study? *"
                                name="propertyDetailInfo.isPropertyDenOrStudy"
                                type="text"
                                disabled={disabled}
                                placeholder="Your answer"
                            />
                        :
                        <DropdownField name="propertyDetailInfo.isPropertyDenOrStudy" label="Does your property have a den or study? *" defaultName="No" value="No" required={true}>
                            <MyDropdownItem newValue="Yes" onChange={handleSubmit}>Yes</MyDropdownItem>
                            <MyDropdownItem newValue="No" onChange={handleSubmit}>No</MyDropdownItem>
                        </DropdownField>
                    }
                </div>
                <div className="col-12 custom-select-form">
                    {
                        disabled ? 
                            <FormControl
                                label="Full bathroom count"
                                name="propertyDetailInfo.fullBathroomCount"
                                type="text"
                                disabled={disabled}
                                placeholder="Your answer"
                            />
                        :
                        <DropdownField name="propertyDetailInfo.fullBathroomCount" label="Full bathroom count" defaultName="Number of Bathrooms" value="" required={false}>
                            <MyDropdownItem newValue="" onChange={handleSubmit}>Number of Bathrooms</MyDropdownItem>
                            <MyDropdownItem newValue="OneBath" onChange={handleSubmit}>One</MyDropdownItem>
                            <MyDropdownItem newValue="TwoBath" onChange={handleSubmit}>Two</MyDropdownItem>
                            <MyDropdownItem newValue="ThreeBath" onChange={handleSubmit}>Three</MyDropdownItem>
                            <MyDropdownItem newValue="FourBath" onChange={handleSubmit}>Four</MyDropdownItem>
                        </DropdownField>
                    }
                </div>
                <div className="col-12 custom-select-form">
                    {
                        disabled ? 
                            <FormControl
                                label="Half bathroom count *"
                                name="propertyDetailInfo.halfBathroomCount"
                                type="text"
                                disabled={disabled}
                                placeholder="Your answer"
                            />
                        :
                        <DropdownField name="propertyDetailInfo.halfBathroomCount" label="Half bathroom count *" defaultName="Number of Bathrooms" value="" required={true}>
                            <MyDropdownItem newValue="" onChange={handleSubmit}>Number of Bathrooms</MyDropdownItem>
                            <MyDropdownItem newValue="ZeroBath" onChange={handleSubmit}>Zero</MyDropdownItem>
                            <MyDropdownItem newValue="OneBath" onChange={handleSubmit}>One</MyDropdownItem>
                            <MyDropdownItem newValue="TwoBath" onChange={handleSubmit}>Two</MyDropdownItem>
                            <MyDropdownItem newValue="ThreeBath" onChange={handleSubmit}>Three</MyDropdownItem>
                            <MyDropdownItem newValue="FourBath" onChange={handleSubmit}>Four</MyDropdownItem>
                        </DropdownField>
                    }
                </div>
                <div className="col-12 col-md-12 custom-select-form">
                    {
                        disabled ? 
                            <FormControl
                                label="Do one or more of your bathrooms have a bathtub ?"
                                name="propertyDetailInfo.isBathroomsHaveBathtub"
                                type="text"
                                disabled={disabled}
                                placeholder="Your answer"
                            />
                        :
                        <DropdownField name="propertyDetailInfo.isBathroomsHaveBathtub" label="Do one or more of your bathrooms have a bathtub ?" defaultName="No" value="No" required={false}>
                            <MyDropdownItem newValue="Yes" onChange={handleSubmit}>Yes</MyDropdownItem>
                            <MyDropdownItem newValue="No" onChange={handleSubmit}>No</MyDropdownItem>
                        </DropdownField>
                    }
                </div>
                
                <div className="col-12 col-md-12">
                    <FormControl
                        label="Please briefly describe the shower (walk-in, shower over bath)"
                        name="propertyDetailInfo.showerDescription"
                        type="text"
                        disabled={disabled}
                        placeholder="Your answer"
                    />
                </div>

                <div className="col-12 col-md-12">
                    <FormControl
                        label="Please briefly describe your bathroom(s) (fittings, style, fixtures, counters etc)"
                        name="propertyDetailInfo.bathroomDescription"
                        type="textarea"
                        disabled={disabled}
                        placeholder="Your answer"
                    />
                </div>
                <div className="col-12 col-md-12">
                    <FormControl
                      label="What is the approximate area of the inside of the property (in square feet)*"
                      name="propertyDetailInfo.propertyApproxArea"
                      type="mobile"
                      maxlength={12}
                      disabled={disabled}
                      placeholder="Numbers only"
                      validate={composeValidators(required)}
                    />
                </div>

                <div className="col-12 col-md-12 custom-select-form">
                    {
                        disabled ? 
                            <FormControl
                                label="Will you offer parking with your listing?*"
                                name="propertyDetailInfo.isParking"
                                type="text"
                                disabled={disabled}
                                placeholder="Your answer"
                            />
                        :
                        <DropdownField name="propertyDetailInfo.isParking" label="Will you offer parking with your listing?*" defaultName="No" value="No" required={true}>
                            <MyDropdownItem newValue="Yes" onChange={handleSubmit}>Yes</MyDropdownItem>
                            <MyDropdownItem newValue="No" onChange={handleSubmit}>No</MyDropdownItem>
                        </DropdownField>
                    }
                </div>

                <div className="col-12 col-md-12">
                    <FormControl
                      label="How many floors in this listing?"
                      name="propertyDetailInfo.floorsListingCount"
                      type="mobile"
                      maxlength={12}
                      disabled={disabled}
                      placeholder="Numbers only"
                    />
                </div>

                <div className="col-12 col-md-12 custom-select-form">
                    {
                        disabled ? 
                            <FormControl
                                label="If more than one story, is there a staircase?"
                                name="propertyDetailInfo.isStairCaseAvailable"
                                type="text"
                                disabled={disabled}
                                placeholder="Your answer"
                            />
                        :
                        <DropdownField name="propertyDetailInfo.isStairCaseAvailable" label="If more than one story, is there a staircase?" defaultName="No" value="No" required={false}>
                            <MyDropdownItem newValue="Yes" onChange={handleSubmit}>Yes</MyDropdownItem>
                            <MyDropdownItem newValue="No" onChange={handleSubmit}>No</MyDropdownItem>
                        </DropdownField>
                    }
                </div>

                <div className="col-12 col-md-12">
                    <FormControl
                        label="If the property is more then one floor please identify which floor each bedroom and bathroom are located?"
                        name="propertyDetailInfo.propertyMoreThanOneFloorDescription"
                        type="text"
                        disabled={disabled}
                        placeholder="Your answer"
                    />
                </div>

                <div className="col-12 col-md-12">
                    <FormControl
                        label="How many floors in the building (if different to above)?"
                        name="propertyDetailInfo.buildingFloorsCount"
                        type="mobile"
                        maxlength={12}
                        disabled={disabled}
                        placeholder="Your answer"
                    />
                </div>

                <div className="col-12 col-md-12">
                    <FormControl
                        label="Which floor of the building is the property located?"
                        name="propertyDetailInfo.propertyFloorLocatedAt"
                        type="mobile"
                        maxlength={12}
                        disabled={disabled}
                        placeholder="Your answer"
                    />
                </div>

                <div className="col-12 col-md-12 custom-select-form">
                    {
                        disabled ? 
                            <FormControl
                                label="Will you accept guests who wish to bring pets?"
                                name="propertyDetailInfo.isPetsAllowed"
                                type="text"
                                disabled={disabled}
                                placeholder="Your answer"
                            />
                        :
                        <DropdownField name="propertyDetailInfo.isPetsAllowed" label="Will you accept guests who wish to bring pets?" defaultName="No" value="No" required={false}>
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
