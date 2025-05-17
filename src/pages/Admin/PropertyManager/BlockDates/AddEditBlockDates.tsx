import React, { useState, ChangeEvent, useEffect, useRef } from "react";
import { Form } from "react-final-form";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { useNavigate, useParams } from "react-router-dom";
import Breadcrumb from 'react-bootstrap/Breadcrumb';
import { Editor } from 'primereact/editor';
import { composeValidators, required, requiredSelect } from "../../../../validations";
import { BLOCK_DATE_STATUS } from "../../../../constants";
import { ROUTE_NAVIGATION_PATH } from "../../../../routes/routes";
import { useCustomMutation } from "../../../../hooks/useApi";
import { toast } from 'react-toastify';
import { Spinner } from "react-bootstrap";
import { FormControl } from "../../../../components/FormElements/FormControl";
import { createBlockDate } from "../../../../api/admin/blockDates";
import PropertyListDropDown from "../../../../components/SearchSelect/PropertyListDropDown";
import { SearchSelectWithForm } from "../../../../components/SearchSelect/SearchSelect";
import { DatePickerControl } from "../../../../components/FormElements/DatePicker";
import proInfo from "../../../../assets/images/Info.svg";



const AddEditBlockDates: React.FC = () => {
    const [about, setAbout] = useState<any>(null);
    const [loader, setLoader] = useState(false);
    const params = useParams();
    const navigate = useNavigate();
    const handleSubmitRef = useRef<() => void>(() => { }); // Create a ref to store the handleSubmit function

    const submitForm = () => {
        if (handleSubmitRef.current) {
            handleSubmitRef.current(); // Programmatically trigger form submission
        }
    };

    const onSubmit = (values: any) => {
        let data = {
            listingId: values.listingId ? values.listingId.value : "",
            startDate: values.startDate,
            endDate: values.endDate,
            note: about,
            blockDateStatus: values.blockDateStatus.value
        }
        mutate(data);
    };

    const { mutate } = useCustomMutation({
        mutationFn: (req: any) => {
            return createBlockDate(req);
        },
        onSuccess: async () => {
            toast.success('Block date created successfully')
            navigate(ROUTE_NAVIGATION_PATH.BLOCK_DATES_LIST);
        },
    });

    const openDeleteModel = () => {
        navigate(ROUTE_NAVIGATION_PATH.BLOCK_DATES_LIST);
    }

    // const navigateToList  = () => {

    // }

    return (
        <>
            <div className="common-right-panel-section">
                <div className="top-right-bar">
                    <Breadcrumb>
                        <Breadcrumb.Item href="#">Property Manager</Breadcrumb.Item>
                        <Breadcrumb.Item href={ROUTE_NAVIGATION_PATH.BLOCK_DATES_LIST}>Block Dates </Breadcrumb.Item>
                        <Breadcrumb.Item active>Create Block Date </Breadcrumb.Item>
                    </Breadcrumb>
                    <div className="guest-header">
                        <div className="guest-left ">
                            <h2>Create Block Date</h2>
                        </div>
                        <div className="guest-right">
                            <button className="btn-delete" onClick={() => openDeleteModel()}>Cancel</button>
                            <button className="btn-primary" onClick={submitForm}>Save Details</button>
                        </div>
                    </div>

                </div>
                {loader ? (
                    <div className="spinner-wrapper"><Spinner /></div>
                ) : (
                    <div className="guest-general-information scrollbar">
                        <div className="info-wrapper info-wrapper-multiple">
                            <div className="infoleft">
                                <h2>General Details</h2>
                            </div>
                            <div className="info-right">
                                <Form
                                    onSubmit={onSubmit}
                                    render={({ handleSubmit, values }) => {
                                        // Store the handleSubmit function in the ref so it can be called later
                                        handleSubmitRef.current = handleSubmit;
                                        return (
                                            <form onSubmit={handleSubmit}>
                                                <div className="row">


                                                    <div className="col-12 col-md-12 custom-select-form">
                                                        <div className="text-start form-field">
                                                            <PropertyListDropDown
                                                                label="Property"
                                                                name="listingId"
                                                                isSearchable
                                                                validate={composeValidators(requiredSelect)}
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="col-12 col-md-5 _datepickerform">
                                                            <DatePickerControl
                                                                label="Start Date"
                                                                name="startDate"
                                                                placeholder="MM-DD-YY"
                                                                validate={composeValidators(required)}
                                                            />
                                                    </div>
                                                    <div className="col-12 col-md-5 _datepickerform">
                                                            <DatePickerControl
                                                                label="End Date"
                                                                name="endDate"
                                                                placeholder="MM-DD-YY"
                                                                minDate={values.startDate}
                                                                validate={composeValidators(required)}
                                                            />
                                                    </div>
                                                    <div className="col-12 col-md-12 custom-select-form _editchips">
                                                        <SearchSelectWithForm
                                                            name="blockDateStatus"
                                                            label="Status"
                                                            options={BLOCK_DATE_STATUS}
                                                            validate={composeValidators(requiredSelect)}
                                                        />
                                                    </div>
                                                    <div className="col-12 editor-common">
                                                        <label className="form-label">Description</label>
                                                        <Editor value={about} onTextChange={(e) => setAbout(e.htmlValue)} style={{ height: '320px' }} />
                                                        <div className="info-input pt-3 pb-0">
                                                            <img src={proInfo} alt="Info" />
                                                            <p>Why property is being blocked.</p>
                                                        </div>
                                                    </div>

                                                </div>
                                            </form>
                                        );
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                )
                }
            </div>

        </>
    );
};

export default AddEditBlockDates;
