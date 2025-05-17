import React, { useState, useEffect, useRef } from "react";
import { Form, Field, useField } from "react-final-form";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { Dropdown, Spinner } from "react-bootstrap";
import { composeValidators, required, requiredSelect, validEmail, validLatitude, validLongitude } from "../../../../validations";
import { FormControl } from "../../../../components/FormElements/FormControl";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import proInfo from "../../../../assets/images/Info.svg";
import minusIcon from "../../../../assets/images/minus.svg";
import plusBlack from "../../../../assets/images/plus-black.svg";
import Breadcrumb from 'react-bootstrap/Breadcrumb';
import dollarIcon from "../../../../assets/images/dollar.svg";
import { CheckboxControlGlobal } from "../../../../components/FormElements/CheckboxControl";
import { Editor } from 'primereact/editor';
import { ROUTE_NAVIGATION_PATH } from "../../../../routes/routes";
import NeighbourhoodListDropDown from "../../../../components/SearchSelect/NeighbourhoodList";
import QuadrantsListDropDown from "../../../../components/SearchSelect/QuadrantsListDropdown";
import { SearchSelectWithForm } from "../../../../components/SearchSelect/SearchSelect";
import { BUILDING_AMMENITIES, COUNRIES, COUNTRIES, STATE_CODE } from "../../../../constants";
import { createBuilding, getBuildingDetail, updateBuilding } from "../../../../api/admin/building";
import { useCustomMutation } from "../../../../hooks/useApi";
import { toast } from 'react-toastify';
import DeleteBuildingModel from "../../../../components/Modal/DeleteBuildingModel";
import { capitalizeFirstWord, formatDate } from "../../../../utils/common";
import { configuration } from "../../../../api";


const EDIT_NEIGHBORHOOD = {
    name: "",
    requiresExtraPaperwork: false,
    requiresCopyOfLeaseAgreement: false,
    docusignTemplateIds: "",
    mitsGeneralType: "",
    neighborhoodId: "",
    unitNumber: "",
    streetAddress: "",
    directionality: "",
    country: "",
    county: "",
    cityName: "",
    zipcode: "",
    stateCode: "",
    longitude: "",
    latitude: "",
    minimumLeaseTerm: "",
    inOutFees: "",
    buildingAmenities: []
}

const AddEditBuilding: React.FC = () => {
    const [initData, setInitData] = useState<any>({
        ...EDIT_NEIGHBORHOOD,
        name: "",
        requiresExtraPaperwork: false,
        requiresCopyOfLeaseAgreement: false,
        docusignTemplateIds: "",
        mitsGeneralType: "",
        neighborhoodId: "",
        unitNumber: "",
        streetAddress: "",
        directionality: "",
        country: "",
        county: "",
        cityName: "",
        zipcode: "",
        stateCode: "",
        longitude: "",
        latitude: "",
        minimumLeaseTerm: 30,
        inOutFees: "",
        buildingAmenities: []
    });
    const [about, setAbout] = useState<any>(null);
    const [publicDescription, setPublicDescription] = useState<any>(null);
    const [loader, setLoader] = useState(true);
    const [deleteModal, setDeleteModal] = useState(false);
    const [buildingId, setBuildingId] = useState("");
    const [buildingName, setBuildingName] = useState("");
    const [stateCodeList, setStateCodeList] = useState<any>([]);
    const effectRan = useRef(false);
    const params = useParams();
    const navigate = useNavigate();
    const handleSubmitRef = useRef<() => void>(() => { }); // Create a ref to store the handleSubmit function
    const [neighbourhood, setNeighbourhood] = useState((localStorage.getItem("neighbourhood")
        ? JSON.parse(localStorage.getItem("neighbourhood") as string)
    : []));
    const [quadrants, setQuadrants] = useState((localStorage.getItem("quadrants")
        ? JSON.parse(localStorage.getItem("quadrants") as string)
    : []));
    const [amenitiesList, setAmenitiesList] = useState<any>([]);

    useEffect(() => {
        if(params.id){
            getBuildingDetail(params.id).then((res: any) => {    
                setInitData((prevState: any) => ({
                    ...prevState,
                    requiresExtraPaperwork: res.data.requiresExtraPaperwork ? res.data.requiresExtraPaperwork : false,
                    name: res.data.name ? res.data.name : "",
                    requiresCopyOfLeaseAgreement: res.data.requiresCopyOfLeaseAgreement ? res.data.requiresCopyOfLeaseAgreement : false,
                    docusignTemplateIds: res.data.docusignTemplateIds ? res.data.docusignTemplateIds.join(", ") : "",
                    mitsGeneralType: "Commercial",
                    neighborhoodId: res.data.neighborhoodId ? res.data.neighborhoodId._id : "",
                    unitNumber: res.data.unitNumber ? res.data.unitNumber : "",
                    streetAddress: res.data.streetAddress ? res.data.streetAddress : "",
                    directionality: res.data.directionality ? res.data.directionality : "",
                    country: res.data.country ? res.data.country : "",
                    county: res.data.county ? res.data.county : "",
                    cityName: res.data.cityName ? res.data.cityName : "",
                    zipcode: res.data.zipcode ? res.data.zipcode : "",
                    stateCode: res.data.stateCode ? res.data.stateCode : "",
                    longitude: res.data.longitude ? res.data.longitude : 0,
                    latitude: res.data.latitude ? res.data.latitude : 0,
                    minimumLeaseTerm: res.data.minimumLeaseTerm ? res.data.minimumLeaseTerm : 0,
                    inOutFees: res.data.inOutFees ? res.data.inOutFees : 0,
                    buildingAmenities: res.data.buildingAmenities ? res.data.buildingAmenities : [],
                    createdAt: res.data.createdAt ? res.data.createdAt : "",
                }));
                
                setAbout(res.data.description ? res.data.description : "");
                setPublicDescription(res.data.publicDescription ? res.data.publicDescription : "");
                setLoader(false);
                setBuildingName(res.data.name);
                setBuildingId(res.data._id);
            });
        } else {
            setLoader(false);
        }
        
    }, []);


    useEffect(() => {
        if (!effectRan.current) {
            configuration.getStateCodes().then((res: any) => {
                setStateCodeList(res.data.map((item:any) => ({
                    label: item.name,
                    value: item.code
                })));
            });
        }
        return () => {
            effectRan.current = true;
        };
    }, [])

    const submitForm = () => {
        if (handleSubmitRef.current) {
            handleSubmitRef.current(); // Programmatically trigger form submission
        }
    };

    const onSubmit = (values: any) => {
        const data:any = { ...values };
        data.docusignTemplateIds = values.docusignTemplateIds ? values.docusignTemplateIds.split(", ").map((item:any) => item.trim()) : [];
        data.directionality = values.directionality ? values.directionality.value : "";
        data.neighborhoodId = values.neighborhoodId ? values.neighborhoodId.value : "";
        data.stateCode = values.stateCode ? values.stateCode.value : "";
        data.country = values.country ? values.country.value : "";
        data.minimumLeaseTerm = data.minimumLeaseTerm ? Number(data.minimumLeaseTerm) : 0;
        data.inOutFees = data.inOutFees ? Number(data.inOutFees) : 0;
        data.latitude = data.latitude ? parseFloat(data.latitude) : 0;
        data.longitude = data.longitude ? parseFloat(data.longitude) : 0;
        data.publicDescription = publicDescription ? publicDescription : "";
        data.description = about ? about : "";
        data.mitsGeneralType = 'General';
        if(values.buildingAmenities && values.buildingAmenities.length > 0) {
            if(isSimpleArray(values.buildingAmenities)){
                data.buildingAmenities = values.buildingAmenities;
            } else {
                data.buildingAmenities = values.buildingAmenities.map((item:any) => item.value)
            }
        } else {
            delete data.buildingAmenities;
        }

        if(!data.description) {
            delete data.description
        }

        if(!data.publicDescription) {
            delete data.publicDescription
        }

        delete data.createdAt;
        mutate(data);
    };

    function isSimpleArray(arr:any) {
        return Array.isArray(arr) && arr.every(item => typeof item !== 'object' || item === null);
    }

    function isArrayOfObjects(arr:any) {
        return Array.isArray(arr) && arr.every(item => typeof item === 'object' && item !== null);
    }

    const { mutate } = useCustomMutation({
        mutationFn: (req: any) => {
            return params.id ? updateBuilding(params.id, req): createBuilding(req);
        },
        onSuccess: async () => {
            toast.success(params.id ? `Building updated successfully` : 'Building created successfully')
            navigate(ROUTE_NAVIGATION_PATH.BUILDING_LIST);
        },
    });

    const openDeleteModel = () => {
        // setUserEmail("sonali@yopmail.com");
        setDeleteModal(true);
    }

    const updateListItem = () => {
        setBuildingName('');
        setBuildingId('');
        navigate(ROUTE_NAVIGATION_PATH.BUILDING_LIST);
    }


    return (
        <>
            <div className="common-right-panel-section">
                <div className="top-right-bar">
                    <Breadcrumb>
                        <Breadcrumb.Item href="#">Property Manager</Breadcrumb.Item>
                        <Breadcrumb.Item href={ROUTE_NAVIGATION_PATH.BUILDING_LIST}>Buildings</Breadcrumb.Item>
                        {/* <Breadcrumb.Item href="#">All Building</Breadcrumb.Item> */}
                        <Breadcrumb.Item active>{params.id ? 'Edit' : 'Create'} Building </Breadcrumb.Item>

                    </Breadcrumb>
                    <div className="guest-header">
                        <div className="guest-left ">
                            <h1>{params.id ? 'Edit' : 'Create'} Building</h1>
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
                            {
                                params.id ?
                                <button className="btn-delete" onClick={() => openDeleteModel()}>Delete Building</button>
                                :
                                null
                            }
                            <button className="btn-primary" onClick={submitForm}>{params.id ? 'Edit' : 'Create'}  building</button>
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
                                                        label="Name"
                                                        name="name"
                                                        type="Name"
                                                        validate={composeValidators(required)}
                                                    />
                                                    <div className="info-input">
                                                        <img src={proInfo} alt="Info" />
                                                        <p>Will be displayed publicly.</p>
                                                    </div>

                                                </div>
                                                <div className="col-12 editor-common">
                                                    <label className="form-label">Description</label>
                                                    <Editor value={about} onTextChange={(e) => setAbout(e.htmlValue)} style={{ height: '320px' }} />
                                                </div>

                                                <div className="col-12 col-md-4 _checkboxmob mb-4">
                                                    <CheckboxControlGlobal
                                                        name="requiresCopyOfLeaseAgreement"
                                                        label="Requires Lease"
                                                    />
                                                </div>
                                                <div className="col-12 col-md-6 _checkboxmob mb-4">
                                                    <CheckboxControlGlobal
                                                        name="requiresExtraPaperwork"
                                                        label="Requires Paperwork"
                                                    />
                                                </div>
                                                <div className="col-12 col-md-12">
                                                    <FormControl
                                                        label="Docusign Template IDs"
                                                        name="docusignTemplateIds"
                                                        type="Name"
                                                    />
                                                    <div className="info-input">
                                                        <img src={proInfo} alt="Info" />
                                                        <p>Comma separate list of DocuSign template ids for documents to send.</p>
                                                    </div>

                                                </div>
                                                <div className="col-12 col-md-12 _dollar">
                                                    <FormControl
                                                        label="Fees"
                                                        name="inOutFees"
                                                        type="input-decimal"
                                                        validate={composeValidators(required)}
                                                    />
                                                    <div className="dollarIcon">
                                                        <img src={dollarIcon} alt="Dollar" />
                                                    </div>
                                                </div>


                                                {/* <div className="col-12 col-md-12 custom-select-form">
                                                    <div className="text-start form-field">
                                                        <DropdownField name="Directional" label="MITS General Type*" defaultName="Select ">
                                                            <MyDropdownItem newValue="" onChange={handleSubmit}>Select Directional</MyDropdownItem>
                                                            <MyDropdownItem newValue="District of Columbia" onChange={handleSubmit}>District of Columbia</MyDropdownItem>
                                                            <MyDropdownItem newValue="Virginia" onChange={handleSubmit}>Virginia</MyDropdownItem>
                                                            <MyDropdownItem newValue="Maryland" onChange={handleSubmit}>Maryland</MyDropdownItem>
                                                        </DropdownField>

                                                    </div>
                                                    <div className="info-input">
                                                        <img src={proInfo} alt="Info" />
                                                        <p>Only if applicable. See <a href="">MITS Project</a>  for more details. <a href="">General Types</a>  are usually referring to the building.</p>
                                                    </div>
                                                </div> */}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="info-wrapper info-wrapper-multiple">
                                        <div className="infoleft">
                                            <h2>Building Address</h2>
                                        </div>
                                        <div className="info-right">
                                            <div className="row">

                                                <div className="col-12 custom-select-form">
                                                    <div className="text-start form-field">
                                                        <NeighbourhoodListDropDown
                                                            name="neighborhoodId"
                                                            label="Neighborhood"
                                                            // options={NEIGHBORHOODS_OPTIONS}
                                                            isSearchable
                                                            validate={composeValidators(requiredSelect)}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-12 col-md-4">
                                                    <FormControl
                                                        label="Unit Number"
                                                        name="unitNumber"
                                                        type="text"
                                                        validate={composeValidators(required)}

                                                    />
                                                </div>
                                                <div className="col-12 col-md-8">
                                                    <FormControl
                                                        label="Street Address"
                                                        name="streetAddress"
                                                        type="text"
                                                        validate={composeValidators(required)}
                                                    />
                                                </div>
                                                <div className="col-12 custom-select-form">
                                                    <div className="text-start form-field">
                                                        <QuadrantsListDropDown
                                                            label="Directionality"
                                                            name="directionality"
                                                            isSearchable
                                                            validate={composeValidators(required)}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-12 col-md-6 custom-select-form">
                                                    <div className="text-start form-field">
                                                        {/* <DropdownField name="Directional" label="City*" defaultName="Select">
                                                            <MyDropdownItem newValue="" onChange={handleSubmit}>Select Bedroom</MyDropdownItem>
                                                            <MyDropdownItem newValue="District of Columbia" onChange={handleSubmit}>1</MyDropdownItem>
                                                            <MyDropdownItem newValue="Virginia" onChange={handleSubmit}>2</MyDropdownItem>
                                                            <MyDropdownItem newValue="Maryland" onChange={handleSubmit}>3</MyDropdownItem>
                                                        </DropdownField> */}
                                                        <FormControl
                                                            label="City"
                                                            name="cityName"
                                                            type="text"
                                                            validate={composeValidators(required)}
                                                        />
                                                    </div>
                                                </div>

                                                <div className="col-12 col-md-3 custom-select-form">
                                                    {/* <FormControl
                                                        label="State Code"
                                                        name="stateCode"
                                                        type="text"
                                                        validate={composeValidators(required)}
                                                    /> */}
                                                    <SearchSelectWithForm
                                                        name="stateCode"
                                                        label="State Code"
                                                        options={stateCodeList}
                                                        validate={composeValidators(requiredSelect)}
                                                    />
                                                </div>
                                                <div className="col-12 col-md-3">
                                                    <FormControl
                                                        label="Zipcode"
                                                        name="zipcode"
                                                        type="text"
                                                        validate={composeValidators(required)}
                                                    />
                                                </div>


                                                <div className="col-12 col-md-6">
                                                    <FormControl
                                                        label="County"
                                                        name="county"
                                                        type="text"
                                                        validate={composeValidators(required)}
                                                    />
                                                </div>

                                                <div className="col-12 col-md-6 custom-select-form">
                                                    <div className="text-start form-field">
                                                        <SearchSelectWithForm
                                                            name="country"
                                                            label="Country"
                                                            options={COUNTRIES}
                                                            placeholder="Select multiple"
                                                            validate={composeValidators(requiredSelect)}
                                                        />
                                                    </div>
                                                </div>

                                                <div className="col-12 col-md-6">
                                                    <FormControl
                                                        label="Longitude"
                                                        name="longitude"
                                                        type="text"
                                                        validate={composeValidators(
                                                            validLongitude
                                                        )}

                                                    />
                                                </div>

                                                <div className="col-12 col-md-6">
                                                    <FormControl
                                                        label="Latitude"
                                                        name="latitude"
                                                        type="text"
                                                        validate={composeValidators(
                                                            validLatitude
                                                        )}
                                                    />
                                                </div>

                                            </div>
                                        </div>
                                    </div>

                                    <div className="info-wrapper info-wrapper-multiple">
                                        <div className="infoleft">
                                            <h2>Description and Amenities</h2>
                                        </div>
                                        <div className="info-right">
                                            <div className="row">
                                                <div className="col-12 col-md-8 teamsort">
                                                    <FormControl
                                                        label="Minimum Lease Term "
                                                        name="minimumLeaseTerm"
                                                        type="input-number"
                                                        validate={composeValidators(required)}
                                                    />
                                                    <div className="plusminus">
                                                        <div className="boxes" onClick={() => {
                                                                form.change("minimumLeaseTerm", values.minimumLeaseTerm-1);
                                                            }}
                                                        >
                                                            <img src={minusIcon} alt="Icon" />
                                                        </div>
                                                        <div className="boxes" onClick={() => {
                                                                form.change("minimumLeaseTerm", values.minimumLeaseTerm+1);
                                                            }}
                                                        >
                                                            <img src={plusBlack} alt="Icon" />
                                                        </div>

                                                    </div>
                                                    <div className="info-input">
                                                        <img src={proInfo} alt="Info" />
                                                        <p>Minimum lease term in days enforced by the building.</p>
                                                    </div>
                                                </div>

                                                <div className="col-12 editor-common">
                                                    <label className="form-label">Public Description</label>
                                                    <Editor value={publicDescription} onTextChange={(e) => setPublicDescription(e.htmlValue)} style={{ height: '320px' }} />
                                                    <div className="info-input pt-3 pb-0">
                                                        <img src={proInfo} alt="Info" />
                                                        <p>May be displayed in listings and feeds.</p>
                                                    </div>
                                                </div>


                                                <div className="col-12 col-md-12 custom-select-form _editchips">
                                                    <div className="text-start form-field">
                                                        <SearchSelectWithForm
                                                            name="buildingAmenities"
                                                            label="Building amenities"
                                                            options={BUILDING_AMMENITIES}
                                                            isMulti={true}
                                                            validate={composeValidators(requiredSelect)}
                                                        />
                                                    </div>
                                                    <div className="info-input">
                                                        <img src={proInfo} alt="Info" />
                                                        <p>Please only select building type amenities. May be force limited in the future.</p>
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
            {
                buildingName && deleteModal ?  (
                    <DeleteBuildingModel
                        show={deleteModal}
                        handleClose={() => setDeleteModal(false)}
                        buildingId={buildingId}
                        building={buildingName}
                        updateListItem={updateListItem}
                    />
                )
                :
                null
            }
        </>
    );
};

export default AddEditBuilding;
