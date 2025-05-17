import { Form } from "react-final-form";
import { addDays } from "date-fns";
import { FormControl } from "../FormElements/FormControl";
import Button from "react-bootstrap/Button";
import { DatePickerControl } from "../FormElements/DatePicker";
import {
  composeValidators,
  minValue,
  required,
  requiredSelect,
  validEmail,
} from "../../validations";
import { CheckboxControlGlobal } from "../FormElements/CheckboxControl";
import {
  BATHROOM_OPTIONS,
  BEDROOM_OPTIONS,
  BUDGET,
  CALLBACK_OPTIONS,
  HOME_SEARCH_REASON,
  HOW_DID_YOU_FIND_US_OPTIONS,
  OCCUPANT_COUNT,
  PET_NUMBER,
  PRIORITY_OPTIONS,
  TIME_ZONE_OPTIONS,
  VALIDATIONS,
  VEHICLE_TYPE,
} from "../../constants";
import CreatePassword from "../CreatePassword";
import PropertyListDropDown from "../SearchSelect/PropertyListDropDown";
import { SearchSelectWithForm } from "../SearchSelect/SearchSelect";
import { RadioControl } from "../FormElements/RadioControl";
import { DropDownOption } from "../../types/rental.type";
import { encryptPassword } from "../../utils";
import { useAuth } from "../../hooks/useAuth";
import { useEffect, useState } from "react";
import NeighbourhoodListDropDown from "../SearchSelect/NeighbourhoodList";
import {
  loadCaptchaEnginge,
  LoadCanvasTemplate,
  validateCaptcha,
} from "react-simple-captcha";
import moment from "moment";

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

export default function AddEditRentalInq({
  isEdit,
  data = {},
  submitData,
}: {
  isEdit?: boolean;
  data?: any;
  submitData: (data: any, isLogin?: boolean) => void;
}) {
  const auth = useAuth();
  const [showCaptchaError, setCaptchaError] = useState(false);

  const onSubmit = (values: any) => {
    setCaptchaError(false);
    let user_captcha = values.captcha;
    if (validateCaptcha(user_captcha) === true) {
      loadCaptchaEnginge(6);
      delete values.captcha;
    
      let alternatePhoneIds = [];
      values.interestedProperties = values.interestedProperties?.map(
        (item: DropDownOption) => item.value || item
      );
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

      if (values.mobile) {
        alternatePhoneIds.push({
          phone: values.mobile,
          type: "mobile",
          note: ' '
        });
      }
      if (values.homePhoneNo) {
        alternatePhoneIds.push({
          phone: values.homePhoneNo,
          type: "home",
          note: ' '
        });
      }
      if (values.workPhoneNo) {
        alternatePhoneIds.push({
          phone: values.workPhoneNo,
          type: "work",
          note: ' '
        });
      }

      const reqData: any = {
        ...values,
        unitId: 0,
        estimatedArrivalDate: values.estimatedArrivalDate ? moment(values.estimatedArrivalDate, 'YYYY-MM-DD hh:mm A').format('YYYY-MM-DD HH:mm:ss') : null,
        estimatedDepartureDate: values.estimatedDepartureDate ? moment(values.estimatedDepartureDate, 'YYYY-MM-DD hh:mm A').format('YYYY-MM-DD HH:mm:ss') : null,
        lastDecisionDate: values.lastDecisionDate ? moment(values.lastDecisionDate, 'YYYY-MM-DD hh:mm A').format('YYYY-MM-DD HH:mm:ss') : null,
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
        password:
          values.isAccountCreation === "false"
            ? encryptPassword(values.password)
            : undefined,
        firstPriority: values.firstPriority?.value || values.firstPriority,
        secondPriority: values.secondPriority?.value || values.secondPriority,
        thirdPriority: values.thirdPriority?.value || values.thirdPriority,
        isAccountCreation: undefined,
        _id: data._id,
        vehicleSize: undefined
      };
      

      if(alternatePhoneIds.length > 0) {
        reqData.alternatePhoneIds = alternatePhoneIds;
      }
      delete reqData.bestPet;
      delete reqData.vehicleSize;
      delete reqData.petCount;
      delete reqData.parkingRequirements;
      delete reqData.petDescription;

      submitData(reqData, values.isAccountCreation === "false");
    } else {
      setCaptchaError(true);
    }
  };

  useEffect(() => {
    loadCaptchaEnginge(8);
  }, []);

  return (
    <Form
      onSubmit={onSubmit}
      initialValues={{
        isAccountCreation: auth.user ? "true" : "false",
        ...data,
      }}
      render={({ handleSubmit, values, form }) => (
        <form onSubmit={handleSubmit} className="owner-inquery-form">
          <div className="row">
            <div className="col-12">
              <PropertyListDropDown
                label="I've found the properties I am most interested in (Optional)"
                name="interestedProperties"
                isMulti={true}
                isSearchable
              />
            </div>
            <div className="col-12">
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
            <div className="col-12">
              <CheckboxControlGlobal
                name="isArrivalDateFlexible"
                label="Is your arrival date flexible? "
              />
            </div>
            {values.isArrivalDateFlexible ? (
              <FlexibleDateInfo name="flexibleArrival" message="arrival"/>
            ) : null}

            <div className="col-12">
              <DatePickerControl
                label="Estimated Departure *"
                name="estimatedDepartureDate"
                placeholder="MM-DD-YY"
                minDate={addDays(values.estimatedArrivalDate, 31)}
                validate={composeValidators(required)}
              />
            </div>
            <div className="col-12">
              <CheckboxControlGlobal
                name="isDepartureDateFlexible"
                label="Is your departure date flexible? "
              />
            </div>
            {values.isDepartureDateFlexible ? (
              <FlexibleDateInfo name="flexibleDeparture" message="departure" />
            ) : null}

            <div className="col-12 custom-select-form">
              <SearchSelectWithForm
                name="maxMonthlyBudget"
                label="Budget *"
                options={BUDGET}
                placeholder={BUDGET[0].label}
                validate={composeValidators(requiredSelect)}
              />
            </div>

            <div className="col-12">
              <CheckboxControlGlobal
                name="isImportantNotesForBudget"
                label="Important notes to add about my budget"
              />
            </div>

            {values.isImportantNotesForBudget ? (
              <div className="col-12">
                <FormControl
                  label="Tell us more about your budget."
                  name="budgetDesc"
                  type="text"
                  placeholder=""
                />
              </div>
            ) : null}

            <div className="col-12 custom-select-form">
              <SearchSelectWithForm
                name="minimumNumberOfBeds"
                label="Bedrooms *"
                options={BEDROOM_OPTIONS}
                placeholder={BEDROOM_OPTIONS[0].label}
                validate={composeValidators(requiredSelect)}
              />
            </div>

            <div className="col-12 custom-select-form">
              <SearchSelectWithForm
                name="minimumNumberOfBathrooms"
                label="Bathrooms *"
                options={BATHROOM_OPTIONS}
                placeholder={BATHROOM_OPTIONS[0].label}
                validate={composeValidators(requiredSelect)}
              />
            </div>

            <div className="col-12 custom-select-form">
              <SearchSelectWithForm
                name="occupantCount"
                label="Number of Occupants *"
                options={OCCUPANT_COUNT}
                placeholder={OCCUPANT_COUNT[0].label}
                validate={composeValidators(requiredSelect)}
              />
            </div>

            <div className="col-12 custom-select-form">
              <NeighbourhoodListDropDown
                name="neighborhood"
                label="Neighborhoods of Interest"
                // options={NEIGHBORHOODS_OPTIONS}
                placeholder={"Select multiple"}
                isMulti={true}
                isSearchable
              />
            </div>

            <div className="col-12">
              <FormControl
                label="What intersection/address/landmark do you wish to be close to ?"
                name="landmark"
                type="text"
                placeholder=""
              />
            </div>

            <div className="col-12">
              <CheckboxControlGlobal
                name="isParking"
                label="Need Parking?"
                tooltipText="Parking rates vary from $270-$350 per month."
              />
            </div>
            {values.isParking ? (
              <>
                <div className="col-12 custom-select-form">
                  <SearchSelectWithForm
                    name="vehicleSize"
                    label="Vehicle Size"
                    options={VEHICLE_TYPE}
                    placeholder={VEHICLE_TYPE[0].label}
                    defaultValue={VEHICLE_TYPE[0]}
                  />
                </div>
                <div className="col-12">
                  <FormControl
                    label="Parking Requirements"
                    name="parkingRequirements"
                    type="text"
                    placeholder="Number of vehicles, coverd parking, parking spot distance, etc."
                  />
                </div>
              </>
            ) : null}

            <div className="col-12">
              <CheckboxControlGlobal
                name="isPetAllowed"
                label="Pet Friendly?"
                tooltipText="Additional pet fees may apply.."
              />
            </div>

            {values.isPetAllowed ? (
              <>
                <div className="col-12 custom-select-form">
                  <SearchSelectWithForm
                    name="petCount"
                    label="How many pets?"
                    options={PET_NUMBER}
                    placeholder={PET_NUMBER[0].label}
                    defaultValue={PET_NUMBER[0]}
                  />
                </div>
                <div className="col-12">
                  <FormControl
                    label="Pet Description"
                    name="petDescription"
                    type="text"
                    placeholder="Pet type, weight, breed, etc."
                  />
                </div>
                <div className="col-12">
                  <FormControl
                    label="Do you have the best pet in the whole world?"
                    name="bestPet"
                    type="text"
                    placeholder="ha?"
                  />
                </div>
              </>
            ) : null}
            <div className="heading mb-3 mt-1">
              <h5>Please let us know about you.</h5>
            </div>

            <div className="col-12 col-md-6">
              <FormControl
                label="First Name *"
                name="firstName"
                type="text"
                maxlength={15}
                placeholder="Enter first name"
                validate={composeValidators(required)}
                disabled={isEdit || auth.user}
              />
            </div>

            <div className="col-12 col-md-6">
              <FormControl
                label="Last Name *"
                name="lastName"
                type="text"
                maxlength={15}
                placeholder="Enter last name"
                validate={composeValidators(required)}
                disabled={isEdit || auth.user}
              />
            </div>

            <div className="col-12">
              <FormControl
                label="Email *"
                name="email"
                type="text"
                placeholder="Enter email address"
                validate={composeValidators(required, validEmail)}
                disabled={isEdit || auth.user}
              />
            </div>
            <div className="col-12">
              <FormControl
                label="Mobile"
                name="mobile"
                type="mobile"
                maxlength={15}
                placeholder="Enter Mobile Number"
                validate={composeValidators(
                  minValue(VALIDATIONS.MIN_PHONE)
                )}
                disabled={isEdit || auth.user}
              />
            </div>

            <div className="col-12">
              <CheckboxControlGlobal
                name="isCallMe"
                label="Please call me"
                tooltipText="An Attache Representative will call you within 1 business day."
              />
            </div>
            {values.isCallMe ? (
              <>
                <div className="col-12 col-md-6">
                  <SearchSelectWithForm
                    name="callMeDetails.timeZone"
                    label="Time zone"
                    options={TIME_ZONE_OPTIONS}
                    placeholder={"Please select your current time zone"}
                    defaultValue={TIME_ZONE_OPTIONS[0]}
                    isSearchable
                  />
                </div>

                <div className="col-12 col-md-6">
                  <SearchSelectWithForm
                    name="callMeDetails.callBackOption"
                    label="Call back options"
                    options={CALLBACK_OPTIONS}
                    placeholder={"Please select"}
                    defaultValue={CALLBACK_OPTIONS[0]}
                    validate={composeValidators(requiredSelect)}
                    toolTipInfo={
                      "A call-back can currently only be made 9AM-5:30PM- Monday-Friday (Eastern time zone). Additional hours and days for call-backs will be added shortly."
                    }
                  />
                </div>
              </>
            ) : null}

            <div className="heading mb-3 mt-1">
              <h5>
                Please let us know which of your requests are the most important
                to you by choosing from the options below.
              </h5>
            </div>
            <div className="col-12 custom-select-form">
              <PriorityDropDown
                name="firstPriority"
                label="First Priority"
                disabledOptions={[
                  values.secondPriority?.value,
                  values.thirdPriority?.value,
                ]}
              />
            </div>
            <div className="col-12 custom-select-form">
              <PriorityDropDown
                name="secondPriority"
                label="Second Priority"
                disabledOptions={[
                  values.firstPriority?.value,
                  values.thirdPriority?.value,
                ]}
              />
            </div>
            <div className="col-12 custom-select-form">
              <PriorityDropDown
                name="thirdPriority"
                label="Third Priority"
                disabledOptions={[
                  values.secondPriority?.value,
                  values.firstPriority?.value,
                ]}
              />
            </div>

            <div className="col-12 custom-select-form">
              <SearchSelectWithForm
                name="bringsYouTown"
                label="What brings you to Town?"
                options={HOME_SEARCH_REASON}
                placeholder={"Please Select"}
              />
            </div>

            <div className="col-12">
              <CheckboxControlGlobal
                name="isGovtPerDiem"
                label="Are you on government Per Diem?"
                tooltipText="If your lodging expenses are being paid for by government per diem please click here. We are experts in government per diem rates and billing schedules."
              />
            </div>

            <div className="col-12 custom-select-form">
              <SearchSelectWithForm
                name="findUs"
                label="How did you find us?"
                options={HOW_DID_YOU_FIND_US_OPTIONS}
                placeholder={"Select One and Tell Us More"}
              />
            </div>
            {/* <div className="col-12">
              <DatePickerControl
                label="When is the latest you would like to make a decision on your rental?"
                name="lastDecisionDate"
                placeholder="MM-DD-YY"
                onChange={(newValue: Date) => {
                  values.isASAP &&
                    newValue !== new Date() &&
                    form.change("isASAP", false);
                }}
              />
            </div> */}

            <div className="col-12">
              <CheckboxControlGlobal
                name="isASAP"
                label="ASAP"
                tooltipText="Check this box if you are ready to make a decision."
                // onChange={(event: any) => {
                //   const newValue = event.target.checked;
                //   newValue && form.change("lastDecisionDate", new Date());
                // }}
              />
            </div>

            {values.isAccountCreation === "false" && !auth?.user ? (
              <div className="col-12">
                <CreatePassword />
              </div>
            ) : null}

            <div className="captcha-field-1">
              <FormControl
                label="Captcha"
                name="captcha"
                type="text"
                validate={composeValidators(required)}
              />
              {
                showCaptchaError ?
                <div className="incorrect">Captcha is incorrect</div>
                :
                null
              }
              <div className="cap_canvas">
                <LoadCanvasTemplate />
                </div>
            </div>
          </div>
          <div className="action-btn-wrapper fixed-bottom">
            <div
              className={`action-btns oi-action-btn ${
                auth?.user
                  ? "justify-content-end ml-1"
                  : "justify-content-around"
              }`}
            >
              {auth?.user ? null : (
                <div className="d-flex gap-1 flex-column ">
                  <RadioControl
                    name="isAccountCreation"
                    label="Continue and create an account"
                    value={"false"}
                    tooltipText="Creating an account gives you access to all your searches and rental history and gives you updates on properties that are newly available and match your search parameters."
                  />
                  <RadioControl
                    name="isAccountCreation"
                    label="Continue without creating an account"
                    value={"true"}
                    tooltipText="Be a guest you can get all your searches and booking history information via mail on your registered email address."
                  />
                </div>
              )}
               
              <Button type="submit" className="btn primary">
                Submit
              </Button>
            </div>
          </div>
        </form>
      )}
    />
  );
}
