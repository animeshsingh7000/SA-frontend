import React, { useEffect, useState } from "react";
import { FormControl } from "../FormElements/FormControl";
import { SearchSelectWithForm } from "../SearchSelect/SearchSelect";
import { FIRE_PLACE_TYPE, WASHER_DRYER_SHARED, YES_NO } from "../../constants";
import { composeValidators, requiredSelect } from "../../validations";


export default function AppliancesAndKitchen({
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
                <div className="col-12 textareafield">
                    <FormControl
                        label="Please detail the make and model of your dishwasher."
                        name="applianceInfo.dishwasherMakeAndModelDesc"
                        type="textarea"
                    />
                </div>
                <div className="col-12 textareafield">
                    <FormControl
                        label="Please provide details of the oven. Make/model, is it gas or electric?"
                        name="applianceInfo.ovenMakeModelDesc"
                        type="textarea"
                    />
                </div>
                <div className="col-12 textareafield">
                    <FormControl
                        label="Please provide details of the stove top. How many burners? Is it gas, convection, or electric?"
                        name="applianceInfo.stoveDesc"
                        type="textarea"
                    />
                </div>
                <div className="col-12 custom-select-form">
                    <div className="text-start form-field">
                        <SearchSelectWithForm
                            name="applianceInfo.washerAndDryerShared"
                            label="Do you have a Washer and Dryer in your unit/home for private use, or is it shared in a building for other residents? *"
                            options={WASHER_DRYER_SHARED}
                            placeholder={WASHER_DRYER_SHARED[0].label}
                            validate={composeValidators(requiredSelect)}
                        />
                    </div>
                </div>
                <div className="col-12">
                    <FormControl
                        label="Please provide details on Washer/Dryer access, where they are (basement, hallway on the same floor if in a condo). *"
                        name="applianceInfo.washerDryerAccessDesc"
                        type="text"
                    />
                </div>
                <div className="col-12 custom-select-form">
                    <div className="text-start form-field">
                        <SearchSelectWithForm
                            name="applianceInfo.isPropertyWithHDTVs"
                            label="Does your property have HDTVs?"
                            options={YES_NO}
                            placeholder={YES_NO[0].label}
                        />
                    </div>
                </div>
                <div className="col-12 textareafield">
                    <FormControl
                        label="Please provide details of each television including size, brand, model, position in property, and age."
                        name="applianceInfo.eachTelevisionDesc"
                        type="textarea"
                    />
                </div>
                <div className="col-12">
                    <FormControl
                        label="Please detail the material or type of each mattress (if known)."
                        name="applianceInfo.specialtyAppliancesDesc"
                        type="text"
                    />
                </div>
            </div>
        </>
    );
}
