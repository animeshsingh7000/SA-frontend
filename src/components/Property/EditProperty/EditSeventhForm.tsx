import { Field, useField } from "react-final-form";
import { FormControl } from "../../FormElements/FormControl";
import { composeValidators, required, requiredSelect } from "../../../validations";
import { Dropdown } from "react-bootstrap";
import { KITCHEN_EQUIPMENTS} from "../../../constants";
import React, { useEffect, useState } from "react";
import { SearchSelectWithForm } from "../../SearchSelect/SearchSelect";
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
  
export default function EditSeventhForm({
    handleSubmit,
    kitchenEquipmentDesc,
    disabled = false
} : {
    handleSubmit: () => void;
    kitchenEquipmentDesc?: any;
    disabled?: boolean
}) {
    const { pathname } = useLocation();
    const [selectedOptions, setSelectedOptions] = useState<any[]>([]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    const handleSelectChange = (selected: any) => {
        // Only save values (not labels)
        const values = selected.map((option: any) => option.value);
        setSelectedOptions(values); // Update the selected options
    };


    return (
        <>
            <p className="edit-property-heading">
                Appliances and kitchen equipment
            </p>
            <p>
                Kitchenware and equipment is essential for ensuing that guests are attended. Please check off to ensure you have a minimum of each of the following items in your property.

            </p>

            <div className="row">
                <div className="col-12 custom-select-form">
                    {/* <SearchSelectWithForm
                        name="appliancesAndKitchenEquipment.kitchenEquipmentDesc"
                        label="Please mention kitchen equipments? *"
                        options={KITCHEN_EQUIPMENTS}
                        isMulti={true}
                        placeholder="Select multiple"
                        validate={composeValidators(requiredSelect)}
                    /> */}
                    <Field
                        name="appliancesAndKitchenEquipment.kitchenEquipmentDesc"
                        validate={composeValidators(requiredSelect)}
                    >
                        {({ input }) => (
                            <SearchSelectWithForm
                                {...input} // spread the input props
                                label="Please mention kitchen equipments? *"
                                options={KITCHEN_EQUIPMENTS}
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
                    
                </div>
                <div className="col-12 col-md-12">
                    <FormControl
                        label="Please detail the make and model of your dishwasher."
                        name="appliancesAndKitchenEquipment.dishwasherMakeAndModelDesc"
                        type="textarea"
                        rows="3"
                        disabled={disabled}
                        placeholder="Your answer"
                    />
                </div>

                <div className="col-12 col-md-12">
                    <FormControl
                        label="Please provide details of the stove top. How many burners? Is it gas, convection, or electric?"
                        name="appliancesAndKitchenEquipment.ovenMakeModelDesc"
                        type="textarea"
                        rows="3"
                        disabled={disabled}
                        placeholder="Your answer"
                    />
                </div>

                <div className="col-12 col-md-12">
                    <FormControl
                        label="Please provide details of the stove top. How many burners? Is it gas, convection, or electric?"
                        name="appliancesAndKitchenEquipment.stoveDesc"
                        type="textarea"
                        rows="3"
                        disabled={disabled}
                        placeholder="Your answer"
                    />
                </div>
                <div className="col-12 col-md-12 custom-select-form">
                    {
                        disabled ? 
                            <FormControl
                                label="Do you have a Washer and Dryer in your unit/home for private use, or is it shared in a building for other residents?*"
                                name="appliancesAndKitchenEquipment.washerAndDryerShared"
                                type="text"
                                disabled={disabled}
                                placeholder="Your answer"
                            />
                        :
                        <DropdownField name="appliancesAndKitchenEquipment.washerAndDryerShared" label="Do you have a Washer and Dryer in your unit/home for private use, or is it shared in a building for other residents?*" defaultName="Please select" value="" required={true}>
                            <MyDropdownItem newValue="" >Please select</MyDropdownItem>
                            <MyDropdownItem newValue="Private Use" onChange={handleSubmit}>Private Use</MyDropdownItem>
                            <MyDropdownItem newValue="Shared - pay for use" onChange={handleSubmit}>Shared - pay for use</MyDropdownItem>
                            <MyDropdownItem newValue="Shared - free for use" onChange={handleSubmit}>Shared - free for use</MyDropdownItem>
                        </DropdownField>
                    }
                </div>

                <div className="col-12 col-md-12">
                    <FormControl
                        label="Please provide details on Washer/Dryer access, where they are (basement, hallway on the same floor if in a condo).*"
                        name="appliancesAndKitchenEquipment.washerDryerAccessDesc"
                        type="text"
                        disabled={disabled}
                        placeholder="Your answer"
                        validate={composeValidators(required)}
                    />
                </div>
                <div className="col-12 col-md-12 custom-select-form">
                    {
                        disabled ? 
                            <FormControl
                                label="Does your property have HDTVs?"
                                name="appliancesAndKitchenEquipment.isPropertyWithHDTVs"
                                type="text"
                                disabled={disabled}
                                placeholder="Your answer"
                            />
                        :
                        <DropdownField name="appliancesAndKitchenEquipment.isPropertyWithHDTVs" label="Does your property have HDTVs?" defaultName="No" value="No" required={false}>
                            <MyDropdownItem newValue="Yes" onChange={handleSubmit}>Yes</MyDropdownItem>
                            <MyDropdownItem newValue="No" onChange={handleSubmit}>No</MyDropdownItem>
                        </DropdownField>
                    }
                </div>
                <div className="col-12 col-md-12">
                    <FormControl
                        label="Please provide details of each television including size, brand, model, position in property, and age."
                        name="appliancesAndKitchenEquipment.eachTelevisionDesc"
                        type="text"
                        disabled={disabled}
                        placeholder="Your answer"
                    />
                </div>
                <div className="col-12 col-md-12">
                    <FormControl
                        label="Please list make and model of any specialty appliances you would like to highlight."
                        name="appliancesAndKitchenEquipment.specialtyAppliancesDesc"
                        type="text"
                        disabled={disabled}
                        placeholder="Your answer"
                    />
                </div>
            </div>
        </>
    );
}

const MyDropdownItem: React.FC<MyDropdownItemProps> = ({ children, newValue, onChange = () => {} }) => (
    <Dropdown.Item onClick={() => onChange(newValue)}>{children}</Dropdown.Item>
);
