import React, { useEffect, useRef, useState } from "react";
import proInfo from "../../assets/images/Info.svg";
import { composeValidators, required, requiredSelect, validLatitude, validLongitude } from "../../validations";
import { FormControl } from "../FormElements/FormControl";
import { SearchSelectWithForm } from "../SearchSelect/SearchSelect";
import {COUNTRIES, REGIONS } from "../../constants";
import NeighbourhoodListDropDown from "../SearchSelect/NeighbourhoodList";
import QuadrantsListDropDown from "../SearchSelect/QuadrantsListDropdown";
import BuildingListDropDown from "../SearchSelect/BuildingListDropDown";
import { configuration } from "../../api";


export default function PropertyAddress({
    handleSubmit,
    disabled = false,
    onChange,
    initialValues
}: {
    handleSubmit?: (data:any) => void;
    disabled?: boolean;
    onChange?: (values: any) => void;
    initialValues?: any;
}) {
    const [stateCodeList, setStateCodeList] = useState<any>([]);
    const effectRan = useRef(false);

    useEffect(() => {
        if (!effectRan.current) {
            configuration.getStateCodes().then((res: any) => {
                let data = res.data.map((item: any) => ({ 
                    label: item.name,
                    value: item.code
                  }));
                data = [{label: 'Select', value: ''}].concat(data)
                setStateCodeList(data);
            });
        }
        return () => {
            effectRan.current = true;
        };
    }, []);

    function updateFilterCategoryId(value:any, name:any, values:any) {
        if(handleSubmit) {
            handleSubmit({ requiresExtraPaperwork: value.requiresExtraPaperwork });
        }
        handleFormChange({label: value.label, value: value.value}, name, values);
    }

    const handleFormChange = (selectedValue: any, name: string, values: any) => {
        const { label, value } = selectedValue;
    
        // Check if label and value are available
        if (label && value) {
            // Split the name into parts (e.g., ['propertyStatus', 'ownerId'])
            const nameParts = name.split('.');
    
            // Update the form field's name with the selected value
            const updatedValue = { label, value };
    
            // Update the parent form with the new value
            if (onChange) {
                // Using the nameParts to set the nested field
                let updatedData: any = { ...values };
                let currentLevel = updatedData;
    
                // Traverse the nameParts to update the nested field
                nameParts.forEach((part, index) => {
                    if (index === nameParts.length - 1) {
                        // Update the final field with the new value
                        currentLevel[part] = value;
                    } else {
                        // Create the nested object if it doesn't exist
                        if (!currentLevel[part]) {
                            currentLevel[part] = {};
                        }
                        currentLevel = currentLevel[part];
                    }
                });
    
                onChange(updatedData); // Pass the updated form data
            }
        }
    };
      

    return (
        <>
            <div className="row">
                <div className="col-12 custom-select-form">
                    <div className="text-start form-field">
                        <SearchSelectWithForm
                            name="propertyAddress.region"
                            label="Region*"
                            options={REGIONS}
                            validate={composeValidators(requiredSelect)}
                            onChange={(e:any) =>handleFormChange(e, 'propertyAddress.region', initialValues)}
                        />
                    </div>
                </div>
                <div className="col-12 custom-select-form">
                    <div className="text-start form-field">
                        <NeighbourhoodListDropDown
                            name="propertyAddress.neighborhoodId"
                            label="Neighborhood*"
                            isSearchable
                            validate={composeValidators(requiredSelect)}
                            onChange={(e:any) =>handleFormChange(e, 'propertyAddress.neighborhoodId', initialValues)}
                        />
                    </div>
                </div>
                <div className="col-12 custom-select-form">
                    <div className="text-start form-field">
                        <BuildingListDropDown
                            name="propertyAddress.buildingId"
                            label="Building"
                            isSearchable
                            updateFilterCategoryId={(e) => updateFilterCategoryId(e, 'propertyAddress.buildingId', initialValues)}
                        />
                    </div>
                </div>
                <div className="col-12 col-md-4">
                    <FormControl
                        label="Unit Number"
                        name="propertyAddress.unitNumber"
                        type="text"
                    />
                </div>
                <div className="col-12 col-md-8">
                    <FormControl
                        label="Street Address*"
                        name="propertyAddress.streetAddress"
                        type="text"
                        validate={composeValidators(required)}
                    />
                </div>
                <div className="col-12 custom-select-form">
                    <div className="text-start form-field">
                        <QuadrantsListDropDown
                            label="Directionality (Optional)"
                            name="propertyAddress.directionality"
                            isSearchable
                            onChange={(e:any) =>handleFormChange(e, 'propertyAddress.directionality', initialValues)}
                        />
                    </div>
                    <div className="info-input">
                        <img src={proInfo} alt="Info" />
                        <p>See http://pe.usps.gov/text/pub28/28c2_014.htm for USPS rules. (Bigfoot not fully compliant compliant yet.)</p>
                    </div>
                </div>
                <div className="col-12 col-md-6 custom-select-form">
                    <div className="text-start form-field">
                    <FormControl
                        label="City*"
                        name="propertyAddress.city"
                        type="text"
                        validate={composeValidators(required)}
                    />  
                    </div>
                </div>
                <div className="col-12 col-md-3">
                    {
                        stateCodeList && stateCodeList.length > 0  ? 
                            <SearchSelectWithForm
                                name="propertyAddress.stateCode"
                                label="State Code*"
                                options={stateCodeList}
                                validate={composeValidators(requiredSelect)}
                                onChange={(e:any) =>handleFormChange(e, 'propertyAddress.stateCode', initialValues)}
                            />
                        :
                        null

                    }
                    
                </div>
                <div className="col-12 col-md-3">
                    <FormControl
                        label="Zipcode*"
                        name="propertyAddress.zipCode"
                        type="text"
                        validate={composeValidators(required)}
                    />
                </div>

                <div className="col-12 col-md-6">
                    <FormControl
                        label="County"
                        name="propertyAddress.county"
                        type="text"
                    />
                </div>
                <div className="col-12 col-md-6 custom-select-form">
                    <div className="text-start form-field">
                        <SearchSelectWithForm
                            name="propertyAddress.country"
                            label="Country*"
                            options={COUNTRIES}
                            placeholder="Select multiple"
                            validate={composeValidators(requiredSelect)}
                            onChange={(e:any) =>handleFormChange(e, 'propertyAddress.country', initialValues)}
                        />
                    </div>
                </div>
                <div className="col-12 textareafield">
                    <FormControl
                        label="Directions"
                        name="propertyAddress.directions"
                        type="textarea"
                    />
                </div>
                <div className="col-12 col-md-6">
                    <FormControl
                        label="Longitude"
                        name="propertyAddress.longitude"
                        type="text"
                        validate={composeValidators(
                            validLongitude
                        )}
                    />
                </div>
                <div className="col-12 col-md-6">
                    <FormControl
                        label="Latitude"
                        name="propertyAddress.latitude"
                        type="text"
                        validate={composeValidators(
                            validLatitude
                        )}
                    />
                </div>
                <div className="col-12">
                    <FormControl
                        label="Elevation"
                        name="propertyAddress.elevation"
                        type="text"
                    />
                </div>
            </div>
        </>
    );
}
