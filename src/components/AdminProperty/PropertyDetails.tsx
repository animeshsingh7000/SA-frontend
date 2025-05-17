import React, { useEffect, useState } from "react";
import proInfo from "../../assets/images/Info.svg";
import { composeValidators, requiredSelect } from "../../validations";
import { CheckboxControlGlobal } from "../FormElements/CheckboxControl";
import { FormControl } from "../FormElements/FormControl";
import dollarIcon from "../../assets/images/dollar.svg";
import { SearchSelectWithForm } from "../SearchSelect/SearchSelect";
import { BATHROOM_OPTIONS, BEDROOM_OPTIONS, HALF_BATHROOM_OPTIONS, IDENTIFY_PROPERTY_TYPE, YES_NO } from "../../constants";


export default function PropertyDetails({
    handleSubmit,
    editable = false,
    disabled = false,
    onChange,
    initialValues
}: {
    handleSubmit?: () => void;
    editable?: boolean;
    disabled?: boolean;
    onChange?: (values: any) => void;
    initialValues?: any;
}) {

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
            <div className="row ">
                <div className="col-12 col-md-4 custom-select-form">
                    <div className="text-start form-field">
                        <SearchSelectWithForm
                            name="propertyDetails.fullBedrooms"
                            label="Bedrooms*"
                            options={BEDROOM_OPTIONS}
                            placeholder={BEDROOM_OPTIONS[0].label}
                            validate={composeValidators(requiredSelect)}
                            onChange={(e:any) =>handleFormChange(e, 'propertyDetails.fullBedrooms', initialValues)}
                        />
                    </div>
                </div>
                <div className="col-12 col-md-4 custom-select-form">
                    <div className="text-start form-field">
                        <SearchSelectWithForm
                            name="propertyDetails.fullBathrooms"
                            label="Full Baths*"
                            options={BATHROOM_OPTIONS}
                            placeholder={BATHROOM_OPTIONS[0].label}
                            validate={composeValidators(requiredSelect)}
                            onChange={(e:any) =>handleFormChange(e, 'propertyDetails.fullBathrooms', initialValues)}
                        />
                    </div>
                </div>
                <div className="col-12 col-md-4 custom-select-form">
                    <div className="text-start form-field">
                        <SearchSelectWithForm
                            name="propertyDetails.halfBathrooms"
                            label="Half Baths*"
                            options={HALF_BATHROOM_OPTIONS}
                            placeholder={HALF_BATHROOM_OPTIONS[0].label}
                            validate={composeValidators(requiredSelect)}
                            onChange={(e:any) =>handleFormChange(e, 'propertyDetails.halfBathrooms', initialValues)}
                        />
                    </div>
                </div>
                <div className="col-12 col-md-4 _mob-padding without-label">
                    <div className="termstext">
                        <CheckboxControlGlobal
                            name="propertyDetails.isPetsAllowed"
                            label="Pets Allowed"
                        />
                    </div>
                </div>
                <div className="col-12 col-md-8 _dollar">
                    <FormControl
                        label="Pet one time fee"
                        name="propertyDetails.oneTimePetFees"
                        type="input-decimal"
                    />
                    <div className="dollarIcon">
                        <img src={dollarIcon} alt="Dollar" />
                    </div>
                </div>

                <div className="col-12 col-md-12">
                    <FormControl
                        label="Pet Regulations"
                        name="propertyDetails.petRegulations"
                        type="text"
                    />
                    <div className="info-input">
                        <img src={proInfo} alt="Info" />
                        <p>Pet regulations appear on public site.</p>
                    </div>
                </div>
                <div className="col-12 col-md-4 _mob-padding">
                    <div className="termstext">
                        <CheckboxControlGlobal
                            name="propertyDetails.hasParking"
                            label="Has Parking"
                        />

                    </div>
                </div>
                <div className="col-12 col-md-6 _mob-padding">
                    <div className="termstext">
                        <CheckboxControlGlobal
                            name="propertyDetails.parkingIncludeInRent"
                            label="Rent Includes Parking"
                        />

                    </div>
                </div>
                <div className="col-12 col-md-4 _dollar">
                    <FormControl
                        label="Daily Parking Fee"
                        name="propertyDetails.dailyParkingFees"
                        type="input-decimal"
                    />
                    <div className="dollarIcon">
                        <img src={dollarIcon} alt="Dollar" />
                    </div>
                </div>
                <div className="col-12 col-md-8">
                    <FormControl
                        label="Parking Description"
                        name="propertyDetails.parkingDescription"
                        type="text"
                    />
                    <div className="info-input">
                        <img src={proInfo} alt="Info" />
                        <p>Parking description appears on public site.</p>
                    </div>
                </div>
                <div className="col-12 textareafield">
                    <FormControl
                        label="Internal Parking Description"
                        name="propertyDetails.internalParkingDescription"
                        type="textarea"
                    />
                </div>
                <div className="col-12 col-md-6">
                    <FormControl
                        label="Squat Footage"
                        name="propertyDetails.livingAreaSquareFoot"
                        type="input-number"
                    />
                </div>
                <div className="col-12 col-md-6">
                    <FormControl
                        label="Levels in Unit"
                        name="propertyDetails.levelsInUnit"
                        type="input-number"
                    />
                </div>
                {
                    editable && (
                        <>
                            <div className="col-12 col-md-6 custom-select-form">
                                <div className="text-start form-field">
                                    <SearchSelectWithForm
                                        name="propertyDetails.propertyType"
                                        label="Please identify your property type"
                                        options={IDENTIFY_PROPERTY_TYPE}
                                        placeholder={IDENTIFY_PROPERTY_TYPE[0].label}
                                    />
                                </div>
                            </div>
                            <div className="col-12 col-md-6">
                                <FormControl
                                    label="What year was the property built (approximately)?"
                                    name="propertyDetails.propertyBuiltYear"
                                    type="input-number"
                                />
                            </div>
                            <div className="col-12">
                                <FormControl
                                    label="When was the property last renovated? Please describe what was renovated."
                                    name="propertyDetails.propertyLastRenovated"
                                    type="text"
                                />
                            </div>
                            <div className="col-12 col-md-6 custom-select-form">
                                <div className="text-start form-field">
                                    <SearchSelectWithForm
                                        name="propertyDetails.isBedroomsWithoutBed"
                                        label="Do any of the bedrooms currently not have a bed? *"
                                        options={YES_NO}
                                        placeholder={YES_NO[0].label}
                                        validate={composeValidators(requiredSelect)}
                                    />
                                </div>
                            </div>
                            <div className="col-12 col-md-6 custom-select-form">
                                <div className="text-start form-field">
                                    <SearchSelectWithForm
                                        name="propertyDetails.isPropertyDenOrStudy"
                                        label="Does your property have a den or study? *"
                                        options={YES_NO}
                                        placeholder={YES_NO[0].label}
                                        validate={composeValidators(requiredSelect)}
                                    />
                                </div>
                            </div>
                            <div className="col-12 custom-select-form">
                                <div className="text-start form-field">
                                    <SearchSelectWithForm
                                        name="propertyDetails.isBathroomsHaveBathtub"
                                        label="Do one or more of your bathrooms have a bathtub ?"
                                        options={YES_NO}
                                        placeholder={YES_NO[0].label}
                                    />
                                </div>
                            </div>
                            <div className="col-12 textareafield">
                                <FormControl
                                    label="Please briefly describe the shower (walk-in, shower over bath)"
                                    name="propertyDetails.showerDescription"
                                    type="textarea"
                                />
                            </div>
                            <div className="col-12 textareafield">
                                <FormControl
                                    label="Please briefly describe your bathroom(s) (fittings, style, fixtures, counters etc)"
                                    name="propertyDetails.bathroomDescription"
                                    type="textarea"
                                />
                            </div>
                            <div className="col-12 custom-select-form">
                                <div className="text-start form-field">
                                    <SearchSelectWithForm
                                        name="propertyDetails.isStairCaseAvailable"
                                        label="If more than one story, is there a staircase?"
                                        options={YES_NO}
                                        placeholder={YES_NO[0].label}
                                    />
                                </div>
                            </div>
                            <div className="col-12 textareafield">
                                <FormControl
                                    label="If the property is more then one floor please identify which floor each bedroom and bathroom are located?"
                                    name="propertyDetails.propertyMoreThanOneFloorDescription"
                                    type="textarea"
                                />
                            </div>
                            <div className="col-12 col-md-6">
                                <FormControl
                                    label="How many floors in the building (if different to above)?"
                                    name="propertyDetails.buildingFloorsCount"
                                    type="input-number"
                                />
                            </div>
                            <div className="col-12 col-md-6">
                                <FormControl
                                    label="Which floor of the building is the property located?"
                                    name="propertyDetails.propertyFloorLocatedAt"
                                    type="input-number"
                                />
                            </div>
                            <div className="col-12 custom-select-form">
                                <div className="text-start form-field">
                                    <SearchSelectWithForm
                                        name="propertyDetails.petRestrictions"
                                        label=" Do you have restrictions on the type of pets guests can bring?*"
                                        options={YES_NO}
                                        placeholder={YES_NO[0].label}
                                        validate={composeValidators(requiredSelect)}
                                    />
                                </div>
                            </div>
                        </>
                    )
                }
            </div>
        </>
    );
}
