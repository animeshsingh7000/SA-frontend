import React, { useEffect, useState } from "react";
import { FormControl } from "../FormElements/FormControl";
import { SearchSelectWithForm } from "../SearchSelect/SearchSelect";
import { FIRE_PLACE_TYPE, SHARED_OUTSIDE, YES_NO } from "../../constants";


export default function PropertyInterior({
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
                <div className="col-12">
                    <FormControl
                        label="When was your furniture last replaced?"
                        name="propertyInterior.furnitureLastReplaced"
                        type="text"
                    />
                </div>
                <div className="col-12 col-md-6 custom-select-form">
                    <div className="text-start form-field">
                        <SearchSelectWithForm
                            name="propertyInterior.isPlanningToRefreshFurnishing"
                            label="Are you planning on refreshing your furnishings for the purpose of listing your property?"
                            options={YES_NO}
                            placeholder={YES_NO[0].label}
                        />
                    </div>
                </div>
                <div className="col-12 col-md-6 custom-select-form">
                    <div className="text-start form-field">
                        <SearchSelectWithForm
                            name="propertyInterior.isMasterBedroomEnSuiteBathroom"
                            label="Does the Master Bedroom have an en-suite bathroom?"
                            options={YES_NO}
                            placeholder={YES_NO[0].label}
                        />
                    </div>
                </div>
                <div className="col-12 custom-select-form">
                    <div className="text-start form-field">
                        <SearchSelectWithForm
                            name="propertyInterior.isMoreThanOneEnSuite"
                            label="Is there more than one en-suite at the property?"
                            options={YES_NO}
                            placeholder={YES_NO[0].label}
                        />
                    </div>
                </div>
                <div className="col-12">
                    <FormControl
                        label="Please describe the closets. (i.e walk in, built in, stand alone)"
                        name="propertyInterior.closetsDescription"
                        type="text"
                    />
                </div>
                <div className="col-12 custom-select-form">
                    <div className="text-start form-field">
                        <SearchSelectWithForm
                            name="propertyInterior.isDaybedPullOutBedOrSofaSpace"
                            label="Does the property have a daybed, pull-out bed, or sofa bed in addition to the sleeping space in the bedroom?"
                            options={YES_NO}
                            placeholder={YES_NO[0].label}
                        />
                    </div>
                </div>
                <div className="col-12 col-md-6 custom-select-form">
                    <div className="text-start form-field">
                        <SearchSelectWithForm
                            name="propertyInterior.isPropertyWithBlinds"
                            label="Does the property have blinds?"
                            options={YES_NO}
                            placeholder={YES_NO[0].label}
                        />
                    </div>
                </div>
                <div className="col-12 col-md-6 custom-select-form">
                    <div className="text-start form-field">
                        <SearchSelectWithForm
                            name="propertyInterior.isPropertyWithFireplace"
                            label="Does this property have a fireplace?"
                            options={YES_NO}
                            placeholder={YES_NO[0].label}
                        />
                    </div>
                </div>
                <div className="col-12 custom-select-form">
                    <div className="text-start form-field">
                        <SearchSelectWithForm
                            name="propertyInterior.fireplaceFuelType"
                            label="What type of fuel does it use?"
                            options={FIRE_PLACE_TYPE}
                            placeholder={FIRE_PLACE_TYPE[0].label}
                        />
                    </div>
                </div>
                <div className="col-12">
                    <FormControl
                        label="When was it last serviced?"
                        name="propertyInterior.fireplaceLastServiced"
                        type="text"
                    />
                </div>
                <div className="col-12 textareafield">
                    <FormControl
                        label="How is the fireplace currently maintained?"
                        name="propertyInterior.fireplaceCurrentlyMaintenanceNote"
                        type="textarea"
                    />
                </div>

            </div>
        </>
    );
}
