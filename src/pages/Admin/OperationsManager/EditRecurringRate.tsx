import React, { useState, useEffect, useRef } from "react";
import { Form } from "react-final-form";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { Spinner } from "react-bootstrap";
import { composeValidators, required } from "../../../validations";
import { FormControl } from "../../../components/FormElements/FormControl"; 
import { useNavigate, useParams } from "react-router-dom";
import proInfo from "../../../assets/images/Info.svg";
import Breadcrumb from 'react-bootstrap/Breadcrumb';
import dollarIcon from "../../../assets/images/dollar.svg";
import { ROUTE_NAVIGATION_PATH } from "../../../routes/routes";
import { useCustomMutation } from "../../../hooks/useApi";
import { toast } from 'react-toastify';
import { getRecurringRateDetail, updateRecuuringRate } from "../../../api/admin/opeartions";

const EDIT_NEIGHBORHOOD = {
    biWeekly: "",
    monthly: "",
    oneTime: "",
    threeWeeks: "",
    weekly: ""
}

const EditRecurringRate: React.FC = () => {
    const [initData, setInitData] = useState<any>({
        ...EDIT_NEIGHBORHOOD,
        biWeekly: "",
        monthly: "",
        oneTime: "",
        threeWeeks: "",
        weekly: ""
    });
    const [loader, setLoader] = useState(true);
    const params = useParams();
    const navigate = useNavigate();
    const handleSubmitRef = useRef<() => void>(() => { }); // Create a ref to store the handleSubmit function

    useEffect(() => {
        if(params.id){
            getRecurringRateDetail(params.id).then((res: any) => {    
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
        const data:any = { ...values };
        delete data._id;
        mutate(data);
    };

    const { mutate } = useCustomMutation({
        mutationFn: (req: any) => {
            return updateRecuuringRate(params.id, req);
        },
        onSuccess: async () => {
            toast.success('Rate updated successfully')
            navigate(ROUTE_NAVIGATION_PATH.RECURRING_RATE);
        },
    });


    return (
        <>
            <div className="common-right-panel-section">
                <div className="top-right-bar">
                    <Breadcrumb>
                        <Breadcrumb.Item href="#">Opeartion Manager</Breadcrumb.Item>
                        <Breadcrumb.Item href={ROUTE_NAVIGATION_PATH.RECURRING_RATE}>Recurring Cleaning Rate</Breadcrumb.Item>
                        {/* <Breadcrumb.Item href="#">All Building</Breadcrumb.Item> */}
                        <Breadcrumb.Item active>Editing Recurring Cleaning Rate </Breadcrumb.Item>

                    </Breadcrumb>
                    <div className="guest-header">
                        <div className="guest-left ">
                            <h1>Editing Recurring Cleaning Rate</h1>
                           
                            <h5>{initData.property_size}</h5>
                              
                        </div>
                        <div className="guest-right">
                            <button className="btn-primary" onClick={submitForm}>Save Details</button>
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
                                                <div className="col-12 col-md-12 _dollar">
                                                    <FormControl
                                                        label="Weekly"
                                                        name="weekly"
                                                        type="input-decimal"
                                                        validate={composeValidators(required)}
                                                    />
                                                    <div className="dollarIcon">
                                                        <img src={dollarIcon} alt="Dollar" />
                                                    </div>

                                                </div>
                                              
                                                <div className="col-12 col-md-12 _dollar">
                                                    <FormControl
                                                        label=" Bi-weekly"
                                                        name="biWeekly"
                                                        type="input-decimal"
                                                        validate={composeValidators(required)}
                                                    />
                                                    <div className="dollarIcon">
                                                        <img src={dollarIcon} alt="Dollar" />
                                                    </div>
                                                </div>
                                                <div className="col-12 col-md-12 _dollar">
                                                    <FormControl
                                                        label="Fees"
                                                        name="threeWeeks"
                                                        type="input-decimal"
                                                        validate={composeValidators(required)}
                                                    />
                                                    <div className="dollarIcon">
                                                        <img src={dollarIcon} alt="Dollar" />
                                                    </div>
                                                </div>

                                                <div className="col-12 col-md-12 _dollar">
                                                    <FormControl
                                                        label="Monthly"
                                                        name="monthly"
                                                        type="input-decimal"
                                                        validate={composeValidators(required)}
                                                    />
                                                    <div className="dollarIcon">
                                                        <img src={dollarIcon} alt="Dollar" />
                                                    </div>
                                                </div>

                                                <div className="col-12 col-md-12 _dollar">
                                                    <FormControl
                                                        label="One time"
                                                        name="oneTime"
                                                        type="input-decimal"
                                                        validate={composeValidators(required)}
                                                    />
                                                    <div className="dollarIcon">
                                                        <img src={dollarIcon} alt="Dollar" />
                                                    </div>
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

export default EditRecurringRate;
