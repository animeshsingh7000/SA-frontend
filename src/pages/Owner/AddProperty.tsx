


import React, { useEffect, useRef, useState } from 'react';
import { Form, Field, useField } from 'react-final-form';
import { Link, useNavigate } from 'react-router-dom';
import logo from "../../assets/images/attache-logo.svg";
import { ROUTE_NAVIGATION_PATH } from '../../routes/routes';
import homeIcon from "../../assets/images/1077035.svg";
import { DatePickerControl } from '../../components/FormElements/DatePicker';
import { composeValidators, maxlength, required, requiredSelect } from '../../validations';
import { Button, Dropdown } from 'react-bootstrap';
import { FormControl } from '../../components/FormElements/FormControl';
import { COUNRIES, NEIGHBORHOOD, VALIDATIONS } from '../../constants';
import { useCustomMutation } from '../../hooks/useApi';
import { configuration, property } from '../../api';
import moment from 'moment';
import { SearchSelectWithForm } from '../../components/SearchSelect/SearchSelect';
import { getNeighbourhood } from '../../api/admin/neighborhood';

interface MyDropdownItemProps {
  children: React.ReactNode;
  newValue: any;
  onChange: (newValue: any) => void;
}

const DropdownField = ({ name, label, defaultName, children }: { name: any, label: any; defaultName: any; children: any }) => {
  const { input, meta } = useField(name);

  const validate = (value: any) => {
    if (!value) {
      return 'Required';
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
              {input.value ? (
                // Render the label of the selected option
                children.find((child: any) => child.props.newValue === input.value)?.props.children || input.value
              ) : (
                // Render the default name if no option is selected
                defaultName
              )}
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

const AddProperty = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [neighbourhood, setNeighbourhood] = useState([]);
  const [quadrants, setQuadrants] = useState((localStorage.getItem("quadrants")
    ? JSON.parse(localStorage.getItem("quadrants") as string)
    : []));
  const [stateCodeList, setStateCodeList] = useState<any>([]);
  const effectRan = useRef(false);

  const nextPage = (values: any, type: any, handleSubmit?: () => void) => {
    if (type == 'continue' && handleSubmit) {
      values.type = 'continue';
      handleSubmit();
    } else {
      values.type = "";
    }
    const currentPageRequiredFields = requiredFields[page];
    if (!currentPageRequiredFields) {
      setPage(page + 1);
      return;
    }

    const areFieldsFilled = currentPageRequiredFields.every((fieldName: any) => !!values[fieldName]);
    if (areFieldsFilled) {
      setPage(page + 1);
    } else {
      // Handle case where required fields are not filled
      // Maybe show a warning message or handle it in another way
    }
  };

  const previousPage = () => setPage(page - 1);

  const { mutate } = useCustomMutation({
    mutationFn: property.addProperty,
    onSuccess: () => {
      navigate(ROUTE_NAVIGATION_PATH.OWNER_DASHBOARD)
    },
  });

  const onSubmit = (values: any) => {
    const data: any = {
      region: values.region,
      neighborhood: values.neighborhood,
      address: {
        addressLine1: values.addressLine1,
        city: values.city,
        state: values.stateCode.value,
        postalCode: values.postalCode,
        country: "UnitedStates"
      },
      unitBedrooms: values.unitBedrooms,
      unitBathrooms: values.unitBathrooms,
      unitSize: values.unitSize
    }
    if (values.propertyAvailableFrom) {
      data.propertyAvailableFrom = values.propertyAvailableFrom.toISOString();
      // data.propertyAvailableFrom = moment(data.propertyAvailableFrom).format("YYYY-MM-DD hh:mm A");
    }

    if (values.unitNumber) {
      data.unitNumber = values.unitNumber
    }

    if (values.minimumReservationTerm) {
      data.minimumReservationTerm = Number(values?.minimumReservationTerm)
    }

    if (values.propertyAvailableUntil) {
      data.propertyAvailableUntil = values.propertyAvailableUntil.toISOString();
      // data.propertyAvailableUntil = moment(data.propertyAvailableUntil).format("YYYY-MM-DD hh:mm A")
    }

    if (!values.type) {
      mutate(data);
    } else {
      values.type = '';
    }
  };

  useEffect(() => {
    if (!effectRan.current) {
      configuration.getStateCodes().then((res: any) => {
        setStateCodeList(res.data.map((item: any) => ({
          label: item.name,
          value: item.code
        })));
      });
      getNeighbourhood().then((res: any) => {
        setNeighbourhood(res.data.neighbourhoods.map((item:any) => ({
            name: item.name,
            _id: item._id
        })))         
    });
    }
    return () => {
      effectRan.current = true;
    };
  }, [])


  const requiredFields: any = {
    1: ['region', 'neighborhood', 'addressLine1', 'city', 'stateCode', 'postalCode', 'unitNumber'],
    2: ['unitBedrooms', 'unitBathrooms'],
    // Add more pages and their required fields here
  };

  const validateForm = (values: any) => {
    const errors: any = {};
    const currentPageRequiredFields = requiredFields[page];
    if (currentPageRequiredFields) {
      currentPageRequiredFields.forEach((fieldName: any) => {
        if (!values[fieldName]) {
          errors[fieldName] = 'Required';
        }
      });
    }
    return errors;
  };

  return (
    <>
      <header className="header">
        <div className="container-fluid">
          <Link className="logo" to={ROUTE_NAVIGATION_PATH.HOME}>
            <img alt="stayattache" className="logo-img" src={logo} />
          </Link>
        </div>
      </header>
      <main className="main">
        <div className="breadcrumb-module breadcrumb-compare-module">
          <div className="container">
            <div className="breadcrumb-row align-items-start">
              <div className="breadcrumb-icon">
                <img src={homeIcon} className="op-50" alt="icon team" />
              </div>
              <div className="breadcrumb-content">
                <h4>Add Property</h4>
                <p className="mb-0">
                  You can start adding your property to our website using the
                  form below. Once we receive your property details, our team
                  will approve your property details where you can add and edit
                  additional information in your dashboard.
                </p>
              </div>
              <div className="breadcrumb-close">
                <Link to={ROUTE_NAVIGATION_PATH.OWNER_DASHBOARD}>
                  <em className="icon-close"></em>
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="rental-portal-container">
          <div className="container">
            <div className="rental-portal-content">
              <div id="rental-inquiry-form">
                <div className={`owner-inquery-wrapper _addproperty`}>
                  <Form
                    onSubmit={onSubmit}
                    validate={validateForm}
                    render={({ handleSubmit, values }) => (
                      <>
                        <div className="steps">
                          <ul>
                            <li className={`${page == 1 ? 'active' : 'active faded'}`} onClick={previousPage}>Property Region</li>
                            <li className={`${page == 2 ? 'active' : ''}`} onClick={() => nextPage(values, 'continue')}>Property Details</li>
                          </ul>
                        </div>
                        <form onSubmit={handleSubmit} className="owner-inquery-form">
                          {page === 1 && (
                            <div className="row">
                              <div className="col-12 col-md-6">
                                <DatePickerControl
                                  label="Available from"
                                  name="propertyAvailableFrom"
                                  type={'dateTime'}
                                  placeholder="MM-DD-YY"

                                />
                              </div>
                              <div className="col-12 col-md-6">
                                <DatePickerControl
                                  label="Available Until(Optional)"
                                  name="propertyAvailableUntil"
                                  type={'dateTime'}
                                  placeholder="MM-DD-YY"
                                />
                              </div>
                              <div className="col-12 col-md-12">
                                <FormControl
                                  label="Minimum Reservation Term"
                                  name="minimumReservationTerm"
                                  type="mobile"
                                  placeholder="Minimum length of a reservation allowed in number of days."
                                  maxlength={3}
                                />
                                <p className="input-hint-text">Minimum length of a reservation allowed in number of days.</p>
                              </div>
                              <div className="col-12 col-md-12 custom-select-form">
                                <DropdownField name="region" label="Region*" defaultName="Select a region if applicable.">
                                  <MyDropdownItem newValue="" onChange={handleSubmit}>Select a region if applicable.</MyDropdownItem>
                                  <MyDropdownItem newValue="District of Columbia, Virginia and Maryland" onChange={handleSubmit}>District of Columbia, Virginia and Maryland</MyDropdownItem>
                                </DropdownField>
                              </div>
                              <div className="col-12 col-md-12 custom-select-form">
                                <DropdownField name="neighborhood" label="Neighborhood*" defaultName="Select a neighborhood.">
                                  {(
                                    neighbourhood

                                  ).map((menu: any) => (
                                    <MyDropdownItem newValue={menu._id} onChange={handleSubmit}>{menu.name}</MyDropdownItem>

                                  ))}
                                </DropdownField>
                              </div>

                              <div className="col-12 col-md-12">
                                <FormControl
                                  label="Unit Number"
                                  name="unitNumber"
                                  type="text"
                                  placeholder="Enter Unit Number"
                                  validate={composeValidators(
                                    required,
                                    maxlength(VALIDATIONS.MAX_NAME)
                                  )}
                                />
                              </div>
                              <div className="col-12 col-md-12">
                                <FormControl
                                  label="Street Address*"
                                  name="addressLine1"
                                  type="text"
                                  placeholder="Enter address"
                                  validate={composeValidators(required)}
                                />
                              </div>
                              <div className="col-12 col-md-12">
                                <FormControl
                                  label="City*"
                                  name="city"
                                  type="text"
                                  placeholder="Enter City Name"
                                  validate={composeValidators(
                                    required,
                                    maxlength(VALIDATIONS.MAX_NAME)
                                  )}
                                />
                              </div>
                              <div className="col-12 col-md-6">
                                {
                                  stateCodeList && stateCodeList.length > 0 ?
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
                                  label="Zipcode*"
                                  name="postalCode"
                                  type="mobile"
                                  maxlength={6}
                                  placeholder="Enter Zipcode"
                                  validate={composeValidators(required)}
                                />
                              </div>

                              <div className="col-12 col-md-12 custom-select-form">
                                <Field name="country">
                                  {({ input }) => (
                                    <div className='common-dropdown dropdown'>
                                      <label className="form-label">Country</label>
                                      <Dropdown className="common-dropdown">
                                        <Dropdown.Toggle variant="success">
                                          {input.value ? input.value : 'Choose a Country'}
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu>
                                          {COUNRIES.map((option: any, index: any) => (
                                            <Dropdown.Item
                                              key={index}
                                              onClick={() => input.onChange(option)}
                                            >
                                              {option}
                                            </Dropdown.Item>
                                          ))}
                                        </Dropdown.Menu>
                                      </Dropdown>
                                    </div>
                                  )}
                                </Field>
                              </div>
                            </div>
                          )}

                          {page === 2 && (
                            <div className="row">
                              <div className="col-12 col-md-12">
                                <FormControl
                                  label="Square Footage*"
                                  name="unitSize"
                                  type="mobile"
                                  maxlength={12}
                                  placeholder="Enter square footage"
                                  validate={composeValidators(required)}
                                />
                              </div>
                              <div className="col-12 custom-select-form">
                                <DropdownField name="unitBedrooms" label="Bedrooms*" defaultName="Number of Bedrooms">
                                  <MyDropdownItem newValue="" onChange={handleSubmit}>Number of Bedrooms</MyDropdownItem>
                                  <MyDropdownItem newValue="Studio" onChange={handleSubmit}>Studio</MyDropdownItem>
                                  <MyDropdownItem newValue="OneBed" onChange={handleSubmit}>1 Bedroom</MyDropdownItem>
                                  <MyDropdownItem newValue="TwoBed" onChange={handleSubmit}>2 Bedroom</MyDropdownItem>
                                  <MyDropdownItem newValue="ThreeBed" onChange={handleSubmit}>3 Bedroom</MyDropdownItem>
                                  <MyDropdownItem newValue="FourBed" onChange={handleSubmit}>4 Bedroom</MyDropdownItem>
                                  <MyDropdownItem newValue="FiveBed" onChange={handleSubmit}>5 Bedroom</MyDropdownItem>
                                  <MyDropdownItem newValue="SixBed" onChange={handleSubmit}>6 Bedroom</MyDropdownItem>
                                  <MyDropdownItem newValue="SevenBed" onChange={handleSubmit}>7 Bedroom</MyDropdownItem>
                                  <MyDropdownItem newValue="EightBed" onChange={handleSubmit}>8 Bedroom</MyDropdownItem>
                                  <MyDropdownItem newValue="NineBedPlus" onChange={handleSubmit}>9 Bedroom or more</MyDropdownItem>
                                </DropdownField>
                              </div>
                              <div className="col-12 custom-select-form">
                                <DropdownField name="unitBathrooms" label="Bathrooms*" defaultName="Number of Bathrooms">
                                  <MyDropdownItem newValue="" onChange={handleSubmit}>Number of Bathrooms</MyDropdownItem>
                                  <MyDropdownItem newValue="OneBath" onChange={handleSubmit}>One</MyDropdownItem>
                                  <MyDropdownItem newValue="TwoBath" onChange={handleSubmit}>Two</MyDropdownItem>
                                  <MyDropdownItem newValue="ThreeBath" onChange={handleSubmit}>Three</MyDropdownItem>
                                  <MyDropdownItem newValue="FourBath" onChange={handleSubmit}>Four</MyDropdownItem>
                                  <MyDropdownItem newValue="FivePlusBath" onChange={handleSubmit}>Five or more</MyDropdownItem>
                                </DropdownField>
                              </div>
                            </div>
                          )}

                          <div className="action-btn-wrapper fixed-bottom ">
                            <div className="action-btns oi-action-btn fixwidth">
                              {
                                page == 2 ?
                                  <>
                                    <Button type="button" className="btn primary _previous" onClick={previousPage}>
                                      PREVIOUS
                                    </Button>
                                    <Button type="submit" className="btn primary">
                                      SUBMIT
                                    </Button>

                                  </>
                                  :
                                  <div className="Continuewrapper">
                                    <Button type="button" className="btn primary" onClick={() => nextPage(values, 'continue', handleSubmit)}>
                                      Continue
                                    </Button>
                                  </div>
                              }
                            </div>
                          </div>
                        </form>
                      </>
                    )}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

    </>

  );
};

const MyDropdownItem: React.FC<MyDropdownItemProps> = ({ children, newValue, onChange = () => { } }) => (
  <Dropdown.Item onClick={() => onChange(newValue)}>{children}</Dropdown.Item>
);

export default AddProperty;
