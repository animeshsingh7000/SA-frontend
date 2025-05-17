import React, { useState, useEffect, useRef } from "react";
import { Form } from "react-final-form";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { Spinner, Table } from "react-bootstrap";
import { composeValidators, required, requiredSelect } from "../../../validations";
import { FormControl } from "../../../components/FormElements/FormControl";
import { Link, useNavigate, useParams } from "react-router-dom";
import proInfo from "../../../assets/images/Info.svg";
import Breadcrumb from 'react-bootstrap/Breadcrumb';
import { DatePickerControl } from "../../../components/FormElements/DatePicker";
import proImg from "../../../assets/images/slider-image.png";
import lockIcon from "../../../assets/images/lock.svg";
import openlockIcon from "../../../assets/images/unlock.png";
import minusIcon from "../../../assets/images/minus.svg";
import plusBlack from "../../../assets/images/plus-black.svg";
import dollarIcon from "../../../assets/images/dollar.svg";
import percentIcon from "../../../assets/images/percent-Icon.svg";
import placeHolder from "../../../assets/images/placeHolder.png";
import { CheckboxControlGlobal } from "../../../components/FormElements/CheckboxControl";
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { ADD_EDIT_LEASE, CLEANING_FREQUENCY } from "../../../constants";
import moment from "moment";
import { useCustomMutation } from "../../../hooks/useApi";
import { ROUTE_NAVIGATION_PATH } from "../../../routes/routes";
import { toast } from "react-toastify";
import { exportUnsignedPdf, getRecurringFee, leaseDetails, lockUnlockLease, paymentSummary, updateLease } from "../../../api/admin/lease";
import { propertyDetails } from "../../../api/admin/property";
import { SearchSelectWithForm } from "../../../components/SearchSelect/SearchSelect";
import LeaseStatusList from "../../../components/SearchSelect/LeaseStatus";
import RenterTypeList from "../../../components/SearchSelect/RenterTypeList";
import GuestForm from "./MultipleGuest";
import PropertyListDropDown from "../../../components/SearchSelect/PropertyListDropDown";
import PerDiemTypeList from "../../../components/SearchSelect/PerDiemTypeList";
import LeaseTemplateList from "../../../components/SearchSelect/LeaseTemplateList";
import BillingInvoiceList from "./BillingInvoiceList";
import InvoiceList from "./InvoicesList";
import PaymentSummary from "./PaymentSummary";
import ActualRequirePayment from "./ActualRequirePayment";
import { capitalizeFirstWord, formatDate, formatPhoneNumber } from "../../../utils/common";
import DeleteLeaseModel from "../../../components/Modal/DeleteLeaseModel";
import AllUserListDropDown from "../../../components/SearchSelect/AllUserListDropDown";
import { AxiosError } from "axios";
import OnwerDetailsModel from "../../../components/Modal/OwnersDetailModel";
import GetUserListDropDown from "../../../components/SearchSelect/GetUserListDropDown";
import DeletePaymentModel from "../../../components/Modal/DeletePaymentModel";
import AttacheUserListDropDown from "../../../components/SearchSelect/AttacheUserListDropDown";

const AddEditLease: React.FC = () => {
    const navigate = useNavigate();
    const [loader, setLoader] = useState(true);
    const handleSubmitRef = useRef<() => void>(() => { }); // Create a ref to store the handleSubmit function
    const [initData, setInitData] = useState<any>(ADD_EDIT_LEASE);
    const [initialOwners, setInitialOwners] = useState<any[]>([]);
    const [floorRate, setFloorRate] = useState<any>(0.00);
    const params = useParams();
    const [isLocked, setIsLocked] = useState<boolean>(() => {
        const storedValue = localStorage.getItem("isLocked");
        return storedValue ? JSON.parse(storedValue) : true; // Default to false if not set
    });
    const [billingInvoices, setBillingInvoices] = useState<any>([]);
    const [invoices, setInvoices] = useState<any>([]);
    const [response, setResponse] = useState<any>({});
    const [deleteModal, setDeleteModal] = useState(false);
    const [deletePaymentModal, setDeletePaymentModal] = useState(false);
    const [leaseId, setLeaseId] = useState(null);
    const [payments, setPayments] = useState<any>([]);
    const [spinner, setSpiner] = useState(false);
    const [bedroomCount, setBedroomCount] = useState<any>(null);
    const [secondaryGuestInfo, setSecondaryGuestInfo] = useState<any>([]);
    const [showMoreOwners, setShowMoreOwners] = useState(false);
    const [summary, setSummary] = useState<any>({});
    const [paymentId, setPaymentId] = useState<any>(null);
    const [invoiceId, setInvoiceId] = useState<any>(null);
    const [petAllow, setPetAllow] = useState(true);
    const [parkingAllow, setParkingAllow] = useState(true);

    useEffect(() => {
        if (params.id) {
            leaseDetails(params.id).then((res: any) => {
                setResponse(res.data[0]);
                setInitData((prevState: any) => ({
                    ...prevState,
                    propertyId: res.data[0].propertyId ? res.data[0].propertyId : initData.propertyId,
                    guarantorId: res.data[0].guarantorId ? res.data[0].guarantorId : initData.guarantorId,
                    billingContactId: res.data[0].billingContactId ? res.data[0].billingContactId : initData.billingContactId,
                    alternativeNameOnLease: res.data[0].alternativeNameOnLease ? res.data[0].alternativeNameOnLease : initData.alternativeNameOnLease,
                    renterType: res.data[0].renterType ? res.data[0].renterType : initData.renterType,
                    leasingAgentId: res.data[0].leasingAgentId ? res.data[0].leasingAgentId : initData.leasingAgentId,
                    status: res.data[0].status ? res.data[0].status : initData.status,
                    numberOfPersons: res.data[0].numberOfPersons ? res.data[0].numberOfPersons : initData.numberOfPersons,
                    leaseStartDate: res.data[0].leaseStartDate ? moment(res.data[0].leaseStartDate, 'YYYY-MM-DD hh:mm A').toDate() : initData.leaseStartDate,
                    leaseEndDate: res.data[0].leaseEndDate ? moment(res.data[0].leaseEndDate, 'YYYY-MM-DD hh:mm A').toDate() : initData.leaseEndDate,
                    ratePerDay: res.data[0].ratePerDay ? res.data[0].ratePerDay : initData.ratePerDay,
                    extensionAllowed: res.data[0].extensionAllowed ? res.data[0].extensionAllowed : initData.extensionAllowed,
                    noticeToExtendDays: res.data[0].noticeToExtendDays ? res.data[0].noticeToExtendDays : initData.noticeToExtendDays,
                    isNightlyRate: res.data[0].isNightlyRate ? res.data[0].isNightlyRate : initData.noticeToExtendDays,
                    monthToMonth: res.data[0].monthToMonth ? res.data[0].monthToMonth : initData.monthToMonth,
                    billingMonthly: res.data[0].billingMonthly ? res.data[0].billingMonthly : initData.billingMonthly,
                    billingMonthlyDaily: res.data[0].billingMonthlyDaily ? res.data[0].billingMonthlyDaily : initData.billingMonthlyDaily,
                    hasParking: res.data[0].hasParking ? res.data[0].hasParking : initData.hasParking,
                    parkingFee: res.data[0].parkingFee ? res.data[0].parkingFee : initData.parkingFee,
                    parkingDescription: res.data[0].parkingDescription ? res.data[0].parkingDescription : initData.parkingDescription,
                    petsAllowed: res.data[0].petsAllowed ? res.data[0].petsAllowed : initData.petsAllowed,
                    petFee: res.data[0].petFee ? res.data[0].petFee : initData.petFee,
                    petDescription: res.data[0].petDescription ? res.data[0].petDescription : initData.petDescription,
                    departureCleaningFee: res.data[0].departureCleaningFee || res.data[0].departureCleaningFee == 0 ? res.data[0].departureCleaningFee : initData.departureCleaningFee,
                    serviceFee: res.data[0].serviceFee ? res.data[0].serviceFee : initData.serviceFee,
                    recurringCleaning: res.data[0].recurringCleaning ? res.data[0].recurringCleaning : initData.recurringCleaning,
                    recurringCleaningFrequency: res.data[0].recurringCleaningFrequency ? res.data[0].recurringCleaningFrequency : 0,
                    recurringCleaningStartDate: res.data[0].recurringCleaningStartDate ? moment(res.data[0].recurringCleaningStartDate, 'YYYY-MM-DD hh:mm A').toDate() : initData.recurringCleaning,
                    recurringCleaningNote: res.data[0].recurringCleaningNote ? res.data[0].recurringCleaningNote : initData.recurringCleaningNote,
                    recurringCleaningRate: res.data[0].recurringCleaningRate ? res.data[0].recurringCleaningRate : initData.recurringCleaningRate,
                    generateRecurringCleaningSchedule: res.data[0].generateRecurringCleaningSchedule ? res.data[0].generateRecurringCleaningSchedule : initData.generateRecurringCleaningSchedule,
                    taxExempt: res.data[0].taxExempt ? res.data[0].taxExempt : initData.taxExempt,
                    taxExemptReason: res.data[0].taxExemptReason ? res.data[0].taxExemptReason : initData.taxExemptReason,
                    isPerDiem: res.data[0].isPerDiem ? res.data[0].isPerDiem : initData.isPerDiem,
                    perDiemType: res.data[0].perDiemType ? res.data[0].perDiemType : initData.perDiemType,
                    isDualPerDiem: res.data[0].isDualPerDiem ? res.data[0].isDualPerDiem : initData.isDualPerDiem,
                    perDiemStartDate: res.data[0].perDiemStartDate ? res.data[0].perDiemStartDate : initData.perDiemStartDate,
                    perDiemPercentage: res.data[0].perDiemPercentage ? res.data[0].perDiemPercentage : initData.perDiemPercentage,
                    generateBillingSchedule: res.data[0].generateBillingSchedule ? res.data[0].generateBillingSchedule : initData.generateBillingSchedule,
                    template_id: res.data[0].template_id ? res.data[0].template_id : initData.template_id,
                    includedLineItems: res.data[0].includedLineItems ? res.data[0].includedLineItems : initData.includedLineItems,
                    note: res.data[0].note ? res.data[0].note : initData.note,
                    ownerNote: res.data[0].ownerNote ? res.data[0].ownerNote : initData.ownerNote,
                    sendLeaseFinalizeEmail: res.data[0].sendLeaseFinalizeEmail ? res.data[0].sendLeaseFinalizeEmail : initData.sendLeaseFinalizeEmail
                }));

                let guestDetails = [...res.data[0].guests];
                let secondaryGuestd = [...res.data[0].guests];
                guestDetails.forEach((guest: any) => {
                    guest.Email = {
                        label: guest.name + ' ' + guest.email,
                        value: guest.guestId
                    }
                })
                const filteredGuests = secondaryGuestd.filter(guest => !guest.isPrimary);
                setInitialOwners(guestDetails);
                setPayments(res.data[0].payments);
                setBillingInvoices(res.data[0].payments);
                setInvoices(res.data[0].invoices);
                setSecondaryGuestInfo(filteredGuests);
                setLoader(false);
                getPaymentSummary(res.data[0].serviceFee);
                setParkingAllow(res.data[0].hasParking ? false : true);
                setPetAllow(res.data[0].petsAllowed ? false : true);

                if(res.data[0].propertyId) {
                    setBedroomCount(res.data[0].propertyDetails.unitBedrooms ? res.data[0].propertyDetails.unitBedrooms : 0);
                    
                    getPropertyDetail(res.data[0].propertyDetails._id, (res.data[0].propertyDetails.unitBedrooms ? res.data[0].propertyDetails.unitBedrooms : 0), res.data[0].departureCleaningFee);
                }
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

    const formatDates = (data: any) => {
        
        return data.map((item: any) => {
            let formattedItem = { ...item };

            // List of keys that contain date values
            const dateKeys = ["dueDateStart", "dueDateEnd", "periodStart", "periodEnd", "updatedAt", "createdAt"];

            //Convert each date field to "YYYY-MM-DD HH:mm:ss"
            dateKeys.forEach((key) => {
                if (formattedItem[key]) {
                    formattedItem[key] = moment.utc(formattedItem[key]).format("YYYY-MM-DD HH:mm:ss");
                }
                //delete formattedItem.isChecked;
            });
            return formattedItem;
        });
    };

    const onSubmit = (values: any) => {
        let data = { ...values };
        Object.keys(data).forEach(key => {
            if (key.startsWith("Email") || key.startsWith("email")) {
                delete data[key];
            }
        });

        data.propertyId = values.propertyId;
        data.guarantorId = data.guarantorId && data.guarantorId.value ? data.guarantorId.value : initData.guarantorId;
        data.billingContactId = data.billingContactId && data.billingContactId.value ? data.billingContactId.value : initData.billingContactId;
        data.renterType = data.renterType && data.renterType.value ? data.renterType.value : initData.renterType;
        data.leasingAgentId = data.leasingAgentId && data.leasingAgentId.value ? data.leasingAgentId.value : initData.leasingAgentId;
        data.status = data.status && data.status.value ? data.status.value : initData.status;
        data.recurringCleaningFrequency = data.recurringCleaningFrequency ? data.recurringCleaningFrequency : initData.recurringCleaningFrequency;
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
        data = convertEmptyStringsToNull(data);

        if (initialOwners && initialOwners.length > 0) {
            let owners = JSON.parse(JSON.stringify(initialOwners));

            owners.forEach((item: any) => {
                if (item.Email) {
                    item.guestId = item.Email.value; // Reassign to only keep the 'value' key
                }
                delete item.Email;
                delete item._id;
                delete item.name;
                delete item.email;
            });
            data.guests = owners
        }
        
        data.payments = payments && payments.length > 0 ? formatDates(payments) : [];
        data.invoices = invoices ? invoices : [];
        data.taxable = response.taxable;
        data.taxRate = response.taxRate;
        data._id = params.id;
        
        mutate(data);
    };

    function convertEmptyStringsToNull(obj:any) {
        if (typeof obj !== 'object' || obj === null) return obj; // Return if not an object
    
        for (const key in obj) {
            if (typeof obj[key] === 'string' && obj[key] === "") {
                obj[key] = null;
            } else if (typeof obj[key] === 'object' && obj[key] !== null) {
                obj[key] = convertEmptyStringsToNull(obj[key]); // Recursive call for nested objects/arrays
            }
        }
        
        return obj;
    }

    const { mutate } = useCustomMutation({
        mutationFn: (req: any) => {
            setSpiner(true)
            return updateLease(req);
        },
        onSuccess: async () => {
            setSpiner(false)
            toast.success('Lease updated successfully')
            navigate(
                params.type === '0' ? ROUTE_NAVIGATION_PATH.LEASING_MANAGER_LIST : params.type === '1' ? ROUTE_NAVIGATION_PATH.CURRENT_LEASESE : params.type === '2' ? ROUTE_NAVIGATION_PATH.CURRENT_PAST_LEASES : params.type === '3' ? ROUTE_NAVIGATION_PATH.CURRENT_FUTURE_LEASES
                    : params.type === '4' ? ROUTE_NAVIGATION_PATH.FUTURE_LEASES : ROUTE_NAVIGATION_PATH.INPREPERATION_LEASES
            );
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

    const handleAddOwner = (newOwner: {
        Email: any; isPrimary: boolean, nteEmail: boolean, arrivalDepartureEmail: boolean,
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
    const handleEditOwner = (index: number, updatedOwner: {
        Email: any; isPrimary: boolean, arrivalDepartureEmail: boolean,
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

    const getPropertyDetail = (propertyId: any, unitBedrooms: any, departureCleaningFee?:any) => {
        propertyDetails(propertyId).then((res: any) => {
            setFloorRate(res.data.propertyStatus.floorRate ? res.data.propertyStatus.floorRate : 0.00);
            if (initData.recurringCleaning == true && initData.recurringCleaningFrequency) {
                let payload = {
                    weeks: initData.recurringCleaningFrequency,
                    beds: unitBedrooms,
                    arrivalDate: initData.leaseStartDate
                }
                getRecurringFee(payload).then((res: any) => {
                    setInitData((prevState: any) => ({
                        ...prevState,
                        recurringCleaningStartDate: res.date,
                        recurringCleaningRate: res.price

                    }));
                })

            }
            // if(!departureCleaningFee) {
            //     handleSetCfee();
            // }
            
        });
    }

    const setCleaningRate = (recurringCleaningFrequency:any) => {
        if(Number(recurringCleaningFrequency) == 0) {
            return;
        }
        let payload = {
            weeks: recurringCleaningFrequency,
            beds: bedroomCount,
            arrivalDate: initData.leaseStartDate
        }
        getRecurringFee(payload).then((res: any) => {
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

    const deleteLeasing = (id: any) => {
        setLeaseId(id);
        setDeleteModal(true);
    }

    const updateListItem = () => {
        setLeaseId(null);
        navigate(
            params.type == '0' ? ROUTE_NAVIGATION_PATH.LEASING_MANAGER_LIST : params.type == '1' ? ROUTE_NAVIGATION_PATH.CURRENT_LEASESE : params.type == '2' ? ROUTE_NAVIGATION_PATH.CURRENT_PAST_LEASES : params.type == '3' ? ROUTE_NAVIGATION_PATH.CURRENT_FUTURE_LEASES
                : params.type == '4' ? ROUTE_NAVIGATION_PATH.FUTURE_LEASES : ROUTE_NAVIGATION_PATH.INPREPERATION_LEASES
        );
    }

    const lockUnlock = (id: any) => {
        let locked = !isLocked ? true : false;
        lockUnlockLease(id, locked).then((res: any) => {
            toast.success('Lease updated successfully')
            setIsLocked(locked);
            localStorage.setItem("isLocked", JSON.stringify(locked));
            localStorage.setItem("leaseId", id);

            // navigate(
            //     params.type == '0' ? ROUTE_NAVIGATION_PATH.LEASING_MANAGER_LIST : params.type == '1' ? ROUTE_NAVIGATION_PATH.CURRENT_LEASESE : params.type == '2' ? ROUTE_NAVIGATION_PATH.CURRENT_PAST_LEASES : params.type == '3' ? ROUTE_NAVIGATION_PATH.CURRENT_FUTURE_LEASES
            //     : params.type == '4' ? ROUTE_NAVIGATION_PATH.FUTURE_LEASES : ROUTE_NAVIGATION_PATH.INPREPERATION_LEASES
            // );
        })
    }

    const showDetails = () => {
        setShowMoreOwners(true);
    }

    const handleSetCfee = () => {
        let fee: any;
        switch (bedroomCount) {
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

    const getPaymentSummary = (serviceFee: any) => {
        paymentSummary(params.id).then((res: any) => {
            res.leaseServiceFee = serviceFee;
            setSummary(res);
        })
    };

    const updateDeletedItems = (data: any) => {
        setPaymentId(data.id);
        setInvoiceId(params.id)
        setDeletePaymentModal(true);
    }

    const deleteListItem = (id: any) => {
        setPaymentId(null);
        setInvoiceId(null);
        setDeletePaymentModal(false);
        setPayments((prevPayments: any) => prevPayments.filter((payment: any) => payment._id !== id));

    }

    const updatePaymentItems = (updatedPayments: any) => {
        // Update the parent state with the new payments
        setPayments(updatedPayments);
    };

    const DownloadPDF = async () => {
        console.log("Component rendered"); // Check if component is rendering
        console.log("params.id:", params.id); // Debug params.id

        exportUnsignedPdf(params.id).then((res:any) => {
            const blob = response.blob(); // Convert response to blob
            const url = URL.createObjectURL(blob); // Create a URL for the blob

            window.open(url, "_blank"); // Open in a new tab

            // Optional: Clean up the object URL after use
            setTimeout(() => URL.revokeObjectURL(url), 10000);

        })

        // try {
        //     const response = await fetch(`https://dev-backend.stayattache.com/api/v1/admin/lease/export/template/${params.id}`, {
        //         method: "GET",
        //         headers: {
        //             "Accept": "application/json, text/plain, */*",
        //             "Authorization": `Bearer ${localStorage.getItem("token")}`, 
        //         },
        //     });

        //     if (!response.ok) {
        //         throw new Error("Failed to fetch PDF");
        //     }

        //     const blob = await response.blob(); // Convert response to blob
        //     const url = URL.createObjectURL(blob); // Create a URL for the blob

        //     window.open(url, "_blank"); // Open in a new tab

        //     // Optional: Clean up the object URL after use
        //     setTimeout(() => URL.revokeObjectURL(url), 10000);
        // } catch (error) {
        //     console.error("Error fetching PDF:", error);
        // }
        

        // const handleOpenPDF = async () => {
        //     try {
        //         const response = await fetch(`/api/v1/admin/lease/export/template/${params.id}`, {
        //             method: "GET",
        //             headers: {
        //                 "Content-Type": "application/pdf",
        //             },
        //         });

        //         if (!response.ok) {
        //             throw new Error("Failed to fetch PDF");
        //         }

        //         const blob = await response.blob(); // Convert response to blob
        //         const url = URL.createObjectURL(blob); // Create a URL for the blob

        //         window.open(url, "_blank"); // Open in a new tab

        //         // Optional: Clean up the object URL after use
        //         setTimeout(() => URL.revokeObjectURL(url), 10000);
        //     } catch (error) {
        //         console.error("Error fetching PDF:", error);
        //     }
        // };
    };
    

    return (
        <>
            <div className="common-right-panel-section _edit-property-section">
                <div className="top-right-bar">
                    <Breadcrumb>
                        <Breadcrumb.Item href="#">Leasing Manager</Breadcrumb.Item>
                        <Breadcrumb.Item href={
                            params.type == '0' ? ROUTE_NAVIGATION_PATH.LEASING_MANAGER_LIST : params.type == '1' ? ROUTE_NAVIGATION_PATH.CURRENT_LEASESE : params.type == '2' ? ROUTE_NAVIGATION_PATH.CURRENT_PAST_LEASES : params.type == '3' ? ROUTE_NAVIGATION_PATH.CURRENT_FUTURE_LEASES
                                : params.type == '4' ? ROUTE_NAVIGATION_PATH.FUTURE_LEASES : ROUTE_NAVIGATION_PATH.INPREPERATION_LEASES
                        }>{params.type == '0' ? 'All Leases' : params.type == '1' ? 'Current Lease' : params.type == '2' ? 'Current + Past Lease' : params.type == '3' ? 'Current + Future Lease'
                            : params.type == '4' ? 'Future Lease' : 'Inprepartion Lease'}</Breadcrumb.Item>
                        <Breadcrumb.Item active>Edit Lease</Breadcrumb.Item>
                    </Breadcrumb>
                    <div className="guest-header pb-4">
                        <div className="guest-left">
                            <div className="property-top-detail">
                                <div className="pro-thumb">
                                <img
                                    src={response?.propertyDetails?.imageUrl ? response?.propertyDetails?.imageUrl : placeHolder}
                                    onError={(e: any) => {
                                        e.target.src = placeHolder;
                                    }}
                                    alt="property"
                                />
                                </div>
                                <div className="pro-desc-top">
                                    <h2>Lease</h2>
                                    <h1>{response.propertyDetails?.address}</h1>
                                    <div className="register">Registered on {formatDate(response.propertyDetails?.createdAt)}</div>
                                    <div className="pro-grid-wrapper">
                                        <div className="p-grid">
                                            <div className="t-info">
                                                Property Owner Info
                                            </div>
                                            <p className="blue">
                                                {response.propertyDetails?.ownerDetails?.name}
                                            </p>
                                            <p className="blue">
                                                {response.propertyDetails?.ownerDetails?.email}
                                            </p>
                                            <p className="">
                                                {
                                                    response.propertyDetails?.ownerDetails?.phoneNumbers && response.propertyDetails?.ownerDetails.phoneNumbers.length > 0 ?
                                                        <>
                                                            {response.propertyDetails?.ownerDetails.phoneNumbers.map((data: any, key: any) => (
                                                                <p>{formatPhoneNumber(data.phone) + ' (' + capitalizeFirstWord(data.type) + ')'}</p>
                                                            ))}
                                                        </>
                                                        :
                                                        null
                                                }
                                            </p>
                                        </div>
                                        <div className="p-grid">
                                            <div className="t-info">
                                                Primary Guest Info
                                            </div>
                                            <p className="blue">
                                                {response?.guestDetails?.name}
                                            </p>
                                            <p className="blue">
                                                {response?.guestDetails?.email}
                                            </p>
                                            <p className="">
                                                {
                                                    response?.guestDetails?.phoneNumbers && response?.guestDetails.phoneNumbers.length > 0 ?
                                                        <>
                                                            {response?.guestDetails.phoneNumbers.map((data: any, key: any) => (
                                                                <p>{formatPhoneNumber(data.phone) + ' (' + capitalizeFirstWord(data.type) + ')'}</p>
                                                            ))}
                                                        </>
                                                        :
                                                        null
                                                }
                                            </p>
                                        </div>
                                        {
                                            secondaryGuestInfo.length > 0 && (
                                                <div className="p-grid">
                                                    <div className="t-info">
                                                        Secondary Guest Info
                                                    </div>

                                                    <p className="blue">
                                                        {secondaryGuestInfo[0]?.name}
                                                    </p>
                                                    <p className="blue">
                                                        {secondaryGuestInfo[0]?.email}
                                                    </p>
                                                    <p className="">
                                                        {
                                                            secondaryGuestInfo[0]?.phoneNumbers && secondaryGuestInfo[0]?.phoneNumbers.length > 0 ?
                                                                <>
                                                                    {secondaryGuestInfo[0].phoneNumbers.map((data: any, key: any) => (
                                                                        <p>{formatPhoneNumber(data.phone) + ' (' + capitalizeFirstWord(data.type) + ')'}</p>
                                                                    ))}
                                                                </>
                                                                :
                                                                null
                                                        }

                                                        {
                                                            secondaryGuestInfo && secondaryGuestInfo.length > 0 ?
                                                                <div className="showmore_info" onClick={showDetails}>
                                                                    <div className="shwmore">Show more</div>
                                                                </div>
                                                                :
                                                                null
                                                        }


                                                    </p>
                                                </div>

                                            )
                                        }

                                    </div>

                                </div>
                            </div>
                        </div>
                        <div className="guest-right">
                            {/* <button className="btn-locklease" onClick={(e: any) => lockUnlock(response._id)}>
                                <img src={!isLocked ? openlockIcon : lockIcon} alt="Lock" />{!isLocked ? 'Unlocked' : 'Locked'} Lease
                            </button> */}
                            <button className="btn-locklease" onClick={(e: any) => lockUnlock(params.id)}
                            >
                                <img src={!isLocked ? openlockIcon : lockIcon} alt="Lock" />{!isLocked ? 'Unlocked' : 'Locked'} Lease
                            </button>
                            <button className={`btn-delete  ${!isLocked ? '' : 'disabled'}`} onClick={(e: any) => !isLocked ? deleteLeasing(response._id) : ''}>Delete Lease</button>
                            <button className={`btn-primary  ${!isLocked ? '' : 'disabled'}`} onClick={(e: any) => !isLocked ? submitForm() : ''}>Save Details</button>
                        </div>
                    </div>
                </div>
                <div className="mid-content-section">
                    <Tabs
                        defaultActiveKey="details"
                        id="fill-tab-example"
                        className="mb-3"
                        fill
                    >
                        <Tab eventKey="details" title="Details">
                            <div className="guest-general-information lease-form-scrollbar scrollbar">
                                <div className="info-wrapper info-wrapper-multiple">
                                    <div className="infoleft">
                                        <h2>General Information</h2>
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
                                                                        {/* <div className="text-start form-field">
                                                                            <Link to={ROUTE_NAVIGATION_PATH.UPDATE_PROPERTY + '/' + response?.propertyDetails._id + '/' + 0 + '?fromLease=1'}>
                                                                                {response?.propertyDetails.name}
                                                                            </Link>
                                                                        </div> */}
                                                                        <div className="text-start form-field">
                                                                            <PropertyListDropDown
                                                                                label="Property"
                                                                                name="propertyId"
                                                                                isSearchable
                                                                                validate={composeValidators(requiredSelect)}
                                                                                onChange={(e: any) => {
                                                                                    setBedroomCount(e.unitBedrooms);
                                                                                    setInitData((prevState: any) => ({
                                                                                        ...prevState,
                                                                                        propertyId: e.value
                                                                                    }));
                                                                                    getPropertyDetail(e.propertyId, e.unitBedrooms);
                                                                                }}
                                                                                disabled={true}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-12 _add-email-data _add-contact-data">
                                                                        <GuestForm
                                                                            initialOwners={initialOwners}
                                                                            onAddOwner={handleAddOwner}
                                                                            onEditOwner={handleEditOwner} // Pass remove handler
                                                                            onRemoveOwner={handleRemoveOwner}
                                                                            isLocked={isLocked}
                                                                        />
                                                                    </div>
                                                                    <div className="col-12 col-md-12 custom-select-form">
                                                                        <div className="text-start form-field">
                                                                            <AllUserListDropDown
                                                                                label=" Guarantor"
                                                                                name="guarantorId"
                                                                                isSearchable
                                                                                onChange={(e: any) => {
                                                                                    setInitData((prevState: any) => ({
                                                                                        ...prevState,
                                                                                        guarantorId: e.value
                                                                                    }));
                                                                                }}
                                                                                disabled={isLocked}
                                                                            />

                                                                        </div>
                                                                    </div>
                                                                    <div className="col-12 col-md-12 custom-select-form">
                                                                        <div className="text-start form-field">
                                                                            <AllUserListDropDown
                                                                                label="Billing Contact"
                                                                                name="billingContactId"
                                                                                isSearchable
                                                                                onChange={(e: any) => {
                                                                                    setInitData((prevState: any) => ({
                                                                                        ...prevState,
                                                                                        billingContactId: e.value
                                                                                    }));
                                                                                }}
                                                                                disabled={isLocked}
                                                                            />

                                                                        </div>
                                                                    </div>
                                                                    <div className="col-12">
                                                                        <FormControl
                                                                            label="Alternative Name"
                                                                            name="alternativeNameOnLease"
                                                                            type="text"
                                                                            disabled={isLocked}
                                                                            onChange={(e: any) => {
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
                                                                                onChange={(e: any) => {
                                                                                    setInitData((prevState: any) => ({
                                                                                        ...prevState,
                                                                                        renterType: e.value
                                                                                    }));
                                                                                }}
                                                                                disabled={isLocked}
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
                                                                                        onChange={(e: any) => {
                                                                                            setInitData((prevState: any) => ({
                                                                                                ...prevState,
                                                                                                leasingAgentId: e.value
                                                                                            }));
                                                                                        }}
                                                                                        disabled={isLocked}
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
                                                                                        onChange={(e: any) => {
                                                                                            setInitData((prevState: any) => ({
                                                                                                ...prevState,
                                                                                                leasingAgentId: e.value
                                                                                            }));
                                                                                        }}
                                                                                        disabled={isLocked}
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
                                                                                onChange={(e: any) => {
                                                                                    setInitData((prevState: any) => ({
                                                                                        ...prevState,
                                                                                        status: e.value
                                                                                    }));

                                                                                }}
                                                                                disabled={isLocked}
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
                                                                                validate={composeValidators(required)}
                                                                                disabled={isLocked}
                                                                                onChange={(e: any) => {
                                                                                    setInitData((prevState: any) => ({
                                                                                        ...prevState,
                                                                                        numberOfPersons: e.target.value
                                                                                    }));
                                                                                }}
                                                                            />
                                                                            <div className="plusminus">
                                                                                <div className="boxes" onClick={() => !isLocked ? decreaseCount() : ''}><img src={minusIcon} alt="Icon" /></div>
                                                                                <div className="boxes" onClick={() => !isLocked ? increaseCount() : ''}><img src={plusBlack} alt="Icon" /></div>
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
                                                                            disabled={isLocked}
                                                                            onChange={(date: any) => {
                                                                                setInitData((prevState: any) => ({
                                                                                    ...prevState,
                                                                                    leaseStartDate: date
                                                                                }));
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
                                                                            disabled={isLocked}
                                                                            onChange={(date: any) => {
                                                                                setInitData((prevState: any) => ({
                                                                                    ...prevState,
                                                                                    leaseEndDate: date
                                                                                }));
                                                                            }}
                                                                        />
                                                                    </div>
                                                                    <div className="col-12 col-md-6 _dollar">
                                                                        <FormControl
                                                                            label="Daily/Nightly Rate"
                                                                            name="ratePerDay"
                                                                            type="input-decimal"
                                                                            onChange={(e: any) => {
                                                                                setInitData((prevState: any) => ({
                                                                                    ...prevState,
                                                                                    ratePerDay: e.target.value
                                                                                }));
                                                                            }}
                                                                            disabled={isLocked}
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
                                                                            label="Extension Allowed"
                                                                            disabled={isLocked}
                                                                            onChange={(e: any) => {
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
                                                                                disabled={isLocked}
                                                                                onChange={(e: any) => {
                                                                                    setInitData((prevState: any) => ({
                                                                                        ...prevState,
                                                                                        noticeToExtendDays: e.target.value
                                                                                    }));
                                                                                }}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-12 col-md-6 _checkboxmob mb-4">
                                                                        <CheckboxControlGlobal
                                                                            name="isNightlyRate"
                                                                            label="Nightly rate"
                                                                            disabled={isLocked}
                                                                            onChange={(e: any) => {
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
                                                                            disabled={isLocked}
                                                                            onChange={(e: any) => {
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
                                                                            disabled={isLocked}
                                                                            onChange={(e: any) => {
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
                                                                            disabled={isLocked}
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
                                                                            disabled={isLocked}
                                                                            onChange={(e: any) => {
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
                                                                            disabled={isLocked || parkingAllow}
                                                                            onChange={(e: any) => {
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
                                                                            disabled={isLocked || parkingAllow}
                                                                            onChange={(e: any) => {
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
                                                                            disabled={isLocked}
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
                                                                            disabled={isLocked || petAllow}
                                                                            onChange={(e: any) => {
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
                                                                            disabled={isLocked || petAllow}
                                                                            onChange={(e: any) => {
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
                                                                            disabled={isLocked}
                                                                            onChange={(e: any) => {
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
                                                                            disabled={isLocked}
                                                                            onChange={(e: any) => {
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
                                                                                disabled={isLocked}
                                                                                onChange={(e: any) => {
                                                                                    setInitData((prevState: any) => ({
                                                                                        ...prevState,
                                                                                        recurringCleaningFrequency: e.value
                                                                                    }));
                                                                                    if (initData.recurringCleaning && (e.value !== '0' || e.value !== 0)) {
                                                                                        setInitData((prevState: any) => ({
                                                                                            ...prevState,
                                                                                            recurringCleaningStartDate: initData.leaseStartDate ? moment.utc(initData.leaseStartDate).add(e.days, 'days').toISOString() : moment.utc().add(e.days, 'days').toISOString()
                                                                                        }));
                                                                                        if (bedroomCount) {
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
                                                                            disabled={isLocked}
                                                                            onChange={(e: any) => {
                                                                                setInitData((prevState: any) => ({
                                                                                    ...prevState,
                                                                                    recurringCleaning: e.target.checked
                                                                                }));
                                                                                if (e.target.checked == true && initData.recurringCleaningFrequency) {
                                                                                    let day = getCleaningFrequencyDays(initData.recurringCleaningFrequency);
                                                                                    setInitData((prevState: any) => ({
                                                                                        ...prevState,
                                                                                        recurringCleaningStartDate: initData.leaseStartDate ? moment.utc(initData.leaseStartDate).add(day, 'days').toISOString() : moment.utc().add(day, 'days').toISOString()
                                                                                    }));
                                                                                    if (bedroomCount) {
                                                                                        setCleaningRate(initData.recurringCleaningFrequency);
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
                                                                    </div>

                                                                    <div className="col-12 col-md-6 _datepickerform">
                                                                        <DatePickerControl
                                                                            label="Cleaning Beginning"
                                                                            name="recurringCleaningStartDate"
                                                                            type={'dateTime'}
                                                                            placeholder="MM-DD-YY"
                                                                            disabled={isLocked}
                                                                            onChange={(date: any) => {
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
                                                                            disabled={isLocked}
                                                                            onChange={(e: any) => {
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
                                                                            disabled={isLocked}
                                                                            onChange={(e: any) => {
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
                                                                            disabled={isLocked}
                                                                            onChange={(e: any) => {
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
                                                                            disabled={isLocked}
                                                                            onChange={(e: any) => {
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
                                                                            disabled={isLocked}
                                                                            onChange={(e: any) => {
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
                                                                            disabled={isLocked}
                                                                            onChange={(e: any) => {
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
                                                                                onChange={(e: any) => {
                                                                                    setInitData((prevState: any) => ({
                                                                                        ...prevState,
                                                                                        perDiemType: e.value
                                                                                    }));
                                                                                }}
                                                                                disabled={isLocked}
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
                                                                            disabled={isLocked}
                                                                            onChange={(e: any) => {
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
                                                                            disabled={isLocked}
                                                                            onChange={(date: any) => {
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
                                                                            disabled={isLocked}
                                                                            onChange={(e: any) => {
                                                                                setInitData((prevState: any) => ({
                                                                                    ...prevState,
                                                                                    perDiemPercentage: e.target.checked
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
                                                                            disabled={isLocked}
                                                                            onChange={(e: any) => {
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
                                                                                onChange={(e: any) => {
                                                                                    setInitData((prevState: any) => ({
                                                                                        ...prevState,
                                                                                        template_id: e.value
                                                                                    }));
                                                                                }}
                                                                                disabled={isLocked}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-12 col-md-12 _checkboxmob mb-4">
                                                                        <CheckboxControlGlobal
                                                                            name="includedLineItems"
                                                                            label="Inclusive Line Items "
                                                                            disabled={isLocked}
                                                                            onChange={(e: any) => {
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
                                                                            disabled={isLocked}
                                                                            onChange={(e: any) => {
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
                                                                            disabled={isLocked}
                                                                            onChange={(e: any) => {
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
                                                                            disabled={isLocked}
                                                                            onChange={(e: any) => {
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
                        </Tab>
                        <Tab eventKey="billingPayment" title="Billing and Payments">
                            <Tabs
                                defaultActiveKey="BillingSchedule"
                                id="fill-tab-example"
                                className="mb-3 leasesubtabs"
                                fill
                            >
                                <Tab eventKey="BillingSchedule" title="Billing Schedule">
                                    <BillingInvoiceList billingDetail={billingInvoices} />
                                </Tab>
                                <Tab eventKey="ActualRequiredPayments" title="Actual Required Payments">
                                    <ActualRequirePayment key={payments ? payments.length : 0} payments={payments} isLocked={isLocked} updateDeletedItems={updateDeletedItems} updatePayments={updatePaymentItems} />
                                </Tab>
                                <Tab eventKey="Invoices" title="Invoices">
                                    <InvoiceList invoiceDetail={invoices} isLocked={isLocked} />
                                </Tab>
                                <Tab eventKey="PaymentsSummary" title="Payments Summary">
                                    <PaymentSummary paymentSummary={summary} />
                                </Tab>
                                {/* <Tab eventKey="exportSignedPdf" title="Export">
                                    <div className="table-section-common _leasing-manager-table">

                                        <Table responsive className="">

                                            <thead>
                                                <tr>
                                                    <th><div className="th-data">Title</div></th>
                                                    <th><div className="th-data">Action</div></th>
                                                </tr>
                                            </thead>
                                            <tbody>

                                                <tr>
                                                    <td>
                                                        Export Unsigned PDF
                                                    </td>
                                                    <td>
                                                        <div  role="button" tabIndex={0}  className="t-user _action" onClick={(e: any) => DownloadPDF()}>
                                                            <div className="t-user-info">Download</div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </Table>
                                    </div>
                                </Tab> */}
                            </Tabs>
                        </Tab>
                    </Tabs>
                </div>
            </div>
            {
                leaseId && deleteModal ? (
                    <DeleteLeaseModel
                        show={deleteModal}
                        leaseId={leaseId}
                        handleClose={() => setDeleteModal(false)}
                        updateListItem={updateListItem}
                    />
                )
                    :
                    null
            }
            {
                showMoreOwners ?
                    <OnwerDetailsModel
                        detail={secondaryGuestInfo}
                        show={showMoreOwners}
                        title={'Secondary Guest Info'}
                        handleClose={() => setShowMoreOwners(false)}
                    />
                    :
                    null
            }
            {
                invoiceId && paymentId && deletePaymentModal ?
                    <DeletePaymentModel
                        show={deletePaymentModal}
                        paymentId={paymentId}
                        invoiceId={invoiceId}
                        handleClose={() => setDeletePaymentModal(false)}
                        updateListItem={deleteListItem}
                    />

                    :
                    null
            }
        </>
    );
};

export default AddEditLease;
