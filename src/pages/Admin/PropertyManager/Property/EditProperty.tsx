import React, { useState, useEffect, useRef, ChangeEvent } from "react";
import { ADMIN_EDIT_PROPERTY_DATA, FILE_SIZE, MAX_FILE_SIZE, MESSAGES } from "../../../../constants";
import { Form } from "react-final-form";
import { ROUTE_NAVIGATION_PATH } from "../../../../routes/routes";
import { useNavigate, useParams } from "react-router-dom";
import { useCustomMutation } from "../../../../hooks/useApi";
import Breadcrumb from 'react-bootstrap/Breadcrumb';
import { toast } from 'react-toastify';
import placeHolder from "../../../../assets/images/ph400x500.png";
import moment from "moment";
import plusIcon from "../../../../assets/images/Plus.svg";
import { deletePropertyImage, propertyDetails, propertyImages, updateImageOrder, updateProperty, uploadPropertyImage } from "../../../../api/admin/property";
import GeneralProperty from "../../../../components/AdminProperty/GeneralProperty";
import PropertyStatus from "../../../../components/AdminProperty/PropertyStatus";
import PropertyAddress from "../../../../components/AdminProperty/PropertyAddress";
import PropertyDetails from "../../../../components/AdminProperty/PropertyDetails";
import Accessibility from "../../../../components/AdminProperty/Accessiblity";
import Features from "../../../../components/AdminProperty/Features";
import TaxInformation from "../../../../components/AdminProperty/TaxInformation";
import Opeartions from "../../../../components/AdminProperty/Operations";
import { Spinner } from "react-bootstrap";
import OwnerGoals from "../../../../components/AdminProperty/OwnerGoals";
import { capitalizeFirstWord, formatPhoneNumber } from "../../../../utils/common";
import OutsideSpace from "../../../../components/AdminProperty/OutsideSpace";
import RoofArea from "../../../../components/AdminProperty/RoofArea";
import PropertyInterior from "../../../../components/AdminProperty/PropertyInterior";
import BedsInfo from "../../../../components/AdminProperty/BedsInfo";
import AppliancesAndKitchen from "../../../../components/AdminProperty/AppliancesAndKitchen";
import MarketingInfo from "../../../../components/AdminProperty/MarketingInfo";
import MaintenanceInfo from "../../../../components/AdminProperty/MaintenanceInfo";
import KeysInfo from "../../../../components/AdminProperty/KeysInfo";
import UtilityInfo from "../../../../components/AdminProperty/UtilityInfo";
import InsuranceInfo from "../../../../components/AdminProperty/InsuranceInfo";
import crossIcon from "../../../../assets/images/crossx.svg";
import OnwerDetailsModel from "../../../../components/Modal/OwnersDetailModel";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { AxiosError } from "axios";

type JsonObject = { [key: string]: any };
const ACCEPT_TYPE = [
    "image/png",
    "image/jpeg",
    "image/jpg",
];

export default function UpdateProperty() {
    const [initData, setInitData] = useState<any>(ADMIN_EDIT_PROPERTY_DATA);
    const [description, setDescription] = useState("");
    const [managedNote, setManagedNote] = useState("");
    const [onwerDetails, setOnwerDetails] = useState<any>({});
    const [multipleOwnersId, setMultipleOwnersId] = useState<any>([]);
    const params = useParams();
    const [loader, setLoader] = useState(true);
    const [spinner, setSpiner] = useState(false);
    const [imageSpinner, setImageSpiner] = useState(false);
    const [images, setImages] = useState<any>([]);
    const [errorMsg, setErrorMsg] = useState('');
    const navigate = useNavigate();
    const handleSubmitRef = useRef<() => void>(() => { }); // Create a ref to store the handleSubmit function
    const [activeTab, setActiveTab] = useState<any>('');
    const [activeSection, setActiveSection] = useState("section1");
    const effectRan = useRef(false);
    const [extraDetailMessage, setExtraDetailMessage] = useState("");
    const [showMoreOwners, setShowMoreOwners] = useState(false);
    const [allOnwers, setAllOwners] = useState<any>([]);
    const [res, setRes] = useState<any>({});
    const fromLease= new URLSearchParams(document.location.search).get('fromLease');

    // Explicitly define ref types
    const sectionsRef: {
        [key: string]: React.MutableRefObject<HTMLDivElement | null>;
    } = {
        section1: useRef<HTMLDivElement | null>(null),
        section2: useRef<HTMLDivElement | null>(null),
        section3: useRef<HTMLDivElement | null>(null),
        section4: useRef<HTMLDivElement | null>(null),
        section5: useRef<HTMLDivElement | null>(null),
        section6: useRef<HTMLDivElement | null>(null),
        section7: useRef<HTMLDivElement | null>(null),
        section8: useRef<HTMLDivElement | null>(null),
        section9: useRef<HTMLDivElement | null>(null),
        section10: useRef<HTMLDivElement | null>(null),
        section11: useRef<HTMLDivElement | null>(null),
        section12: useRef<HTMLDivElement | null>(null),
        section13: useRef<HTMLDivElement | null>(null),
        section14: useRef<HTMLDivElement | null>(null),
        section15: useRef<HTMLDivElement | null>(null),
        section16: useRef<HTMLDivElement | null>(null),
        section17: useRef<HTMLDivElement | null>(null),
        section18: useRef<HTMLDivElement | null>(null),
        section19: useRef<HTMLDivElement | null>(null),
        section20: useRef<HTMLDivElement | null>(null),
    };

    useEffect(() => {
        if (!effectRan.current) {
            propertyDetails(params.id).then((res: any) => {
                setRes(res.data);
                setInitData((prevState: any) => ({
                    ...prevState,
                    generalInfo: {
                        ...prevState.generalInfo, // Spread the existing propertyDetails
                        ...(res.data.generalInfo || {}), // Spread res.data.propertyDetails if it exists
                        available: res.data.generalInfo.available ? moment(res.data.generalInfo.available, 'YYYY-MM-DD hh:mm A').toDate() : null,
                        availableFrom: res.data.generalInfo.availableFrom ? moment(res.data.generalInfo.availableFrom, 'YYYY-MM-DD hh:mm A').toDate() : null,
                        availableUntil: res.data.generalInfo.availableUntil ? moment(res.data.generalInfo.availableUntil, 'YYYY-MM-DD hh:mm A').toDate() : null,
                    },
                    propertyStatus: {
                        ...prevState.propertyStatus, // Spread the existing propertyDetails
                        ...(res.data.propertyStatus || {}), // Spread res.data.propertyDetails if it exists
                        birthday: res.data.propertyStatus.birthday ? moment(res.data.propertyStatus.birthday, 'YYYY-MM-DD hh:mm A').toDate() : null,
                        lastCleaning: res.data.propertyStatus.lastCleaning ? moment(res.data.propertyStatus.lastCleaning, 'YYYY-MM-DD hh:mm A').toDate() : null,
                        lastQC: res.data.propertyStatus.lastQC ? moment(res.data.propertyStatus.lastQC, 'YYYY-MM-DD hh:mm A').toDate() : null,
                        managedStatus: res.data.propertyStatus.managedStatus ? res.data.propertyStatus.managedStatus : 2
                    },
                    propertyAddress: {
                        ...prevState.propertyAddress, // Spread the existing propertyDetails
                        ...(res.data.propertyAddress || {}), // Spread res.data.propertyDetails if it exists
                        
                        latitude: res.data.propertyAddress.latitude && res.data.propertyAddress.latitude !== 0 ? res.data.propertyAddress.latitude : null,
                        longitude: res.data.propertyAddress.longitude && res.data.propertyAddress.longitude !== 0 ? res.data.propertyAddress.longitude : null
                    },
                    propertyDetails: {
                        ...prevState.propertyDetails, // Spread the existing propertyDetails
                        ...(res.data.propertyDetails || {}), // Spread res.data.propertyDetails if it exists
                        isBedroomsWithoutBed: res.data.propertyDetails.isBedroomsWithoutBed ? res.data.propertyDetails.isBedroomsWithoutBed : 'No',
                        isPropertyDenOrStudy: res.data.propertyDetails.isPropertyDenOrStudy ? res.data.propertyDetails.isPropertyDenOrStudy : 'No', // Update only the hasParking field
                        isBathroomsHaveBathtub: res.data.propertyDetails.isBathroomsHaveBathtub ? res.data.propertyDetails.isBathroomsHaveBathtub : 'No', // Update only the hasParking field
                        isStairCaseAvailable: res.data.propertyDetails.isStairCaseAvailable ? res.data.propertyDetails.isStairCaseAvailable : 'No', // Update only the hasParking field
                        petRestrictions: res.data.propertyDetails.petRestrictions ? res.data.propertyDetails.petRestrictions : 'No', // Update only the hasParking field
                    },
                    accessibility: res.data.accessibility ? res.data.accessibility : initData.accessibility,
                    features: {
                        amenities: res.data.features.amenities && res.data.features.amenities.length > 0 ? res.data.features.amenities : null,
                    },
                    taxInfo: res.data.taxInfo ? res.data.taxInfo : initData.taxInfo,
                    operations: res.data.operations ? res.data.operations : initData.operations,
                    ownerGoalsInfo: {
                        ...prevState.ownerGoalsInfo, // Spread the existing propertyDetails
                        ...(res.data.ownerGoalsInfo || {}), // Spread res.data.propertyDetails if it exists
                        lockedClosetPropertyBelongings: res.data.ownerGoalsInfo.lockedClosetPropertyBelongings ? res.data.ownerGoalsInfo.lockedClosetPropertyBelongings : 'No',
                    },
                    outsideInfo: {
                        ...prevState.outsideInfo, // Spread the existing propertyDetails
                        ...(res.data.outsideInfo || {}),
                        isYardOrOutsideAreaAvailable: res.data.outsideInfo.isYardOrOutsideAreaAvailable ? res.data.outsideInfo.isYardOrOutsideAreaAvailable : "No",
                        isOutsideAreaMaintainedByGardener: res.data.outsideInfo.isOutsideAreaMaintainedByGardener ? res.data.outsideInfo.isOutsideAreaMaintainedByGardener : "No",
                        isPropertyHavingBalcony: res.data.outsideInfo.isPropertyHavingBalcony ? res.data.outsideInfo.isPropertyHavingBalcony : "No",
                        isPropertyHavingOutdoorFurniture: res.data.outsideInfo.isPropertyHavingOutdoorFurniture ? res.data.outsideInfo.isPropertyHavingOutdoorFurniture : "No",
                        isOutdoorFurnitureWinterize: res.data.outsideInfo.isOutdoorFurnitureWinterize ? res.data.outsideInfo.isOutdoorFurnitureWinterize : "No",
                        isHomeNeededToWinterize: res.data.outsideInfo.isHomeNeededToWinterize ? res.data.outsideInfo.isHomeNeededToWinterize : "No",
                        isLockedStorageOutsideUnit: res.data.outsideInfo.isLockedStorageOutsideUnit ? res.data.outsideInfo.isLockedStorageOutsideUnit : "No",
                    },
                    roofAreaInfo: {
                        isRoofManaged: res.data.roofAreaInfo.isRoofManaged ? res.data.roofAreaInfo.isRoofManaged : "No",
                        isGreenSpaceAreaAvailable: res.data.roofAreaInfo.isGreenSpaceAreaAvailable ? res.data.roofAreaInfo.isGreenSpaceAreaAvailable : "No",
                        isRoofShared: res.data.roofAreaInfo.isRoofShared ? res.data.roofAreaInfo.isRoofShared : "No"
                    },
                    propertyInterior: {
                        ...prevState.propertyInterior, // Spread the existing propertyDetails
                        ...(res.data.propertyInterior || {}),
                        isPlanningToRefreshFurnishing: res.data.propertyInterior.isPlanningToRefreshFurnishing ? res.data.propertyInterior.isPlanningToRefreshFurnishing : "No",
                        isMasterBedroomEnSuiteBathroom: res.data.propertyInterior.isMasterBedroomEnSuiteBathroom ? res.data.propertyInterior.isMasterBedroomEnSuiteBathroom : "No",
                        isMoreThanOneEnSuite: res.data.propertyInterior.isMoreThanOneEnSuite ? res.data.propertyInterior.isMoreThanOneEnSuite : "No",
                        isDaybedPullOutBedOrSofaSpace: res.data.propertyInterior.isDaybedPullOutBedOrSofaSpace ? res.data.propertyInterior.isDaybedPullOutBedOrSofaSpace : "No",
                        isPropertyWithBlinds: res.data.propertyInterior.isPropertyWithBlinds ? res.data.propertyInterior.isPropertyWithBlinds : "No",
                        isPropertyWithFireplace: res.data.propertyInterior.isPropertyWithFireplace ? res.data.propertyInterior.isPropertyWithFireplace : "No",
                    },
                    bedsInfo: {
                        ...prevState.bedsInfo, // Spread the existing propertyDetails
                        ...(res.data.bedsInfo || {}),
                        isBedFramesHeadboards: res.data.bedsInfo.isBedFramesHeadboards ? res.data.bedsInfo.isBedFramesHeadboards : "No",
                    },
                    applianceInfo: {
                        ...prevState.applianceInfo, // Spread the existing propertyDetails
                        ...(res.data.applianceInfo || {}),
                        isPropertyWithHDTVs: res.data.applianceInfo.isPropertyWithHDTVs ? res.data.applianceInfo.isPropertyWithHDTVs : "No",
                    },
                    marketingInfo: {
                        ...prevState.marketingInfo, // Spread the existing propertyDetails
                        ...(res.data.marketingInfo || {}),
                        isBusinessLicense: res.data.marketingInfo.isBusinessLicense ? res.data.marketingInfo.isBusinessLicense : "No",
                        isAssistanceRequiredForBusinessLicense: res.data.marketingInfo.isAssistanceRequiredForBusinessLicense ? res.data.marketingInfo.isAssistanceRequiredForBusinessLicense : "No",
                        isSecurePackageAcceptance: res.data.marketingInfo.isSecurePackageAcceptance ? res.data.marketingInfo.isSecurePackageAcceptance : "No",
                        isFloorPlanAvailable: res.data.marketingInfo.isFloorPlanAvailable ? res.data.marketingInfo.isFloorPlanAvailable : "No",
                        isFloorAssistanceRequired: res.data.marketingInfo.isFloorAssistanceRequired ? res.data.marketingInfo.isFloorAssistanceRequired : "No"
                    },
                    maintenanceInfo: {
                        ...prevState.maintenanceInfo, // Spread the existing propertyDetails
                        ...(res.data.maintenanceInfo || {}),
                        isKeyRequiredToAccessTrash: res.data.maintenanceInfo.isKeyRequiredToAccessTrash ? res.data.maintenanceInfo.isKeyRequiredToAccessTrash : 'No',
                        buildingOrPropertyAccessInfoDesc: res.data.maintenanceInfo.buildingOrPropertyAccessInfoDesc ? res.data.maintenanceInfo.buildingOrPropertyAccessInfoDesc : 'No'
                    },
                    keysInfo: {
                        ...prevState.keysInfo, // Spread the existing propertyDetails
                        ...(res.data.keysInfo || {}),
                        isKeyRequiredToAccessBuilding: res.data.keysInfo.isKeyRequiredToAccessBuilding ? res.data.keysInfo.isKeyRequiredToAccessBuilding : 'No',
                        isGarageDoorOpener: res.data.keysInfo.isGarageDoorOpener ? res.data.keysInfo.isGarageDoorOpener : "No",
                        isKeyRequiredToAccessMailBox: res.data.keysInfo.isKeyRequiredToAccessMailBox ? res.data.keysInfo.isKeyRequiredToAccessMailBox : "No"
                    },
                    insuranceInfo: {
                        ...prevState.insuranceInfo, // Spread the existing propertyDetails
                        ...(res.data.insuranceInfo || {}),
                        isHomeOrBuildingInsurance: res.data.insuranceInfo.isHomeOrBuildingInsurance ? res.data.insuranceInfo.isHomeOrBuildingInsurance : "No",
                        isContentInsuranceAvailable: res.data.insuranceInfo.isContentInsuranceAvailable ? res.data.insuranceInfo.isContentInsuranceAvailable : "No",
                        isInsuranceContentRequiredBeforeAnyRepair: res.data.insuranceInfo.isInsuranceContentRequiredBeforeAnyRepair ? res.data.insuranceInfo.isInsuranceContentRequiredBeforeAnyRepair : "No",
                        isContentRequireByAttachToInsurer: res.data.insuranceInfo.isContentRequireByAttachToInsurer ? res.data.insuranceInfo.isContentRequireByAttachToInsurer : "No",
                    },
                    utilityInfo: res.data.utilityInfo ? res.data.utilityInfo : initData.utilityInfo,
                }));
                setMultipleOwnersId(res.data.propertyStatus.multipleOwnersId && res.data.propertyStatus.multipleOwnersId.length > 0 ? res.data.propertyStatus.multipleOwnersId : [])
                setDescription(res.data.generalInfo.description ? res.data.generalInfo.description : null);
                setManagedNote(res.data.propertyStatus.managedNote ? res.data.propertyStatus.managedNote : null);
                setOnwerDetails(res.data.propertyStatus.ownerInfo)
                let owners = res.data.propertyStatus.ownerInfo ? [res.data.propertyStatus.ownerInfo] : [];
                let multiOwners = res.data.propertyStatus.multipleOwnerInfo ? res.data.propertyStatus.multipleOwnerInfo : [];
                setAllOwners(owners.concat(multiOwners));
                setLoader(false);

            });
            getImages()
        }
        return () => {
            effectRan.current = true;
        };

    }, [])

    function getImages() {
        propertyImages(params.id).then((res: any) => {
            setImages(res.data);
            setImageSpiner(false);
            setSpiner(false);
        });
    }

    const { mutate } = useCustomMutation({
        mutationFn: (req: any) => {
            setSpiner(true);
            return updateProperty(params.id, req);
        },
        onSuccess: () => {
            setSpiner(false);
            toast.success(`Property details has been be updated successfully!`)
            navigate(ROUTE_NAVIGATION_PATH.ADMIN_OWNER_PROPERTY_LIST + '?activeTab=' + activeTab + '&type=' + params.type)
        },
        onError: (error: AxiosError<{ message: string; status: number, code: number }>) => {
      
            setSpiner(false);
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
        
        if (values.propertyStatus.managedStatus) {
            data.propertyStatus.managedStatus = (values.propertyStatus.managedStatus.value ? values.propertyStatus.managedStatus.value : values.propertyStatus.managedStatus)
        }
        if (values.propertyStatus.ownerId) {
            data.propertyStatus.ownerId = values.propertyStatus.ownerId.value ? values.propertyStatus.ownerId.value : values.propertyStatus.ownerId
        }
        if (values.propertyStatus.leasingManagerId) {
            data.propertyStatus.leasingManagerId = values.propertyStatus.leasingManagerId.value ? values.propertyStatus.leasingManagerId.value : values.propertyStatus.leasingManagerId
        }
        if (multipleOwnersId && multipleOwnersId.length > 0) {
            data.propertyStatus.multipleOwnersId = multipleOwnersId.map((item: any) => item.value)
        }
        if (values.propertyStatus.lastQCBy) {
            data.propertyStatus.lastQCBy = values.propertyStatus.lastQCBy.value ? values.propertyStatus.lastQCBy.value : values.propertyStatus.lastQCBy
        }
        if (values.propertyStatus.assetTier) {
            data.propertyStatus.assetTier = values.propertyStatus.assetTier.value ? values.propertyStatus.assetTier.value : values.propertyStatus.assetTier;
        }
       
       
        data.propertyStatus.birthday = values.propertyStatus.birthday ? moment(values.propertyStatus.birthday).format('YYYY-MM-DD hh:mm A') : null;
        data.propertyStatus.lastCleaning = values.propertyStatus.lastCleaning ? moment(values.propertyStatus.lastCleaning).format('YYYY-MM-DD hh:mm A') : null;
        data.propertyStatus.lastQC = values.propertyStatus.lastQC ? moment(values.propertyStatus.lastQC).format('YYYY-MM-DD hh:mm A') : null;
        data.propertyStatus.dailyRate = values.propertyStatus.dailyRate ? parseFloat(values.propertyStatus.dailyRate) : 0;
        data.propertyStatus.annualDailyRate = values.propertyStatus.annualDailyRate ? parseFloat(values.propertyStatus.annualDailyRate) : 0;
        data.propertyStatus.floorRate = values.propertyStatus.floorRate ? parseFloat(values.propertyStatus.floorRate) : 0;
        data.propertyStatus.monthlyRate = values.propertyStatus.monthlyRate ? parseFloat(values.propertyStatus.monthlyRate) : 0;
        data.propertyStatus.managementFees = values.propertyStatus.managementFees ? parseFloat(values.propertyStatus.managementFees) : 0;
        data.propertyAddress.region = values.propertyAddress.region ? (values.propertyAddress.region.value ? values.propertyAddress.region.value : values.propertyAddress.region) : null;
        data.propertyAddress.directionality = values.propertyAddress.directionality ? (values.propertyAddress.directionality.value ? values.propertyAddress.directionality.value : values.propertyAddress.directionality) : null;
        data.propertyAddress.neighborhoodId = values.propertyAddress.neighborhoodId ? (values.propertyAddress.neighborhoodId.value ? values.propertyAddress.neighborhoodId.value : values.propertyAddress.neighborhoodId) : null;
        if (data.propertyAddress.buildingId) {
            data.propertyAddress.buildingId = values.propertyAddress.buildingId.value ? values.propertyAddress.buildingId.value : values.propertyAddress.buildingId;

        }
        data.propertyAddress.stateCode = values.propertyAddress.stateCode ? (values.propertyAddress.stateCode.value ? values.propertyAddress.stateCode.value : values.propertyAddress.stateCode) : null;
        data.propertyAddress.country = values.propertyAddress.country ? (values.propertyAddress.country.value ? values.propertyAddress.country.value : values.propertyAddress.country) : null;
        data.propertyAddress.latitude =  values.propertyAddress.latitude? parseFloat(data.propertyAddress.latitude) : null;
        data.propertyAddress.longitude = values.propertyAddress.longitude ? parseFloat(data.propertyAddress.longitude) : null;

        data.propertyDetails.fullBedrooms = values.propertyDetails.fullBedrooms ? (values.propertyDetails.fullBedrooms.value ? values.propertyDetails.fullBedrooms.value : values.propertyDetails.fullBedrooms) : null;
        data.propertyDetails.fullBathrooms = values.propertyDetails.fullBathrooms ? (values.propertyDetails.fullBathrooms.value ? values.propertyDetails.fullBathrooms.value : values.propertyDetails.fullBathrooms) : null;
        data.propertyDetails.halfBathrooms = values.propertyDetails.halfBathrooms ? (values.propertyDetails.halfBathrooms.value ? values.propertyDetails.halfBathrooms.value : values.propertyDetails.halfBathrooms) : null;
        data.propertyDetails.propertyType = values.propertyDetails.propertyType ? (values.propertyDetails.propertyType.value ? values.propertyDetails.propertyType.value : values.propertyDetails.propertyType) : null;
        if (values.propertyDetails.isBedroomsWithoutBed) {
            data.propertyDetails.isBedroomsWithoutBed = values.propertyDetails.isBedroomsWithoutBed.value ? values.propertyDetails.isBedroomsWithoutBed.value : values.propertyDetails.isBedroomsWithoutBed;
        }
        
        data.propertyDetails.isPropertyDenOrStudy = values.propertyDetails.isPropertyDenOrStudy.value ? values.propertyDetails.isPropertyDenOrStudy.value : values.propertyDetails.isPropertyDenOrStudy;
        
        data.propertyDetails.isBathroomsHaveBathtub = (values.propertyDetails.isBathroomsHaveBathtub.value ? values.propertyDetails.isBathroomsHaveBathtub.value : values.propertyDetails.isBathroomsHaveBathtub);
        data.propertyDetails.isStairCaseAvailable = (values.propertyDetails.isStairCaseAvailable.value ? values.propertyDetails.isStairCaseAvailable.value : values.propertyDetails.isStairCaseAvailable);
        data.propertyDetails.petRestrictions = (values.propertyDetails.petRestrictions.value ? values.propertyDetails.petRestrictions.value : values.propertyDetails.petRestrictions);
        if (values.features.amenities && values.features.amenities.length > 0) {
            data.features.amenities = data.features.amenities?.map(
                (item: any) => item.value || item
            )
        } else {
            delete data.features;
        }

        if (values.operations.guestServicesId) {
            data.operations.guestServicesId = values.operations.guestServicesId.value ? values.operations.guestServicesId.value : values.operations.guestServicesId
        }
        if (values.operations.opsManagerId) {
            data.operations.opsManagerId = values.operations.opsManagerId.value ? values.operations.opsManagerId.value : values.operations.opsManagerId
        }
        data.ownerGoalsInfo.lockedClosetPropertyBelongings = (values.ownerGoalsInfo.lockedClosetPropertyBelongings.value ? values.ownerGoalsInfo.lockedClosetPropertyBelongings.value : values.ownerGoalsInfo.lockedClosetPropertyBelongings);

        data.outsideInfo.isYardOrOutsideAreaAvailable = (values.outsideInfo.isYardOrOutsideAreaAvailable.value ? values.outsideInfo.isYardOrOutsideAreaAvailable.value : values.outsideInfo.isYardOrOutsideAreaAvailable);
        data.outsideInfo.isOutsideAreaMaintainedByGardener = (values.outsideInfo.isOutsideAreaMaintainedByGardener.value ? values.outsideInfo.isOutsideAreaMaintainedByGardener.value : values.outsideInfo.isOutsideAreaMaintainedByGardener);
        data.outsideInfo.isPropertyHavingBalcony = (values.outsideInfo.isPropertyHavingBalcony.value ? values.outsideInfo.isPropertyHavingBalcony.value : values.outsideInfo.isPropertyHavingBalcony);
        data.outsideInfo.isPropertyHavingOutdoorFurniture = (values.outsideInfo.isPropertyHavingOutdoorFurniture.value ? values.outsideInfo.isPropertyHavingOutdoorFurniture.value : values.outsideInfo.isPropertyHavingOutdoorFurniture);
        data.outsideInfo.isOutdoorFurnitureWinterize = (values.outsideInfo.isOutdoorFurnitureWinterize.value ? values.outsideInfo.isOutdoorFurnitureWinterize.value : values.outsideInfo.isOutdoorFurnitureWinterize);
        data.outsideInfo.isHomeNeededToWinterize = (values.outsideInfo.isHomeNeededToWinterize.value ? values.outsideInfo.isHomeNeededToWinterize.value : values.outsideInfo.isHomeNeededToWinterize);
        data.outsideInfo.isLockedStorageOutsideUnit = (values.outsideInfo.isLockedStorageOutsideUnit.value ? values.outsideInfo.isLockedStorageOutsideUnit.value : values.outsideInfo.isLockedStorageOutsideUnit);
        data.outsideInfo.isOutdoorAreaShared = values.outsideInfo.isOutdoorAreaShared ? (values.outsideInfo.isOutdoorAreaShared.value ? values.outsideInfo.isOutdoorAreaShared.value : values.outsideInfo.isOutdoorAreaShared) : null;

        data.roofAreaInfo.isRoofManaged = (values.roofAreaInfo.isRoofManaged.value ? values.roofAreaInfo.isRoofManaged.value : values.roofAreaInfo.isRoofManaged);
        data.roofAreaInfo.isGreenSpaceAreaAvailable = (values.roofAreaInfo.isGreenSpaceAreaAvailable.value ? values.roofAreaInfo.isGreenSpaceAreaAvailable.value : values.roofAreaInfo.isGreenSpaceAreaAvailable);
        data.roofAreaInfo.isRoofShared = (values.roofAreaInfo.isRoofShared.value ? values.roofAreaInfo.isRoofShared.value : values.roofAreaInfo.isRoofShared);

        data.propertyInterior.isPlanningToRefreshFurnishing = (values.propertyInterior.isPlanningToRefreshFurnishing.value ? values.propertyInterior.isPlanningToRefreshFurnishing.value : values.propertyInterior.isPlanningToRefreshFurnishing);
        data.propertyInterior.isMasterBedroomEnSuiteBathroom = (values.propertyInterior.isMasterBedroomEnSuiteBathroom.value ? values.propertyInterior.isMasterBedroomEnSuiteBathroom.value : values.propertyInterior.isMasterBedroomEnSuiteBathroom);
        data.propertyInterior.isMoreThanOneEnSuite = (values.propertyInterior.isMoreThanOneEnSuite.value ? values.propertyInterior.isMoreThanOneEnSuite.value : values.propertyInterior.isMoreThanOneEnSuite);
        data.propertyInterior.isDaybedPullOutBedOrSofaSpace = (values.propertyInterior.isDaybedPullOutBedOrSofaSpace.value ? values.propertyInterior.isDaybedPullOutBedOrSofaSpace.value : values.propertyInterior.isDaybedPullOutBedOrSofaSpace);
        data.propertyInterior.isPropertyWithBlinds = (values.propertyInterior.isPropertyWithBlinds.value ? values.propertyInterior.isPropertyWithBlinds.value : values.propertyInterior.isPropertyWithBlinds);
        data.propertyInterior.isPropertyWithFireplace = (values.propertyInterior.isPropertyWithFireplace.value ? values.propertyInterior.isPropertyWithFireplace.value : values.propertyInterior.isPropertyWithFireplace);
        data.propertyInterior.fireplaceFuelType = (values.propertyInterior.fireplaceFuelType.value ? values.propertyInterior.fireplaceFuelType.value : values.propertyInterior.fireplaceFuelType);

        data.bedsInfo.isBedFramesHeadboards = (values.bedsInfo.isBedFramesHeadboards.value ? values.bedsInfo.isBedFramesHeadboards.value : values.bedsInfo.isBedFramesHeadboards);

        data.applianceInfo.washerAndDryerShared = (values.applianceInfo.washerAndDryerShared.value ? values.applianceInfo.washerAndDryerShared.value : values.applianceInfo.washerAndDryerShared);
        data.applianceInfo.isPropertyWithHDTVs = (values.applianceInfo.isPropertyWithHDTVs.value ? values.applianceInfo.isPropertyWithHDTVs.value : values.applianceInfo.isPropertyWithHDTVs);

        data.marketingInfo.isBusinessLicense = (values.marketingInfo.isBusinessLicense.value ? values.marketingInfo.isBusinessLicense.value : values.marketingInfo.isBusinessLicense);
        data.marketingInfo.isAssistanceRequiredForBusinessLicense = (values.marketingInfo.isAssistanceRequiredForBusinessLicense.value ? values.marketingInfo.isAssistanceRequiredForBusinessLicense.value : values.marketingInfo.isAssistanceRequiredForBusinessLicense);
        data.marketingInfo.isSecurePackageAcceptance = (values.marketingInfo.isSecurePackageAcceptance.value ? values.marketingInfo.isSecurePackageAcceptance.value : values.marketingInfo.isSecurePackageAcceptance);
        data.marketingInfo.isFloorPlanAvailable = (values.marketingInfo.isFloorPlanAvailable.value ? values.marketingInfo.isFloorPlanAvailable.value : values.marketingInfo.isFloorPlanAvailable);
        data.marketingInfo.isFloorAssistanceRequired = (values.marketingInfo.isFloorAssistanceRequired.value ? values.marketingInfo.isFloorAssistanceRequired.value : values.marketingInfo.isFloorAssistanceRequired);

        data.maintenanceInfo.isKeyRequiredToAccessTrash = (values.maintenanceInfo.isKeyRequiredToAccessTrash.value ? values.maintenanceInfo.isKeyRequiredToAccessTrash.value : values.maintenanceInfo.isKeyRequiredToAccessTrash);
        data.maintenanceInfo.isContractorInspected = (values.maintenanceInfo.isContractorInspected.value ? values.maintenanceInfo.isContractorInspected.value : values.maintenanceInfo.isContractorInspected);

        data.keysInfo.isKeyRequiredToAccessBuilding = (values.keysInfo.isKeyRequiredToAccessBuilding.value ? values.keysInfo.isKeyRequiredToAccessBuilding.value : values.keysInfo.isKeyRequiredToAccessBuilding);
        data.keysInfo.isGarageDoorOpener = (values.keysInfo.isGarageDoorOpener.value ? values.keysInfo.isGarageDoorOpener.value : values.keysInfo.isGarageDoorOpener);
        data.keysInfo.isKeyRequiredToAccessMailBox = (values.keysInfo.isKeyRequiredToAccessMailBox.value ? values.keysInfo.isKeyRequiredToAccessMailBox.value : values.keysInfo.isKeyRequiredToAccessMailBox);

        data.insuranceInfo.isHomeOrBuildingInsurance = (values.insuranceInfo.isHomeOrBuildingInsurance.value ? values.insuranceInfo.isHomeOrBuildingInsurance.value : values.insuranceInfo.isHomeOrBuildingInsurance);
        data.insuranceInfo.isContentInsuranceAvailable = (values.insuranceInfo.isContentInsuranceAvailable.value ? values.insuranceInfo.isContentInsuranceAvailable.value : values.insuranceInfo.isContentInsuranceAvailable);
        data.insuranceInfo.isInsuranceContentRequiredBeforeAnyRepair = (values.insuranceInfo.isInsuranceContentRequiredBeforeAnyRepair.value ? values.insuranceInfo.isInsuranceContentRequiredBeforeAnyRepair.value : values.insuranceInfo.isInsuranceContentRequiredBeforeAnyRepair);
        data.insuranceInfo.isContentRequireByAttachToInsurer = (values.insuranceInfo.isContentRequireByAttachToInsurer.value ? values.insuranceInfo.isContentRequireByAttachToInsurer.value : values.insuranceInfo.isContentRequireByAttachToInsurer);

        let cleanedData = deepClean(data);
        delete cleanedData.propertyStatus.ownerInfo;
        if(cleanedData.propertyStatus.multipleOwnerInfo) {
            delete cleanedData.propertyStatus.multipleOwnerInfo;
        }
        cleanedData = Object.fromEntries(
            Object.entries(cleanedData).filter(([key]) => !key.startsWith("Email-"))
        );
        cleanedData = removeEmptyObjects(cleanedData);

        mutate(cleanedData);
    };

    const showDetails = () => {
        setShowMoreOwners(true);
    }


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

    const handleMenuClick = (section: keyof typeof sectionsRef) => {
        setActiveSection(String(section));
        sectionsRef[section].current?.scrollIntoView({
            behavior: "smooth",
            block: "start",
        });
    };

    useEffect(() => {
        console.log("scroll-------");
        if (!Object.values(sectionsRef).every((ref) => ref.current)) {
            return; // Exit if refs are not ready
        }

        const observerOptions = {
            root: null,
            rootMargin: "-60px 0px 0px 0px",
            threshold: 0.1,
        };

        const observerCallback = (entries: IntersectionObserverEntry[]) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setActiveSection(entry.target.id);
                }
            });
        };

        const observer = new IntersectionObserver(observerCallback, observerOptions);

        Object.values(sectionsRef).forEach((ref) => {
            if (ref.current) observer.observe(ref.current);
        });

        return () => observer.disconnect();
    }, [sectionsRef]); // Ensure refs are loaded



    useEffect(() => {
        let tabDetails = params.type == '1' ? 'currentActive' : (params.type == '3' ? 'onLease' : (params.type == '2' ? 'available' : 'allProperties'));
        setActiveTab(tabDetails);
    }, [activeTab])


    const handleUpdate = (newAbout: any) => {
        setDescription(newAbout); // Update the parent's state
    };

    const handleNoteUpdate = (newAbout: any, owners: any) => {
        setManagedNote(newAbout); // Update the parent's state
        setMultipleOwnersId([...owners]);
    };

    const handleBuildingUpdate = (value: any) => {
        if (value.requiresExtraPaperwork) {
            setExtraDetailMessage("This property requires additonal paperwork.")
        } else {
            setExtraDetailMessage("")
        }

    }

    const onImageChange = (event: ChangeEvent<HTMLInputElement>) => {

        if (event.target.files && event.target.files[0]) {
            setErrorMsg('');
            const file = event.target.files[0];
            const selectedFile = event.target.files[0].size
            const fileSizeKiloBytes = selectedFile / FILE_SIZE;
            if (!ACCEPT_TYPE.includes(file.type)) {
                setErrorMsg("Only png, jpg, jpeg files are allowed.");
                event.target.value = "";
            } else if (fileSizeKiloBytes > MAX_FILE_SIZE) {
                setErrorMsg(MESSAGES.FILE_SIZE_ERROR);
                return;
            } else {
                setImageSpiner(true);
                const imag = event.target.files[0];
                var formData = new FormData();
                formData.append("images", imag);
                uploadPropertyImage(params.id, formData).then((res) => {
                    getImages();
                });
            }

        }
    };



    const removeImage = (id: any) => {
        setSpiner(true);
        deletePropertyImage(params.id, id).then((res: any) => {
            getImages();
        });
    };

    const handleDragEnd = (result:any) => {
        console.log(result);
        if (!result.destination) return;
    
        const reorderedImages = [...images];
        const [movedItem] = reorderedImages.splice(result.source.index, 1);
        reorderedImages.splice(result.destination.index, 0, movedItem);
    
        setImages(reorderedImages);
        updateImageOrderAPI(reorderedImages); // API call to update images
    };

    const updateImageOrderAPI = async (updatedImages: any[]) => {
        const keyToRemove = 'position' as keyof any;
      
        // Remove 'position' key from each object
        const cleanedImages = updatedImages.map((obj) => {
          const { [keyToRemove]: _removed, ...rest } = obj;
          return rest;
        });
      
        // Prepare request payload
        const payload = {
          files: cleanedImages
        };
      
        console.log(payload); // optional: to debug before sending
      
        try {
          await updateImageOrder(params.id, payload);
          getImages(); // refresh images after update
        } catch (error) {
            toast.error(`Update failed! Try again in sometime.`)
        }
    };


    return (
        <>

            {/* User Management Editing Property  */}

            <div className="common-right-panel-section _edit-property-section">
                <div className="top-right-bar">
                    <Breadcrumb>
                        <Breadcrumb.Item href="#">Property Manager</Breadcrumb.Item>
                        <Breadcrumb.Item href="#">Properties</Breadcrumb.Item>
                        <Breadcrumb.Item href={ROUTE_NAVIGATION_PATH.ADMIN_OWNER_PROPERTY_LIST + '?activeTab=' + activeTab + '&type=' + params.type}>{params.type == '1' ? 'Listed Property' : params.type == '2' ? 'Available Properties' : params.type == '3' ? 'Rented Properties' : 'All Properties'}</Breadcrumb.Item>
                        <Breadcrumb.Item active>Edit Property {spinner}</Breadcrumb.Item>
                    </Breadcrumb>
                    <div className="guest-header">
                        <div className="guest-left">
                            <div className="property-top-detail">
                                <div className="pro-thumb">
                                    <img src={images && images.length > 0 ? images[0].Url : placeHolder} alt="Image" />
                                </div>
                                <div className="pro-desc-top">
                                    <h2>Property</h2>
                                    <h1>{initData.propertyAddress.unitNumber} {initData.propertyAddress.streetAddress}, {initData.propertyAddress.city}, {initData.propertyAddress.stateCode} {initData.propertyAddress.zipCode}</h1>
                                    <div className="register">Registered on Aug 20, 2024</div>
                                    <div className="showMsg">{extraDetailMessage ? extraDetailMessage : ''}</div>
                                    <div className="pro-grid-wrapper">
                                        <div className="p-grid">
                                            <div className="t-info">
                                                Additonal Information
                                            </div>
                                            {
                                                onwerDetails && (
                                                    <>
                                                        <p className="blue">{onwerDetails.fullName}</p>
                                                        <p className="blue">{onwerDetails.email}</p>
                                                        {
                                                            onwerDetails.phoneNumbers && onwerDetails.phoneNumbers.length > 0 ?
                                                                <>
                                                                    {onwerDetails.phoneNumbers.map((data: any, key: any) => (
                                                                        <p>{formatPhoneNumber(data.phone) + ' (' + capitalizeFirstWord(data.type) + ')'}</p>
                                                                    ))}
                                                                </>
                                                                :
                                                                null
                                                        }
                                                        <div className="showmore_info" onClick={showDetails}>
                                                            <div className="shwmore">Show more</div>
                                                        </div>
                                                    </>
                                                )
                                            }
                                        </div>

                                        <div className="p-grid">
                                            <div className="t-info">
                                                Extension Possible
                                            </div>
                                            {
                                              res.currentLeaseInfo ?
                                                !res.generalInfo.isExtensionPossible ? 
                                                <p className="">
                                                    No, the current guest is NOT expected to extend.'
                                                </p>
                                                :
                                                <p className="">
                                                    Yes, the current guest is NOT expected to extend.
                                                </p>
                                              :
                                                <p className="">
                                                    No Current Lease
                                                </p>
                                            }
                                        </div>

                                        {
                                            fromLease && (
                                                res.currentLeaseInfo && res.currentLeaseInfo.primaryGuestInfo ?
                                                <div className="p-grid">
                                                    <div className="t-info">
                                                        Current Guest Information
                                                    </div>
                                                        {
                                                            res.currentLeaseInfo.primaryGuestInfo && (
                                                                <>
                                                                    <p className="blue">{res.currentLeaseInfo.primaryGuestInfo.name}</p>
                                                                    <p className="blue">{res.currentLeaseInfo.primaryGuestInfo.email}</p>
                                                                </>
                                                            )
                                                        }
                                                    </div>
                                                :
                                                null

                                            )
                                        }
                                        
                                    </div>

                                </div>
                            </div>

                        </div>
                        <div className="guest-right">
                            {/* <button className="btn-delete">Delete Property</button> */}
                            <button className="btn-primary" onClick={submitForm}>Save Details</button>

                        </div>
                    </div>

                </div>
                <>
                    {spinner ? <div className="spinner-wrapper"><Spinner /></div> : null}
                </>
                {loader ? (
                    <div className="spinner-wrapper"><Spinner /></div>
                ) : (
                    <div className="guest-general-information scrollbar _property-edit-info-section">
                        <div className="info-wrapper">
                            <div className="infoleft">
                                <div className="user-stepper">
                                    <ul>
                                        <li className={activeSection === 'section1' ? "active" : ""} onClick={() => handleMenuClick("section1")}>General Information</li>
                                        <li className={activeSection === 'section2' ? "active" : ""} onClick={() => handleMenuClick("section2")}>Status</li>
                                        <li className={activeSection === 'section3' ? "active" : ""} onClick={() => handleMenuClick("section3")}>Address</li>
                                        <li className={activeSection === 'section4' ? "active" : ""} onClick={() => handleMenuClick("section4")}>Details</li>
                                        <li className={activeSection === 'section5' ? "active" : ""} onClick={() => handleMenuClick("section5")}>Accessibility</li>
                                        <li className={activeSection === 'section6' ? "active" : ""} onClick={() => handleMenuClick("section6")}>Features</li>
                                        <li className={activeSection === 'section7' ? "active" : ""} onClick={() => handleMenuClick("section7")}>Tax Info</li>
                                        <li className={activeSection === 'section8' ? "active" : ""} onClick={() => handleMenuClick("section8")}>Operations</li>
                                        <li className={activeSection === 'section9' ? "active" : ""} onClick={() => handleMenuClick("section9")}>Owner Goals</li>
                                        <li className={activeSection === 'section10' ? "active" : ""} onClick={() => handleMenuClick("section10")}>Outside space</li>
                                        <li className={activeSection === 'section11' ? "active" : ""} onClick={() => handleMenuClick("section11")}>Roof Area</li>
                                        <li className={activeSection === 'section12' ? "active" : ""} onClick={() => handleMenuClick("section12")}>Property Interior</li>
                                        <li className={activeSection === 'section13' ? "active" : ""} onClick={() => handleMenuClick("section13")}>Beds</li>
                                        <li className={activeSection === 'section14' ? "active" : ""} onClick={() => handleMenuClick("section14")}>Appliances and Kitchen Equipment</li>
                                        <li className={activeSection === 'section15' ? "active" : ""} onClick={() => handleMenuClick("section15")}>Marketing and administration</li>
                                        <li className={activeSection === 'section16' ? "active" : ""} onClick={() => handleMenuClick("section16")}>Maintenance and Operations</li>
                                        <li className={activeSection === 'section17' ? "active" : ""} onClick={() => handleMenuClick("section17")}>Keys</li>
                                        <li className={activeSection === 'section18' ? "active" : ""} onClick={() => handleMenuClick("section18")}>Utilities</li>
                                        <li className={activeSection === 'section19' ? "active" : ""} onClick={() => handleMenuClick("section19")}>Insurance</li>
                                        <li className={activeSection === 'section20' ? "active" : ""} onClick={() => handleMenuClick("section20")}>Public Image</li>
                                    </ul>
                                </div>
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
                                                <div className="genraleditproperty" id="section1" ref={sectionsRef.section1}>
                                                    <h2>General Information</h2>
                                                    <GeneralProperty handleSubmit={handleUpdate} description={description} editable={true} initialAvailableFrom={initData.generalInfo?.availableFrom} />
                                                </div>


                                                <div className="_property-detail-sec" id="section2" ref={sectionsRef.section2}>
                                                    <h2>Property Status</h2>
                                                    <div className="row">

                                                        {
                                                            onwerDetails && (
                                                                <div className="owner-info">
                                                                    <div className="_owner">Owner Info</div>
                                                                    <p>{onwerDetails.fullName}</p>
                                                                    <p>{onwerDetails.email}</p>
                                                                    {
                                                                        onwerDetails.phoneNumbers && onwerDetails.phoneNumbers.length > 0 ?
                                                                            <>
                                                                                {onwerDetails.phoneNumbers.map((data: any, key: any) => (
                                                                                    <p>{formatPhoneNumber(data.phone) + ' (' + capitalizeFirstWord(data.type) + ')'}</p>
                                                                                ))}
                                                                            </>
                                                                            :
                                                                            null
                                                                    }
                                                                </div>
                                                            )
                                                        }

                                                    </div>

                                                    <PropertyStatus handleSubmit={handleNoteUpdate} note={managedNote} editable={true} multipleOwnersId={multipleOwnersId} />
                                                </div>

                                                <div className="_property-detail-sec" id="section3" ref={sectionsRef.section3}>
                                                    <h2>Property Address</h2>
                                                    <PropertyAddress handleSubmit={handleBuildingUpdate} />
                                                </div>

                                                <div className="_property-detail-sec" id="section4" ref={sectionsRef.section4}>
                                                    <h2>Property Detail</h2>
                                                    <PropertyDetails editable={true} />
                                                </div>

                                                <div className="_property-detail-sec" id="section5" ref={sectionsRef.section5}>
                                                    <h2>Accessibility</h2>
                                                    <Accessibility />
                                                </div>
                                                <div className="_property-detail-sec" id="section6" ref={sectionsRef.section6}>
                                                    <h2>Features/Amenities</h2>
                                                    <Features />
                                                </div>
                                                <div className="_property-detail-sec" id="section7" ref={sectionsRef.section7}>
                                                    <h2>Tax Information</h2>
                                                    <TaxInformation />
                                                </div>
                                                <div className="_property-detail-sec" id="section8" ref={sectionsRef.section8}>
                                                    <h2>Operations</h2>
                                                    <Opeartions editable={true} />
                                                </div>
                                                <div className="_property-detail-sec" id="section9" ref={sectionsRef.section9}>
                                                    <h2>Owner Goals</h2>
                                                    <OwnerGoals editable={true} />
                                                </div>
                                                <div className="_property-detail-sec" id="section10" ref={sectionsRef.section10}>
                                                    <h2>Outside Space</h2>
                                                    <OutsideSpace editable={true} />
                                                </div>
                                                <div className="_property-detail-sec" id="section11" ref={sectionsRef.section11}>
                                                    <h2>Roof Area</h2>
                                                    <RoofArea editable={true} />
                                                </div>
                                                <div className="_property-detail-sec" id="section12" ref={sectionsRef.section12}>
                                                    <h2>Property Interior</h2>
                                                    <PropertyInterior editable={true} />
                                                </div>
                                                <div className="_property-detail-sec" id="section13" ref={sectionsRef.section13}>
                                                    <h2>Beds</h2>
                                                    <BedsInfo editable={true} />
                                                </div>
                                                <div className="_property-detail-sec" id="section14" ref={sectionsRef.section14}>
                                                    <h2>Appliances and kitchen equipment</h2>
                                                    <AppliancesAndKitchen editable={true} />
                                                </div>
                                                <div className="_property-detail-sec" id="section15" ref={sectionsRef.section15}>
                                                    <h2>Marketing and administration</h2>
                                                    <MarketingInfo editable={true} />
                                                </div>
                                                <div className="_property-detail-sec" id="section16" ref={sectionsRef.section16}>
                                                    <h2>Maintenance and Operations</h2>
                                                    <MaintenanceInfo editable={true} />
                                                </div>
                                                <div className="_property-detail-sec" id="section17" ref={sectionsRef.section17}>
                                                    <h2>Keys</h2>
                                                    <KeysInfo editable={true} />
                                                </div>
                                                <div className="_property-detail-sec" id="section18" ref={sectionsRef.section18}>
                                                    <h2>Utilities</h2>
                                                    <UtilityInfo editable={true} />
                                                </div>
                                                <div className="_property-detail-sec" id="section19" ref={sectionsRef.section19}>
                                                    <h2>Insurance</h2>
                                                    <InsuranceInfo editable={true} />
                                                </div>
                                                <div className="_property-detail-sec" id="section20" ref={sectionsRef.section20}>
                                                    <h2>Public Images</h2>
                                                    <div className="row ">
                                                        <div className="col-12">
                                                            <div className="imagetxt">Images</div>
                                                            <DragDropContext onDragEnd={handleDragEnd}>
                                                                <Droppable droppableId="imageList" direction="horizontal">
                                                                {(dropProvided) => (
                                                                    <div ref={dropProvided.innerRef} {...dropProvided.droppableProps} className="input-file-ws-property">
                                                                        {images.map((img:any, index:any) => (
                                                                            <Draggable key={img._id} draggableId={img._id.toString()} index={index}>
                                                                                {(dragProvided:any) => (
                                                                                    <div
                                                                                        ref={dragProvided.innerRef}
                                                                                        {...dragProvided.draggableProps}
                                                                                        {...dragProvided.dragHandleProps}
                                                                                        className="thumb-image"
                                                                                    >
                                                                                        <div className="removeBtn" onClick={() => removeImage(img._id)}>
                                                                                            <img src={crossIcon} alt="icon" />
                                                                                        </div>
                                                                                        <img src={img.Url} alt="Image" />
                                                                                    </div>
                                                                                )}
                                                                            </Draggable>
                                                                        ))}
                                                                        {dropProvided.placeholder}

                                                                        {/* Upload Input should not be draggable */}
                                                                        <div className="file-input">
                                                                            {imageSpinner && (
                                                                                <div className="sppiner-input">
                                                                                    <Spinner />
                                                                                </div>
                                                                            )}
                                                                            <input
                                                                                type="file"
                                                                                onChange={onImageChange}
                                                                                accept=".png,.jpg,.jpeg"
                                                                                name="file-input"
                                                                                id="file-input"
                                                                                className="file-input__input"
                                                                            />
                                                                            <label className="file-input__label" htmlFor="file-input">
                                                                                <span>
                                                                                    <div className="fileupload">
                                                                                    <img src={plusIcon} alt="Icon" />
                                                                                    </div>
                                                                                </span>
                                                                            </label>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                                </Droppable>
                                                            </DragDropContext>
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
                )}
            </div >

            {/* User Management Editing Property End  */}

            {
                showMoreOwners ?
                <OnwerDetailsModel
                    detail={allOnwers}
                    show={showMoreOwners}
                    title={'Owner Info'}
                    handleClose={() => setShowMoreOwners(false)}
                />
                :
                null
            }
        </>
    );
}

function deepClean(obj: any): any {
    if (Array.isArray(obj)) {
        // Recursively clean arrays and filter out unwanted values
        return obj
            .map(deepClean)
            .filter((item) => item !== null && item !== "");
    } else if (typeof obj === 'object' && obj !== null) {
        // Recursively clean objects
        return Object.entries(obj).reduce((acc, [key, value]) => {
            const cleanedValue = deepClean(value);
            if (cleanedValue !== null && cleanedValue !== "") {
                acc[key] = cleanedValue;
            }
            return acc;
        }, {} as Record<string, any>);
    }
    // Return the value as is for other data types
    return obj;
}