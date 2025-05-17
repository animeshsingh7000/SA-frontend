import React, { useState, useEffect, useRef } from "react";
import { Form, Field, useField } from "react-final-form";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { Dropdown } from "react-bootstrap";
import { composeValidators, required, validEmail } from "../../../../validations";
import { FormControl } from "../../../../components/FormElements/FormControl";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import proInfo from "../../../../assets/images/Info.svg";
import closeIcon from "../../../../assets/images/close.svg";
import blueInfoIcon from "../../../../assets/images/blue-info.svg";
import Breadcrumb from 'react-bootstrap/Breadcrumb';
import { Editor } from 'primereact/editor';
import { ROUTE_NAVIGATION_PATH } from "../../../../routes/routes";
import { useCustomMutation } from "../../../../hooks/useApi";
import { createRegion, getRegionDetail, updateRegion } from "../../../../api/admin/regions";
import { toast } from 'react-toastify';
import { capitalizeFirstWord, formatDate } from "../../../../utils/common";
import { Spinner } from "react-bootstrap";
import AttacheUserListDropDown from "../../../../components/SearchSelect/AttacheUserListDropDown";

const EDIT_REGION = {
    emergencyPhone: "",
    regionGuestServicesId: "",
    phoneNumber: "",
    faxNumber: "",
    name: "",
    slug: ""
}

const AddEditRegions: React.FC = () => {
    const [about, setAbout] = useState<any>(null);
    const [initData, setInitData] = useState<any>({
        ...EDIT_REGION,
        emergencyPhone: "",
        regionGuestServicesId: "",
        phoneNumber: "",
        faxNumber: "",
        name: "",
        slug: ""
    });
    const [loader, setLoader] = useState(true);
    const [showNote, setShowNote] = useState(true);

    const params = useParams();
    const navigate = useNavigate();
    const handleSubmitRef = useRef<() => void>(() => { }); // Create a ref to store the handleSubmit function

    useEffect(() => {
        if(params.id){
            getRegionDetail(params.id).then((res: any) => {    
                setInitData((prevState: any) => ({
                    ...prevState,
                    emergencyPhone: res.data.emergencyPhone ? res.data.emergencyPhone : "",
                    name: res.data.name ? res.data.name : "",
                    regionGuestServicesId: res.data.regionGuestServicesId ? res.data.regionGuestServicesId : "",
                    phoneNumber: res.data.phoneNumber? res.data.phoneNumber : "",
                    faxNumber: res.data.faxNumber ? res.data.faxNumber : "",
                    slug: res.data.slug ? res.data.slug : "",
                    createdAt: res.data.createdAt ? res.data.createdAt : "",
                }));
                
                setAbout(res.data.description ? res.data.description : "");
                setLoader(false);
            });
        } else {
            setLoader(false);
        }
        
    }, []);

    const submitForm = () => {
        if (handleSubmitRef.current) {
            handleSubmitRef.current(); // Programmatically trigger form submission
        }
    };

    const onSubmit = (values: any) => {
        let guestDetail = values.regionGuestServicesId ? (typeof values.regionGuestServicesId === "object" ? values.regionGuestServicesId.value: values.regionGuestServicesId) : "";
        let data = {
            emergencyPhone: values.emergencyPhone,
            regionGuestServicesId: guestDetail,
            phoneNumber: values.phoneNumber,
            faxNumber: values.faxNumber,
            name: values.name,
            description: about,
        }
        mutate(data);
        
    };

    const { mutate } = useCustomMutation({
        mutationFn: (req: any) => {
            return params.id ? updateRegion(params.id, req): createRegion(req);
        },
        onSuccess: async () => {
            toast.success(params.id ? `Region updated successfully` : 'Region created successfully')
            navigate(ROUTE_NAVIGATION_PATH.REGIONS_LIST);
        },
    });

    const removeNote = () => {
        setShowNote(false)
    }

    return (
        <>
            <div className="common-right-panel-section">
                <div className="top-right-bar">
                    <Breadcrumb>
                        <Breadcrumb.Item href="#">Property Manager</Breadcrumb.Item>
                        <Breadcrumb.Item href={ROUTE_NAVIGATION_PATH.REGIONS_LIST}>Regions </Breadcrumb.Item>
                        <Breadcrumb.Item active>{params.id ? 'Edit' : 'Create'} Regions </Breadcrumb.Item>
                    </Breadcrumb>
                    <div className="guest-header">
                        <div className="guest-left ">
                            <h2>Regions</h2>
                            {
                                params.id ?
                                <>
                                    <h1>{capitalizeFirstWord(initData.name)}</h1>
                                    <div className="register">Registered on {initData?.createdAt ? formatDate(initData.createdAt) : '-'}</div>
                                </>
                                :
                                null
                            }
                        </div>
                        <div className="guest-right">
                            {/* <button className="btn-delete">Delete Regions</button> */}
                            <button className="btn-primary" onClick={submitForm}>Save Details</button>
                        </div>
                    </div>

                </div>
                
                <div className="guest-general-information scrollbar">
                    {
                        showNote ?
                            <div className="note-infotxt">
                                <div className="infoblue">
                                    <img src={blueInfoIcon} alt="Info" />
                                </div>
                                
                                    <div className="notetxt">
                                        <div className="h4">Note</div>
                                        <p>Regions cannot be deleted at this time. It would be perilous to allow it. </p>
                                        <div className="close" onClick={removeNote}>
                                            <img src={closeIcon} alt="" />
                                        </div>

                                    </div>
                                
                            
                            </div>
                        :
                        null

                    }
                    <div className="info-wrapper info-wrapper-multiple">
                        <div className="infoleft">
                            <h2>General Details</h2>
                        </div>
                        {loader ? (
                            <Spinner />
                        ) : (
                            <div className="info-right">
                                <Form
                                    initialValues={initData}
                                    onSubmit={onSubmit}
                                    render={({ handleSubmit, values }) => {
                                        // Store the handleSubmit function in the ref so it can be called later
                                        handleSubmitRef.current = handleSubmit;
                                        return (
                                            <form onSubmit={handleSubmit}>
                                                <div className="row">
                                                    <div className="col-12 col-md-12">
                                                        <FormControl
                                                            label="Region"
                                                            name="name"
                                                            type="text"
                                                            validate={composeValidators(required)}
                                                        />
                                                    </div>
                                                    <div className="col-12 editor-common">
                                                        <label className="form-label">Description</label>
                                                        <Editor value={about} onTextChange={(e) => setAbout(e.htmlValue)} style={{ height: '320px' }} />
                                                    </div>
                                                    <div className="col-12 col-md-12">
                                                        <FormControl
                                                            label="Slug"
                                                            name="slug"
                                                            type="text"
                                                            disabled={true}
                                                        />
                                                    </div>
                                                    <div className="col-12 col-md-12">
                                                        <FormControl
                                                            label="Office Phone"
                                                            name="phoneNumber"
                                                            type="mobile"
                                                            minlength={10}
                                                            maxlength={20}
                                                            validate={composeValidators(required)}
                                                        />
                                                        <div className="info-input">
                                                            <img src={proInfo} alt="Info" />
                                                            <p>Used in generated messages so SHOULD be set.</p>
                                                        </div>

                                                    </div>
                                                    <div className="col-12 col-md-12">
                                                        <FormControl
                                                            label="Emergency Phone"
                                                            name="emergencyPhone"
                                                            type="mobile"
                                                            minlength={10}
                                                            maxlength={20}
                                                            validate={composeValidators(required)}
                                                        />
                                                        <div className="info-input">
                                                            <img src={proInfo} alt="Info" />
                                                            <p>Used in generated messages so SHOULD be set.</p>
                                                        </div>

                                                    </div>
                                                    <div className="col-12 col-md-12">
                                                        <FormControl
                                                            label="Fax Number"
                                                            name="faxNumber"
                                                            type="text"
                                                        />


                                                    </div>
                                                    <div className="col-12 col-md-12 custom-select-form">
                                                        <div className="text-start form-field">
                                                            <AttacheUserListDropDown
                                                                label="Guest Services"
                                                                name="regionGuestServicesId"
                                                                validate={composeValidators(required)}
                                                            />

                                                        </div>


                                                    </div>
                                                </div>
                                            </form>
                                        );
                                    }}
                                />
                            </div>
                        )
                        }
                    </div>

                </div>
            </div>
        </>
    );
};

export default AddEditRegions;
