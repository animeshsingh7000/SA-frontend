import { Button } from "react-bootstrap";
import { EDIT_PROPERTY_INITDATA } from "../../constants";
import { Form } from "react-final-form";
import { useEffect, useState } from "react";
import EditFirstForm from "../../components/Property/EditProperty/EditFirstForm";
import { ROUTE_NAVIGATION_PATH } from "../../routes/routes";
import { useNavigate, useParams } from "react-router-dom";
import EditSecondForm from "../../components/Property/EditProperty/EditSecondForm";
import EditThirdForm from "../../components/Property/EditProperty/EditThirdForm";
import EditFourthForm from "../../components/Property/EditProperty/EditFourthForm";
import EditFifthForm from "../../components/Property/EditProperty/EditFifthForm";
import EditSixthForm from "../../components/Property/EditProperty/EditSixthForm";
import EditSeventhForm from "../../components/Property/EditProperty/EditSeventhForm";
import EditEighthForm from "../../components/Property/EditProperty/EditEigthForm";
import EditNinethForm from "../../components/Property/EditProperty/EditNinethForm";
import EditTenthForm from "../../components/Property/EditProperty/EditTenthForm";
import EditEleventhForm from "../../components/Property/EditProperty/EditEleventhForm";
import EditTwelveForm from "../../components/Property/EditProperty/EditTwelveForm";
import { property } from "../../api";
import { useCustomMutation } from "../../hooks/useApi";
import { CheckboxControl } from "../../components/FormElements/CheckboxControl";
import Breadcrumb from 'react-bootstrap/Breadcrumb';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Table from 'react-bootstrap/Table';
import Spinner from "../../components/Spinner";
import { updateOwnerProperty } from "../../api/admin/ownerInquiry";
import { toast } from 'react-toastify';
import { FormControl } from "../../components/FormElements/FormControl";
import { composeValidators, maxlength, minValue, validEmail, required, validLatitude, validLongitude } from "../../validations";
import approveICon from "../../assets/images/approve.svg";
import proImg from "../../assets/images/slider-image.png";
import proInfo from "../../assets/images/Info.svg";


import deleteIcon from "../../assets/images/remove-red-icon.svg";
import rejectIcon from "../../assets/images/close-icon-red.svg";
import tuserIcon from "../../assets/images/t-user-icon.svg";
import buildingIcon from "../../assets/images/building.svg";
import greenIcon from "../../assets/images/green-tick.svg";
import crossIcon from "../../assets/images/crossx.svg";
import plusIcon from "../../assets/images/Plus.svg";
import userIconImg from "../../assets/images/the-way-banner.jpg";
import editIcon from "../../assets/images/edit.svg";
import deleteIcon2 from "../../assets/images/trash.svg";

import plusGreen from "../../assets/images/plus-green.svg";

export default function OwnerEditProperty() {
    const [lastStep, setLastStep] = useState<any>(0);
    const [page, setPage] = useState(lastStep);
    const params = useParams();
    const [initData, setInitData] = useState<any>(EDIT_PROPERTY_INITDATA);
    const [loader, setLoader] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        setLoader(true);
        property.getPropertyById(params.propertyId).then((res: any) => {
            setInitData((prevState: any) => ({
                ...prevState,
                propertyDetails: res.data.attacheRentalProperty.propertyDetails,
                ownerGoals: res.data.attacheRentalProperty.ownerGoals ? res.data.attacheRentalProperty.ownerGoals : initData.ownerGoals,
                propertyDetailInfo: res.data.attacheRentalProperty.propertyDetailInfo ? res.data.attacheRentalProperty.propertyDetailInfo : initData.propertyDetailInfo,
                outsideSpace: res.data.attacheRentalProperty.outsideSpace ? res.data.attacheRentalProperty.outsideSpace : initData.outsideSpace,
                propertyInterior: res.data.attacheRentalProperty.propertyInterior ? res.data.attacheRentalProperty.propertyInterior : initData.propertyInterior,
                beds: res.data.attacheRentalProperty.beds ? res.data.attacheRentalProperty.beds : initData.beds,
                appliancesAndKitchenEquipment: res.data.attacheRentalProperty.appliancesAndKitchenEquipment ? res.data.attacheRentalProperty.appliancesAndKitchenEquipment : initData.appliancesAndKitchenEquipment,
                marketingAndAdministration: res.data.attacheRentalProperty.marketingAndAdministration ? res.data.attacheRentalProperty.marketingAndAdministration : initData.marketingAndAdministration,
                maintenanceAndOperation: res.data.attacheRentalProperty.maintenanceAndOperation ? res.data.attacheRentalProperty.maintenanceAndOperation : initData.maintenanceAndOperation,
                keys: res.data.attacheRentalProperty.keys ? res.data.attacheRentalProperty.keys : initData.keys,
                utilities: res.data.attacheRentalProperty.utilities ? res.data.attacheRentalProperty.utilities : initData.utilities,
                insurance: res.data.attacheRentalProperty.insurance ? res.data.attacheRentalProperty.insurance : initData.insurance,
                location: res.data?.location?.coordinates[0] ? {
                    latitude: res.data?.location?.coordinates[1],
                    longitude: res.data?.location?.coordinates[0]
                } : initData.location
            }));
            setLastStep(res.data?.lastStep ? res.data.lastStep : 1);
            setPage(res.data?.lastStep ? res.data.lastStep : 1);
            setLoader(false);
        });
    }, [])

    const { mutate } = useCustomMutation({
        mutationFn: updateOwnerProperty,
        onSuccess: () => {
            toast.success(`Property has been updated successfully!`)
            navigate(ROUTE_NAVIGATION_PATH.ADMIN_OWNER_PROPERTY_LIST)
        },
    });

    const onSubmit = (values: any) => {
        if (values.type == 'continue') {
            values.type = "";
            return;
        }

        if (values.propertyInterior) {
            if (values.propertyInterior.floorType && isArrayofObjects(values.propertyInterior.floorType)) {
                values.propertyInterior.floorType = values.propertyInterior?.floorType.map(
                    (item: { label: string; value: string }) => item.value
                );
            }
        }

        if (values.beds) {
            if (values.beds.bedAndMattressType && isArrayofObjects(values.beds.bedAndMattressType)) {
                values.beds.bedAndMattressType = values.beds.bedAndMattressType.map(
                    (item: { label: string; value: string }) => item.value
                );
            }
        }


        if (values.appliancesAndKitchenEquipment) {
            if (values.appliancesAndKitchenEquipment.kitchenEquipmentDesc && isArrayofObjects(values.appliancesAndKitchenEquipment.kitchenEquipmentDesc)) {
                values.appliancesAndKitchenEquipment.kitchenEquipmentDesc = values.appliancesAndKitchenEquipment.kitchenEquipmentDesc.map(
                    (item: { label: string; value: string }) => item.value
                );
            }
        }


        if (values.marketingAndAdministration) {
            if (values.marketingAndAdministration.sharedAmenitiesDesc && isArrayofObjects(values.marketingAndAdministration.sharedAmenitiesDesc)) {
                values.marketingAndAdministration.sharedAmenitiesDesc = values.marketingAndAdministration.sharedAmenitiesDesc.map(
                    (item: { label: string; value: string }) => item.value
                );
            }
        }

        let data = {
            attacheRentalProperty: values,
            propertyId: params.propertyId,
            lastStep: lastStep,
            location: {
                type: "Point",
                coordinates: [values.location.latitude, values.location.longitude]
            },
            approvalType: "accept"
        }

        if (data.attacheRentalProperty.propertyDetailInfo.floorsListingCount) {
            data.attacheRentalProperty.propertyDetailInfo.floorsListingCount = parseInt(data.attacheRentalProperty.propertyDetailInfo.floorsListingCount);
        }

        delete data.attacheRentalProperty.type;
        delete data.attacheRentalProperty.location;

        mutate(data);
    };

    function isArrayofObjects(arr: any) {
        // Check if arr is an array
        if (!Array.isArray(arr)) {
            return false;
        }

        // Check if every element in the array is an object
        return arr.every(item => typeof item === 'object' && item !== null);
    }

    return (
        <>

            {
                loader ?
                <div className="spinner-wrapper"> <Spinner /></div>
                    :
                    <div className="rental-portal-container" style={{ 'display': 'none' }}>
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
                                                    <EditFirstForm handleSubmit={handleSubmit} disabled={params.type === "edit" ? false : true} />

                                                    <EditSecondForm handleSubmit={handleSubmit} disabled={params.type === "edit" ? false : true} />

                                                    <EditThirdForm handleSubmit={handleSubmit} disabled={params.type === "edit" ? false : true} />

                                                    <EditFourthForm handleSubmit={handleSubmit} disabled={params.type === "edit" ? false : true} />

                                                    <EditFifthForm handleSubmit={handleSubmit} disabled={params.type === "edit" ? false : true} />

                                                    <EditSixthForm handleSubmit={handleSubmit} disabled={params.type === "edit" ? false : true} />

                                                    <EditSeventhForm handleSubmit={handleSubmit} kitchenEquipmentDesc={initData.appliancesAndKitchenEquipment.kitchenEquipmentDesc} disabled={params.type === "edit" ? false : true} />

                                                    <EditEighthForm handleSubmit={handleSubmit} tags={initData.marketingAndAdministration.highlightFeaturesDesc} disabled={params.type === "edit" ? false : true} />

                                                    <EditNinethForm handleSubmit={handleSubmit} disabled={params.type === "edit" ? false : true} />

                                                    <EditTenthForm handleSubmit={handleSubmit} disabled={params.type === "edit" ? false : true} />

                                                    <EditEleventhForm handleSubmit={handleSubmit} disabled={params.type === "edit" ? false : true} />

                                                    <EditTwelveForm handleSubmit={handleSubmit} disabled={params.type === "edit" ? false : true} />

                                                    <p className="edit-property-heading">
                                                        Location
                                                    </p>

                                                    <div className="row">
                                                        <div className="col-12 col-md-6">
                                                            <FormControl
                                                                label="Latitude*"
                                                                name="location.latitude"
                                                                type="text"
                                                                placeholder="Enter Latitude"
                                                                disabled={params.type === "edit" ? false : true}
                                                                validate={composeValidators(
                                                                    required,
                                                                    validLatitude
                                                                )}
                                                            />
                                                        </div>
                                                        <div className="col-12 col-md-6">
                                                            <FormControl
                                                                label="Longitude*"
                                                                name="location.longitude"
                                                                type="text"
                                                                placeholder="Enter Longitude"
                                                                disabled={params.type === "edit" ? false : true}
                                                                validate={composeValidators(
                                                                    required,
                                                                    validLongitude
                                                                )}
                                                            />
                                                        </div>
                                                    </div>

                                                    {
                                                        params.type === "edit" ?
                                                            <div className="action-btn-wrapper fixed-bottom ">
                                                                <div className="action-btns oi-action-btn fixwidth">
                                                                    <div className="Continuewrapper">
                                                                        <Button type="submit" className="btn primary minwdth">
                                                                            SUBMIT
                                                                        </Button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            :
                                                            null
                                                    }

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
