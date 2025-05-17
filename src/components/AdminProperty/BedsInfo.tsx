import React, { useEffect, useState } from "react";
import { FormControl } from "../FormElements/FormControl";
import { SearchSelectWithForm } from "../SearchSelect/SearchSelect";
import { FIRE_PLACE_TYPE, YES_NO } from "../../constants";


export default function BedsInfo({
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
                            name="bedsInfo.isBedFramesHeadboards"
                            label="Are there bed-frames/headboards?"
                            options={YES_NO}
                            placeholder={YES_NO[0].label}
                        />
                    </div>
                </div>
                <div className="col-12">
                    <FormControl
                        label="If more than one bed is present, please describe the configuration in the bedrooms."
                        name="bedsInfo.bedroomConfigurationDesc"
                        type="text"
                    />
                </div>
                <div className="col-12">
                    <FormControl
                        label="Please describe the size of each mattress."
                        name="bedsInfo.eachMattressSizeDesc"
                        type="text"
                    />
                </div>
                <div className="col-12">
                    <FormControl
                        label="Please describe the age of each mattress."
                        name="bedsInfo.eachMattressAgeDesc"
                        type="text"
                    />
                </div>
                <div className="col-12">
                    <FormControl
                        label="Please detail the material or type of each mattress (if known)."
                        name="bedsInfo.eachMattressMaterialDesc"
                        type="text"
                    />
                </div>
            </div>
        </>
    );
}
