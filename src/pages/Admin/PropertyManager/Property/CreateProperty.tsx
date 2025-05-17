import React, { useState, useEffect, useRef } from "react";
import { ADMIN_PROPERTY_DATA } from "../../../../constants";
import { Form } from "react-final-form";
import { ROUTE_NAVIGATION_PATH } from "../../../../routes/routes";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useCustomMutation } from "../../../../hooks/useApi";
import Breadcrumb from 'react-bootstrap/Breadcrumb';
import { toast } from 'react-toastify';
import GeneralProperty from "../../../../components/AdminProperty/GeneralProperty";
import PropertyStatus from "../../../../components/AdminProperty/PropertyStatus";
import PropertyAddress from "../../../../components/AdminProperty/PropertyAddress";
import Accessibility from "../../../../components/AdminProperty/Accessiblity";
import Features from "../../../../components/AdminProperty/Features";
import PropertyDetails from "../../../../components/AdminProperty/PropertyDetails";
import TaxInformation from "../../../../components/AdminProperty/TaxInformation";
import Opeartions from "../../../../components/AdminProperty/Operations";
import { createProperty } from "../../../../api/admin/property";
import moment from "moment";
import { AxiosError } from "axios";
import { Spinner } from "react-bootstrap";

type JsonObject = { [key: string]: any };

export default function CreateProperty() {
    const [initData, setInitData] = useState<any>(ADMIN_PROPERTY_DATA);
    const [description, setDescription] = useState("");
    const [managedNote, setManagedNote] = useState("");
    const [multipleOwnersId, setMultipleOwnersId] = useState<any>([]);
    const params = useParams();
    const [loader, setLoader] = useState(false);
    const navigate = useNavigate();
    const handleSubmitRef = useRef<() => void>(() => { }); // Create a ref to store the handleSubmit function
    const [activeTab, setActiveTab] = useState<any>('');

    const { mutate } = useCustomMutation({
        mutationFn: (req: any) => {
            setLoader(true);
            return createProperty(req);
        },
        onSuccess: () => {
            setLoader(true);
            toast.success(`Property has been created successfully!`)
            navigate(ROUTE_NAVIGATION_PATH.ADMIN_OWNER_PROPERTY_LIST + '?activeTab=' + activeTab + '&type=' + params.type)
        },
        onError: (error: AxiosError<{ message: string; status: number, code: number }>) => {
            setLoader(false);
        },
    });

    const submitForm = () => {
        if (handleSubmitRef.current) {
            handleSubmitRef.current(); // Programmatically trigger form submission
        }
    };

    const onSubmit = (values: any) => {
        const data: any = { ...values }
        data.generalInfo.description = description ? description : "";
        data.generalInfo.minimumStayRequired = values.generalInfo.minimumStayRequired ? Number(values.generalInfo.minimumStayRequired) : null;
        data.generalInfo.availableFrom = data.generalInfo.availableFrom ? moment(data.generalInfo.availableFrom).format('YYYY-MM-DD hh:mm A') : null;
        data.generalInfo.availableUntil = data.generalInfo.availableUntil ? moment(data.generalInfo.availableUntil).format('YYYY-MM-DD hh:mm A') : null;

        data.propertyStatus.managedNote = managedNote ? managedNote : "";
        data.propertyStatus.managedStatus = values.propertyStatus.managedStatus && values.propertyStatus.managedStatus.value ? values.propertyStatus.managedStatus.value : initData.propertyStatus.managedStatus;
        data.propertyStatus.ownerId = values.propertyStatus.ownerId && values.propertyStatus.ownerId.value ? values.propertyStatus.ownerId.value : initData.propertyStatus.ownerId;
        data.propertyStatus.leasingManagerId = values.propertyStatus.leasingManagerId && values.propertyStatus.leasingManagerId.value ? values.propertyStatus.leasingManagerId.value : initData.propertyStatus.leasingManagerId;
        if (multipleOwnersId && multipleOwnersId.length > 0) {
            data.propertyStatus.multipleOwnersId = multipleOwnersId
        }

        data.propertyStatus.birthday = values.propertyStatus.birthday ? moment(values.propertyStatus.birthday).format('YYYY-MM-DD hh:mm A') : null;
        data.propertyStatus.dailyRate = values.propertyStatus.dailyRate ? parseFloat(values.propertyStatus.dailyRate) : 0;
        data.propertyStatus.annualDailyRate = values.propertyStatus.annualDailyRate ? parseFloat(values.propertyStatus.annualDailyRate) : 0;
        data.propertyStatus.floorRate = values.propertyStatus.floorRate ? parseFloat(values.propertyStatus.floorRate) : 0;
        data.propertyStatus.monthlyRate = values.propertyStatus.monthlyRate ? parseFloat(values.propertyStatus.monthlyRate) : 0;
        data.propertyStatus.managementFees = values.propertyStatus.managementFees ? parseFloat(values.propertyStatus.managementFees) : null;

        data.propertyAddress.region = values.propertyAddress.region && values.propertyAddress.region.value ? values.propertyAddress.region.value : initData.propertyAddress.region;
        data.propertyAddress.directionality = values.propertyAddress.directionality && values.propertyAddress.directionality.value ? values.propertyAddress.directionality.value : initData.propertyAddress.directionality;
        data.propertyAddress.neighborhoodId = values.propertyAddress.neighborhoodId && values.propertyAddress.neighborhoodId.value ? values.propertyAddress.neighborhoodId.value : initData.propertyAddress.neighborhoodId;
        data.propertyAddress.buildingId = values.propertyAddress.buildingId && values.propertyAddress.buildingId.value ? values.propertyAddress.buildingId.value : initData.propertyAddress.buildingId;
        data.propertyAddress.stateCode = values.propertyAddress.stateCode && values.propertyAddress.stateCode.value ? values.propertyAddress.stateCode.value : initData.propertyAddress.stateCode;
        data.propertyAddress.country = values.propertyAddress.country && values.propertyAddress.country.value ? values.propertyAddress.country.value : initData.propertyAddress.country;
        data.propertyAddress.latitude = data.latitude ? parseFloat(data.propertyAddress.latitude) : 0;
        data.propertyAddress.longitude = data.longitude ? parseFloat(data.propertyAddress.longitude) : 0;

        data.propertyDetails.fullBedrooms = values.propertyDetails.fullBedrooms && values.propertyDetails.fullBedrooms.value ? values.propertyDetails.fullBedrooms.value : initData.propertyDetails.fullBedrooms;
        data.propertyDetails.fullBathrooms = values.propertyDetails.fullBathrooms && values.propertyDetails.fullBathrooms.value ? values.propertyDetails.fullBathrooms.value : initData.propertyDetails.fullBathrooms;
        data.propertyDetails.halfBathrooms = values.propertyDetails.halfBathrooms && values.propertyDetails.halfBathrooms.value ? values.propertyDetails.halfBathrooms.value : initData.propertyDetails.halfBathrooms;

        if (values?.features.amenities && values.features.amenities.length > 0) {
            data.features.amenities = values.features.amenities.map((item: any) => item.value)
        } else {
            delete data.features;
        }

        data.operations.guestServicesId = values.operations.guestServicesId && values.operations.guestServicesId.value ? values.operations.guestServicesId.value : initData.operations.guestServicesId;
        data.operations.opsManagerId = values.operations.opsManagerId && values.operations.opsManagerId.value ? values.operations.opsManagerId.value : initData.operations.opsManagerId;

        let cleanedData = deepClean(data);
        cleanedData = Object.fromEntries(
            Object.entries(cleanedData).filter(([key]) => !key.startsWith("Email-"))
        );
        cleanedData = removeEmptyObjects(cleanedData)

        mutate(cleanedData);
    };


    const removeEmptyObjects = (obj: any): any => {
        if (Array.isArray(obj)) {
            return obj.map(removeEmptyObjects);
        } else if (typeof obj === "object" && obj !== null) {
            return Object.entries(obj).reduce((acc: JsonObject, [key, value]) => {
                const cleanedValue = removeEmptyObjects(value);

                // Check if the cleanedValue is an empty object
                if (typeof cleanedValue === "object" && cleanedValue !== null && Object.keys(cleanedValue).length === 0) {
                    return acc; // Skip empty objects
                }

                // Otherwise, add it to the accumulated object
                acc[key] = cleanedValue;
                return acc;
            }, {});
        }

        return obj; // Return the value if it's not an object or array
    };



    useEffect(() => {
        let tabDetails = params.type == '1' ? 'currentActive' : (params.type == '3' ? 'onLease' : (params.type == '2' ? 'available' : 'allProperties'));
        setActiveTab(tabDetails);
        setLoader(false);
    }, [activeTab])


    const handleUpdate = (newAbout: any) => {
        setDescription(newAbout); // Update the parent's state
    };

    const handleNoteUpdate = (newAbout: any, owners: any) => {
        setManagedNote(newAbout); // Update the parent's state
        if (owners && owners.length > 0) {
            setMultipleOwnersId(owners.map((item: any) => item.value));
        }
        //setMultipleOwnersId(owners);
    };

    return (
        <>

            <div className="common-right-panel-section">
                <div className="top-right-bar">
                    <Breadcrumb>
                        <Breadcrumb.Item href="#">Property Manager</Breadcrumb.Item>
                        <Breadcrumb.Item href="#">Properties</Breadcrumb.Item>
                        <Breadcrumb.Item href={ROUTE_NAVIGATION_PATH.ADMIN_OWNER_PROPERTY_LIST + '?activeTab=' + activeTab + '&type=' + params.type}>{params.type == '1' ? 'Active Property' : params.type == '2' ? 'Available Properties' : params.type == '3' ? 'On Lease Properties' : 'All Properties'}</Breadcrumb.Item>
                        <Breadcrumb.Item active>Create Property</Breadcrumb.Item>
                    </Breadcrumb>
                    <div className="guest-header">
                        <div className="guest-left">
                            <h1>Create Property</h1>
                        </div>
                        <div className="guest-right">
                            <Link to={ROUTE_NAVIGATION_PATH.ADMIN_OWNER_PROPERTY_LIST + '?activeTab=' + activeTab + '&type=' + params.type}>
                                <button className="btn-delete">Cancel</button>
                            </Link>
                            <button className="btn-primary" onClick={submitForm}>Create Property</button>

                        </div>
                    </div>

                </div>
                <>
                    {loader ? <div className="spinner-wrapper"><Spinner /></div> : null}
                </>

                <div className="guest-general-information scrollbar">
                    <Form
                        initialValues={initData}
                        onSubmit={onSubmit}
                        keepDirtyOnReinitialize
                        render={({ handleSubmit, values }) => {
                            // Store the handleSubmit function in the ref so it can be called later
                            handleSubmitRef.current = handleSubmit;
                            return (
                                <form onSubmit={handleSubmit}>
                                    <div className="info-wrapper info-wrapper-multiple">
                                        <div className="infoleft">
                                            <h2>General Information</h2>
                                        </div>
                                        <div className="info-right">
                                            <GeneralProperty handleSubmit={handleUpdate} />
                                        </div>
                                    </div>
                                    <div className="info-wrapper info-wrapper-multiple">
                                        <div className="infoleft">
                                            <h2>Property Status</h2>
                                        </div>
                                        <div className="info-right">
                                            <PropertyStatus initialValues={initData} handleSubmit={handleNoteUpdate}
                                                onChange={(updatedValues: any) => setInitData((prevState: any) => ({
                                                    ...prevState,
                                                    ...updatedValues, // Spread the previous state and apply updates
                                                }))
                                            }
                                               
                                            />
                                        </div>
                                    </div>
                                    <div className="info-wrapper info-wrapper-multiple">
                                        <div className="infoleft">
                                            <h2>Property Address</h2>
                                        </div>
                                        <div className="info-right">
                                            <PropertyAddress initialValues={initData} onChange={(updatedValues: any) => setInitData((prevState: any) => ({
                                                ...prevState,
                                                ...updatedValues, // Spread the previous state and apply updates
                                            }))} />
                                        </div>
                                    </div>
                                    <div className="info-wrapper info-wrapper-multiple">
                                        <div className="infoleft">
                                            <h2>Property Details</h2>
                                        </div>
                                        <div className="info-right">
                                            <PropertyDetails initialValues={initData} onChange={(updatedValues: any) => setInitData((prevState: any) => ({
                                                ...prevState,
                                                ...updatedValues, // Spread the previous state and apply updates
                                            }))} />
                                        </div>
                                    </div>
                                    <div className="info-wrapper info-wrapper-multiple">
                                        <div className="infoleft">
                                            <h2>Accessibility</h2>
                                        </div>
                                        <div className="info-right">
                                            <Accessibility />
                                        </div>
                                    </div>
                                    <div className="info-wrapper info-wrapper-multiple">
                                        <div className="infoleft">
                                            <h2>Features</h2>
                                        </div>
                                        <div className="info-right">
                                            <Features onChange={(updatedValues: any) => setInitData((prevState: any) => ({
                                                ...prevState,
                                                ...updatedValues, // Spread the previous state and apply updates
                                            }))} />
                                        </div>
                                    </div>
                                    <div className="info-wrapper info-wrapper-multiple">
                                        <div className="infoleft">
                                            <h2>Tax Information</h2>
                                        </div>
                                        <div className="info-right">
                                            <TaxInformation />
                                        </div>
                                    </div>
                                    <div className="info-wrapper info-wrapper-multiple">
                                        <div className="infoleft">
                                            <h2>Operations</h2>
                                        </div>
                                        <div className="info-right">

                                            <Opeartions initialValues={initData} onChange={(updatedValues: any) => setInitData((prevState: any) => ({
                                                ...prevState,
                                                ...updatedValues, // Spread the previous state and apply updates
                                            }))} />
                                        </div>
                                    </div>
                                </form>
                            );
                        }}
                    />
                </div>
            </div>



        </>
    );
}


function deepClean(obj: any): any {
    if (Array.isArray(obj)) {
        // Recursively clean arrays and filter out unwanted values
        return obj
            .map(deepClean)
            .filter((item) => item !== null && item !== "" && item !== 0);
    } else if (typeof obj === 'object' && obj !== null) {
        // Recursively clean objects
        return Object.entries(obj).reduce((acc, [key, value]) => {
            const cleanedValue = deepClean(value);
            if (cleanedValue !== null && cleanedValue !== "" && cleanedValue !== 0) {
                acc[key] = cleanedValue;
            }
            return acc;
        }, {} as Record<string, any>);
    }
    // Return the value as is for other data types
    return obj;
}
