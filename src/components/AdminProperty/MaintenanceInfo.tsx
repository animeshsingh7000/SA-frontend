import React, { useEffect, useState } from "react";
import { FormControl } from "../FormElements/FormControl";
import { SearchSelectWithForm } from "../SearchSelect/SearchSelect";
import { FIRE_PLACE_TYPE, WASHER_DRYER_SHARED, YES_NO } from "../../constants";
import { composeValidators, requiredSelect } from "../../validations";


export default function MaintenanceInfo({
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
                        label="Please provide details of your AC system - include make, model, year, last service if known, including if it is controlled by the building."
                        name="maintenanceInfo.acSystemDesc"
                        type="textarea"
                    />
                </div>
                <div className="col-12 textareafield">
                    <FormControl
                        label="Please provide details of your heating system - include make, model, year, last service if known, including if it is controlled by the building."
                        name="maintenanceInfo.heatingSystemDesc"
                        type="textarea"
                    />
                </div>
                <div className="col-12 ">
                    <FormControl
                        label="Where is the thermostat located? Are there clear instructions for use?"
                        name="maintenanceInfo.thermostatLocation"
                        type="text"
                    />
                </div>
                <div className="col-12 textareafield">
                    <FormControl
                        label="Please provide details of the trash. Location, Pick-up days for regular trash, pick-up days for recycling and green waste if different."
                        name="maintenanceInfo.trashLocation"
                        type="textarea"
                    />
                </div>
                <div className="col-12 custom-select-form">
                    <div className="text-start form-field">
                        <SearchSelectWithForm
                            name="maintenanceInfo.isKeyRequiredToAccessTrash"
                            label="Is a key required to access the trash?"
                            options={YES_NO}
                            placeholder={YES_NO[0].label}
                            validate={composeValidators(requiredSelect)}
                        />
                    </div>
                </div>
                <div className="col-12">
                    <FormControl
                        label="Where is the breaker (fuse) box located?"
                        name="maintenanceInfo.breakerFuseLocation"
                        type="text"
                    />
                </div>
                <div className="col-12">
                    <FormControl
                        label="Where is the water shut-off valve located? For the apartment, for the building?"
                        name="maintenanceInfo.waterShutOffValveLocation"
                        type="text"
                    />
                </div>
                <div className="col-12 textareafield">
                    <FormControl
                        label="Please provide details of the hot water service. Where is it located, what is the make, model, when was it last serviced?"
                        name="maintenanceInfo.hotWaterServiceDesc"
                        type="textarea"
                    />
                </div>
                <div className="col-12 textareafield">
                    <FormControl
                        label=" Please provide details of where important mail should be sent."
                        name="maintenanceInfo.importantMailSentDesc"
                        type="textarea"
                    />
                </div>
                <div className="col-12 textareafield">
                    <FormControl
                        label="Please detail any special property access or building information."
                        name="maintenanceInfo.buildingOrPropertyAccessInfoDesc"
                        type="textarea"
                    />
                </div>
                <div className="col-12">
                    <FormControl
                        label="When was the property last painted? (Interior / exterior)"
                        name="maintenanceInfo.propertyLastPainted"
                        type="text"
                    />
                </div>
                <div className="col-12">
                    <FormControl
                        label="Who is the HVAC service provider for this listing?"
                        name="maintenanceInfo.hvacServiceProvider"
                        type="text"
                    />
                </div>
                <div className="col-12 custom-select-form">
                    <div className="text-start form-field">
                        <SearchSelectWithForm
                            name="maintenanceInfo.isContractorInspected"
                            label="Are you getting the contractor inspection from Attache to ensure your property is ready for listing?"
                            options={YES_NO}
                            placeholder={YES_NO[0].label}
                        />
                    </div>
                </div>
                <div className="col-12">
                    <FormControl
                        label="The management contract authorizes us to spend $300 per 30 days on your property to take care of any required repairs. If you are not allowing this, please indicate below."
                        name="maintenanceInfo.repairsNotAllowedDesc"
                        type="text"
                    />
                </div>
                <div className="col-12">
                    <FormControl
                        label="Are there any repair items that need attention to your knowledge?"
                        name="maintenanceInfo.repairItemsDesc"
                        type="text"
                    />
                </div>
            </div>
        </>
    );
}
