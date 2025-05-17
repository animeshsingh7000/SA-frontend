import { Field, useField } from "react-final-form";
import { Dropdown } from "react-bootstrap";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import proInfo from "../../assets/images/Info.svg";
import { composeValidators, required, requiredNotZero, requiredSelect } from "../../validations";
import { Editor } from 'primereact/editor';
import { DatePickerControl } from "../FormElements/DatePicker";
import { CheckboxControlGlobal } from "../FormElements/CheckboxControl";
import { FormControl } from "../FormElements/FormControl";
import plusGreen from "../../assets/images/plus-green.svg";
import percentIcon from "../../assets/images/percent-Icon.svg";
import dollarIcon from "../../assets/images/dollar.svg";
import { SearchSelectWithForm } from "../SearchSelect/SearchSelect";
import { ASSET_TIER, MANAGED_STATUS_TYPE } from "../../constants";
import AttacheUserListDropDown from "../SearchSelect/AttacheUserListDropDown";
import OwnerUserListDropDown from "../SearchSelect/OwnerUserListDropDown";
import OwnerForm from "../../pages/Admin/PropertyManager/Property/OnwerForm";
import GetUserListDropDown from "../SearchSelect/GetUserListDropDown";


export default function PropertyStatus({
    handleSubmit,
    note,
    multipleOwnersId,
    editable = false,
    disabled = false,
    onChange,
    initialValues
}: {
    handleSubmit: (note: any, ownerIds: any[]) => void;
    note?: any;
    multipleOwnersId?: any;
    editable?: boolean;
    disabled?: boolean;
    onChange?: (values: any) => void;
    initialValues?: any;  // New prop to accept values from the parent
}) {

    const [about, setAbout] = useState(note ? note : null);
    const { pathname } = useLocation();
    const [initialOwners, setinitialOwners] = useState<any[]>(multipleOwnersId ? multipleOwnersId : []);


    const handleChange = (e: any) => {
        const newValue = e.htmlValue;
        setAbout(newValue); // Update local state
        handleSubmit(newValue, initialOwners); // Send the updated value to the parent immediately
    };

    const handleAddOwner = (newOwner: { label: string; value: string }) => {
        setinitialOwners([...initialOwners, newOwner]);
        handleSubmit(about, [...initialOwners, newOwner]);
    };

    const handleEditOwner = (index: number, updatedOwner: { label: string; value: string}) => {
        const updatedOwners = [...initialOwners];
        updatedOwners[index] = updatedOwner; // Update the specific phone entry
        setinitialOwners(updatedOwners);
        handleSubmit(about, updatedOwners);

    };

    const handleRemoveOwner = (index: number) => {
        
        const updatedOwners = initialOwners.filter((_, i) => i !== index);
        setinitialOwners(updatedOwners); // Remove email at the specified index
        handleSubmit(about, updatedOwners);
    };

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
                <div className="col-12 col-md-6 custom-select-form">
                    <div className="text-start form-field">
                        <OwnerUserListDropDown
                            label="Owner*"
                            name="propertyStatus.ownerId"
                            isSearchable
                            validate={composeValidators(requiredSelect)}
                            onChange={(e:any) =>handleFormChange(e, 'propertyStatus.ownerId', initialValues)}
                        />
                    </div>
                </div>
                <div className="col-12 col-md-6 custom-select-form">
                    <div className="text-start form-field">
                        <GetUserListDropDown
                            label="Leasing Manager"
                            name="propertyStatus.leasingManagerId"
                            isSearchable
                            type={'4'}
                            onChange={(e:any) =>handleFormChange(e, 'propertyStatus.leasingManagerId', initialValues)}

                        />
                    </div>
                </div>

                <div className="col-12 _add-contact-data">
                    <OwnerForm
                        initialOwners={initialOwners}
                        onAddOwner={handleAddOwner}
                        onEditOwner={handleEditOwner} // Pass remove handler
                        onRemoveOwner={handleRemoveOwner}
                    />
                </div>
                <div className="col-12 custom-select-form">
                    <div className="text-start form-field">
                        <SearchSelectWithForm
                            name="propertyStatus.managedStatus"
                            label="Managed Status"
                            options={MANAGED_STATUS_TYPE}
                            onChange={(e:any) =>handleFormChange(e, 'propertyStatus.managedStatus', initialValues)}
                        />
                    </div>
                </div>
                <div className="col-12 editor-common">
                    <label className="form-label">Managed Note</label>
                    <Editor value={about} onTextChange={(e) => handleChange(e)} style={{ height: '320px' }} />
                </div>
                {
                    editable && (
                        <div className="col-12">
                            <FormControl
                                label="Booking Window Gap"
                                name="propertyStatus.bookingWindowGap"
                                type="text"
                            />
                        </div>
                    )
                }
                <div className="col-12 textareafield">
                    <FormControl
                        label="Leasing Note"
                        name="propertyStatus.leasingNote"
                        type="textarea"
                    />
                </div>
                <div className="col-12 textareafield">
                    <FormControl
                        label="Welcome Letter"
                        name="propertyStatus.welcomeLetter"
                        type="textarea"
                    />
                </div>
                <div className="col-12 _mob-padding">
                    <div className="termstext">
                        <CheckboxControlGlobal
                            name="propertyStatus.unfurnished"
                            label="Unfurnished"
                        />

                    </div>
                </div>
                <div className={`col-12 ${editable ? 'col-md-6' : ''} _dollar`}>
                    <FormControl
                        label="Daily Rate*"
                        name="propertyStatus.dailyRate"
                        type="input-decimal"
                        validate={composeValidators(requiredNotZero)}
                    />
                    <div className="dollarIcon">
                        <img src={dollarIcon} alt="Dollar" />
                    </div>
                </div>
                {
                    editable && (
                        <div className="col-12 col-md-6 custom-select-form">
                            <div className="text-start form-field">
                                <SearchSelectWithForm
                                    name="propertyStatus.assetTier"
                                    label="Asset Tier"
                                    options={ASSET_TIER}
                                    isSearchable
                                />
                            </div>
                        </div>
                    )
                }
                <div className="col-12 _dollar">
                    <FormControl
                        label="Annual Daily Rate*"
                        name="propertyStatus.annualDailyRate"
                        type="input-decimal"
                        validate={composeValidators(requiredNotZero)}
                    />
                    <div className="dollarIcon">
                        <img src={dollarIcon} alt="Dollar" />
                    </div>
                </div>
                <div className="col-12 col-md-6 _mob-padding">
                    <div className="termstext">
                        <CheckboxControlGlobal
                            name="propertyStatus.isOverrideDailyRateAllowed"
                            label="Override Tier Daily Rate"
                        />

                    </div>
                </div>
                <div className="col-12 col-md-6 _mob-padding">
                    <div className="termstext">
                        <CheckboxControlGlobal
                            name="propertyStatus.isDynamicPricingAllowed"
                            label="Allow Dynamic Pricing"
                        />

                    </div>
                </div>
                <div className="col-12 col-md-6 _dollar">
                    <FormControl
                        label="Floor Rate"
                        name="propertyStatus.floorRate"
                        type="input-decimal"
                        placeholder="0.00"
                    />
                    <div className="dollarIcon">
                        <img src={dollarIcon} alt="Dollar" />
                    </div>
                </div>
                <div className="col-12 col-md-6 _dollar">
                    <FormControl
                        label="Monthly Rate"
                        name="propertyStatus.monthlyRate"
                        type="input-decimal"
                        placeholder="0.00"
                    />
                    <div className="dollarIcon">
                        <img src={dollarIcon} alt="Dollar" />
                    </div>
                </div>
                <div className="col-12 col-md-6 _dollar">
                    <FormControl
                        label="Management Fee"
                        name="propertyStatus.managementFees"
                        type="input-decimal"
                    />
                    <div className="dollarIcon">
                        <img src={percentIcon} alt="percent" />
                    </div>
                </div>
                <div className="col-12 col-md-6 _mob-padding">
                    <div className="termstext">
                        <CheckboxControlGlobal
                            name="propertyStatus.isPropertyAvailableOnDiscount"
                            label="Is this property on discount"
                        />

                    </div>
                </div>
                <div className="col-12 col-md-6 _datepickerform">
                    <DatePickerControl
                        label="Birthday"
                        name="propertyStatus.birthday"
                        type={'dateTime'}
                        placeholder="MM-DD-YY"
                    />
                    <div className="info-input">
                        <p>Date when the property became available to rent.</p>
                    </div>
                </div>
                
                {
                    editable && (
                        <>
                            <div className="col-12 col-md-6 _datepickerform">
                                <DatePickerControl
                                    label="Last Cleaning"
                                    name="propertyStatus.lastCleaning"
                                    type={'dateTime'}
                                    placeholder="MM-DD-YY"
                                />
                        
                            </div>
                            <div className="col-12 col-md-6 _datepickerform">
                                <DatePickerControl
                                    label="Last QC"
                                    name="propertyStatus.lastQC"
                                    type={'dateTime'}
                                    placeholder="MM-DD-YY"
                                />
                            </div>
                            <div className="col-12 col-md-6 custom-select-form">
                                <div className="text-start form-field">
                                    <AttacheUserListDropDown
                                        label="Last QC By"
                                        name="propertyStatus.lastQCBy"
                                        isSearchable
                                    />
                                </div>
                            </div>
                            <div className="col-12 col-md-6 _dollar">
                                <FormControl
                                    label="Orbirental Property ID"
                                    name="propertyStatus.orbirentalPropertyId"
                                    type="text"
                                    disabled={true}
                                />
                            </div>
                        </>
                    )
                }
                <div className="col-12 col-md-6 _mob-padding">
                    <div className="termstext">
                        <CheckboxControlGlobal
                            name="propertyStatus.approvalForZillow"
                            label="Send property to zillow"
                        />
                    </div>
                </div>
            </div>
        </>
    );
}


