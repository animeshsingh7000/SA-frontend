import React, { useEffect, useState } from "react";
import { FormControl } from "../FormElements/FormControl";
import { SearchSelectWithForm } from "../SearchSelect/SearchSelect";
import { WASHER_DRYER_SHARED, YES_NO } from "../../constants";
import { composeValidators, required, requiredSelect } from "../../validations";


export default function KeysInfo({
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
                        label="Please provide details of the keys you will provide. Fobs, pass cards, garage access, parking passes etc *"
                        name="keysInfo.keyDetail"
                        type="textarea"
                        validate={composeValidators(required)}
                    />
                </div>
                <div className="col-12">
                    <FormControl
                        label="How many sets of keys will you provide? *"
                        name="keysInfo.setOfKeys"
                        type="text"
                        validate={composeValidators(required)}
                    />
                </div>
                <div className="col-12 custom-select-form">
                    <div className="text-start form-field">
                        <SearchSelectWithForm
                            name="keysInfo.isKeyRequiredToAccessBuilding"
                            label="Will a key be required to access the building? Please detail the code if there is an electronic lock. *"
                            options={YES_NO}
                            placeholder={YES_NO[0].label}
                            validate={composeValidators(requiredSelect)}
                        />
                    </div>
                </div>
                <div className="col-12 col-md-6 custom-select-form">
                    <div className="text-start form-field">
                        <SearchSelectWithForm
                            name="keysInfo.isGarageDoorOpener"
                            label="Will you be providing a garage door opener? *"
                            options={YES_NO}
                            placeholder={YES_NO[0].label}
                            validate={composeValidators(requiredSelect)}
                        />
                    </div>
                </div>
                <div className="col-12 col-md-6 custom-select-form">
                    <div className="text-start form-field">
                        <SearchSelectWithForm
                            name="keysInfo.isKeyRequiredToAccessMailBox"
                            label="Is a key required to access the mail? *"
                            options={YES_NO}
                            placeholder={YES_NO[0].label}
                            validate={composeValidators(requiredSelect)}
                        />
                    </div>
                </div>
                
            </div>
        </>
    );
}
