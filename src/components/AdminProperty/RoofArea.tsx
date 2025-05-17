import React, { useEffect, useState } from "react";
import { FormControl } from "../FormElements/FormControl";
import { SearchSelectWithForm } from "../SearchSelect/SearchSelect";
import { SHARED_OUTSIDE, YES_NO } from "../../constants";


export default function RoofArea({
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
                            name="roofAreaInfo.isRoofManaged"
                            label="Is the roof managed? (leaves in gutters etc) *"
                            options={YES_NO}
                            placeholder={YES_NO[0].label}
                        />
                    </div>
                </div>
                
                <div className="col-12 col-md-6 custom-select-form">
                    <div className="text-start form-field">
                        <SearchSelectWithForm
                            name="roofAreaInfo.isGreenSpaceAreaAvailable"
                            label="Is there an entertaining area or green space?"
                            options={YES_NO}
                            placeholder={YES_NO[0].label}
                        />
                    </div>
                </div>
                <div className="col-12 col-md-6 custom-select-form">
                    <div className="text-start form-field">
                        <SearchSelectWithForm
                            name="roofAreaInfo.isRoofShared"
                            label="Is the roof area a shared space?"
                            options={YES_NO}
                            placeholder={YES_NO[0].label}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}
