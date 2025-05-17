import { Field, useField } from "react-final-form";
import { FormControl } from "../../FormElements/FormControl";
import { composeValidators, maxlength, required, requiredSelect } from "../../../validations";
import { Dropdown } from "react-bootstrap";
import { PROPERTY_TYPE, VALIDATIONS } from "../../../constants";
import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { configuration } from "../../../api";
import { SearchSelectWithForm } from "../../SearchSelect/SearchSelect";
import { getNeighbourhood } from "../../../api/admin/neighborhood";

interface MyDropdownItemProps {
    children: React.ReactNode;
    newValue: any;
    onChange?: (newValue: any) => void;
}
  
const DropdownField = ({ name, label, defaultName, children, required } : {name: any, label:any; defaultName:any; children:any, required:any}) => {
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
    const [neighbourhood, setNeighbourhood] = useState([]);
    const [quadrants, setQuadrants] = useState((localStorage.getItem("quadrants")
        ? JSON.parse(localStorage.getItem("quadrants") as string)
    : []));
    const [stateCodeList, setStateCodeList] = useState<any>([]);
    const effectRan = useRef(false);

    useEffect(() => {
        if (!effectRan.current) {
            configuration.getStateCodes().then((res: any) => {
                setStateCodeList(res.data.map((item:any) => ({
                    label: item.name,
                    value: item.code
                })));
            });
            getNeighbourhood().then((res: any) => {
                setNeighbourhood(res.data.neighbourhoods.map((item:any) => ({
                    name: item.name,
                    _id: item._id
                })))         
            });
        }
        return () => {
            effectRan.current = true;
        };
    }, [])

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return (
        <>
            <p className="edit-property-heading">
                Property Details
            </p>

            <div className="row">
                <div className="col-12 col-md-12 custom-select-form">
                    {
                        disabled ? 
                            <FormControl
                                label="Region*"
                                name="propertyDetails.propertyRegion"
                                type="text"
                                disabled={disabled}
                                placeholder="Enter Region"
                            />
                        :
                            <DropdownField name="propertyDetails.propertyRegion" label="Region*" defaultName="Select a region if applicable." required={true}>
                                <MyDropdownItem newValue="" onChange={handleSubmit}>Select a region if applicable.</MyDropdownItem>
                                <MyDropdownItem newValue="District of Columbia, Virginia and Maryland" onChange={handleSubmit}>District of Columbia, Virginia and Maryland</MyDropdownItem>
                            </DropdownField>
                    }
                    
                </div>
                <div className="col-12 col-md-12 custom-select-form">
                    {
                        disabled ? 
                            <FormControl
                                label="Neighborhood*"
                                name="propertyDetails.neighborhood"
                                type="text"
                                disabled={disabled}
                                placeholder="Enter Neighborhood"
                            />
                        :
                            <DropdownField name="propertyDetails.neighborhood" label="Neighborhood*" defaultName="Select a neighborhood." required={true}>
                                {(
                                    neighbourhood
                                    
                                ).map((menu:any) => (
                                    <MyDropdownItem newValue={menu._id} onChange={handleSubmit}>{menu.name}</MyDropdownItem>

                                ))}
                            </DropdownField>
                    }
                </div>
                <div className="col-12 col-md-12 custom-select-form">
                    {
                        disabled ? 
                            <FormControl
                                label="Please indentify your property type"
                                name="propertyDetails.propertyType"
                                type="text"
                                disabled={disabled}
                                placeholder="Enter proprty type"
                            />
                        :
                        <DropdownField name="propertyDetails.propertyType" label="Please indentify your property type" defaultName="Please select" required={false}>
                            {(
                                PROPERTY_TYPE
                                
                            ).map((menu:any) => (
                                <MyDropdownItem newValue={menu.value} onChange={handleSubmit}>{menu.title}</MyDropdownItem>

                            ))}
                        </DropdownField>
                    }
                </div>
                <div className="col-12 col-md-12">
                    <FormControl
                        label="Street Address*"
                        name="propertyDetails.streetAddress"
                        type="text"
                        disabled={disabled}
                        placeholder="Enter address"
                        validate={composeValidators(required)}
                    />
                </div>
                <div className="col-12 col-md-6">
                    <FormControl
                        label="Unit Number"
                        name="propertyDetails.unitNumber"
                        type="text"
                        disabled={disabled}
                        placeholder="Enter Unit Number"
                        validate={composeValidators(
                            required
                        )}
                    />
                </div>
                <div className="col-12 col-md-6">
                    {
                        disabled ? 
                            <FormControl
                                label="Directionality (Optional)"
                                name="propertyDetails.directionality"
                                type="text"
                                disabled={disabled}
                                placeholder="Enter directionality"
                            />
                        :
                        <DropdownField name="propertyDetails.directionality" label="Directionality (Optional)" defaultName="Select a directional" required={false}>
                            {/* <MyDropdownItem newValue="" >Select a region if applicable.</MyDropdownItem> */}
                            {(
                                quadrants
                                
                            ).map((menu:any) => (
                                <MyDropdownItem newValue={menu._id} onChange={handleSubmit}>{menu.name}</MyDropdownItem>

                            ))}
                        </DropdownField>
                    }
                </div>
                <div className="col-12 col-md-6">
                    <FormControl
                        label="City*"
                        name="propertyDetails.city"
                        type="text"
                        disabled={disabled}
                        placeholder="Enter City Name"
                        validate={composeValidators(
                            required,
                            maxlength(VALIDATIONS.MAX_NAME)
                        )}
                    />
                </div>
                <div className="col-12 col-md-6">
                    <FormControl
                        label="Zipcode*"
                        name="propertyDetails.postalCode"
                        type="mobile"
                        maxlength={6}
                        disabled={disabled}
                        placeholder="Enter Zipcode"
                        validate={composeValidators(required)}
                    />
                </div>
                
                <div className="col-12 col-md-12">
                    {/* {
                        disabled ? 
                            <FormControl
                                label="State Code*"
                                name="propertyDetails.state"
                                type="text"
                                disabled={disabled}
                                placeholder="Enter state code"
                            />
                        :
                        <DropdownField name="propertyDetails.state" label="State Code" defaultName="Select State" required={true}>
                            <MyDropdownItem newValue="" onChange={handleSubmit}>Select State</MyDropdownItem>
                            <MyDropdownItem newValue="District of Columbia" onChange={handleSubmit}>District of Columbia</MyDropdownItem>
                            <MyDropdownItem newValue="Virginia" onChange={handleSubmit}>Virginia</MyDropdownItem>
                            <MyDropdownItem newValue="Maryland" onChange={handleSubmit}>Maryland</MyDropdownItem>
                        </DropdownField>
                    } */}
                     {
                        stateCodeList && stateCodeList.length > 0  ? 
                            <SearchSelectWithForm
                                name="propertyDetails.state"
                                label="State Code*"
                                options={stateCodeList}
                                validate={composeValidators(requiredSelect)}
                                disabled={disabled}
                            />
                        :
                        null

                    }
                </div>
            </div>
        </>
    );
}

const MyDropdownItem: React.FC<MyDropdownItemProps> = ({ children, newValue, onChange = () => {} }) => (
    <Dropdown.Item onClick={() => onChange(newValue)}>{children}</Dropdown.Item>
);
