import React, { useEffect, useState } from "react";
import { YES_NO } from "../../constants";
import { FormControl } from "../FormElements/FormControl";
import { SearchSelectWithForm } from "../SearchSelect/SearchSelect";


export default function OwnerGoals({
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
                        label="Annual Revenue Goal"
                        name="ownerGoalsInfo.expectedAnnualRentalIncome"
                        type="text"
                    />
                </div>
                <div className="col-12 textareafield">
                    <FormControl
                        label="What is your flexibility in terms of returning to your property?"
                        name="ownerGoalsInfo.flexibilityInTermsOfReturningProp"
                        type="textarea"
                    />
                </div>
                <div className="col-12">
                    <FormControl
                        label="What is your expected use of this property per year (in days), give an indication of time of year you like to return."
                        name="ownerGoalsInfo.propertyUsageOrSchedule"
                        type="text"
                    />
                </div>
                <div className="col-12">
                    <FormControl
                        label="What is the lead time required/requested from finalizing this questionnaire to us listing your property for rental?"
                        name="ownerGoalsInfo.leadTimeRequireToListProperty"
                        type="text"
                        placeholder="Max 10 days"
                    />
                </div>
                <div className="col-12 textareafield">
                    <FormControl
                        label="What is happening with the property between now and the available date?"
                        name="ownerGoalsInfo.propertyBtwNowAndAvailabilityDate"
                        type="textarea"
                    />
                </div>
                
                <div className="col-12">
                    <FormControl
                        label="Do you have restrictions on the length of time you will list with us. i.e. a date of sale, a time-frame to move-back , or is this to be a year or longer listing?"
                        name="ownerGoalsInfo.restrictionsOnLengthOfListing"
                        type="text"
                    />
                </div>            
                <div className="col-12 custom-select-form">
                    <div className="text-start form-field">
                        <SearchSelectWithForm
                            name="ownerGoalsInfo.lockedClosetPropertyBelongings"
                            label="Do you plan to have a locked closet at the property for personal belongings?"
                            options={YES_NO}
                            placeholder={YES_NO[0].label}
                        />
                    </div>
                </div>
                            
            </div>
        </>
    );
}
