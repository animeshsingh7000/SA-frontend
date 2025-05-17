import React, { useEffect, useRef, useState } from "react";
import { Button } from "react-bootstrap";
import { toast } from "react-toastify";
import { FormControl } from "../../components/FormElements/FormControl";
import { VALIDATIONS } from "../../constants";
import {
  composeValidators,
  maxlength,
  minValue,
  required,
  requiredSelect,
  validEmail,
} from "../../validations";
import { Form, Field, useField } from "react-final-form";
import Header from "../Header";
import iconOwner from "../../assets/images/owner-green-icon.svg";
import { Link, useNavigate } from "react-router-dom";
import { ROUTE_NAVIGATION_PATH } from "../../routes/routes";
import Dropdown from "react-bootstrap/Dropdown";
import { DatePickerControl } from "../../components/FormElements/DatePicker";
import PasswordField from "../../components/FormElements/PasswordField";
import { formatDate1 } from "../../utils/common";
import { configuration, owner } from "../../api";
import { useCustomMutation } from "../../hooks/useApi";
import { useMessageModal } from "../../hooks/useMessage";
import { Breadcrumb } from "../../components";
import moment from "moment";
import { SearchSelectWithForm } from "../../components/SearchSelect/SearchSelect";

interface MyDropdownItemProps {
  children: React.ReactNode;
  newValue: any;
  onChange: (newValue: any) => void;
}

const DropdownField = ({
  name,
  label,
  defaultName,
  children,
}: {
  name: any;
  label: any;
  defaultName: any;
  children: any;
}) => {
  const { input, meta } = useField(name);

  const validate = (value: any) => {
    if (!value) {
      return "Required";
    }
  };
  return (
    <Dropdown className="common-dropdown">
      <label className="form-label">{label}</label>
      <Dropdown.Toggle variant="success">
        <Field
          name={name}
          validate={validate}
          render={({ input, meta }) => (
            <>
              {input.value
                ? // Render the label of the selected option
                  children.find(
                    (child: any) => child.props.newValue === input.value
                  )?.props.children || input.value
                : // Render the default name if no option is selected
                  defaultName}
              {/* No error message rendered here */}
            </>
          )}
        />
      </Dropdown.Toggle>
      <Dropdown.Menu>
        {React.Children.map(children, (child) =>
          React.cloneElement(child, { onChange: input.onChange })
        )}
      </Dropdown.Menu>
      {meta.touched && meta.error && <div className="error">{meta.error}</div>}
    </Dropdown>
  );
};

export default function OwnerInquiry() {
  const [showAlternateEmail, setShowAlternateEmail] = useState(false);
  const navigate = useNavigate();
  const [stateCodeList, setStateCodeList] = useState<any>([]);
  const effectRan = useRef(false);

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
  }, []);

  const { mutate } = useCustomMutation({
    mutationFn: owner.ownerInquiry,
    onSuccess: () => {
      toast.success("Owner Inquiry submitted successfully!");
      navigate(ROUTE_NAVIGATION_PATH.SIGN_IN);
    },
  });

  const onSubmit = (values: any) => {
    let alternatePhoneIds = [];
    var formData = new FormData();
    const data: any = {
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      mobile: values.mobile,
      address: {
        addressLine1: values.addressLine1,
        city: values.city,
        state: values.stateCode.value ? values.stateCode.value : '',
        postalCode: values.postalCode,
        country: "UnitedStates",
      },

      unitBedrooms: values.unitBedrooms,
      unitBathrooms: values.unitBathrooms,
      password: values.password,
    };
    if (values.propertyAvailableFrom) {
      data.propertyAvailableFrom = moment(values.propertyAvailableFrom).format("YYYY-MM-DD");
    }

    if (values.unitSize) {
      data.unitSize = Number(values.unitSize);
    }

    if (values.minimumReservationTerm) {
      data.minimumReservationTerm = Number(values?.minimumReservationTerm);
    }

    if (values.askUsAnything) {
      data.askUsAnything = values.askUsAnything;
    }

    
    if (values.homePhoneNo) {
      alternatePhoneIds.push({
        phone: values.homePhoneNo,
        type: "home",
        note: ' '
      });
      data.homePhoneNo = values?.workPhoneNo;
    }

    if (values.mobile) {
      alternatePhoneIds.push({
        phone: values.mobile,
        type: "mobile",
        note: ' '
      });
      data.homePhoneNo = values?.workPhoneNo;
    }

    if (values.workPhoneNo) {
      alternatePhoneIds.push({
        phone: values.workPhoneNo,
        type: "work",
        note: ' '
      });
      data.workPhoneNo = values?.workPhoneNo;
    }

    if(alternatePhoneIds.length > 0) {
      data.alternatePhoneIds = alternatePhoneIds;
    }

    if (showAlternateEmail) {
      data.alternateEmail = values.alternateEmail;
      data.alternateEmailIds = [values.alternateEmail];
    }
    mutate(data);
  };

  const handleChange = (newValue: any) => {
    // Do something with the new value, e.g., update the form state
  };

  return (
    <>
      <Header mainClass="with-btn" isNavButton={true} />
      <main className="main-content">
        <Breadcrumb
          icon={iconOwner}
          heading="Owner Inquiry"
          description="The Attache owner program provides great service to our
          property owners and it's easy to get started. After reviewing
          our owner services you can inquire about having your property
          managed by completing a quick owner inquiry"
        />
        <div className="owner-inquery-wrapper">
          <Form
            onSubmit={onSubmit}
            render={({ handleSubmit, values }) => (
              <form onSubmit={handleSubmit} className="owner-inquery-form">
                <div className="owner-inquery-helper-text">
                  Submitting this form is the first step to starting your
                  housing search. It is not binding and your information will
                  always be kept private.{" "}
                  <Link
                    to={ROUTE_NAVIGATION_PATH.PRIVACY_POLICY}
                    className="normal-link"
                    title="Privacy Policy"
                  >
                    Privacy Policy
                  </Link>
                </div>
                <div className="row">
                  <div className="col-12 col-md-6">
                    <FormControl
                      label="First Name*"
                      name="firstName"
                      type="text"
                      placeholder="Enter first name"
                      validate={composeValidators(
                        required,
                        maxlength(VALIDATIONS.MAX_NAME)
                      )}
                    />
                  </div>
                  <div className="col-12 col-md-6">
                    <FormControl
                      label="Last Name*"
                      name="lastName"
                      type="text"
                      placeholder="Enter last name"
                      validate={composeValidators(
                        required,
                        maxlength(VALIDATIONS.MAX_NAME)
                      )}
                    />
                  </div>
                  <div className="col-12 col-md-6">
                    <FormControl
                      label="Email Address*"
                      name="email"
                      type="email"
                      placeholder="Enter email address"
                      validate={composeValidators(required, validEmail)}
                    />
                  </div>
                  <div className="col-12 col-md-6">
                    <FormControl
                      label="Mobile*"
                      name="mobile"
                      type="mobile"
                      maxlength={15}
                      placeholder="Enter Mobile Number"
                      validate={composeValidators(
                        required,
                        minValue(VALIDATIONS.MIN_PHONE)
                      )}
                    />
                  </div>
                  <div className="col-12 col-md-6">
                    <FormControl
                      label="Address or Intersection*"
                      name="addressLine1"
                      type="text"
                      placeholder="Enter address"
                      validate={composeValidators(required)}
                    />
                  </div>
                  <div className="col-12 col-md-6 custom-select-form">
                    {
                        stateCodeList && stateCodeList.length > 0  ? 
                            <SearchSelectWithForm
                                name="stateCode"
                                label="State Code*"
                                options={stateCodeList}
                                validate={composeValidators(requiredSelect)}
                            />
                        :
                        null

                    }
                  </div>
                  <div className="col-12 col-md-6">
                    <FormControl
                      label="City*"
                      name="city"
                      type="text"
                      placeholder="Enter city name"
                      validate={composeValidators(required)}
                    />
                  </div>
                  <div className="col-12 col-md-6">
                    <FormControl
                      label="Zip Code*"
                      name="postalCode"
                      type="mobile"
                      maxlength={6}
                      placeholder="Enter zipcode"
                      validate={composeValidators(required)}
                    />
                  </div>
                  <div className="col-12 col-md-6">
                    <DatePickerControl
                      label="Date available to start renting*"
                      name="propertyAvailableFrom"
                      placeholder="MM-DD-YY"
                      validate={composeValidators(required)}
                    />
                  </div>
                  <div className="col-12 col-md-6">
                    <FormControl
                      label="Square Footage*"
                      name="unitSize"
                      type="mobile"
                      maxlength={12}
                      placeholder="Enter square footage"
                      validate={composeValidators(required)}
                    />
                  </div>
                  <div className="col-12 col-md-6 custom-select-form">
                    <DropdownField
                      name="unitBedrooms"
                      label="Bedrooms*"
                      defaultName="Number of Bedrooms"
                    >
                      <MyDropdownItem newValue="" onChange={handleSubmit}>
                        Number of Bedrooms
                      </MyDropdownItem>
                      <MyDropdownItem newValue="Studio" onChange={handleSubmit}>
                        Studio
                      </MyDropdownItem>
                      <MyDropdownItem newValue="OneBed" onChange={handleSubmit}>
                        1 Bedroom
                      </MyDropdownItem>
                      <MyDropdownItem newValue="TwoBed" onChange={handleSubmit}>
                        2 Bedroom
                      </MyDropdownItem>
                      <MyDropdownItem
                        newValue="ThreeBed"
                        onChange={handleSubmit}
                      >
                        3 Bedroom
                      </MyDropdownItem>
                      <MyDropdownItem
                        newValue="FourBed"
                        onChange={handleSubmit}
                      >
                        4 Bedroom
                      </MyDropdownItem>
                      <MyDropdownItem
                        newValue="FiveBed"
                        onChange={handleSubmit}
                      >
                        5 Bedroom
                      </MyDropdownItem>
                      <MyDropdownItem newValue="SixBed" onChange={handleSubmit}>
                        6 Bedroom
                      </MyDropdownItem>
                      <MyDropdownItem
                        newValue="SevenBed"
                        onChange={handleSubmit}
                      >
                        7 Bedroom
                      </MyDropdownItem>
                      <MyDropdownItem
                        newValue="EightBed"
                        onChange={handleSubmit}
                      >
                        8 Bedroom
                      </MyDropdownItem>
                      <MyDropdownItem
                        newValue="NineBedPlus"
                        onChange={handleSubmit}
                      >
                        9 Bedroom or more
                      </MyDropdownItem>
                    </DropdownField>
                  </div>
                  <div className="col-12 col-md-6 custom-select-form">
                    <DropdownField
                      name="unitBathrooms"
                      label="Bathrooms*"
                      defaultName="Number of Bathrooms"
                    >
                      <MyDropdownItem newValue="" onChange={handleSubmit}>
                        Number of Bathrooms
                      </MyDropdownItem>
                      <MyDropdownItem
                        newValue="OneBath"
                        onChange={handleSubmit}
                      >
                        One
                      </MyDropdownItem>
                      <MyDropdownItem
                        newValue="TwoBath"
                        onChange={handleSubmit}
                      >
                        Two
                      </MyDropdownItem>
                      <MyDropdownItem
                        newValue="ThreeBath"
                        onChange={handleSubmit}
                      >
                        Three
                      </MyDropdownItem>
                      <MyDropdownItem
                        newValue="FourBath"
                        onChange={handleSubmit}
                      >
                        Four
                      </MyDropdownItem>
                      <MyDropdownItem
                        newValue="FivePlusBath"
                        onChange={handleSubmit}
                      >
                        Five or more
                      </MyDropdownItem>
                    </DropdownField>
                  </div>
                  <div className="col-12 bigtxt">
                    <div className="minimum-term-para">
                      Minimum Term Lease Days (If Condo Building)
                    </div>
                    <FormControl
                      label="All of our properties have 30-day minimum lease terms. Some buildings will have 90 day or 180 day min lease terms."
                      name="minimumReservationTerm"
                      type="textarea-number"
                      maxlength={3}
                      placeholder="Enter minimum stay days"
                    />
                  </div>
                  {/* <div className="col-12">
                    <div className="alternate">Phone Number (Alternate)</div>
                    <FormControl
                      name="inquiry"
                      type="mobile"
                      rows="3"
                      maxlength={VALIDATIONS.MAX_DESCRIPTION}
                      validate={composeValidators(required)}
                      placeholder="Enter your alternate phone number"
                    />
                    <div className="remove-tag">
                      <Button type="button" className="btn-link">
                        Remove
                      </Button>
                    </div>
                    <div className="add_tag_link">
                      <span>+</span> Add Phone Number
                    </div>
                  </div> */}
                  <div className="col-12 col-md-6">
                    <FormControl
                      label="Work Phone Number"
                      name="workPhoneNo"
                      type="mobile"
                      maxlength={15}
                      placeholder="Enter Work Phone Number"
                    />
                  </div>
                  <div className="col-12 col-md-6">
                    <FormControl
                      label="Home Phone Number"
                      name="homePhoneNo"
                      type="mobile"
                      maxlength={15}
                      placeholder="Enter Home Phone Number"
                    />
                  </div>
                  <div className="col-12">
                    {showAlternateEmail ? (
                      <>
                        <div className="alternate">Email (Alternate)</div>
                        <FormControl
                          name="alternateEmail"
                          type="text"
                          rows="3"
                          placeholder="Enter your alternate email address"
                        />
                        <div
                          className="remove-tag"
                          onClick={() => setShowAlternateEmail(false)}
                        >
                          <Button type="button" className="btn-link">
                            Remove
                          </Button>
                        </div>
                      </>
                    ) : (
                      <div
                        className="add_tag_link"
                        onClick={() => setShowAlternateEmail(true)}
                      >
                        <span>+</span> Add Email
                      </div>
                    )}
                  </div>

                  <div className="col-12">
                    <FormControl
                      label="Ask Us Anything"
                      name="askUsAnything"
                      type="textarea"
                      rows="3"
                      maxlength={VALIDATIONS.MAX_DESCRIPTION}
                      placeholder="Ask Us Anything"
                    />
                  </div>
                  <div className="create-your-pass top-seperator">
                    <div className="captcha-field">
                      <h5>Create Password</h5>
                      <p>
                        Create a password to be able to log into your account in
                        the future.
                      </p>
                      <PasswordField
                        label="Password"
                        name="password"
                        placeholder="Enter your password"
                        validations={composeValidators(
                          required,
                          minValue(VALIDATIONS.MIN_PASSWORD)
                        )}
                      />
                    </div>
                    {/* <div className="captcha-field">
                      <PasswordField
                        label="Confirm Password"
                        name="confirmPassword"
                        placeholder="Enter Confirm password"
                        validations={required}
                      />
                    </div> */}
                  </div>
                </div>
                <div className="action-btn-wrapper fixed-bottom">
                  <div className="action-btns oi-action-btn">
                    <p className="oi-action-p">
                      Once you submit, your account will need to be activated by
                      our Admin.
                    </p>
                    <Button type="submit" className="btn primary">
                      Submit
                    </Button>
                  </div>
                </div>
              </form>
            )}
          />
        </div>
      </main>
    </>
  );
}

const MyDropdownItem: React.FC<MyDropdownItemProps> = ({
  children,
  newValue,
  onChange = () => {},
}) => (
  <Dropdown.Item onClick={() => onChange(newValue)}>{children}</Dropdown.Item>
);
