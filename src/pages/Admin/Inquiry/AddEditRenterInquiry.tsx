import React, { useState, useEffect, useRef } from "react";
import { Form, Field, useField } from "react-final-form";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { composeValidators, required, requiredSelect } from "../../../validations";
import { FormControl } from "../../../components/FormElements/FormControl";
import { useNavigate, useParams, } from "react-router-dom";
import buildingIcon from "../../../assets/images/building.svg";
import sortIcon from "../../../assets/images/Sort.svg";
import filterIcon from "../../../assets/images/filter-icon.svg";
import displayIcon from "../../../assets/images/display.svg";
import checkgrey from "../../../assets/images/checkgrey.svg";
import downArrow from "../../../assets/images/down-arrow2.png";
import Breadcrumb from 'react-bootstrap/Breadcrumb';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Table from 'react-bootstrap/Table';
import { DatePickerControl } from "../../../components/FormElements/DatePicker";
import { CheckboxControlGlobal } from "../../../components/FormElements/CheckboxControl";
import SearchBar from "../../../components/SearchBar";
import { BATHROOM_OPTIONS, BEDROOM_OPTIONS, CALLBACK_OPTIONS, HOME_SEARCH_REASON, HOW_DID_YOU_FIND_US_OPTIONS, OCCUPANT_COUNT, PET_NUMBER, PRIORITY_OPTIONS, RENTAL_STATUS, TIME_ZONE_OPTIONS, VALIDATIONS, VEHICLE_TYPE } from "../../../constants";
import { ROUTE_NAVIGATION_PATH } from "../../../routes/routes";
import { getRentalInquiryDetail, updateRentalInquiry } from "../../../api/admin/renterInquiry";
import { AxiosError } from "axios";
import { capitalizeFirstWord, formatDate } from "../../../utils/common";
import { useCustomMutation } from "../../../hooks/useApi";
import { toast } from 'react-toastify';
import { Spinner } from "react-bootstrap";
import { addDays } from "date-fns";
import { SearchSelectWithForm } from "../../../components/SearchSelect/SearchSelect";
import NeighbourhoodListDropDown from "../../../components/SearchSelect/NeighbourhoodList";
import PropertyListDropDown from "../../../components/SearchSelect/PropertyListDropDown";
import { DropDownOption } from "../../../types/rental.type";
import DeleteRentalInquiryModel from "../../../components/Modal/DeleteRentalInquiryModel";
import GuestHistory from "./GuestHistory";
import RentalDetail from "./RentalDetail";
import SuggestedProperty from "./SuggestedProperty";

function FlexibleDateInfo({ name, message }: { name: string, message:string }) {
  return (
    <>
      <div className="col-12 col-md-6">
        <FormControl
          label="Number of Days Prior"
          name={`${name}.numberOfDaysPrior`}
          type="mobile"
          maxlength={VALIDATIONS.MAX_DAYS}
          placeholder="Numbers only"
        />
      </div>
      <div className="col-12 col-md-6">
        <FormControl
          label="Number of Days After"
          name={`${name}.numberOfDaysAfter`}
          type="mobile"
          maxlength={VALIDATIONS.MAX_DAYS}
          placeholder="Numbers only"
        />
      </div>
      <div className="col-12">
        <FormControl
          label={`Tell us more about your ${message} plans.`}
          name={`${name}.flexiblePlanDesc`}
          type="text"
          maxlength={VALIDATIONS.MAX_DESCRIPTION}
          placeholder={`How flexible is your ${message} date?`}
        />
      </div>
    </>
  );
}

function PriorityDropDown({
  name,
  label,
  disabledOptions,
}: {
  name: string;
  label: string;
  disabledOptions?: string[];
}) {
  const options = PRIORITY_OPTIONS.map((item) => ({
    ...item,
    isDisabled: disabledOptions?.includes(item.value),
  }));
  return (
    <SearchSelectWithForm
      name={name}
      label={label}
      options={options}
      placeholder={PRIORITY_OPTIONS[0].label}
    />
  );
}

const AddEditRenterInquiry: React.FC = () => {
  const [rowData, setRowData] = useState<any>([]);
  const [loader, setLoader] = useState(true);
  const [activeKey, setActiveKey] = useState('editDetails');
  const params = useParams();
  const [inquiryData, setInquiryData] = useState<any>({});
  const handleSubmitRef = useRef<() => void>(() => { }); // Create a ref to store the handleSubmit function
  const navigate = useNavigate();
  const [isChecked, setIsChecked] = useState(inquiryData.newMatchNotification || false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [rentalId, setRentalId] = useState("");
  const effectRan = useRef(false);

  useEffect(() => {
    if (!effectRan.current) {
    getRentalInquiryDetail(params.id)
      .then((res) => {
        setRowData(res.data);
        setRentalId(res.data._id);
        setIsChecked(res.data.newMatchNotification || false);
        setInquiryData(res.data);
        const data = res.data;
        setInquiryData({
          estimatedArrivalDate: new Date(data.estimatedArrivalDate),
          estimatedDepartureDate: new Date(data.estimatedDepartureDate),
          maxMonthlyBudget: data.maxMonthlyBudget,
          minimumNumberOfBeds: data.minimumNumberOfBeds,
          minimumNumberOfBathrooms: data.minimumNumberOfBathrooms,
          occupantCount: data.occupantCount,
          neighborhood: data.neighborhood,
          callMeDetails: data.isCallMe
            ? {
              timeZone: data.callMeDetails?.timeZone,
              callBackOption: data.callMeDetails?.callBackOption,
            }
            : undefined,
          interestedProperties: res.data.interestedProperties && res.data.interestedProperties.length > 0 ? res.data.interestedProperties : [],
          vehicleSize: data.parkingDetails?.vehicleSize,
          parkingRequirements: data.parkingDetails?.parkingRequirements,
          petCount: data.petDetails?.petCount,
          petDescription: data.petDetails?.petDescription,
          bestPet: data.petDetails?.bestPet,
          findUs: data.findUs,
          bringsYouTown: data.bringsYouTown,
          firstPriority: data.firstPriority,
          secondPriority: data.secondPriority,
          thirdPriority: data.thirdPriority,
          lastDecisionDate: data.lastDecisionDate
            ? new Date(data.lastDecisionDate)
            : undefined,
          perDiemNote: data.perDiemNote,
          isGovtPerDiem: data.isGovtPerDiem ? data.isGovtPerDiem : false,
          requestJoke: data.requestJoke ? data.requestJoke : false,
          newMatchNotification: data.newMatchNotification ? data.newMatchNotification : false,
          offeredProperties: res.data.offeredProperties && res.data.offeredProperties.length > 0 ? res.data.offeredProperties : [],
          rentalInquiryUpdateStatus: res.data.rentalInquiryUpdateStatus,
          agreedProperty: res.data.agreedProperty ? Number(res.data.agreedProperty) : '',
          waiveApplicationFee: res.data.waiveApplicationFee ? res.data.waiveApplicationFee : false,
          notes: res.data.notes ? res.data.notes : undefined,
          isArrivalDateFlexible: res.data.isArrivalDateFlexible ? res.data.isArrivalDateFlexible : false,
          flexibleArrival: res.data.flexibleArrival ? res.data.flexibleArrival : null,
          isDepartureDateFlexible: res.data.isDepartureDateFlexible ? res.data.isDepartureDateFlexible : false,
          flexibleDeparture: res.data.flexibleDeparture ? res.data.flexibleDeparture : null,
          specialRequests: res.data.specialRequests,
          destinationAddress: res.data.destinationAddress,
          findUsOther: res.data.findUsOther,
          isASAP: res.data.isASAP ? res.data.isASAP : false,
          isCallMe: res.data.isCallMe? res.data.isCallMe : false,
          organization: res.data.organization,
          isParking: res.data.isParking ? res.data.isParking : false,
          isPetAllowed: res.data.isPetAllowed ? res.data.isPetAllowed: false
        });
        setLoader(false);
      })
      .catch((error: AxiosError<{ message: string; status: number }>) => {
      });
    }
    return () => {
        effectRan.current = true;
    };
  }, []);

  const submitForm = () => {
    if (handleSubmitRef.current) {
      handleSubmitRef.current(); // Programmatically trigger form submission
    }
  };

  const onSubmit = (values: any) => {
    values.interestedProperties = values.interestedProperties?.map(
      (item: DropDownOption) => item.value || item
    );
    values.offeredProperties = values.offeredProperties?.map(
      (item: DropDownOption) => item.value || item
    );
    values.rentalInquiryUpdateStatus = values.rentalInquiryUpdateStatus ? values.rentalInquiryUpdateStatus?.value : undefined;
    values.agreedProperty = values.agreedProperty ?  (values.agreedProperty?.value ? values.agreedProperty?.value.toString() : values.agreedProperty.toString())  : undefined;

    if(values.flexibleArrival)  {
      values.flexibleArrival = {
        numberOfDaysPrior: values?.flexibleArrival.numberOfDaysPrior ? Number(values?.flexibleArrival.numberOfDaysPrior) : 0,
        numberOfDaysAfter: values?.flexibleArrival.numberOfDaysAfter ? Number(values?.flexibleArrival.numberOfDaysAfter) : 0,
        flexiblePlanDesc: values?.flexibleArrival.flexiblePlanDesc
      }
    }

    if(values.flexibleDeparture)  {
      values.flexibleDeparture = {
        numberOfDaysPrior: values?.flexibleDeparture.numberOfDaysPrior ? Number(values?.flexibleDeparture.numberOfDaysPrior) : 0,
        numberOfDaysAfter: values?.flexibleDeparture.numberOfDaysAfter ? Number(values?.flexibleDeparture.numberOfDaysAfter) : 0,
        flexiblePlanDesc: values?.flexibleDeparture.flexiblePlanDesc
      }
    }
    
    const reqData: any = {
      ...values,
      maxMonthlyBudget: values.maxMonthlyBudget.value || values.maxMonthlyBudget,
      minimumNumberOfBeds: values.minimumNumberOfBeds.value || values.minimumNumberOfBeds,
      minimumNumberOfBathrooms: values.minimumNumberOfBathrooms.value || values.minimumNumberOfBathrooms,
      occupantCount: values.occupantCount.value || values.occupantCount,
      neighborhood: values.neighborhood?.map(
        (item: DropDownOption) => item.value || item
      ),
      callMeDetails: values.isCallMe
        ? {
            timeZone: values.callMeDetails.timeZone?.value || values.callMeDetails.timeZone,
            callBackOption: values.callMeDetails.callBackOption?.value || values.callMeDetails.callBackOption,
          }
        : undefined,
      parkingDetails: values.isParking
        ? {
            vehicleSize: values.vehicleSize?.value || values.vehicleSize,
            parkingRequirements: values.parkingRequirements,
          }
        : undefined,
      isPetAllowed: values.isPetAllowed,
      petDetails: values.isPetAllowed
        ? {
            petCount: values.petCount?.value ||  values.petCount,
            petDescription: values.petDescription,
            bestPet: values.bestPet,
          }
        : undefined,
      findUs: values.findUs?.value ||  values.findUs,
      bringsYouTown: values.bringsYouTown?.value ||  values.bringsYouTown,
      firstPriority: values.firstPriority?.value || values.firstPriority,
      secondPriority: values.secondPriority?.value || values.secondPriority,
      thirdPriority: values.thirdPriority?.value || values.thirdPriority,
    };
    if(!values.notes) delete values.notes;
    delete reqData.bestPet;
    delete reqData.vehicleSize;
    delete reqData.petCount;
    delete reqData.parkingRequirements;
    delete reqData.petDescription;
    if(!reqData.flexibleArrival) {
      delete reqData.flexibleArrival;
    }
    if(!reqData.flexibleDeparture) {
      delete reqData.flexibleDeparture;
    }
    mutate(reqData);
  };

  const { mutate } = useCustomMutation({
    mutationFn: (req: any) => {
      return updateRentalInquiry(params.id, req);
    },
    onSuccess: async () => {
      toast.success(`Rental inquiry updated successfully`)
      navigate(ROUTE_NAVIGATION_PATH.ADMIN_RENTER_INQUIRY_LIST);
    },
  });

  const handleSelect = (key: any) => {
    setActiveKey(key); // Set the active tab
  };

  const openDeleteModel = () => {
    // setUserEmail("sonali@yopmail.com");
    setDeleteModal(true);
  }

  const updateListItem = () => {
    setRentalId('');
    navigate(ROUTE_NAVIGATION_PATH.ADMIN_RENTER_INQUIRY_LIST);
  }

  return (
    <>
      {/* Rental  Inquiry edit form  start */}

      <div className="common-right-panel-section">
        <div className="top-right-bar">
          <Breadcrumb>
            <Breadcrumb.Item href="#">Inquiry</Breadcrumb.Item>
            <Breadcrumb.Item href={ROUTE_NAVIGATION_PATH.ADMIN_RENTER_INQUIRY_LIST}>Rental Inquiries</Breadcrumb.Item>
            <Breadcrumb.Item active>Edit Rental Inquiry</Breadcrumb.Item>
          </Breadcrumb>
          <div className="guest-header _inquiry-header-tabs">
            <div className="guest-left ">
              <h2>Edit Rental Inquiry</h2>
              <h1>{capitalizeFirstWord(rowData.firstName)} {capitalizeFirstWord(rowData.LastName)}</h1>
              <div className="register">Registered on {formatDate(rowData.createdAt)}</div>
            </div>
            {
              activeKey === 'editDetails' ?
                <div className="guest-right">
                  <button className="btn-delete" onClick={() => openDeleteModel()}>Delete Inquiry</button>
                  <button className="btn-primary" onClick={submitForm}>Save Details</button>
                  {/* <div className="threedots-tab">
                  <img src={threedots} alt="Dots" />
                  <div className="drop-text-dots">
                    <ul>
                      <li>
                        <img src={emailIcon} alt="eMail" /> Email Options
                      </li>
                      <li>
                        <img src={monitorIcon} alt="Icon" /> Convert to App
                      </li>
                      <li>
                        <img src={buildingIcon2} alt="View" /> View Matching Properties
                      </li>
                    </ul>
                  </div>
                </div> */}

                </div>
                :
                null
            }
          </div>

        </div>
        <div className="mid-content-section">
          <Tabs
            activeKey={activeKey}
            id="fill-tab-example"
            className="mb-3"
            fill
            onSelect={handleSelect}
          >

            <Tab eventKey="editDetails" title="Details">
              <div className="guest-general-information inquiry-wrapper-scrollbar scrollbar">
                {loader ? (
                <div className="spinner-wrapper relative"> <Spinner /> </div>
                ) : (
                  <Form
                    initialValues={inquiryData}
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
                                <div className="col-12 col-md-12 _datepickerform">
                                  <DatePickerControl
                                    label="Estimated Arrival *"
                                    name="estimatedArrivalDate"
                                    placeholder="MM-DD-YY"
                                    validate={composeValidators(required)}
                                    onChange={(newValue: Date) => {
                                      newValue &&
                                        form.change(
                                          "estimatedDepartureDate",
                                          addDays(newValue, 31)
                                        );
                                    }}
                                  />
                                </div>
                                <div className="col-12 col-md-12 _checkboxmob mb-4">
                                  <CheckboxControlGlobal
                                    name="isArrivalDateFlexible"
                                    label="Is your arrival date flexible? "
                                  />
                                </div>


                                {values.isArrivalDateFlexible ? (
                                  <FlexibleDateInfo name="flexibleArrival" message="arrival" />
                                ) : null}

                                <div className="col-12 col-md-12 _datepickerform">
                                  <DatePickerControl
                                    label="Estimated Departure *"
                                    name="estimatedDepartureDate"
                                    placeholder="MM-DD-YY"
                                    minDate={addDays(values.estimatedArrivalDate, 31)}
                                    validate={composeValidators(required)}
                                  />
                                </div>
                                <div className="col-12 col-md-12 _checkboxmob mb-4">
                                  <CheckboxControlGlobal
                                    name="isDepartureDateFlexible"
                                    label="Is your departure date flexible? "
                                  />
                                </div>
                                {values.isDepartureDateFlexible ? (
                                  <FlexibleDateInfo name="flexibleDeparture" message="departure" />
                                ) : null}

                                <div className="col-12 col-md-6 custom-select-form">
                                  <div className="text-start form-field">
                                    <SearchSelectWithForm
                                      name="minimumNumberOfBeds"
                                      label="Bedrooms *"
                                      options={BEDROOM_OPTIONS}
                                      placeholder={BEDROOM_OPTIONS[0].label}
                                      validate={composeValidators(requiredSelect)}
                                    />
                                  </div>
                                </div>

                                <div className="col-12 col-md-6 custom-select-form">
                                  <div className="text-start form-field">
                                    <SearchSelectWithForm
                                      name="minimumNumberOfBathrooms"
                                      label="Bathrooms *"
                                      options={BATHROOM_OPTIONS}
                                      placeholder={BATHROOM_OPTIONS[0].label}
                                      validate={composeValidators(requiredSelect)}
                                    />
                                  </div>
                                </div>
                                <div className="col-12 col-md-5 custom-select-form">
                                  <div className="text-start form-field">
                                    <SearchSelectWithForm
                                      name="occupantCount"
                                      label="Number of Occupants *"
                                      options={OCCUPANT_COUNT}
                                      placeholder={OCCUPANT_COUNT[0].label}
                                      validate={composeValidators(requiredSelect)}
                                    />
                                  </div>
                                </div>

                                <div className="col-12 col-md-7 custom-select-form">
                                  <div className="text-start form-field">
                                    <SearchSelectWithForm
                                      name="bringsYouTown"
                                      label="What brings you to Town?"
                                      options={HOME_SEARCH_REASON}
                                      placeholder={"Please Select"}
                                    />
                                  </div>
                                </div>
                                <div className="col-12 col-md-12 _checkboxmob mb-4">
                                  <CheckboxControlGlobal
                                    name="isGovtPerDiem"
                                    label="Are you on government Per Diem?"
                                    tooltipText="If your lodging expenses are being paid for by government per diem please click here. We are experts in government per diem rates and billing schedules."
                                  />
                                </div>
                                {
                                  values.isGovtPerDiem ?

                                  <div className="col-12 col-md-12">
                                    <FormControl
                                      label="Per Diem Note"
                                      name="perDiemNote"
                                      type="text"
                                      placeholder="Per Diem Note"
                                    />
                                  </div>
                                :
                                  null
                                }
                                <div className="col-12 col-md-12 _datepickerform">
                                  <DatePickerControl
                                    label="Decision Date"
                                    name="lastDecisionDate"
                                    placeholder="MM-DD-YY"
                                    onChange={(newValue: Date) => {
                                      values.isASAP &&
                                        newValue !== new Date() &&
                                        form.change("isASAP", false);
                                    }}
                                  />
                                </div>
                                <div className="col-12 col-md-12 _checkboxmob mb-4">
                                  <CheckboxControlGlobal
                                    name="isASAP"
                                    label="Decision date ASAP"
                                  />
                                </div>

                                <div className="col-12 col-md-12 _checkboxmob mb-4">
                                  <CheckboxControlGlobal
                                    name="isCallMe"
                                    label="Please call me"
                                  />
                                </div>

                                {values.isCallMe ? (
                                  <>

                                    <div className="col-12 col-md-6 custom-select-form">
                                      <SearchSelectWithForm
                                        name="callMeDetails.callBackOption"
                                        label="Call back options"
                                        options={CALLBACK_OPTIONS}
                                        placeholder={"Please select"}
                                        defaultValue={CALLBACK_OPTIONS[0]}
                                        validate={composeValidators(requiredSelect)}

                                      />
                                    </div>
                                    <div className="col-12 col-md-12 custom-select-form">
                                      <div className="text-start form-field">
                                        <SearchSelectWithForm
                                          name="callMeDetails.timeZone"
                                          label="Time zone"
                                          options={TIME_ZONE_OPTIONS}
                                          placeholder={"Please select your current time zone"}
                                          defaultValue={TIME_ZONE_OPTIONS[0]}
                                          isSearchable
                                        />
                                      </div>
                                    </div>

                                  </>
                                )
                                  :
                                  null
                                }

                                <div className="col-12 col-md-12 _checkboxmob mb-4">
                                  <CheckboxControlGlobal
                                    name="requestJoke"
                                    label="Request joke or riddle"
                                  />
                                </div>

                                <div className="col-12 col-md-12">
                                  <FormControl
                                    label="Organization"
                                    name="organization"
                                    type="text"
                                  />
                                </div>
                                <div className="col-12 col-md-12 _checkboxmob mb-2">
                                  <SearchSelectWithForm
                                    name="findUs"
                                    label="How did you find us?"
                                    options={HOW_DID_YOU_FIND_US_OPTIONS}
                                  />
                                </div>
                                <div className="col-12 col-md-12">
                                  <FormControl
                                    label="Please tell us more"
                                    name="findUsOther"
                                    type="text"
                                  />
                                </div>

                                <div className="col-12 custom-select-form _editchips">
                                  <div className="text-start form-field">
                                    <NeighbourhoodListDropDown
                                      name="neighborhood"
                                      label="Neighborhoods of Interest"
                                      // options={NEIGHBORHOODS_OPTIONS}
                                      placeholder={"Select multiple"}
                                      isMulti={true}
                                      isSearchable
                                    />
                                  </div>
                                </div>
                                <div className="col-12">
                                  <FormControl
                                    label="Desitination Address"
                                    name="destinationAddress"
                                    type="text"
                                  />
                                </div>
                                <div className="col-12 col-md-12 _checkboxmob mb-4">
                                  <CheckboxControlGlobal
                                    name="isParking"
                                    label="Need Parking?"
                                  />
                                </div>
                                {values.isParking ? (
                                  <>
                                    <div className="col-12">
                                      <FormControl
                                        label="Parking Requirements"
                                        name="parkingRequirements"
                                        type="text"
                                      />
                                    </div>
                                    <div className="col-12 custom-select-form">
                                      <div className="text-start form-field">
                                        <SearchSelectWithForm
                                          name="vehicleSize"
                                          label="Vehicle Size"
                                          options={VEHICLE_TYPE}
                                          placeholder={VEHICLE_TYPE[0].label}
                                          defaultValue={VEHICLE_TYPE[0]}
                                        />
                                      </div>
                                    </div>
                                  </>
                                )
                                  :
                                  null
                                }
                                <div className="col-12 col-md-12 _checkboxmob mb-4">
                                  <CheckboxControlGlobal
                                    name="isPetAllowed"
                                    label="Pet Friendly?"
                                  />
                                </div>
                                {values.isPetAllowed ? (
                                  <>
                                    <div className="col-12 col-md-6 custom-select-form">
                                      <div className="text-start form-field">
                                        <SearchSelectWithForm
                                          name="petCount"
                                          label="How many pets?"
                                          options={PET_NUMBER}
                                          placeholder={PET_NUMBER[0].label}
                                          defaultValue={PET_NUMBER[0]}
                                        />
                                      </div>
                                    </div>
                                    <div className="col-12">
                                      <FormControl
                                        label="Pet Description"
                                        name="petDescription"
                                        type="text"
                                      />
                                    </div>
                                  </>
                                )
                                  :
                                  null
                                }

                                <div className="col-12 custom-select-form">
                                  <div className="text-start form-field">
                                    <PriorityDropDown
                                      name="firstPriority"
                                      label="First Priority"
                                      disabledOptions={[
                                        values.secondPriority?.value,
                                        values.thirdPriority?.value,
                                      ]}
                                    />
                                  </div>
                                </div>
                                <div className="col-12 custom-select-form">
                                  <div className="text-start form-field">
                                    <PriorityDropDown
                                      name="secondPriority"
                                      label="Second Priority"
                                      disabledOptions={[
                                        values.firstPriority?.value,
                                        values.thirdPriority?.value,
                                      ]}
                                    />
                                  </div>
                                </div>
                                <div className="col-12 custom-select-form">
                                  <div className="text-start form-field">
                                    <PriorityDropDown
                                      name="thirdPriority"
                                      label="Third Priority"
                                      disabledOptions={[
                                        values.secondPriority?.value,
                                        values.firstPriority?.value,
                                      ]}
                                    />
                                  </div>
                                </div>
                                <div className="col-12">
                                  <FormControl
                                    label="Special Requests"
                                    name="specialRequests"
                                    type="text"
                                  />
                                </div>
                                <div className="col-12 custom-select-form _editchips">
                                  <div className="text-start form-field">
                                    <PropertyListDropDown
                                      label="Properties of interest"
                                      name="interestedProperties"
                                      isMulti={true}
                                      isSearchable
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="info-wrapper info-wrapper-multiple">
                            <div className="infoleft">
                              <h2>Processing Fields</h2>
                            </div>
                            <div className="info-right">
                              <div className="row">
                                <div className="col-12 custom-select-form _editchips">
                                  <div className="text-start form-field">
                                      <PropertyListDropDown
                                        label="Properties to offer"
                                        name="offeredProperties"
                                        isMulti={true}
                                        isSearchable
                                      />
                                  </div>
                                </div>
                                <div className="col-12 custom-select-form">
                                  <div className="text-start form-field">
                                    <PropertyListDropDown
                                        label="Agreed Property"
                                        name="agreedProperty"
                                        isSearchable
                                      />
                                  </div>
                                </div>
                                <div className="col-12 custom-select-form">
                                  <div className="text-start form-field">
                                    <SearchSelectWithForm
                                        name="rentalInquiryUpdateStatus"
                                        label="Status"
                                        options={RENTAL_STATUS}
                                        placeholder={RENTAL_STATUS[0].label}
                                        defaultValue={RENTAL_STATUS[0]}
                                        validate={composeValidators(requiredSelect)}
                                    />
                                  </div>
                                </div>
                                <div className="col-12 col-md-12 _checkboxmob mb-4">
                                  <CheckboxControlGlobal
                                    name="waiveApplicationFee"
                                    label="Waive Application Fee"
                                  />
                                </div>
                                <div className="col-12 textareafield">
                                  <FormControl
                                    label="Internal Note"
                                    name="notes"
                                    type="textarea"
                                    maxlength={500}
                                    placeholder="Note"
                                  />
                                </div>
                                <div className="toggle-switch-btn">
                                  <div className="col-12 col-md-12">
                                    <Field name="newMatchNotification" type="checkbox">
                                      {({ input }) => (
                                        <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>

                                          {/* Custom Toggle Switch */}
                                          <div className="toggle-container" style={{ position: 'relative' }}>
                                            <input
                                              {...input}
                                              type="checkbox"
                                              id="toggleSwitch"
                                              style={{ display: 'none' }}
                                              onChange={(e) => {
                                                const isChecked1 = e.target.checked;
                                                setIsChecked(isChecked1); // Update local state
                                                form.change("newMatchNotification", isChecked1); // Update form state
                                              }}
                                            // Hide default checkbox
                                            />
                                            {/* Label acting as the toggle switch */}
                                            <label
                                              htmlFor="toggleSwitch"
                                              style={{
                                                display: 'inline-block',
                                                width: '50px',
                                                height: '24px',
                                                backgroundColor: isChecked ? '#4CAF50' : '#ccc',
                                                borderRadius: '50px',
                                                position: 'relative',
                                                cursor: 'pointer',
                                                transition: 'background-color 0.3s',
                                              }}
                                            >
                                              {/* Circle inside the toggle */}
                                              <span
                                                style={{
                                                  position: 'absolute',
                                                  top: '2px',
                                                  left: input.checked ? '26px' : '2px',
                                                  width: '20px',
                                                  height: '20px',
                                                  backgroundColor: 'white',
                                                  borderRadius: '50%',
                                                  transition: 'left 0.3s',
                                                }}
                                              />
                                            </label>
                                          </div>

                                          <label className="form-label" style={{ marginRight: '10px', marginBottom: '4px' }}>Send New Match Notification</label>

                                        </div>
                                      )}
                                    </Field>

                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                        </form>
                      )
                    }}
                  />
                )}
              </div>
            </Tab>
            <Tab eventKey="guestHistory" title="Lease History">
              <GuestHistory />
            </Tab>
            <Tab eventKey="suggestedProperties" title="Suggested Properties">
              <SuggestedProperty />
            </Tab>
            <Tab eventKey="userDetails" title="User Details">
              <RentalDetail inquiryData={rowData}/>
            </Tab>
          </Tabs>
        </div>

      </div>

      {
        rentalId && deleteModal ?  (
            <DeleteRentalInquiryModel
                show={deleteModal}
                handleClose={() => setDeleteModal(false)}
                rentalId={rentalId}
                updateListItem={updateListItem}
            />
        )
        :
        null
      }
    </>
  );
};

export default AddEditRenterInquiry;
