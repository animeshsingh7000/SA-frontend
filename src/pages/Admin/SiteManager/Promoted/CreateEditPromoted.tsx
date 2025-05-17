import React, { useState, useEffect, useRef } from "react";
import { Form } from "react-final-form";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { composeValidators, required, requiredSelect } from "../../../../validations";
import { FormControl } from "../../../../components/FormElements/FormControl";
import { useNavigate, useParams } from "react-router-dom";
import Breadcrumb from 'react-bootstrap/Breadcrumb';
import { createPromotedProperty, getPromotedPropertyDetail, updatePromotedProperty } from "../../../../api/admin/siteManger";
import { useCustomMutation } from "../../../../hooks/useApi";
import { ROUTE_NAVIGATION_PATH } from "../../../../routes/routes";
import { toast } from 'react-toastify';
import { Spinner } from "react-bootstrap";
import PropertyListDropDown from "../../../../components/SearchSelect/PropertyListDropDown";
import DeletePromotedModel from "../../../../components/Modal/DeletePromotedModel";

const EDIT_DETAILS = {
    position: "",
    propertyId: ""
}

const CreateEditPromoted: React.FC = () => {
    const [loader, setLoader] = useState(true);
    const params = useParams();
    const navigate = useNavigate();
    const [initData, setInitData] = useState<any>({
        ...EDIT_DETAILS,
        position: "",
        propertyId: ""
    });
    const handleSubmitRef = useRef<() => void>(() => { }); // Create a ref to store the handleSubmit function
    const [featuretteId, setfeaturetteId] = useState("");
    const [featuretteHeading, setFeaturetteHeading] = useState("");
    const [deleteModal, setDeleteModal] = useState(false);

    const submitForm = () => {
        if (handleSubmitRef.current) {
            handleSubmitRef.current(); // Programmatically trigger form submission
        }
    };

    useEffect(() => {
        if (params.id) {
            getPromotedPropertyDetail(params.id).then((res: any) => {
                setInitData((prevState: any) => ({
                    ...prevState,
                    position: res.position ? res.position : 0,
                    propertyId: res.propertyId ? res.propertyId : "",
                }));
                setFeaturetteHeading(res.propertyId);
                setfeaturetteId(res.position);
                setLoader(false);
            });
        } else {
            setLoader(false);
        }

    }, []);

    const onSubmit = (values: any) => {
        
        const data: any = { ...values };
        data.propertyId = values.propertyId.value ? values.propertyId.value : values.propertyId;
        data.position = Number(values.position)
        mutate(data);

    };

    const { mutate } = useCustomMutation({
        mutationFn: (req: any) => {
            return params.id ? updatePromotedProperty(params.id, req) : createPromotedProperty(req);
        },
        onSuccess: async () => {
            toast.success(params.id ? `Promoted property updated successfully` : 'Promoted property created successfully')
            navigate(ROUTE_NAVIGATION_PATH.ADMIN_PROMOTED_PROPERTY);
        },
    });

    const openDeleteModel = () => {
        setDeleteModal(true);
    }

    const navigateToList = () => {
        navigate(ROUTE_NAVIGATION_PATH.ADMIN_PROMOTED_PROPERTY);
    }

    const updateListItem = () => {
        setFeaturetteHeading('');
        setfeaturetteId('');
        navigate(ROUTE_NAVIGATION_PATH.ADMIN_PROMOTED_PROPERTY);
    }

    return (
        <>
            <div className="common-right-panel-section">
                <div className="top-right-bar">
                    <Breadcrumb>
                        <Breadcrumb.Item href="#">Site Manager</Breadcrumb.Item>
                        <Breadcrumb.Item href={ROUTE_NAVIGATION_PATH.ADMIN_PROMOTED_PROPERTY}>Promoted Property</Breadcrumb.Item>
                        <Breadcrumb.Item active>{params.id ? 'Edit' : 'Create'} Promoted Property</Breadcrumb.Item>

                    </Breadcrumb>
                    <div className="guest-header">
                        <div className="guest-left">
                            <h1>{params.id ? 'Edit' : 'Create'} Promoted Property</h1>
                        </div>
                        <div className="guest-right">
                            {
                                params.id ?
                                    <button className="btn-delete" onClick={() => openDeleteModel()}>Delete Promoted Property</button>
                                    :
                                    <button className="btn-delete" onClick={navigateToList}>Cancel</button>
                            }
                            <button className="btn-primary" onClick={submitForm}>{params.id ? 'Save' : 'Create'} Detail</button>
                        </div>
                    </div>

                </div>
                {loader ? (
                    <div className="spinner-wrapper"><Spinner /></div>
                ) : (
                    <div className="guest-general-information scrollbar _promoted_form">
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

                                                    <div className="col-12 col-md-12 custom-select-form">
                                                        <PropertyListDropDown
                                                            label="Property"
                                                            name="propertyId"
                                                            validate={composeValidators(requiredSelect)}
                                                        />
                                                    </div>
                                                    
                                                    

                                                    <div className="col-12 col-md-12">
                                                        <FormControl
                                                            label="Position"
                                                            name="position"
                                                            type="input-number"
                                                            validate={composeValidators(required)}
                                                        />
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
                featuretteHeading && deleteModal ? (
                    <DeletePromotedModel
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

export default CreateEditPromoted;