import React, { useState, useEffect, useRef } from "react";
import { Form } from "react-final-form";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { composeValidators, required, requiredSelect } from "../../../validations";
import { FormControl } from "../../../components/FormElements/FormControl";
import { Link, useNavigate, useParams } from "react-router-dom";
import proInfo from "../../../assets/images/Info.svg";
import Breadcrumb from 'react-bootstrap/Breadcrumb';
import { DatePickerControl } from "../../../components/FormElements/DatePicker";
import minusIcon from "../../../assets/images/minus.svg";
import plusBlack from "../../../assets/images/plus-black.svg";
import dollarIcon from "../../../assets/images/dollar.svg";
import percentIcon from "../../../assets/images/percent-Icon.svg";
import { toast } from 'react-toastify';
import { CheckboxControlGlobal } from "../../../components/FormElements/CheckboxControl";
import { useCustomMutation } from "../../../hooks/useApi";
import { createLease, getRecurringFee } from "../../../api/admin/lease";
import { ROUTE_NAVIGATION_PATH } from "../../../routes/routes";
import { Spinner } from "react-bootstrap";
import PropertyListDropDown from "../../../components/SearchSelect/PropertyListDropDown";
import RenterTypeList from "../../../components/SearchSelect/RenterTypeList";
import AttacheUserListDropDown from "../../../components/SearchSelect/AttacheUserListDropDown";
import LeaseStatusList from "../../../components/SearchSelect/LeaseStatus";
import { SearchSelectWithForm } from "../../../components/SearchSelect/SearchSelect";
import { ADD_EDIT_LEASE, CLEANING_FREQUENCY } from "../../../constants";
import PerDiemTypeList from "../../../components/SearchSelect/PerDiemTypeList";
import LeaseTemplateList from "../../../components/SearchSelect/LeaseTemplateList";
import GuestForm from "./MultipleGuest";
import moment from "moment";
import { propertyDetails } from "../../../api/admin/property";
import { AxiosError } from "axios";
import AllUserListDropDown from "../../../components/SearchSelect/AllUserListDropDown";
import GetUserListDropDown from "../../../components/SearchSelect/GetUserListDropDown";

export default function AddLease() {
    const navigate = useNavigate();
    const [loader, setLoader] = useState(true);
    const params = useParams();
    const handleSubmitRef = useRef<() => void>(() => { }); // Create a ref to store the handleSubmit function
    const [initData, setInitData] = useState<any>(ADD_EDIT_LEASE);
    const [initialOwners, setInitialOwners] = useState<any[]>([]);
    const [petAllow, setPetAllow] = useState(true);
    const [parkingAllow, setParkingAllow] = useState(true);
    const [floorRate, setFloorRate] = useState<any>(0.00);
    const [spinner, setSpiner] = useState(false);
    const [bedroomCount, setBedroomCount] = useState<any>(null);
    const [propertyId, setPropertyId] = useState<any>(null);

    useEffect(() => {
        if(params.id){
            //
        } else {
            setInitData((prevState: any) => ({
                ...prevState,
                leaseStartDate: moment.utc().toDate(),
                leaseEndDate: moment.utc().add(30, 'days').toDate(),
                renterType: 10
            }));
            setLoader(false);
        }
        
    }, []);

    const submitForm = () => {
        if (handleSubmitRef.current) {
            handleSubmitRef.current(); // Programmatically trigger form submission
        }
    };

    const onSubmit = (values: any) => {
        const data = { ...values };
        Object.keys(data).forEach(key => {
            if (key.startsWith("Email") || key.startsWith("email")) {
              delete data[key];
            }
        });
          
        if (initialOwners && initialOwners.length > 0) {
            let owners = JSON.parse(JSON.stringify(initialOwners));

            owners.forEach((item:any) => {
                if (item.Email) {
                  item.guestId = item.Email.value; // Reassign to only keep the 'value' key
                }
                delete item.Email;
              });
            data.guests = owners
        }
        data.propertyId = data.propertyId && data.propertyId.value ? data.propertyId.value : initData.propertyId;
        data.guarantorId = data.guarantorId && data.guarantorId.value ? data.guarantorId.value : initData.guarantorId;
        data.billingContactId = data.billingContactId && data.billingContactId.value ? data.billingContactId.value : initData.billingContactId;
        data.renterType = data.renterType && data.renterType.value ? data.renterType.value : initData.renterType;
        data.leasingAgentId = data.leasingAgentId && data.leasingAgentId.value ? data.leasingAgentId.value : initData.leasingAgentId;
        data.status = data.status && data.status.value ? data.status.value : initData.status;
        data.recurringCleaningFrequency = data.recurringCleaningFrequency ? data.recurringCleaningFrequency : 0;
        data.perDiemType = data.perDiemType && data.perDiemType.value ? data.perDiemType.value : initData.perDiemType;
        data.template_id = data.template_id && data.template_id.value ? data.template_id.value : initData.template_id;
        data.noticeToExtendDays = data.noticeToExtendDays ? parseFloat(data.noticeToExtendDays) : initData.noticeToExtendDays;
        data.ratePerDay = data.ratePerDay ? parseFloat(data.ratePerDay) : initData.ratePerDay;
        data.petDescription = data.petDescription ? data.petDescription : null;
        data.parkingDescription = data.parkingDescription ? data.parkingDescription : null;
        data.parkingFee = data.parkingFee ? parseFloat(data.parkingFee) : null;
        data.petFee = data.petFee ? parseFloat(data.petFee) : null;
        data.departureCleaningFee = data.departureCleaningFee ? parseFloat(data.departureCleaningFee) : 0;
        data.serviceFee = data.serviceFee ? parseFloat(data.serviceFee) : initData.serviceFee;
        data.recurringCleaningRate = data.recurringCleaningRate ? parseFloat(data.recurringCleaningRate) : 0;
        data.perDiemPercentage = data.perDiemPercentage ? parseFloat(data.perDiemPercentage) : initData.perDiemPercentage;
        data.leaseStartDate = data.leaseStartDate ? moment(data.leaseStartDate, 'YYYY-MM-DD hh:mm A').format('YYYY-MM-DD HH:mm:ss') : null;
        data.leaseEndDate = data.leaseEndDate ? moment(data.leaseEndDate, 'YYYY-MM-DD hh:mm A').format('YYYY-MM-DD HH:mm:ss') : null;
        data.recurringCleaningStartDate = data.recurringCleaningStartDate ? moment.utc(data.recurringCleaningStartDate).format('YYYY-MM-DD HH:mm:ss') : null;
        data.perDiemStartDate = data.perDiemStartDate ? moment(data.perDiemStartDate, 'YYYY-MM-DD hh:mm A').format('YYYY-MM-DD HH:mm:ss') : null;
        data.payments = [];
        data.invoices = [];
        data.taxable = false;
        data.taxRate = 0;

        mutate(data);
    };

    const { mutate } = useCustomMutation({
        mutationFn: (req: any) => {
            setSpiner(true);
            return createLease(req);
        },
        onSuccess: async () => {
            setSpiner(false);
            toast.success('Lease created successfully')
            navigate(ROUTE_NAVIGATION_PATH.LEASING_MANAGER_LIST);
            
        },
        onError: (error: AxiosError<{ message: string; status: number, code: number }>) => {
            setSpiner(false);
        },
    });

    const increaseCount = () => {
        setInitData((prevState: any) => ({
            ...prevState, // Keep all the current form values intact
            numberOfPersons: Number(prevState.numberOfPersons) + 1, // Decrease unitSize
        }));
      }
    
    const decreaseCount = () => {
        if (Number(initData.numberOfPersons) == 0) {
            return;
        } else {
            setInitData((prevState: any) => ({
                ...prevState,
                numberOfPersons: Number(prevState.numberOfPersons) - 1
            }));
        }
    }

    const increaseNoticeCount = () => {
        setInitData((prevState: any) => ({
            ...prevState, // Keep all the current form values intact
            noticeToExtendDays: Number(prevState.noticeToExtendDays) + 1, // Decrease unitSize
        }));
      }
    
    const decreaseNoticeCount = () => {
        if (Number(initData.noticeToExtendDays) == 0) {
            return;
        } else {
            setInitData((prevState: any) => ({
                ...prevState,
                noticeToExtendDays: Number(prevState.noticeToExtendDays) - 1
            }));
        }
    }

    const handleAddOwner = (newOwner: { Email: any; isPrimary: boolean, nteEmail: boolean, arrivalDepartureEmail: boolean,
        notifyTheUser: boolean;
        paymentsReminder: boolean;
        viewLeaseOnDashboard: boolean;
        payInvoice: boolean
    }) => {
        // Ensure only one primary guest
        if (newOwner.isPrimary) {
          const updatedOwners = initialOwners.map((owner) => ({
            ...owner,
            isPrimary: false, // Set all others to non-primary
          }));
          setInitialOwners([...updatedOwners, newOwner]);
        } else {
          setInitialOwners([...initialOwners, newOwner]);
        }
    };
    
    // Function to handle editing an existing owner
    const handleEditOwner = (index: number, updatedOwner: { Email: any; isPrimary: boolean, arrivalDepartureEmail: boolean,
        notifyTheUser: boolean;
        paymentsReminder: boolean;
        viewLeaseOnDashboard: boolean;
        payInvoice: boolean
    }) => {
        const updatedOwners = [...initialOwners];
        // Ensure only one primary guest
        if (updatedOwner.isPrimary) {
          updatedOwners.forEach((owner) => (owner.isPrimary = false));
        }
        updatedOwners[index] = updatedOwner;
        setInitialOwners(updatedOwners);
    };
    
    // Function to handle removing an owner
    const handleRemoveOwner = (index: number) => {
        const updatedOwners = initialOwners.filter((_, idx) => idx !== index);
        setInitialOwners(updatedOwners);
    };

    const getPropertyDetail = (propertyId:any, unitBedrooms:any, leaseStartDate:any, leaseEndDate:any) => {
        let arrivalDate = moment.utc(leaseStartDate).format('YYYY-MM-DD');
        let departureDate = moment.utc(leaseEndDate).format('YYYY-MM-DD')
        propertyDetails(propertyId, arrivalDate, departureDate).then((res: any) => {
            setInitData((prevState: any) => ({
                ...prevState,
                // parkingFee: res.data.propertyDetails.dailyParkingFees,
                parkingDescription: res.data.propertyDetails.parkingDescription,
                // petFee: res.data.propertyDetails.oneTimePetFees,
                petDescription: res.data.propertyDetails.petRegulations,
                leasingAgentId: res.data.propertyStatus.leasingManagerId,
                ratePerDay : res.data.propertyStatus.dailyRate ? res.data.propertyStatus.dailyRate : 0,
                isNightlyRate: true,
            }));   
            setFloorRate(res.data.propertyStatus.floorRate ? res.data.propertyStatus.floorRate : 0.00);
            if(initData.recurringCleaning == true && initData.recurringCleaningFrequency) {
                let payload = {
                    weeks: initData.recurringCleaningFrequency,
                    beds: unitBedrooms,
                    arrivalDate: initData.leaseStartDate
                }
                getRecurringFee(payload).then((res:any) => {                    
                    setInitData((prevState: any) => ({
                        ...prevState,
                        recurringCleaningStartDate: res.date,
                        recurringCleaningRate: res.price

                    }));
                })
                
            }
            handleSetCfee(unitBedrooms ? Number(unitBedrooms) : 0);
        });
    }

    const setCleaningRate = (recurringCleaningFrequency:any) => {
        let payload = {
            weeks: recurringCleaningFrequency,
            beds: bedroomCount,
            arrivalDate: initData.leaseStartDate
        }
        getRecurringFee(payload).then((res:any) => {                    
            setInitData((prevState: any) => ({
                ...prevState,
                recurringCleaningRate: res.price
            }));
        })
    }

    const getCleaningFrequencyDays = (value: number) => {
        const frequency = CLEANING_FREQUENCY.find(item => item.value === value);
        return frequency ? frequency.days : null; // Returns `null` if not found
    };

    const handleSetCfee = (unitBedrooms:number) => {
        let fee:any;
        switch (unitBedrooms) {
          case 0:
          case 1:
            fee = 235;
            break;
          case 2:
            fee = 270;
            break;
          case 3:
            fee = 320;
            break;
          case 4:
            fee = 350;
            break;
          case 5:
            fee = 370;
            break;
          default:
            fee = 390;
        }
        setInitData((prevState: any) => ({
            ...prevState,
            departureCleaningFee: fee,
        }));
    };

    return (
        <>
            <div className="common-right-panel-section _edit-property-section">
                <div className="top-right-bar">
                    <Breadcrumb>
                        <Breadcrumb.Item href="#">Leasing Manager</Breadcrumb.Item>
                        <Breadcrumb.Item href={ROUTE_NAVIGATION_PATH.LEASING_MANAGER_LIST}>All Leases</Breadcrumb.Item>
                        <Breadcrumb.Item active>{params.id ? 'Edit' : 'Create'} Lease</Breadcrumb.Item>
                    </Breadcrumb>
                    <div className="guest-header">
                        <div className="guest-left ">
                            <h1>Create Lease</h1>
                        </div>
                        <div className="guest-right">
                            <Link to={ROUTE_NAVIGATION_PATH.LEASING_MANAGER_LIST}>
                                <button className="btn-delete">Cancel</button>
                            </Link>
                            <button className="btn-primary" onClick={submitForm}>Create New Lease</button>
                        </div>
                    </div>
                </div>
                <div className="mid-content-section">
                    <div className="guest-general-information scrollbar">
                        <div className="info-wrapper info-wrapper-multiple">
                            <div className="infoleft">
                                <h2>Enter Lease Details</h2>
                            </div>
                            <>
                                {spinner ? <div className="spinner-wrapper"><Spinner /></div> : null}
                            </>
                            {
                                loader ? (
                                    <div className="spinner-wrapper"><Spinner /></div>
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
                                                            <div className="col-12 col-md-12 custom-select-form">
                                                                <div className="text-start form-field">
                                                                    <PropertyListDropDown
                                                                        label="Property"
                                                                        name="propertyId"
                                                                        isSearchable
                                                                        validate={composeValidators(requiredSelect)}
                                                                        onChange={(e:any) => {
                                                                            setBedroomCount(e.unitBedrooms);
                                                                            console.log(e.unitBedrooms);
                                                                            setPropertyId(e.propertyId);
                                                                            setInitData((prevState: any) => ({
                                                                                ...prevState,
                                                                                propertyId: e.value
                                                                            }));
                                                                            getPropertyDetail(e.propertyId, e.unitBedrooms, initData.leaseStartDate, initData.leaseEndDate);
                                                                            
                                                                        }}
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="col-12 _add-email-data _add-contact-data">
                                                                <GuestForm
                                                                    initialOwners={initialOwners}
                                                                    onAddOwner={handleAddOwner}
                                                                    onEditOwner={handleEditOwner} // Pass remove handler
                                                                    onRemoveOwner={handleRemoveOwner}
                                                                />
                                                            </div>
                                                            <div className="col-12 col-md-12 custom-select-form">
                                                                <div className="text-start form-field">
                                                                    <AllUserListDropDown
                                                                        label=" Guarantor"
                                                                        name="guarantorId"
                                                                        isSearchable
                                                                        onChange={(e:any) => {
                                                                            setInitData((prevState: any) => ({
                                                                                ...prevState,
                                                                                guarantorId: e.value
                                                                            }));
                                                                        }}
                                                                    />

                                                                </div>
                                                            </div>
                                                            <div className="col-12 col-md-12 custom-select-form">
                                                                <div className="text-start form-field">
                                                                    <AllUserListDropDown
                                                                        label="Billing Contact"
                                                                        name="billingContactId"
                                                                        isSearchable
                                                                        onChange={(e:any) => {
                                                                            setInitData((prevState: any) => ({
                                                                                ...prevState,
                                                                                billingContactId: e.value
                                                                            }));
                                                                        }}
                                                                    />

                                                                </div>
                                                            </div>
                                                            <div className="col-12">
                                                                <FormControl
                                                                    label="Alternative Name"
                                                                    name="alternativeNameOnLease"
                                                                    type="text"
                                                                    onChange={(e:any) => {
                                                                        setInitData((prevState: any) => ({
                                                                            ...prevState,
                                                                            alternativeNameOnLease: e.target.value
                                                                        }));
                                                                    }}
                                                                />
                                                                 <div className="info-input">
                                                                    <img src={proInfo} alt="Info" />
                                                                    <p>Replaces the Primary Guest name on the generated lease agreement. (Template must be compatible)</p>
                                                                </div>

                                                            </div>
                                                            <div className="col-12 col-md-4 custom-select-form ">
                                                                <div className="text-start form-field mb-0">
                                                                    <RenterTypeList
                                                                        label="Renter Type*"
                                                                        name="renterType"
                                                                        isSearchable
                                                                        validate={composeValidators(requiredSelect)}
                                                                        onChange={(e:any) => {
                                                                            setInitData((prevState: any) => ({
                                                                                ...prevState,
                                                                                renterType: e.value
                                                                            }));
                                                                        }}
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="col-12 col-md-8 custom-select-form ">
                                                                {
                                                                    !initData.leasingAgentId && (
                                                                        <div className="text-start form-field mb-0">
                                                                            <AttacheUserListDropDown
                                                                                label="Leasing Agent"
                                                                                name="leasingAgentId"
                                                                                isSearchable
                                                                                //type="4"
                                                                                onChange={(e:any) => {
                                                                                    setInitData((prevState: any) => ({
                                                                                        ...prevState,
                                                                                        leasingAgentId: e.value
                                                                                    }));
                                                                                }}
                                                                            />
                                                                        </div>
                                                                    )
                                                                }
                                                                {
                                                                    initData.leasingAgentId && (
                                                                        <div className="text-start form-field mb-0">
                                                                            <AttacheUserListDropDown
                                                                                label="Leasing Agent"
                                                                                name="leasingAgentId"
                                                                                isSearchable
                                                                                //type="4"
                                                                                onChange={(e:any) => {
                                                                                    setInitData((prevState: any) => ({
                                                                                        ...prevState,
                                                                                        leasingAgentId: e.value
                                                                                    }));
                                                                                }}
                                                                            />
                                                                        </div>
                                                                    )
                                                                }
                                                               
                                                                <div className="info-input">
                                                                    <img src={proInfo} alt="Info" />
                                                                    <p>The authorized lease signing agent from Attache for this agreement. Will be required to sign the agreement to finalize.</p>
                                                                </div>
                                                            </div>
                                                            <div className="col-12 col-md-12 custom-select-form mb-0">
                                                                <div className="text-start form-field">
                                                                    <LeaseStatusList
                                                                        label="Status*"
                                                                        name="status"
                                                                        isSearchable
                                                                        onChange={(e:any) => {
                                                                            setInitData((prevState: any) => ({
                                                                                ...prevState,
                                                                                status: e.value
                                                                            }));
                                                                        }}
                                                                    />
                                                                    <div className="info-input">
                                                                        <img src={proInfo} alt="Info" />
                                                                        <p>In the future this will not be editable as it's managed by the system now.</p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="col-12 col-md-12">
                                                                <div className="col-12 col-md-4 teamsort">
                                                                    <FormControl
                                                                        label="Number of Persons"
                                                                        name="numberOfPersons"
                                                                        type="text"
                                                                        onChange={(e:any) => {
                                                                            setInitData((prevState: any) => ({
                                                                                ...prevState,
                                                                                numberOfPersons: e.target.value
                                                                            }));
                                                                        }}
                                                                        validate={composeValidators(required)}
                                                                    />
                                                                    <div className="plusminus">
                                                                        <div className="boxes" onClick={() => decreaseCount()}><img src={minusIcon} alt="Icon" /></div>
                                                                        <div className="boxes" onClick={() => increaseCount()}><img src={plusBlack} alt="Icon" /></div>
                                                                    </div>

                                                                </div>
                                                            </div>
                                                            <div className="col-12 col-md-6 _datepickerform">
                                                                <DatePickerControl
                                                                    label="Arrival"
                                                                    name="leaseStartDate"
                                                                    type={'dateTime'}
                                                                    placeholder="MM-DD-YY"
                                                                    validate={composeValidators(required)}
                                                                    onChange={(date:any) => {
                                                                        setInitData((prevState: any) => ({
                                                                            ...prevState,
                                                                            leaseStartDate: date
                                                                        }));
                                                                        if(propertyId) {
                                                                            getPropertyDetail(propertyId, bedroomCount, date, initData.leaseEndDate);
                                                                        }
                                                                        if(initData.recurringCleaning == true && initData.recurringCleaningFrequency) {         
                                                                            let day = getCleaningFrequencyDays(initData.recurringCleaningFrequency);

                                                                            setInitData((prevState: any) => ({
                                                                                ...prevState,
                                                                                recurringCleaningStartDate: moment.utc(date).add(day, 'days').toISOString()                                                        
                                                                            }));
                                                                        }
                                                                        
                                                                    }}
                                                                />
                                                            </div>
                                                            <div className="col-12 col-md-6 _datepickerform">
                                                                <DatePickerControl
                                                                    label="Departure"
                                                                    name="leaseEndDate"
                                                                    type={'dateTime'}
                                                                    placeholder="MM-DD-YY"
                                                                    validate={composeValidators(required)}
                                                                    onChange={(date:any) => {
                                                                        setInitData((prevState: any) => ({
                                                                            ...prevState,
                                                                            leaseEndDate: date
                                                                        }));
                                                                        if(propertyId) {
                                                                            getPropertyDetail(propertyId, bedroomCount, initData.leaseStartDate, date);
                                                                        }
                                                                        
                                                                    }}
                                                                />
                                                            </div>
                                                            <div className="col-12 col-md-6 _dollar">
                                                                <FormControl
                                                                    label="Daily/Nightly Rate"
                                                                    name="ratePerDay"
                                                                    type="input-decimal"
                                                                    onChange={(e:any) => {
                                                                        setInitData((prevState: any) => ({
                                                                            ...prevState,
                                                                            ratePerDay: e.target.value
                                                                        }));
                                                                    }}
                                                                />
                                                                <div className="dollarIcon">
                                                                    <img src={dollarIcon} alt="Dollar" />
                                                                </div>
                                                                <div className="info-input">
                                                                    <img src={proInfo} alt="Info" />
                                                                    <p>The floor rate for this property is ${floorRate} per day.</p>
                                                                </div>
                                                            </div>
                                                            <div className="col-12 col-md-6 _checkboxmob mt-4">
                                                                <CheckboxControlGlobal
                                                                    name="extensionAllowed"
                                                                    label="Extension Allowed "
                                                                    onChange={(e:any) => {
                                                                        setInitData((prevState: any) => ({
                                                                            ...prevState,
                                                                            extensionAllowed: e.target.checked
                                                                        }));
                                                                    }}
                                                                />
                                                            </div>
                                                            <div className="col-12 col-md-12">
                                                                <div className="col-12 col-md-12 teamsort">
                                                                    <FormControl
                                                                        label="Notice to Extend"
                                                                        name="noticeToExtendDays"
                                                                        type="input-decimal"
                                                                        onChange={(e:any) => {
                                                                            setInitData((prevState: any) => ({
                                                                                ...prevState,
                                                                                noticeToExtendDays: e.target.value
                                                                            }));
                                                                        }}
                                                                    />
                                                                    {/* <div className="plusminus">
                                                                        <div className="boxes" onClick={() => decreaseNoticeCount()}><img src={minusIcon} alt="Icon" /></div>
                                                                        <div className="boxes" onClick={() => increaseNoticeCount()}><img src={plusBlack} alt="Icon" /></div>
                                                                    </div> */}

                                                                </div>
                                                            </div>
                                                            <div className="col-12 col-md-6 _checkboxmob mb-4">
                                                                <CheckboxControlGlobal
                                                                    name="isNightlyRate"
                                                                    label="Nightly rate"
                                                                    onChange={(e:any) => {
                                                                        setInitData((prevState: any) => ({
                                                                            ...prevState,
                                                                            isNightlyRate: e.target.checked
                                                                        }));
                                                                    }}
                                                                />
                                                            </div>
                                                            <div className="col-12 col-md-6 _checkboxmob mb-4">
                                                                <CheckboxControlGlobal
                                                                    name="monthToMonth"
                                                                    label="Month to Month"
                                                                    onChange={(e:any) => {
                                                                        setInitData((prevState: any) => ({
                                                                            ...prevState,
                                                                            monthToMonth: e.target.checked
                                                                        }));
                                                                    }}
                                                                />
                                                            </div>
                                                            <div className="col-12 col-md-6 _checkboxmob mb-4">
                                                                <CheckboxControlGlobal
                                                                    name="billingMonthlyDaily"
                                                                    label="Monthly Daily"
                                                                    onChange={(e:any) => {
                                                                        setInitData((prevState: any) => ({
                                                                            ...prevState,
                                                                            billingMonthlyDaily: e.target.checked
                                                                        }));
                                                                    }}
                                                                />
                                                                <div className="info-input">
                                                                    <img src={proInfo} alt="Info" />
                                                                    <p>Payments due on the first of each month. Daily rate * number of days in the month.</p>
                                                                </div>
                                                            </div>
                                                            <div className="col-12 col-md-6 _checkboxmob mb-4">
                                                                <CheckboxControlGlobal
                                                                    name="hasParking"
                                                                    label="Parking"
                                                                    onChange={(e:any) => {
                                                                        setParkingAllow(e.target.checked == true ? false : true)
                                                                        setInitData((prevState: any) => ({
                                                                            ...prevState,
                                                                            hasParking: e.target.checked
                                                                        }));
                                                                    }}
                                                                />
                                                                <div className="info-input">
                                                                    <img src={proInfo} alt="Info" />
                                                                    <p>Sets the parking to YES in the lease agreement.</p>
                                                                </div>
                                                            </div>
                                                            <div className="col-12 col-md-6 _checkboxmob mb-4">
                                                                <CheckboxControlGlobal
                                                                    name="billingMonthly"
                                                                    label="Bill Monthly"
                                                                    onChange={(e:any) => {
                                                                        setInitData((prevState: any) => ({
                                                                            ...prevState,
                                                                            billingMonthly: e.target.checked
                                                                        }));
                                                                    }}
                                                                />
                                                                <div className="info-input">
                                                                    <img src={proInfo} alt="Info" />
                                                                    <p>Payments due on the first of each month. Prorates the first and last month if necessary.</p>
                                                                </div>
                                                            </div>
                                                            <div className="col-12 col-md-12 _dollar">
                                                                <FormControl
                                                                    label="Parking 30-Day/Night Rate"
                                                                    name="parkingFee"
                                                                    type="input-decimal"
                                                                    disabled={parkingAllow}
                                                                    onChange={(e:any) => {
                                                                        setInitData((prevState: any) => ({
                                                                            ...prevState,
                                                                            parkingFee: e.target.value
                                                                        }));
                                                                    }}
                                                                />
                                                                <div className="dollarIcon">
                                                                    <img src={dollarIcon} alt="Dollar" />
                                                                </div>

                                                            </div>
                                                            <div className="col-12">
                                                                <FormControl
                                                                    label="Parking Description"
                                                                    name="parkingDescription"
                                                                    type="text"
                                                                    disabled={parkingAllow}
                                                                    onChange={(e:any) => {
                                                                        setInitData((prevState: any) => ({
                                                                            ...prevState,
                                                                            parkingDescription: e.target.value
                                                                        }));
                                                                    }}
                                                                />
                                                                <div className="info-input">
                                                                    <img src={proInfo} alt="Info" />
                                                                    <p>May appear in parking section of the lease agreement if the template is setup to do so.</p>
                                                                </div>
                                                            </div>

                                                            <div className="col-12 col-md-6 _checkboxmob mb-4">
                                                                <CheckboxControlGlobal
                                                                    name="petsAllowed"
                                                                    label="Pets Allowed"
                                                                    onChange={(e:any) => {
                                                                        setPetAllow(e.target.checked == true ? false : true)
                                                                        setInitData((prevState: any) => ({
                                                                            ...prevState,
                                                                            petsAllowed: e.target.checked
                                                                        }));
                                                                    }}
                                                                />
                                                                <div className="info-input">
                                                                    <img src={proInfo} alt="Info" />
                                                                    <p>Sets pets allowed to YES in the lease agreement.</p>
                                                                </div>
                                                            </div>
                                                            <div className="col-12 col-md-12 _dollar">
                                                                <FormControl
                                                                    label="Pet Fee"
                                                                    name="petFee"
                                                                    type="input-decimal"
                                                                    disabled={petAllow}
                                                                    onChange={(e:any) => {
                                                                        setInitData((prevState: any) => ({
                                                                            ...prevState,
                                                                            petFee: e.target.value
                                                                        }));
                                                                    }}
                                                                />
                                                                <div className="dollarIcon">
                                                                    <img src={dollarIcon} alt="Dollar" />
                                                                </div>
                                                                <div className="info-input">
                                                                    <img src={proInfo} alt="Info" />
                                                                    <p>One time pet fee if different from standard pet fee. Standard fee is one time fee of $450.00 USD due by lease start date.</p>
                                                                </div>

                                                            </div>
                                                            <div className="col-12">
                                                                <FormControl
                                                                    label="Pet Description"
                                                                    name="petDescription"
                                                                    type="text"
                                                                    disabled={petAllow}
                                                                    onChange={(e:any) => {
                                                                        setInitData((prevState: any) => ({
                                                                            ...prevState,
                                                                            petDescription: e.target.value
                                                                        }));
                                                                    }}
                                                                />
                                                                <div className="info-input">
                                                                    <img src={proInfo} alt="Info" />
                                                                    <p>May appear in pet section of the lease agreement if the template is set up to do so.</p>
                                                                </div>
                                                            </div>
                                                            <div className="col-12 col-md-12 _dollar">
                                                                <FormControl
                                                                    label="Departure Cleaning Fee"
                                                                    name="departureCleaningFee"
                                                                    type="text"
                                                                    onChange={(e:any) => {
                                                                        setInitData((prevState: any) => ({
                                                                            ...prevState,
                                                                            departureCleaningFee: e.target.value
                                                                        }));
                                                                    }}
                                                                />
                                                                <div className="dollarIcon">
                                                                    <img src={dollarIcon} alt="Dollar" />
                                                                </div>
                                                                <div className="info-input">
                                                                    <img src={proInfo} alt="Info" />
                                                                    <p>Based on bedroom count.</p>
                                                                </div>

                                                            </div>
                                                            <div className="col-12 col-md-12 _dollar">
                                                                <FormControl
                                                                    label="Service Fee"
                                                                    name="serviceFee"
                                                                    type="input-decimal"
                                                                    onChange={(e:any) => {
                                                                        setInitData((prevState: any) => ({
                                                                            ...prevState,
                                                                            serviceFee: e.target.value
                                                                        }));
                                                                    }}
                                                                />
                                                                <div className="dollarIcon">
                                                                    <img src={percentIcon} alt="Dollar" />
                                                                </div>
                                                                <div className="info-input">
                                                                    <img src={proInfo} alt="Info" />
                                                                    <p>You cannot enter negative value.</p>
                                                                </div>

                                                            </div>
                                                            <div className="col-12 col-md-6 custom-select-form">
                                                                <div className="text-start form-field mb-0">
                                                                    <SearchSelectWithForm
                                                                        name="recurringCleaningFrequency"
                                                                        label="Cleaning Frequency"
                                                                        options={CLEANING_FREQUENCY}
                                                                        placeholder={CLEANING_FREQUENCY[0].label}
                                                                        onChange={(e:any) => {
                                                                            setInitData((prevState: any) => ({
                                                                                ...prevState,
                                                                                recurringCleaningFrequency: e.value
                                                                            }));
                                                                            if(initData.recurringCleaning && e.value !== '') {
                                                                                setInitData((prevState: any) => ({
                                                                                    ...prevState,
                                                                                    recurringCleaningStartDate: moment.utc(initData.leaseStartDate).add(e.days, 'days').toISOString()
                                                                                }));
                                                                                
                                                                                if(bedroomCount) {
                                                                                    setCleaningRate(e.value);
                                                                                }
                                                                            }else {
                                                                                setInitData((prevState: any) => ({
                                                                                    ...prevState,
                                                                                    recurringCleaningStartDate: null,
                                                                                    recurringCleaningRate: null
                                                                                }));
                                                                            }
                                                                        }}
                                                                    />
                                                                    <div className="info-input">
                                                                        <img src={proInfo} alt="Info" />
                                                                        <p>Frequency is based on weeks such as every four weeks rather than monthly.</p>
                                                                    </div>

                                                                </div>
                                                            </div>
                                                            <div className="col-12 col-md-6 _checkboxmob mt-4 mb-3">
                                                                <CheckboxControlGlobal
                                                                    name="recurringCleaning"
                                                                    label="Recurring Cleaning"
                                                                    onChange={(e:any) => {
                                                                        setInitData((prevState: any) => ({
                                                                            ...prevState,
                                                                            recurringCleaning: e.target.checked
                                                                        }));
                                                                        if(e.target.checked == true && initData.recurringCleaningFrequency) {
                                                                            let day = getCleaningFrequencyDays(initData.recurringCleaningFrequency);
                                                                            setInitData((prevState: any) => ({
                                                                                ...prevState,
                                                                                recurringCleaningStartDate: moment.utc(initData.leaseStartDate).add(day, 'days').toISOString()
                                                                            }));
                                                                            if(bedroomCount) {
                                                                                setCleaningRate(initData.recurringCleaningFrequency);
                                                                            }
                                                                        } else {
                                                                            setInitData((prevState: any) => ({
                                                                                ...prevState,
                                                                                recurringCleaningStartDate: null,
                                                                                recurringCleaningRate: null
                                                                            }));
                                                                        }
                                                                    }}
                                                                />
                                                            </div>

                                                            <div className="col-12 col-md-6 _datepickerform">
                                                                <DatePickerControl
                                                                    label="Cleaning Beginning"
                                                                    name="recurringCleaningStartDate"
                                                                    type={'dateTime'}
                                                                    placeholder="MM-DD-YY"
                                                                    onChange={(date:any) => {
                                                                        setInitData((prevState: any) => ({
                                                                            ...prevState,
                                                                            recurringCleaningStartDate: date
                                                                        }));
                                                                    }}
                                                                />
                                                            </div>
                                                            <div className="col-12 col-md-6 _dollar">
                                                                <FormControl
                                                                    label="Cleaning Rate"
                                                                    name="recurringCleaningRate"
                                                                    type="input-decimal"
                                                                    onChange={(e:any) => {
                                                                        setInitData((prevState: any) => ({
                                                                            ...prevState,
                                                                            recurringCleaningRate: e.target.value
                                                                        }));
                                                                    }}
                                                                />
                                                                <div className="dollarIcon">
                                                                    <img src={dollarIcon} alt="Dollar" />
                                                                </div>

                                                            </div>

                                                            <div className="col-12 col-md-12">
                                                                <FormControl
                                                                    label="Cleaning Note"
                                                                    name="recurringCleaningNote"
                                                                    type="text"
                                                                    onChange={(e:any) => {
                                                                        setInitData((prevState: any) => ({
                                                                            ...prevState,
                                                                            recurringCleaningNote: e.target.value
                                                                        }));
                                                                    }}
                                                                />
                                                                <div className="info-input">
                                                                    <img src={proInfo} alt="Info" />
                                                                    <p>Internal note about cleaning.</p>
                                                                </div>
                                                            </div>

                                                            <div className="col-12 col-md-12 _checkboxmob mb-4">
                                                                <CheckboxControlGlobal
                                                                    name="generateRecurringCleaningSchedule"
                                                                    label="Generate Recurring Cleaning Schedule"
                                                                    onChange={(e:any) => {
                                                                        setInitData((prevState: any) => ({
                                                                            ...prevState,
                                                                            generateRecurringCleaningSchedule: e.target.checked
                                                                        }));
                                                                    }}
                                                                />
                                                                <div className="info-input">
                                                                    <img src={proInfo} alt="Info" />
                                                                    <p>Generate the recurring cleaning billing schedule.</p>
                                                                </div>
                                                            </div>
                                                            <div className="col-12 col-md-12 _checkboxmob mb-4">
                                                                <CheckboxControlGlobal
                                                                    name="taxExempt"
                                                                    label="Tax Exempt"
                                                                    onChange={(e:any) => {
                                                                        setInitData((prevState: any) => ({
                                                                            ...prevState,
                                                                            taxExempt: e.target.checked
                                                                        }));
                                                                    }}
                                                                />
                                                                <div className="info-input">
                                                                    <img src={proInfo} alt="Info" />
                                                                    <p>Only check if guest is Tax Exempt ( not for per diem billing )</p>
                                                                </div>
                                                            </div>
                                                            <div className="col-12">
                                                                <FormControl
                                                                    label="Tax Exempt Reason"
                                                                    name="taxExemptReason"
                                                                    type="text"
                                                                    onChange={(e:any) => {
                                                                        setInitData((prevState: any) => ({
                                                                            ...prevState,
                                                                            taxExemptReason: e.target.value
                                                                        }));
                                                                    }}
                                                                />
                                                            </div>

                                                            <div className="col-12 col-md-12 _checkboxmob mb-4">
                                                                <CheckboxControlGlobal
                                                                    name="isPerDiem"
                                                                    label="Is Per Diem"
                                                                    onChange={(e:any) => {
                                                                        setInitData((prevState: any) => ({
                                                                            ...prevState,
                                                                            isPerDiem: e.target.checked
                                                                        }));
                                                                    }}
                                                                />
                                                                <div className="info-input">
                                                                    <img src={proInfo} alt="Info" />
                                                                    <p>Causes billing generator to calculate sliding scale per diem http://www.gsa.gov/portal/category/100120</p>
                                                                </div>
                                                            </div>

                                                            <div className="col-12 col-md-12 custom-select-form">
                                                                <div className="text-start form-field mb-0">
                                                                    <PerDiemTypeList
                                                                        label="Per Diem Type "
                                                                        name="perDiemType"
                                                                        isSearchable
                                                                        onChange={(e:any) => {
                                                                            setInitData((prevState: any) => ({
                                                                                ...prevState,
                                                                                perDiemType: e.value
                                                                            }));
                                                                        }}
                                                                    />

                                                                    <div className="info-input">
                                                                        <img src={proInfo} alt="Info" />
                                                                        <p>Select the rate provider type. Default is Standard - DC</p>
                                                                    </div>

                                                                </div>
                                                            </div>
                                                            <div className="col-12 col-md-12 _checkboxmob mb-4">
                                                                <CheckboxControlGlobal
                                                                    name="isDualPerDiem"
                                                                    label="Dual Per Diem"
                                                                    onChange={(e:any) => {
                                                                        setInitData((prevState: any) => ({
                                                                            ...prevState,
                                                                            isDualPerDiem: e.target.checked
                                                                        }));
                                                                    }}
                                                                />
                                                                <div className="info-input">
                                                                    <img src={proInfo} alt="Info" />
                                                                    <p>Basic dual per diem - just doubles the items.</p>
                                                                </div>
                                                            </div>
                                                            <div className="col-12 col-md-12 _datepickerform">
                                                                <DatePickerControl
                                                                    label="Per Diem Start Date"
                                                                    name="perDiemStartDate"
                                                                    type={'dateTime'}
                                                                    placeholder="MM-DD-YY"
                                                                    onChange={(date:any) => {
                                                                        setInitData((prevState: any) => ({
                                                                            ...prevState,
                                                                            perDiemStartDate: date
                                                                        }));
                                                                    }}
                                                                />
                                                                 <div className="info-input">
                                                                    <img src={proInfo} alt="Info" />
                                                                    <p>Set the per diem start date here if it is prior to the lease start date.</p>
                                                                </div>
                                                            </div>
                                                            <div className="col-12 col-md-12 _dollar">
                                                                <FormControl
                                                                    label="Per Diem Percentage "
                                                                    name="perDiemPercentage"
                                                                    type="input-decimal"
                                                                    onChange={(e:any) => {
                                                                        setInitData((prevState: any) => ({
                                                                            ...prevState,
                                                                            perDiemPercentage: e.target.value
                                                                        }));
                                                                    }}
                                                                />
                                                                <div className="dollarIcon">
                                                                    <img src={percentIcon} alt="percent" />
                                                                </div>
                                                                <div className="info-input">
                                                                    <img src={proInfo} alt="Info" />
                                                                    <p>Use this for non-sliding scale per diems such as Maternity leave.</p>
                                                                </div>
                                                            </div>
                                                            <div className="col-12 col-md-12 _checkboxmob mb-4">
                                                                <CheckboxControlGlobal
                                                                    name="generateBillingSchedule"
                                                                    label=" Generate Billing Schedule"
                                                                    onChange={(e:any) => {
                                                                        setInitData((prevState: any) => ({
                                                                            ...prevState,
                                                                            generateBillingSchedule: e.target.checked
                                                                        }));
                                                                    }}
                                                                />
                                                                <div className="info-input">
                                                                    <img src={proInfo} alt="Info" />
                                                                    <p>Will overwrite current billing schedule if there is one. Use with caution.</p>
                                                                </div>
                                                            </div>

                                                            <div className="col-12 col-md-12 custom-select-form">
                                                                <div className="text-start form-field">
                                                                    <LeaseTemplateList
                                                                        label="Lease Template"
                                                                        name="template_id"
                                                                        isSearchable
                                                                        onChange={(e:any) => {
                                                                            setInitData((prevState: any) => ({
                                                                                ...prevState,
                                                                                template_id: e.value
                                                                            }));
                                                                        }}
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="col-12 col-md-12 _checkboxmob mb-4">
                                                                <CheckboxControlGlobal
                                                                    name="includedLineItems"
                                                                    label="Inclusive Line Items"
                                                                    onChange={(e:any) => {
                                                                        setInitData((prevState: any) => ({
                                                                            ...prevState,
                                                                            includedLineItems: e.target.checked
                                                                        }));
                                                                    }}
                                                                />
                                                                <div className="info-input">
                                                                    <img src={proInfo} alt="Info" />
                                                                    <p>Whether to include non-included line items on the lease billing schedule.</p>
                                                                </div>
                                                            </div>

                                                            <div className="col-12 textareafield">
                                                                <FormControl
                                                                    label="Note"
                                                                    name="note"
                                                                    type="textarea"
                                                                    onChange={(e:any) => {
                                                                        setInitData((prevState: any) => ({
                                                                            ...prevState,
                                                                            note: e.target.value
                                                                        }));
                                                                    }}
                                                                />
                                                                <div className="info-input">
                                                                    <img src={proInfo} alt="Info" />
                                                                    <p>Internal notes for this lease.</p>
                                                                </div>
                                                            </div>
                                                            <div className="col-12 textareafield">
                                                                <FormControl
                                                                    label="Owner Note"
                                                                    name="ownerNote"
                                                                    type="textarea"
                                                                    onChange={(e:any) => {
                                                                        setInitData((prevState: any) => ({
                                                                            ...prevState,
                                                                            ownerNote: e.target.value
                                                                        }));
                                                                    }}
                                                                />
                                                                <div className="info-input">
                                                                    <img src={proInfo} alt="Info" />
                                                                    <p>Owner notes for this lease.</p>
                                                                </div>
                                                            </div>
                                                            <div className="col-12 col-md-12 _checkboxmob ">
                                                                <CheckboxControlGlobal
                                                                    name="sendLeaseFinalizeEmail"
                                                                    label="Send Lease Finalize Email"
                                                                    onChange={(e:any) => {
                                                                        setInitData((prevState: any) => ({
                                                                            ...prevState,
                                                                            sendLeaseFinalizeEmail: e.target.checked
                                                                        }));
                                                                    }}
                                                                />
                                                                <div className="info-input">
                                                                    <img src={proInfo} alt="Info" />
                                                                    <p>Send lease finalize email to owner and guest.</p>
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
            </div>
        </>
    );
}

