import React, { useEffect, useState } from "react";
import { FormControl } from "../FormElements/FormControl";
import { SearchSelectWithForm } from "../SearchSelect/SearchSelect";
import { FIRE_PLACE_TYPE, YES_NO } from "../../constants";


export default function InsuranceInfo({
    handleSubmit,
    editable = false,
    disabled = false
}: {
    handleSubmit?: () => void;
    editable?: boolean;
    disabled?: boolean
}) {

    return (
        <>
            <div className="row ">
                <div className="col-12 custom-select-form">
                    <div className="text-start form-field">
                        <SearchSelectWithForm
                            name="insuranceInfo.isHomeOrBuildingInsurance"
                            label="Do you have home/building insurance?"
                            options={YES_NO}
                            placeholder={YES_NO[0].label}
                        />
                    </div>
                </div>
                <div className="col-12">
                    <FormControl
                        label="Please detail which organization is providing building insurance."
                        name="insuranceInfo.buildingInsuranceProviderDetail"
                        type="text"
                    />
                </div>
                <div className="col-12 textareafield">
                    <FormControl
                        label="Please provide the policy number, limit, and expiration date."
                        name="insuranceInfo.buildingPolicyDetails"
                        type="textarea"
                    />
                </div>
                <div className="col-12 custom-select-form">
                    <div className="text-start form-field">
                        <SearchSelectWithForm
                            name="insuranceInfo.isContentInsuranceAvailable"
                            label="Do you have contents insurance?"
                            options={YES_NO}
                            placeholder={YES_NO[0].label}
                        />
                    </div>
                </div>
                <div className="col-12">
                    <FormControl
                        label="Please detail which organization is providing contents insurance."
                        name="insuranceInfo.contentInsuranceProviderDetail"
                        type="text"
                    />
                </div>
                <div className="col-12 textareafield">
                    <FormControl
                        label="Please provide the policy number, limit, and expiration date."
                        name="insuranceInfo.contentPolicyDetails"
                        type="textarea"
                    />
                </div>
                <div className="col-12 custom-select-form">
                    <div className="text-start form-field">
                        <SearchSelectWithForm
                            name="insuranceInfo.isInsuranceContentRequiredBeforeAnyRepair"
                            label="Does the insurance company require contact before any repairs may be assessed?"
                            options={YES_NO}
                            placeholder={YES_NO[0].label}
                        />
                    </div>
                </div>
                <div className="col-12 custom-select-form">
                    <div className="text-start form-field">
                        <SearchSelectWithForm
                            name="insuranceInfo.isContentRequireByAttachToInsurer"
                            label="Do you authorize Attache to contact your insurer in case of emergency?"
                            options={YES_NO}
                            placeholder={YES_NO[0].label}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}
