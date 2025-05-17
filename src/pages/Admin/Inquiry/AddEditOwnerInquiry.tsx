import React, { useState, useEffect, useRef } from "react";
import { Form, Field, useField } from "react-final-form";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { Dropdown, Spinner } from "react-bootstrap";
import { AuthType } from "../../../types/User";
import { composeValidators, required, requiredSelect } from "../../../validations";
import { FormControl } from "../../../components/FormElements/FormControl";
import { useNavigate, useParams } from "react-router-dom";
import { AxiosError } from "axios";
import minusIcon from "../../../assets/images/minus.svg";
import plusBlack from "../../../assets/images/plus-black.svg";
import Breadcrumb from 'react-bootstrap/Breadcrumb';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { DatePickerControl } from "../../../components/FormElements/DatePicker";
import { getInquiryDetail, updateOwnerInquiry } from "../../../api/admin/ownerInquiry";
import { capitalizeFirstWord, formatDate, formatPhoneNumber } from "../../../utils/common";
import { ROUTE_NAVIGATION_PATH } from "../../../routes/routes";
import { OWNER_INQUIRY_EDIT } from "../../../constants";
import { useCustomMutation } from "../../../hooks/useApi";
import { toast } from 'react-toastify';
import { configuration } from "../../../api";
import { SearchSelectWithForm } from "../../../components/SearchSelect/SearchSelect";

interface MyDropdownItemProps {
  children: React.ReactNode;
  newValue: any;
  onChange?: (newValue: any) => void;
}

const DropdownField = ({
  name,
  label,
  defaultName,
  children,
  required,
  onValueChange,  // New prop for handling value changes externally
}: {
  name: any;
  label: any;
  defaultName: any;
  children: any;
  required: any;
  onValueChange?: (value: any) => void;  // Optional function to handle value change outside of form
}) => {
  const validate = (value: any) => {
    if (required && !value) {
      return 'This field is required';
    }
  };

  return (
    <Dropdown className="common-dropdown">
      <label className="form-label">{label}</label>
      <Field
        name={name}
        validate={validate}
        render={({ input, meta }) => (
          <>
            <Dropdown.Toggle variant="success">
              {input.value
                ? children.find(
                    (child: any) => child.props.newValue === input.value
                  )?.props.children || input.value
                : defaultName}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {React.Children.map(children, (child) =>
                React.cloneElement(child, {
                  onChange: (value: any) => {
                    input.onChange(value);  // Update form value
                    if (onValueChange) {
                      onValueChange(value);  // Update `initData` or any other external state
                    }
                  },
                })
              )}
            </Dropdown.Menu>
            {meta.touched && meta.error && (
              <div className="error">{meta.error}</div>
            )}
          </>
        )}
      />
    </Dropdown>
  );
};


const AddEditOnwerInquiry: React.FC = () => {
  const fromStatus= new URLSearchParams(document.location.search).get('fromStatus');
  const [rowData, setRowData] = useState<any>({});
  const [initData, setInitData] = useState<any>(OWNER_INQUIRY_EDIT);
  const [loader, setLoader] = useState(true);
  const params = useParams();
  const [activeKey, setActiveKey] = useState('editDetails');
  const handleSubmitRef = useRef<() => void>(() => { }); // Create a ref to store the handleSubmit function
  const navigate = useNavigate();
  const [neighbourhood, setNeighbourhood] = useState((localStorage.getItem("neighbourhood")
  ? JSON.parse(localStorage.getItem("neighbourhood") as string)
  : []));
  const [quadrants, setQuadrants] = useState((localStorage.getItem("quadrants")
        ? JSON.parse(localStorage.getItem("quadrants") as string)
  : []));
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
  }, [])

  useEffect(() => {
    setLoader(true);
    getInquiryDetail(params.id)
      .then((res) => {
          setRowData(res.data);
          setInitData((prevState: any) => ({
            ...prevState,
            unitNumber: res.data.unitNumber ? res.data.unitNumber : initData.unitNumber,
            address: res.data.address ? res.data.address : initData.address,
            neighborhood: res.data.neighborhood ? res.data.neighborhood : initData.neighborhood,
            unitSize: res.data.unitSize ? res.data.unitSize : initData.unitSize,
            unitBathrooms: res.data.unitBathrooms ? res.data.unitBathrooms : initData.unitBathrooms,
            halfBathroomCount: res.data.halfBathroomCount ? res.data.halfBathroomCount : initData.halfBathroomCount,
            unitBedrooms: res.data.unitBedrooms ? res.data.unitBedrooms : initData.unitBedrooms,
            propertyAvailableFrom: res.data.propertyAvailableFrom ? res.data.propertyAvailableFrom : initData.propertyAvailableFrom,
            minimumReservationTerm: res.data.minimumReservationTerm ? res.data.minimumReservationTerm : null,
            inquiryNote: res.data.inquiryNote ? res.data.inquiryNote : initData.inquiryNote,
            internalNote: res.data.internalNote ? res.data.internalNote : initData.internalNote,
            directionality: res.data.directionality ? res.data.directionality : initData.directionality,
          }));
          if(fromStatus) {
            submitForm();
          }
          setLoader(false);
      })
      .catch((error: AxiosError<{ message: string; status: number }>) => {  
        setLoader(false);
      });

  }, []);

  const { mutate } = useCustomMutation({
    mutationFn: (req: any) => {
        return updateOwnerInquiry(params.id, req);
    },
    onSuccess: async () => {
        toast.success(`Owner inquiry updated successfully`)
        navigate(ROUTE_NAVIGATION_PATH.ADMIN_OWNER_INQUIRY_LIST);
    },
  });

  const onSubmit = (values:any) => {
    const data:any = values;

    if(!data.minimumReservationTerm) {
      delete data.minimumReservationTerm;
    }

    if(!data.directionality) {
      delete data.directionality
    }

    data.address.state = values.address.state.value ? values.address.state.value : values.address.state;

    

    data.inquiryNote = data.inquiryNote ? data.inquiryNote : "";
    
    data.internalNote = data.internalNote ? data.internalNote : "";
    
    delete data.address.country;

    mutate(data)

  };

  const handleSelect = (key:any) => {
    setActiveKey(key); // Set the active tab
  };

  const increaseCount = (type:string) => {
    if(type === 'unitSize') {
      setInitData((prevState: any) => ({
        ...prevState, // Keep all the current form values intact
        unitSize: Number(prevState.unitSize) + 1, // Decrease unitSize
      }));
    } else {
      setInitData((prevState: any) => ({
        ...prevState, // Keep all the current form values intact
        minimumReservationTerm: Number(prevState.minimumReservationTerm) + 1, // Decrease unitSize
      }));
    }
  }

  const decreaseCount = (type:string) => {
      if(type === 'unitSize') {
        if (Number(initData.unitSize) == 0) {
          return;
        } else {
            setInitData((prevState: any) => ({
                ...prevState,
                unitSize: Number(prevState.unitSize) - 1
            }));
        }
      } else {
        if (Number(initData.minimumReservationTerm) == 0) {
          return;
        } else {
            setInitData((prevState: any) => ({
                ...prevState,
                minimumReservationTerm: Number(prevState.minimumReservationTerm) - 1
            }));
        }
      }
      
  }

  const submitForm = () => {
    if (handleSubmitRef.current) {
        handleSubmitRef.current(); // Programmatically trigger form submission
    }
  };

  const handleDirectionalityChange = (newValue: string) => {
    setInitData((prevData:any) => ({
      ...prevData,
      directionality: newValue,
    }));
  };

  const handleNeighborrhoodChange = (newValue: string) => {
    setInitData((prevData:any) => ({
      ...prevData,
      neighborhood: newValue,
    }));
  };

  const handleStateCodeChange = (newValue: string) => {
    setInitData((prevState:any) => ({
      ...prevState,
      address: {
        ...prevState.address, // Preserve the rest of the address fields
        state: newValue, // Update only addressLine1
      },
    }));
  };

  const handleUnitBathroomsChange = (newValue: string) => {
    setInitData((prevData:any) => ({
      ...prevData,
      unitBathrooms: newValue,
    }));
  };

  const handleHalfBathroomsChange = (newValue: string) => {
    setInitData((prevData:any) => ({
      ...prevData,
      halfBathroomCount: newValue,
    }));
  };

  const handleUnitBedroomsChange =  (newValue: string) => {
    setInitData((prevData:any) => ({
      ...prevData,
      unitBedrooms: newValue,
    }));
  };

  return (
    <>
      {/* Owner Inquiry edit form  start */}

      <div className="common-right-panel-section">
        <div className="top-right-bar">
          <Breadcrumb>
            <Breadcrumb.Item href="#">Inquiry</Breadcrumb.Item>
            <Breadcrumb.Item href={ROUTE_NAVIGATION_PATH.ADMIN_OWNER_INQUIRY_LIST}>Owner Inquiries</Breadcrumb.Item>
            <Breadcrumb.Item active>Edit Owner Inquiry</Breadcrumb.Item>
          </Breadcrumb>
          <div className="guest-header _inquiry-header-tabs">
            <div className="guest-left ">
              <h2>Owner Inquiry</h2>
              <h1>{capitalizeFirstWord(rowData.firstName)} {capitalizeFirstWord(rowData.LastName)}</h1>
              <div className="register">Registered on {formatDate(rowData.createdAt)}</div>
            </div>
            {
              activeKey === 'editDetails' ?
              <div className="guest-right">
                {/* <button className="btn-delete">Cancel</button> */}
                <button className="btn-primary" onClick={submitForm}>Save Details</button>
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
                <div className="info-wrapper info-wrapper-multiple">
                  <div className="infoleft">
                    <h2>General Details</h2>
                  </div>
                  {
                  loader ?
                      <div className="spinner-wrapper"> <Spinner /></div>
                  :
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
                              <div className="col-12">
                                <FormControl
                                  label="Unit Number*"
                                  name="unitNumber"
                                  type="unitNumber"
                                  placeholder="Unit Number"
                                  onChange={(e:any) => {
                                    setInitData({
                                      ...initData,
                                      unitNumber: e.target.value,
                                    });
                                  }}
                                  validate={composeValidators(required)}
                                />

                              </div>
                              <div className="col-12">
                                <FormControl
                                  label="Street Address*"
                                  name="address.addressLine1"
                                  type="addressLine1"
                                  placeholder="Street Address"
                                  onChange={(e:any) => {
                                    setInitData((prevState:any) => ({
                                      ...prevState,
                                      address: {
                                        ...prevState.address, // Preserve the rest of the address fields
                                        addressLine1: e.target.value, // Update only addressLine1
                                      },
                                    }));
                                  }}
                                  validate={composeValidators(required)}
                                />
                              </div>
                              <div className="col-12 custom-select-form">
                                <div className="text-start form-field">
                                <DropdownField
                                  name="directionality"
                                  label="Directional"
                                  defaultName="Select a directional"
                                  required={false}
                                  onValueChange={handleDirectionalityChange}
                              >
                                  {/* <MyDropdownItem newValue="" >Select a region if applicable.</MyDropdownItem> */}
                                    {(
                                      quadrants
                                      
                                    ).map((quad:any) => (
                                      <MyDropdownItem newValue={quad._id} onChange={handleSubmit}>{quad.name}</MyDropdownItem>

                                    ))}
                                </DropdownField>
                                </div>
                              </div>
                              <div className="col-12 col-md-6">
                                <FormControl
                                  label="City Name*"
                                  name="address.city"
                                  type="text"
                                  placeholder="City name"
                                  onChange={(e:any) => {
                                    setInitData((prevState:any) => ({
                                      ...prevState,
                                      address: {
                                        ...prevState.address, // Preserve the rest of the address fields
                                        city: e.target.value, // Update only addressLine1
                                      },
                                    }));
                                  }}
                                  validate={composeValidators(required)}
                                />
                              </div>
                              <div className="col-12 col-md-6 custom-select-form">
                                {
                                    stateCodeList && stateCodeList.length > 0  ? 
                                        <SearchSelectWithForm
                                            name="address.state"
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
                                  label="Zip Code*"
                                  name="address.postalCode"
                                  type="text"
                                  placeholder="Zip Code"
                                  onChange={(e:any) => {
                                    setInitData((prevState:any) => ({
                                      ...prevState,
                                      address: {
                                        ...prevState.address, // Preserve the rest of the address fields
                                        postalCode: e.target.value, // Update only addressLine1
                                      },
                                    }));
                                  }}
                                  validate={composeValidators(required)}
                                />
                              </div>
                              <div className="col-12 col-md-6 custom-select-form">
                                <div className="text-start form-field">
                                  <DropdownField name="neighborhood" label="Neighborhood" defaultName="Select a neighborhood" required={true} onValueChange={handleNeighborrhoodChange}>
                                    {(
                                        neighbourhood
                                        
                                    ).map((menu:any) => (
                                        <MyDropdownItem newValue={menu._id} onChange={handleSubmit}>{menu.name}</MyDropdownItem>

                                    ))}
                                  </DropdownField>
                                </div>
                              </div>
                              <div className="col-12 col-md-6 teamsort">
                                <FormControl
                                  label="Square Footage*"
                                  name="unitSize"
                                  type="input-number"
                                  onChange={(e:any) => {
                                    setInitData({
                                      ...initData,
                                      unitSize: e.target.value,
                                    });
                                  }}
                                  validate={composeValidators(required)}
                                />
                                <div className="plusminus">
                                  <div className="boxes" onClick={() => decreaseCount('unitSize')}><img src={minusIcon} alt="Icon" /></div>
                                  <div className="boxes" onClick={() => increaseCount('unitSize')}><img src={plusBlack} alt="Icon" /></div>

                                </div>

                              </div>
                              <div className="col-12 custom-select-form">
                                <div className="text-start form-field">
                                <DropdownField name="unitBedrooms" label="Bedroom count*" defaultName="Select a Bedrooms" required={true} onValueChange={handleUnitBedroomsChange}>
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
                              </div>
                              <div className="col-12 col-md-6 custom-select-form">
                                <div className="text-start form-field">
                                  <DropdownField name="unitBathrooms" label="Full bathroom count*" defaultName="Number of Bathrooms" required={true} onValueChange={handleUnitBathroomsChange}>
                                    <MyDropdownItem newValue="" onChange={handleSubmit}>Number of Bathrooms</MyDropdownItem>
                                    <MyDropdownItem newValue="ZeroBath" onChange={handleSubmit}>Zero</MyDropdownItem>
                                    <MyDropdownItem newValue="OneBath" onChange={handleSubmit}>One</MyDropdownItem>
                                    <MyDropdownItem newValue="TwoBath" onChange={handleSubmit}>Two</MyDropdownItem>
                                    <MyDropdownItem newValue="ThreeBath" onChange={handleSubmit}>Three</MyDropdownItem>
                                    <MyDropdownItem newValue="FourBath" onChange={handleSubmit}>Four</MyDropdownItem>
                                  </DropdownField>
                                </div>

                              </div>
                              <div className="col-12 col-md-6 custom-select-form">
                                <div className="text-start form-field">
                                  <DropdownField name="halfBathroomCount" label="Half bathroom count*" defaultName="Number of Bathrooms" required={true} onValueChange={handleHalfBathroomsChange}>
                                    <MyDropdownItem newValue="" onChange={handleSubmit}>Number of Bathrooms</MyDropdownItem>
                                    <MyDropdownItem newValue="ZeroBath" onChange={handleSubmit}>Zero</MyDropdownItem>
                                    <MyDropdownItem newValue="OneBath" onChange={handleSubmit}>One</MyDropdownItem>
                                    <MyDropdownItem newValue="TwoBath" onChange={handleSubmit}>Two</MyDropdownItem>
                                    <MyDropdownItem newValue="ThreeBath" onChange={handleSubmit}>Three</MyDropdownItem>
                                    <MyDropdownItem newValue="FourBath" onChange={handleSubmit}>Four</MyDropdownItem>
                                  </DropdownField>
                                </div>

                              </div>

                              <div className="col-12 col-md-6 _datepickerform">
                                <DatePickerControl
                                  label="Available from*"
                                  name="propertyAvailableFrom"
                                  type={'dateTime'}
                                  placeholder="MM-DD-YY"
                                  onChange={(date:any) => {
                                    setInitData({
                                      ...initData,
                                      propertyAvailableFrom: date,
                                    });
                                  }}
                                  validate={composeValidators(required)}
                                />
                              </div>
                              <div className="col-12 col-md-6 teamsort">
                                <FormControl
                                  label="Minimum Lease Term Days (If Condo Building)"
                                  name="minimumReservationTerm"
                                  type="input-number"
                                  onChange={(e:any) => {
                                    setInitData({
                                      ...initData,
                                      minimumReservationTerm: e.target.value,
                                    });
                                  }}
                                />
                                <div className="plusminus">
                                <div className="boxes" onClick={() => decreaseCount('minimumReservationTerm')}><img src={minusIcon} alt="Icon" /></div>
                                  <div className="boxes" onClick={() => increaseCount('minimumReservationTerm')}><img src={plusBlack} alt="Icon" /></div>

                                </div>

                              </div>

                              <div className="col-12 textareafield">
                                <FormControl
                                  label="Note"
                                  name="inquiryNote"
                                  type="textarea"
                                  placeholder="Note"
                                  onChange={(e:any) => {
                                    setInitData({
                                      ...initData,
                                      inquiryNote: e.target.value,
                                    });
                                  }}
                                />
                              </div>
                              <div className="col-12 textareafield">
                                <FormControl
                                  label="Internal Note"
                                  name="internalNote"
                                  type="textarea"
                                  placeholder="Internal Note"
                                  onChange={(e:any) => {
                                    setInitData({
                                      ...initData,
                                      internalNote: e.target.value,
                                    });
                                  }}
                                />
                              </div>


                            </div>
                          </form>
                        )
                      }}
                    />

                  </div>
                  }
                </div>

              </div>
            </Tab>
            <Tab eventKey="ownerDetails" title="Owner Details">
              <div className="tabs-ownerdetail">
                <div className="leftxt">Name</div>
                <div className="righttxt _name">{capitalizeFirstWord(rowData.firstName)} {capitalizeFirstWord(rowData.lastName)}</div>
              </div>
              <div className="tabs-ownerdetail">
                <div className="leftxt">Email</div>
                <div className="righttxt">{rowData.email}</div>
              </div>
              <div className="tabs-ownerdetail">
                <div className="leftxt">Phone</div>
                <div className="righttxt">{rowData.alternatePhoneIds && rowData.alternatePhoneIds.length > 0 ? formatPhoneNumber(Number(rowData.alternatePhoneIds[0].phone)) : '-'}</div>
              </div>
            </Tab>
            {/* <Tab eventKey="SuggestedProperties" title="Suggested Properties">
            </Tab>
            <Tab eventKey="UserDetails" title="User Details">
            </Tab> */}
          </Tabs>
        </div>

      </div>

      {/* Owner Inquiry edit form  end */}
    </>
  );
};

const MyDropdownItem: React.FC<MyDropdownItemProps> = ({ children, newValue, onChange = () => {} }) => (
  
  <Dropdown.Item onClick={() => onChange(newValue)}>{children}</Dropdown.Item>
);

export default AddEditOnwerInquiry;
