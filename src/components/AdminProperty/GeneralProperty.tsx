import { Field, useField } from "react-final-form";
import { Dropdown } from "react-bootstrap";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import proInfo from "../../assets/images/Info.svg";
import { composeValidators, required } from "../../validations";
import { Editor } from 'primereact/editor';
import { DatePickerControl } from "../FormElements/DatePicker";
import { CheckboxControlGlobal } from "../FormElements/CheckboxControl";
import { FormControl } from "../FormElements/FormControl";


export default function GeneralProperty({
    handleSubmit,
    description,
    editable = false,
    disabled = false,
    initialAvailableFrom, // Receive the initialAvailableFrom prop
}: {
    handleSubmit: (about: any) => void;
    description?: any;
    editable?: boolean;
    disabled?: boolean;
    initialAvailableFrom?: Date; // Optional prop
}) {
    const [about, setAbout] = useState(description ? description : null);
    const { pathname } = useLocation();
    const [availableFrom, setAvailableFrom] = useState<Date | undefined>(initialAvailableFrom ? initialAvailableFrom : undefined); // Change null to undefined
    const [availableUntil, setAvailableUntil] = useState<Date | undefined>(undefined);

    const handleChange = (e: any) => {
        const newValue = e.htmlValue;
        setAbout(newValue); // Update local state
        handleSubmit(newValue); // Send the updated value to the parent immediately
    };

    const handleAvailableFromChange = (date: any) => {
        setAvailableFrom(date); // Update availableFrom date
    };
    const handleAvailableUntilChange = (date: Date | undefined) => {
        setAvailableUntil(date); // Update availableUntil date
    };


    return (
        <>
            <div className="row">
                {
                    editable && (
                        <>
                            <div className="col-12 _mob-padding">
                                <div className="termstext">
                                    <CheckboxControlGlobal
                                        name="generalInfo.isOwnerContractor"
                                        label="Owner Contractor"
                                    />
                                </div>
                            </div>
                            <div className="col-12 textareafield">
                                <FormControl
                                    label="Owner Contractor Details"
                                    name="generalInfo.ownerContractorDetails"
                                    type="textarea"
                                />
                            </div>
                            {/* <div className="col-12 _mob-padding">
                                <div className="termstext">
                                    <CheckboxControlGlobal
                                        name="generalInfo.birdwatch"
                                        label="Birdwatch"
                                    />
                                </div>
                            </div> */}
                            <div className="col-12 col-md-6 _datepickerform">
                                <DatePickerControl
                                    label="Available"
                                    name="generalInfo.available"
                                    type={'dateTime'}
                                    placeholder="MM-DD-YY"
                                    disabled={true}
                                />
                            </div>
                        </>
                    )

                }
                <div className="col-12">
                    <FormControl
                        label="Listing Title"
                        name="generalInfo.listingTitle"
                        type="Name"
                        disabled={true}
                    />
                    <div className="info-input">
                        <p>Edit the address to set the listing title.</p>
                    </div>
                </div>
                <div className="col-12">
                    <FormControl
                        label="Name"
                        name="generalInfo.name"
                        type="Last"
                    />
                    <div className="info-input">
                        <p>Overrides the listing title in public displays.</p>
                    </div>
                </div>
                <div className="col-12 editor-common">
                    <label className="form-label">Description</label>
                    <Editor value={about} onTextChange={(e) => handleChange(e)} style={{ height: '320px' }} />
                </div>

                <div className="col-12 col-md-4">
                    <div className="termstext _mob-padding">
                        <CheckboxControlGlobal
                            name="generalInfo.isUnderNegotiation"
                            label="Under Negotiation"
                        />
                    </div>
                </div>
                {
                    editable && (
                        <div className="col-12 col-md-4">
                            <label className="form-label _extension">Extension Possible</label>

                            {/* <div className="termstext _mob-padding"> */}
                                {/* <CheckboxControlGlobal
                                    name="generalInfo.isExtensionPossible"
                                    label="Under Negotiation"
                                /> */}
                            
                                <p className="current_lease"> No current lease</p>
                            {/* </div> */}
                    </div>
                    )
                }
                {/* <div className="col-12 col-md-4 _mob-padding">
                    <div className="termstext">
                        <CheckboxControlGlobal
                            name="generalInfo.isPromoted"
                            label="Promoted?"
                        />
                    </div>
                </div> */}

                <div className="col-12">
                    <FormControl
                        label="Video URL"
                        name="generalInfo.videoUrl"
                        type="text"
                    />
                </div>
                <div className="col-12">
                    <FormControl
                        label="Airbnb Feed URL"
                        name="generalInfo.airbnbFeedUrl"
                        type="text"
                    />
                </div>
                <div className="col-12 col-md-6 _datepickerform">
                    <DatePickerControl
                        label="Available From"
                        name="generalInfo.availableFrom"
                        type={'dateTime'}
                        placeholder="MM-DD-YY"
                        value={availableFrom}
                        onChange={handleAvailableFromChange} // Update availableFrom date
                        minDate={availableUntil} // Make sure availableFrom cannot be later than availableUntil
                    />
                    <div className="info-input">
                        <p>This property is only available from this date.</p>
                    </div>
                </div>
                <div className="col-12 col-md-6 _datepickerform">
                    <DatePickerControl
                        label="Available Until"
                        name="generalInfo.availableUntil"
                        type={'dateTime'}
                        placeholder="MM-DD-YY"
                        value={availableUntil}
                        onChange={handleAvailableUntilChange} // Update availableUntil date
                        minDate={availableFrom} // Make sure availableUntil cannot be earlier than availableFrom
                        
                    />
                    <div className="info-input">
                        <p>This property is only available until and including this date.</p>
                    </div>
                </div>
                <div className="col-12 col-md-6 teamsort">
                    <FormControl
                        label="Minimum Reservation Term"
                        name="generalInfo.minimumStayRequired"
                        type="input-number"
                    />

                    <div className="info-input">
                        <p>Minimum length of a reservation allowed in number of days.</p>
                    </div>
                    {/* <div className="plusminus">
                        <div className="boxes"><img src={minusIcon} alt="Icon" /></div>
                        <div className="boxes"><img src={plusBlack} alt="Icon" /></div>

                    </div> */}

                </div>

                <div className="col-12 col-md-6 _mob-padding without-label">
                    <div className="termstext">
                        <CheckboxControlGlobal
                            name="generalInfo.isMinimumStayStrict"
                            label="Strict Minimum term"
                        />
                        <div className="info-input">
                            <p>Is the minimum term in days a strict minimum?</p>
                        </div>
                    </div>
                </div>
                {
                    !editable && (
                        <div className="col-12">
                            <FormControl
                                label="Annual Revenue Goal"
                                name="generalInfo.annualRevenueGoal"
                                type="text"
                            />
                        </div>
                    )
                }
            </div>

        </>
    );
}
