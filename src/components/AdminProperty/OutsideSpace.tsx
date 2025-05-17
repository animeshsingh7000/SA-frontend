import React, { useEffect, useState } from "react";
import { FormControl } from "../FormElements/FormControl";
import { SearchSelectWithForm } from "../SearchSelect/SearchSelect";
import { SHARED_OUTSIDE, YES_NO } from "../../constants";


export default function OutsideSpace({
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
                            name="outsideInfo.isYardOrOutsideAreaAvailable"
                            label="Does your property have a yard or outside area?"
                            options={YES_NO}
                            placeholder={YES_NO[0].label}
                        />
                    </div>
                </div>
                <div className="col-12">
                    <FormControl
                        label="What is the approximate area of the outside of the property (in square feet) with this listing."
                        name="outsideInfo.outsideAreaSquareFeet"
                        type="text"
                    />
                </div>
                <div className="col-12 col-md-6 custom-select-form">
                    <div className="text-start form-field">
                        <SearchSelectWithForm
                            name="outsideInfo.isOutsideAreaMaintainedByGardener"
                            label="Is the outside area maintained by a gardener?"
                            options={YES_NO}
                            placeholder={YES_NO[0].label}
                        />
                    </div>
                </div>
                <div className="col-12 col-md-6 custom-select-form">
                    <div className="text-start form-field">
                        <SearchSelectWithForm
                            name="outsideInfo.isPropertyHavingBalcony"
                            label="Does your property have a balcony, porch, deck, or veranda?"
                            options={YES_NO}
                            placeholder={YES_NO[0].label}
                        />
                    </div>
                </div>
                <div className="col-12 col-md-6 custom-select-form">
                    <div className="text-start form-field">
                        <SearchSelectWithForm
                            name="outsideInfo.isPropertyHavingOutdoorFurniture"
                            label="Does this property have outdoor furniture?"
                            options={YES_NO}
                            placeholder={YES_NO[0].label}
                        />
                    </div>
                </div>
                <div className="col-12 col-md-6 custom-select-form">
                    <div className="text-start form-field">
                        <SearchSelectWithForm
                            name="outsideInfo.isOutdoorFurnitureWinterize"
                            label="Does the outdoor furniture need to be winterized?"
                            options={YES_NO}
                            placeholder={YES_NO[0].label}
                        />
                    </div>
                </div>
                <div className="col-12 custom-select-form">
                    <div className="text-start form-field">
                        <SearchSelectWithForm
                            name="outsideInfo.isOutdoorAreaShared"
                            label="Is the outdoor area shared or exclusive to the unit?"
                            options={SHARED_OUTSIDE}
                            placeholder={SHARED_OUTSIDE[0].label}
                        />
                    </div>
                </div>
                <div className="col-12 textareafield">
                    <FormControl
                        label="Please describe the perimeter. Is the property fully fenced? Is there a secure gate? What type of fence?"
                        name="outsideInfo.perimeterProperty"
                        type="textarea"
                    />
                </div>
                <div className="col-12 textareafield">
                    <FormControl
                        label="If there is a deck or sheltered area, please describe it."
                        name="outsideInfo.deckOrShelteredAreaDesc"
                        type="textarea"
                    />
                </div>            
                <div className="col-12 col-md-6 custom-select-form">
                    <div className="text-start form-field">
                        <SearchSelectWithForm
                            name="outsideInfo.isHomeNeededToWinterize"
                            label="Does the home need to be winterized (water faucets)?"
                            options={YES_NO}
                            placeholder={YES_NO[0].label}
                        />
                    </div>
                </div>
                <div className="col-12 col-md-6 custom-select-form">
                    <div className="text-start form-field">
                        <SearchSelectWithForm
                            name="outsideInfo.isLockedStorageOutsideUnit"
                            label="Is there locked storage outside the unit?"
                            options={YES_NO}
                            placeholder={YES_NO[0].label}
                        />
                    </div>
                </div>
                <div className="col-12 textareafield">
                    <FormControl
                        label="Please describe any other outside space associated with this listing."
                        name="outsideInfo.anyOtherOutsideSpaceDesc"
                        type="textarea"
                    />
                </div>    
            </div>
        </>
    );
}
