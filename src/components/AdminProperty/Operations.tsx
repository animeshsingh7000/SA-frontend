import React from "react";
import proInfo from "../../assets/images/Info.svg";
import { FormControl } from "../FormElements/FormControl";
import AttacheUserListDropDown from "../SearchSelect/AttacheUserListDropDown";
import { CheckboxControlGlobal } from "../FormElements/CheckboxControl";
import { composeValidators, validPhoneNumber } from "../../validations";
import GetUserListDropDown from "../SearchSelect/GetUserListDropDown";

export default function Opeartions({
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
    initialValues?:any;
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
            <div className="row">
                <div className="col-12 custom-select-form">
                    <div className="text-start form-field">
                        <AttacheUserListDropDown
                            label="Guest Services"
                            name="operations.guestServicesId"
                            isSearchable
                            onChange={(e:any) => handleFormChange(e, 'operations.guestServicesId', initialValues)}
                        />
                    </div>
                </div>
                <div className="col-12 custom-select-form">
                    <div className="text-start form-field">
                        <GetUserListDropDown
                            label="Operations Manager"
                            name="operations.opsManagerId"
                            isSearchable
                            type={'5'}
                            onChange={(e:any) => handleFormChange(e, 'operations.opsManagerId', initialValues)}
                        />
                    </div>
                </div>
                {
                    !editable && (
                        <>
                            <div className="col-12 _mob-padding">
                                <div className="termstext">
                                    <CheckboxControlGlobal
                                        name="operations.isOwnerContractor"
                                        label="Owner Contractor"
                                    />
                                </div>
                            </div>
                            <div className="col-12 textareafield">
                                <FormControl
                                    label="Owner Contractor Details"
                                    name="operations.ownerContractorDetails"
                                    type="textarea"
                                />
                            </div>
                            {/* <div className="col-12 _mob-padding">
                                <div className="termstext">
                                    <CheckboxControlGlobal
                                        name="operations.birdwatch"
                                        label="Birdwatch"
                                    />
                                </div>
                            </div> */}
                        </>
                    )
                }

                <div className="col-12">
                    <FormControl
                        label="Hostfully URL"
                        name="operations.hostfullyUrl"
                        type="text"
                    />
                </div>
                <div className="col-12 col-md-6">
                    <FormControl
                        label="Property Phone"
                        name="operations.propertyPhone"
                        type="mobile"
                        minlength={10}
                        maxlength={20}
                        validate={composeValidators(validPhoneNumber)}
                    />
                </div>
                <div className="col-12 col-md-6">
                    <FormControl
                        label="LB Code"
                        name="operations.lbCode"
                        type="text"
                    />
                </div>
                <div className="col-12 textareafield">
                    <FormControl
                        label="LB Info"
                        name="operations.lbInfo"
                        type="textarea"
                    />
                </div>

                <div className="col-12 col-md-6">
                    <FormControl
                        label="Network Name"
                        name="operations.networkName"
                        type="text"
                    />
                </div>
                <div className="col-12 col-md-6">
                    <FormControl
                        label="Network Pass"
                        name="operations.networkPass"
                        type="text"
                    />
                </div>
                <div className="col-12 textareafield">
                    <FormControl
                        label="Internet Account Info"
                        name="operations.internetAccountInfo"
                        type="textarea"
                    />
                </div>
                <div className="col-12 col-md-8">
                    <FormControl
                        label="IP Address"
                        name="operations.ipAddress"
                        type="text"

                    />
                </div>
                <div className="col-12 col-md-4 _mob-padding without-label">
                    <div className="termstext">
                        <CheckboxControlGlobal
                            name="operations.isAutomateInstructions"
                            label="Automate Instructions"
                        />
                    </div>
                </div>
                <div className="col-12">
                    <FormControl
                        label="Video URL"
                        name="operations.videoUrl"
                        type="text"
                    />
                </div>
                <div className="col-12 textareafield">
                    <FormControl
                        label="Arrival Info"
                        name="operations.arrivalInfo"
                        type="textarea"
                    />
                </div>
                <div className="col-12 textareafield">
                    <FormControl
                        label="Departure Info"
                        name="operations.departureInfo"
                        type="textarea"
                    />
                </div>
                <div className="col-12 textareafield">
                    <FormControl
                        label="HVAC Info"
                        name="operations.hvacInfo"
                        type="textarea"
                    />
                </div>
                <div className="col-12">
                    <FormControl
                        label="AC Filter Size"
                        name="operations.acFilterSize"
                        type="text"
                    />
                </div>
                <div className="col-12 col-md-4 _mob-padding">
                    <div className="termstext">
                        <CheckboxControlGlobal
                            name="operations.isSnowRemovalRequired"
                            label="Snow Removal Required"
                        />
                    </div>
                </div>
                <div className="col-12 col-md-6 _mob-padding">
                    <div className="termstext">
                        <CheckboxControlGlobal
                            name="operations.isLeafyDrain"
                            label="Leafy Drain"
                        />

                    </div>
                </div>
                <div className="col-12 col-md-4 _mob-padding">
                    <div className="termstext">
                        <CheckboxControlGlobal
                            name="operations.isBuildingControlsHvac"
                            label="Building Controls HVAC"
                        />
                    </div>
                </div>
                <div className="col-12 col-md-6 _mob-padding">
                    <div className="termstext">
                        <CheckboxControlGlobal
                            name="operations.isHvacMaintenanceProgram"
                            label="Pets Allowed"
                        />
                    </div>
                </div>
                <div className="col-12 textareafield">
                    <FormControl
                        label="HVAC Maintenance Program"
                        name="operations.buildingHvacNote"
                        type="textarea"
                    />
                </div>
                <div className="col-12 _mob-padding">
                    <div className="termstext">
                        <CheckboxControlGlobal
                            name="operations.isWindowAcUnitsAvailable"
                            label="Window AC Units"
                        />
                    </div>
                </div>
                <div className="col-12">
                    <FormControl
                        label="FOB Numbers"
                        name="operations.fobNumbers"
                        type="text"
                    />
                    <div className="info-input">
                        <img src={proInfo} alt="Info" />
                        <p>Comma separated list of fob numbers/identifiers.</p>
                    </div>
                </div>
                <div className="col-12 col-md-6">
                    <FormControl
                        label="Maintenance"
                        name="operations.maintenanceInfo"
                        type="text"
                    />
                </div>
                <div className="col-12 col-md-6">
                    <FormControl
                        label="Maintenance Phone"
                        name="operations.maintenancePhone"
                        type="mobile"
                        minlength={10}
                        maxlength={20}
                        validate={composeValidators(validPhoneNumber)}
                    />
                </div>
                <div className="col-12 textareafield">
                    <FormControl
                        label="Maintenance Note"
                        name="operations.maintenanceNote"
                        type="textarea"
                    />
                </div>
            </div>
        </>
    );
}
