import { Field, useField } from "react-final-form";
import { FormControl } from "../../FormElements/FormControl";
import { Dropdown } from "react-bootstrap";
import { MATTRESS_TYPE } from "../../../constants";
import React, { useEffect } from "react";
import { SearchSelectWithForm } from "../../SearchSelect/SearchSelect";
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
  
export default function EditSixthForm({
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
                Beds
            </p>
            <p>
                We spend a third of our lives in bed. Having great beds is important to everyone.
            </p>

            <div className="row">

                <div className="col-12 custom-select-form">
                {
                        disabled ? 
                            <FormControl
                                label="Bedroom count of property *"
                                name="beds.bedroomCount"
                                type="text"
                                disabled={disabled}
                                placeholder="Your answer"
                            />
                        :
                        <DropdownField name="beds.bedroomCount" label="Bedroom count of property *" defaultName="Number of Bedrooms" value="" required={true}>
                            <MyDropdownItem newValue="" onChange={handleSubmit}>Number of Bedrooms</MyDropdownItem>
                            <MyDropdownItem newValue="Studio" onChange={handleSubmit}>Studio</MyDropdownItem>
                            <MyDropdownItem newValue="OneBed" onChange={handleSubmit}>1 Bedroom</MyDropdownItem>
                            <MyDropdownItem newValue="TwoBed" onChange={handleSubmit}>2 Bedroom</MyDropdownItem>
                            <MyDropdownItem newValue="ThreeBed" onChange={handleSubmit}>3 Bedroom</MyDropdownItem>
                            <MyDropdownItem newValue="FourBed" onChange={handleSubmit}>4 Bedroom</MyDropdownItem>
                            <MyDropdownItem newValue="FiveBed" onChange={handleSubmit}>5 Bedroom</MyDropdownItem>
                            <MyDropdownItem newValue="SixBed" onChange={handleSubmit}>6 Bedroom</MyDropdownItem>
                            <MyDropdownItem newValue="SevenBed" onChange={handleSubmit}>7 Bedroom</MyDropdownItem>
                            <MyDropdownItem newValue="EightBed" onChange={handleSubmit}>8 Bedroom</MyDropdownItem>
                            <MyDropdownItem newValue="NineBedPlus" onChange={handleSubmit}>9 Bedroom or more</MyDropdownItem>
                        </DropdownField>
                    }
                </div>
                
                <div className="col-12 custom-select-form">
                    <SearchSelectWithForm
                        name="beds.bedAndMattressType"
                        label="Please describe bed and mattress types"
                        options={MATTRESS_TYPE}
                        isMulti={true}
                        placeholder="Select multiple"
                    />
                </div>

                <div className="col-12 col-md-12 custom-select-form">
                    {
                        disabled ? 
                            <FormControl
                                label="Are there bed-frames/headboards?"
                                name="beds.isBedFramesHeadboards"
                                type="text"
                                disabled={disabled}
                                placeholder="Your answer"
                            />
                        :
                        <DropdownField name="beds.isBedFramesHeadboards" label="Are there bed-frames/headboards?" defaultName="No" value="No" required={false}>
                            <MyDropdownItem newValue="Yes" onChange={handleSubmit}>Yes</MyDropdownItem>
                            <MyDropdownItem newValue="No" onChange={handleSubmit}>No</MyDropdownItem>
                        </DropdownField>
                    }
                </div>

                <div className="col-12 col-md-12">
                    <FormControl
                        label="If more than one bed is present, please describe the configuration in the bedrooms."
                        name="beds.bedroomConfigurationDesc"
                        type="textarea"
                        disabled={disabled}
                        placeholder="Add Description"
                    />
                </div>
                
                <div className="col-12 col-md-12">
                    <FormControl
                        label="Please describe the size of each mattress."
                        name="beds.eachMattressSizeDesc"
                        type="text"
                        disabled={disabled}
                        placeholder="Add Description"
                    />
                </div>

                <div className="col-12 col-md-12">
                    <FormControl
                        label="Please describe the age of each mattress."
                        name="beds.eachMattressAgeDesc"
                        type="textarea"
                        disabled={disabled}
                        placeholder="Add Description"
                    />
                </div>

                <div className="col-12 col-md-12">
                    <FormControl
                        label="Please detail the material or type of each mattress (if known)."
                        name="beds.eachMattressMaterialDesc"
                        type="textarea"
                        disabled={disabled}
                        placeholder="Add Description"
                    />
                </div>
            </div>
        </>
    );
}

const MyDropdownItem: React.FC<MyDropdownItemProps> = ({ children, newValue, onChange = () => {} }) => (
    <Dropdown.Item onClick={() => onChange(newValue)}>{children}</Dropdown.Item>
);
