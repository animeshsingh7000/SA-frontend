import React, { useEffect, useState } from "react";
import { FormControl } from "../FormElements/FormControl";
import { SearchSelectWithForm } from "../SearchSelect/SearchSelect";
import { WASHER_DRYER_SHARED, YES_NO } from "../../constants";
import { composeValidators, required, requiredSelect } from "../../validations";


export default function UtilityInfo({
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
                        label="Please provide details of your Electricity provider. Account number, the name on the account, associated phone number."
                        name="utilityInfo.electricityProviderDesc"
                        type="textarea"
                    />
                </div>
                <div className="col-12 textareafield">
                    <FormControl
                        label="Please provide details of your Gas provider. Account number, the name on the account, associated phone number."
                        name="utilityInfo.gasProviderDesc"
                        type="textarea"
                    />
                </div>
                <div className="col-12 textareafield">
                    <FormControl
                        label="Please provide details of your Water provider. Account number, the name on the account, associated phone number."
                        name="utilityInfo.waterProviderDesc"
                        type="textarea"
                    />
                </div>
                <div className="col-12 textareafield">
                    <FormControl
                        label="Please provide details of your cable provider. Account number, the name on the account, associated phone number."
                        name="utilityInfo.cableProviderDesc"
                        type="textarea"
                    />
                </div>
                <div className="col-12">
                    <FormControl
                        label="Where is the router located? *"
                        name="utilityInfo.routerLocationDesc"
                        type="text"
                        validate={composeValidators(required)}
                    />
                </div>
                <div className="col-12 textareafield">
                    <FormControl
                        label="Please provide details of any other premium service you are offering as part of your listing. *"
                        name="utilityInfo.premiumServiceDesc"
                        type="textarea"
                        validate={composeValidators(required)}
                    />
                </div>
            </div>
        </>
    );
}
