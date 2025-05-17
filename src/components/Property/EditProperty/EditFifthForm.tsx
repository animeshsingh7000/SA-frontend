import { Field, useField } from "react-final-form";
import { FormControl } from "../../FormElements/FormControl";
import { Dropdown } from "react-bootstrap";
import { FLOOR_TYPE } from "../../../constants";
import React, { useEffect } from "react";
import { SearchSelectWithForm } from "../../SearchSelect/SearchSelect";
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
  
export default function EditFifthForm({
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
                Property Interior
            </p>

            <div className="row">

                <div className="col-12 col-md-12 custom-select-form">
                    {
                        disabled ? 
                            <FormControl
                                label="Is your property currently furnished?"
                                name="propertyInterior.isPropertyFurnished"
                                type="text"
                                disabled={disabled}
                                placeholder="Your answer"
                            />
                        :
                        <DropdownField name="propertyInterior.isPropertyFurnished" label="Is your property currently furnished?" defaultName="No" value="No" required={false}>
                            <MyDropdownItem newValue="Yes" onChange={handleSubmit}>Yes</MyDropdownItem>
                            <MyDropdownItem newValue="No" onChange={handleSubmit}>No</MyDropdownItem>
                        </DropdownField>
                    }
                </div>

                <div className="col-12 col-md-12">
                    <FormControl
                        label="When was your furniture last replaced?"
                        name="propertyInterior.furnitureLastReplaced"
                        type="text"
                        disabled={disabled}
                        placeholder="Your answer"
                    />
                </div>

                <div className="col-12 col-md-12 custom-select-form">
                    {
                        disabled ? 
                            <FormControl
                                label="Are you planning on refreshing your furnishings for the purpose of listing your property?"
                                name="propertyInterior.isPlanningToRefreshFurnishing"
                                type="text"
                                disabled={disabled}
                                placeholder="Your answer"
                            />
                        :
                        <DropdownField name="propertyInterior.isPlanningToRefreshFurnishing" label="Are you planning on refreshing your furnishings for the purpose of listing your property?" defaultName="No" value="No" required={false}>
                            <MyDropdownItem newValue="Yes" onChange={handleSubmit}>Yes</MyDropdownItem>
                            <MyDropdownItem newValue="No" onChange={handleSubmit}>No</MyDropdownItem>
                        </DropdownField>
                    }
                </div>

                <div className="col-12 custom-select-form">
                    <SearchSelectWithForm
                        name="propertyInterior.floorType"
                        label="What is the floor type?"
                        options={FLOOR_TYPE}
                        isMulti={true}
                        placeholder="Select multiple"
                    />
                </div>

                <div className="col-12 col-md-12 custom-select-form">
                    {
                        disabled ? 
                            <FormControl
                                label="Does the Master Bedroom have an en-suite bathroom?"
                                name="propertyInterior.isMasterBedroomEnSuiteBathroom"
                                type="text"
                                disabled={disabled}
                                placeholder="Your answer"
                            />
                        :
                        <DropdownField name="propertyInterior.isMasterBedroomEnSuiteBathroom" label="Does the Master Bedroom have an en-suite bathroom?" defaultName="No" value="No" required={false}>
                            <MyDropdownItem newValue="Yes" onChange={handleSubmit}>Yes</MyDropdownItem>
                            <MyDropdownItem newValue="No" onChange={handleSubmit}>No</MyDropdownItem>
                        </DropdownField>
                    }
                </div>

                <div className="col-12 col-md-12 custom-select-form">
                    {
                        disabled ? 
                            <FormControl
                                label="Is there more than one en-suite at the property?"
                                name="propertyInterior.isMoreThanOneEnSuite"
                                type="text"
                                disabled={disabled}
                                placeholder="Your answer"
                            />
                        :
                        <DropdownField name="propertyInterior.isMoreThanOneEnSuite" label="Is there more than one en-suite at the property?" defaultName="No" value="No" required={false}>
                            <MyDropdownItem newValue="Yes" onChange={handleSubmit}>Yes</MyDropdownItem>
                            <MyDropdownItem newValue="No" onChange={handleSubmit}>No</MyDropdownItem>
                        </DropdownField>
                    }
                </div>

                <div className="col-12 col-md-12">
                    <FormControl
                        label="Please describe the closets. (i.e walk in, built in, stand alone)"
                        name="propertyInterior.closetsDescription"
                        type="text"
                        disabled={disabled}
                        placeholder="Your answer"
                    />
                </div>

                <div className="col-12 col-md-12 custom-select-form">
                    {
                        disabled ? 
                            <FormControl
                                label="Does the property have a daybed, pull-out bed, or sofa bed in addition to the sleeping space in the bedroom?"
                                name="propertyInterior.isDaybedPullOutBedOrSofaSpace"
                                type="text"
                                disabled={disabled}
                                placeholder="Your answer"
                            />
                        :
                        <DropdownField name="propertyInterior.isDaybedPullOutBedOrSofaSpace" label="Does the property have a daybed, pull-out bed, or sofa bed in addition to the sleeping space in the bedroom?" defaultName="No" value="No" required={false}>
                            <MyDropdownItem newValue="Yes" onChange={handleSubmit}>Yes</MyDropdownItem>
                            <MyDropdownItem newValue="No" onChange={handleSubmit}>No</MyDropdownItem>
                        </DropdownField>
                    }
                </div>

                <div className="col-12 col-md-12 custom-select-form">
                    {
                        disabled ? 
                            <FormControl
                                label="Does the property have blinds?"
                                name="propertyInterior.isPropertyWithBlinds"
                                type="text"
                                disabled={disabled}
                                placeholder="Your answer"
                            />
                        :
                        <DropdownField name="propertyInterior.isPropertyWithBlinds" label="Does the property have blinds?" defaultName="No" value="No" required={false}>
                            <MyDropdownItem newValue="Yes" onChange={handleSubmit}>Yes</MyDropdownItem>
                            <MyDropdownItem newValue="No" onChange={handleSubmit}>No</MyDropdownItem>
                        </DropdownField>
                    }
                </div>

                <div className="col-12 col-md-12 custom-select-form">
                {
                        disabled ? 
                            <FormControl
                                label="Does this property have a fireplace?"
                                name="propertyInterior.isPropertyWithFireplace"
                                type="text"
                                disabled={disabled}
                                placeholder="Your answer"
                            />
                        :
                        <DropdownField name="propertyInterior.isPropertyWithFireplace" label="Does this property have a fireplace?" defaultName="No" value="No" required={false}>
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
