import React, { useState, useEffect, useRef } from "react";
import { Form } from "react-final-form";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { AuthType } from "../../../../types/User";
import { composeValidators, required } from "../../../../validations";
import { FormControl } from "../../../../components/FormElements/FormControl";
import { useNavigate, useParams } from "react-router-dom";
import proInfo from "../../../../assets/images/Info.svg";
import Breadcrumb from 'react-bootstrap/Breadcrumb';
import { CheckboxControlGlobal } from "../../../../components/FormElements/CheckboxControl";
import PropertyListDropDown from "../../../../components/SearchSelect/PropertyListDropDown";
import { createFeaturette, getFeaturetteDetail, updateFeaturette } from "../../../../api/admin/siteManger";
import { useCustomMutation } from "../../../../hooks/useApi";
import { ROUTE_NAVIGATION_PATH } from "../../../../routes/routes";
import { toast } from 'react-toastify';
import { Spinner } from "react-bootstrap";
import DeleteFeaturetteModel from "../../../../components/Modal/DeleteFeaturetteModel";

const EDIT_FEATURETTE = {
    heading: "",
    subheading: "",
    lead: "",
    enabled: false,
    link: "",
    position: "",
    unitId: ""
}

const CreateEditFeaturettes: React.FC = () => {
    const [loader, setLoader] = useState(false);
    const params = useParams();
    const navigate = useNavigate();
    const [initData, setInitData] = useState<any>({
        ...EDIT_FEATURETTE,
        heading: "",
        subheading: "",
        lead: "",
        enabled: false,
        link: "",
        position: "",
        unitId: ""
    });
    const handleSubmitRef = useRef<() => void>(() => { }); // Create a ref to store the handleSubmit function
    const [errorMessage, setErrorMessage] = useState("");
    const [featuretteId, setfeaturetteId] = useState("");
    const [featuretteHeading, setFeaturetteHeading] = useState("");
    const [deleteModal, setDeleteModal] = useState(false);

    const submitForm = () => {
        if (handleSubmitRef.current) {
            handleSubmitRef.current(); // Programmatically trigger form submission
        }
    };

    useEffect(() => {
        if(params.id){
            getFeaturetteDetail(params.id).then((res: any) => {    
                setInitData((prevState: any) => ({
                    ...prevState,
                    heading: res.data.heading ? res.data.heading : "",
                    subheading: res.data.subheading ? res.data.subheading : "",
                    lead: res.data.lead ? res.data.lead : "",
                    enabled: res.data.enabled ? res.data.enabled : false,
                    position: res.data.position ? res.data.position : 0,
                    link: res.data.link ?  res.data.link : "",
                    unitId: res.data.unitId ? res.data.unitId : "",
                }));   
                setLoader(false);
                setFeaturetteHeading(res.data.heading);
                setfeaturetteId(res.data._id);
            });
        } else {
            setLoader(false);
        }
        
    }, []);

    const onSubmit = (values: any) => {
        delete values?.isRemember;
        const data:any = { ...values };
        if(values.unitId) {
            data.unitId = values.unitId.value;
        } else {
            delete data.unitId;
        }
        // if(data.position) {
            data.position = values.position ? Number(values.position) : null;

        // } else {
        //     delete data.position;
        // }
        // if(!data.link)
          data.link = values.link ? data.link : null;
        mutate(data);

    };

    const { mutate } = useCustomMutation({
        mutationFn: (req: any) => {
            return params.id ? updateFeaturette(params.id, req): createFeaturette(req);
        },
        onSuccess: async () => {
            toast.success(params.id ? `Featurette updated successfully` : 'Featurette created successfully')
            navigate(ROUTE_NAVIGATION_PATH.FEATURETTE);
        },
    });

    const eitherRequired = (values: any): Record<string, string | undefined> => {  
        const errors: Record<string, string | undefined> = {};
        if (!values.link || !values.unitId.value) {
            setErrorMessage('Either Link or Property is required');
        } else {
            setErrorMessage("");
        }
        return errors; // Return the errors object
    };

    const openDeleteModel = () => {
        setDeleteModal(true);
    }

    const navigateToList = () => {
        navigate(ROUTE_NAVIGATION_PATH.FEATURETTE); 
    }
      
    const updateListItem = () => {
        setFeaturetteHeading('');
        setfeaturetteId('');
        navigate(ROUTE_NAVIGATION_PATH.FEATURETTE);
    }

    return (
        <>
            <div className="common-right-panel-section">
                <div className="top-right-bar">
                    <Breadcrumb>
                        <Breadcrumb.Item href="#">Site Manager</Breadcrumb.Item>
                        <Breadcrumb.Item href={ROUTE_NAVIGATION_PATH.FEATURETTE}>Featurettes</Breadcrumb.Item>
                        <Breadcrumb.Item active>{params.id ? 'Edit' : 'Create'} Featurettes</Breadcrumb.Item>

                    </Breadcrumb>
                    <div className="guest-header">
                        <div className="guest-left">
                            <h1>{params.id ? 'Edit' : 'Create'} Featurettes</h1>
                        </div>
                        <div className="guest-right">
                            {
                                params.id ?
                                <button className="btn-delete" onClick={() => openDeleteModel()}>Delete Featurette</button>
                                :
                                <button className="btn-delete" onClick={navigateToList}>Cancel</button>
                            }
                            <button className="btn-primary" onClick={submitForm}> {params.id ? 'Edit' : 'Create'} Featurettes</button>
                        </div>
                    </div>

                </div>
                {loader ? (
                   <div className="spinner-wrapper"><Spinner /></div>
                ) : (
                    <div className="guest-general-information scrollbar">
                        <div className="info-wrapper info-wrapper-multiple">
                            <div className="infoleft">
                                <h2>{params.id ? 'Edit Details' : 'Create Details'}</h2>
                            </div>
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
                                                            label="Heading*"
                                                            name="heading"
                                                            type="Name"
                                                            validate={composeValidators(required)}
                                                        />


                                                    </div>
                                                    <div className="col-12 col-md-12">
                                                        <FormControl
                                                            label="Subheading*"
                                                            name="subheading"
                                                            type="Name"
                                                            validate={composeValidators(required)}
                                                        />
                                                    </div>
                                                    <div className="col-12 col-md-12">
                                                        <FormControl
                                                            label="Lead"
                                                            name="lead"
                                                            type="textarea"
                                                            rows="3"
                                                        />
                                                    </div>

                                                    <div className="col-12 col-md-12 mb-4">
                                                        <CheckboxControlGlobal name="enabled" label="Enabled"/>
                                                    </div>

                                                    <div className="col-12 col-md-12">
                                                        <FormControl
                                                            label="Position"
                                                            name="position"
                                                            type="input-number"

                                                        />
                                                    </div>

                                                    <div className="col-12 col-md-12 custom-select-form">
                                                        <div className="info-input">
                                                            <img src={proInfo} alt="Info" />
                                                            <p>Please select only one of the following:</p>
                                                        </div>
                                                    </div>
                                                    <div className="col-12 col-md-12">
                                                        <FormControl
                                                            label="Link"
                                                            name="link"
                                                            type="Name"
                                                        />
                                                    </div>
                                                    <div className="col-12 col-md-12 custom-select-form">
                                                        <PropertyListDropDown
                                                            label="Property"
                                                            name="unitId"
                                                        />
                                                    </div>
                                                    <div className="col-12 col-md-12 custom-select-form">
                                                        <div className="info-input">
                                                        <span className="error">{errorMessage}</span>
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

            {
                featuretteHeading && deleteModal ?  (
                    <DeleteFeaturetteModel
                        show={deleteModal}
                        handleClose={() => setDeleteModal(false)}
                        featuretteId={featuretteId}
                        featuretteHeading={featuretteHeading}
                        updateListItem={updateListItem}
                    />
                )
                :
                null
            }
        </>
    );
};

export default CreateEditFeaturettes;