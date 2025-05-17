import React, { useState, useEffect, useRef } from "react";
import { Field, Form } from "react-final-form";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { Spinner } from "react-bootstrap";
import { FormControl } from "../../../components/FormElements/FormControl";
import { useNavigate, useParams } from "react-router-dom";
import proInfo from "../../../assets/images/Info.svg";
import Breadcrumb from 'react-bootstrap/Breadcrumb';
import { ROUTE_NAVIGATION_PATH } from "../../../routes/routes";
import { getDocumentTemplateDetail } from "../../../api/admin/opeartions";

const EDIT_NEIGHBORHOOD = {
    description: "",
    context: false,
    title: false,
    slug: "",
    type: "",
    content: "",
    enabled: false
}

const EditTemplate: React.FC = () => {
    const [initData, setInitData] = useState<any>({
        ...EDIT_NEIGHBORHOOD,
        description: "",
        context: false,
        title: false,
        slug: "",
        type: "",
        content: "",
        enabled: false
    });
    const [loader, setLoader] = useState(true);
    const params = useParams();
    const navigate = useNavigate();
    const handleSubmitRef = useRef<() => void>(() => { }); // Create a ref to store the handleSubmit function

    useEffect(() => {
        if (params.id) {
            getDocumentTemplateDetail(params.id).then((res: any) => {
                setInitData((prevState: any) => ({
                    ...prevState,
                    ...res.data
                }));
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
       
    };


    return (
        <>
            <div className="common-right-panel-section">
                <div className="top-right-bar">
                    <Breadcrumb>
                        <Breadcrumb.Item href="#">Opeartion Manager</Breadcrumb.Item>
                        <Breadcrumb.Item href={ROUTE_NAVIGATION_PATH.RECURRING_RATE}>Recurring Cleaning Rate</Breadcrumb.Item>
                        {/* <Breadcrumb.Item href="#">All Building</Breadcrumb.Item> */}
                        <Breadcrumb.Item active>Editing Template </Breadcrumb.Item>

                    </Breadcrumb>
                    <div className="guest-header">
                        <div className="guest-left ">
                            <h1>Editing Template</h1>

                            <h5>{initData.property_size}</h5>

                        </div>
                    </div>

                </div>
                <div className="guest-general-information scrollbar">

                    {loader ? (
                        <div className="spinner-wrapper relative"> <Spinner /> </div>
                    ) :
                        <Form
                            initialValues={initData}
                            onSubmit={onSubmit}
                            render={({ handleSubmit, values, form }) => {
                                // Store the handleSubmit function in the ref so it can be called later
                                handleSubmitRef.current = handleSubmit;
                                return (
                                    <form onSubmit={handleSubmit}>
                                        <div className="info-wrapper info-wrapper-multiple">
                                            <div className="infoleft">
                                                <h2>General Details</h2>
                                            </div>
                                            <div className="info-right">
                                                <div className="row">
                                                    <div className="col-12 col-md-12">
                                                        <FormControl
                                                            label="Title"
                                                            name="title"
                                                            type="text"
                                                            disabled={true}
                                                        />
                                                    </div>

                                                    <div className="col-12 col-md-12">
                                                        <FormControl
                                                            label="Unique Slug"
                                                            name="slug"
                                                            type="text"
                                                            disabled={true}
                                                        />
                                                        <div className="info-input">
                                                            <img src={proInfo} alt="Info" />
                                                            <p>Not required AND CANNOT be changed if set. Leave empty most of the time.</p>
                                                        </div>
                                                    </div>
                                                    <div className="col-12 col-md-12 textareafield">
                                                        <FormControl
                                                            label="Description"
                                                            name="description"
                                                            type="textarea"
                                                            disabled={true}
                                                        />
                                                    </div>

                                                    <div className="col-12 col-md-12 textareafield">
                                                        <FormControl
                                                            label="Content"
                                                            name="content"
                                                            type="textarea"
                                                            disabled={true}
                                                        />
                                                    </div>

                                                    <div className="col-12 col-md-12 textareafield">
                                                        <FormControl
                                                            label="Context"
                                                            name="context"
                                                            type="textarea"
                                                            disabled={true}
                                                        />
                                                    </div>

                                                    <div className="col-12 col-md-12 _dollar">
                                                        <FormControl
                                                            label="Type"
                                                            name="type"
                                                            type="text"
                                                            disabled={true}
                                                        />
                                                    </div>

                                                    <div className="check-group commocheckbox custom-checkbox-new">
                                                        <Field
                                                            label="Enabled"
                                                            name="enabled"
                                                            type="checkbox"
                                                            component="input"
                                                            disabled={true}

                                                        />
                                                        <label className="enabled_text">Enabled</label>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                )
                            }}
                        />
                    }
                </div>

            </div>
        </>
    );
};

export default EditTemplate;
