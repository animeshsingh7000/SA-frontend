import { Button } from "react-bootstrap";
import { Form } from "react-final-form";
import { useEffect, useState } from "react";
import { ROUTE_NAVIGATION_PATH } from "../../routes/routes";
import { useNavigate, useParams } from "react-router-dom";
import { useCustomMutation } from "../../hooks/useApi";
import Spinner from "../../components/Spinner";
import { addFeaturette, getFeaturetteDetails, updateFeaturette } from "../../api/admin/ownerInquiry";
import { toast } from 'react-toastify';
import { FormControl } from "../../components/FormElements/FormControl";
import { composeValidators, maxlength, required } from "../../validations";
import { FEATURETTE_REQUEST } from "../../constants";
import { CheckboxControl } from "../../components/FormElements/CheckboxControl";
import PropertyListDropDown from "../../components/SearchSelect/PropertyListDropDown";

export default function AddEditFeaturette() {
    const [initData, setInitData] = useState<any>(FEATURETTE_REQUEST);
    const [loader, setLoader] = useState(false);
    const [isProperty, setIsProperty] = useState(false);
    const featuretteId= new URLSearchParams(document.location.search).get('id');


    const navigate = useNavigate();

    useEffect(() => {
        if(featuretteId) {
            getFeaturetteDetails(featuretteId)
            .then((res) => {
                setInitData((prevState: any) => ({
                    ...prevState,
                    unitId: res.data.data.unitId ? res.data.data.unitId : null,
                    heading: res.data.data.heading ? res.data.data.heading : null,
                    subheading: res.data.data.subheading ? res.data.data.subheading : null,
                    lead: res.data.data.lead ? res.data.data.lead : null,
                    enabled: res.data.data.enabled ? res.data.data.enabled : false,
                    link: res.data.data.link ? res.data.data.link : null,
                    position: res.data.data.position ? res.data.data.position : null,
        
                }));
            })
            .catch((error) => {
                toast.error(error.response?.data?.message || error.message);
            });
        }
        
    }, [])

    const { mutate } = useCustomMutation({
        mutationFn: featuretteId? updateFeaturette : addFeaturette,
        onSuccess: () => {
            toast.success(`Featurette Property has been added successfully!`)
            navigate(ROUTE_NAVIGATION_PATH.FEATURETTE_LISTING)
        },
    });

    const onSubmit = (values: any) => {
        if(!values.link && !values.unitId) {
            setIsProperty(true);
        } else {
            setIsProperty(false);
            let data:any = {
                unitId: values.unitId ? values.unitId.value : '',
                heading: values.heading,
                subheading: values.subheading,
                lead: values.lead,
                enabled: values.enabled,
                link: values.link,
                position: values.position ? parseInt(values.position) : null
            }

            if(featuretteId) {
                data.id = featuretteId
            }
            mutate(data);
        }       
    };


    return (
        <>
            {
                loader ?
                    <Spinner />
                :
                <div className="rental-portal-container">
                    <div className="container">
                        <div className="rental-portal-content">
                            <div id="rental-inquiry-form">
                                <div className="owner-inquery-wrapper _addproperty">
                                    <Form
                                        initialValues={initData}
                                        onSubmit={onSubmit}
                                        render={({ handleSubmit, values }) => (
                                            <form
                                                onSubmit={handleSubmit}
                                                className="owner-inquery-form"
                                            >

                                                <div className="row">
                                                    <div className="col-12 col-md-12 custom-select-form">
                                                        <FormControl
                                                            label="Heading*"
                                                            name="heading"
                                                            type="text"
                                                            placeholder="Enter heading"
                                                            validate={composeValidators(
                                                                required,
                                                                maxlength(250)
                                                            )}
                                                        />
                                                    </div>
                                                    <div className="col-12 col-md-12">
                                                        <FormControl
                                                            label="Subheading*"
                                                            name="subheading"
                                                            type="text"
                                                            placeholder="Enter subheading"
                                                            validate={composeValidators(
                                                                required,
                                                                maxlength(250)
                                                            )}
                                                        />
                                                    </div>
                                                    <div className="col-12 col-md-12">
                                                        <FormControl
                                                            label="Lead"
                                                            name="lead"
                                                            type="textarea"
                                                            placeholder="Enter lead"
                                                            validate={composeValidators(
                                                                maxlength(500)
                                                            )}
                                                        />
                                                    </div>
                                                    <div className="col-12 col-md-12 _strict-lease">
                                                        <CheckboxControl name="enabled" label="Enabled"/>
                                                    </div>
                                                    <div className="col-12 col-md-12">
                                                        <FormControl
                                                            label="Position"
                                                            name="position"
                                                            type="mobile"
                                                            placeholder="Enter position"
                                                        />
                                                    </div>

                                                    <div className={isProperty ? 'property-link-error': ''}>Please select only one of the following:</div>
                                                    
                                                    <div className="col-12 col-md-12">
                                                        <FormControl
                                                            label="Link"
                                                            name="link"
                                                            type="text"
                                                            placeholder="Enter link"
                                                        />
                                                    </div>

                                                    <div className="col-12 col-md-12">
                                                        <PropertyListDropDown
                                                            label="Property"
                                                            name="unitId"
                                                        />
                                                    </div>

                                                </div>

                                                <div className="action-btn-wrapper fixed-bottom ">
                                                    <div className="action-btns oi-action-btn fixwidth">
                                                        <div className="Continuewrapper">
                                                            <Button type="submit" className="btn primary minwdth">
                                                                { featuretteId ? 'UPDATE' : 'SUBMIT' }
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </form>
                                        )}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            }

        </>
    );
}
