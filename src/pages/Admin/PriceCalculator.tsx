import { Button } from "react-bootstrap";
import { Pet_And_Parking_Charges_Type, PRICE_CALCULATOR } from "../../constants";
import { Field, Form, useField } from "react-final-form";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useCustomMutation } from "../../hooks/useApi";
import Spinner from "../../components/Spinner";
import { calculatePrice } from "../../api/admin/ownerInquiry";
import PropertyListDropDown from "../../components/SearchSelect/PropertyListDropDown";
import { composeValidators, required, requiredSelect, validAmount } from "../../validations";
import { DatePickerControl } from "../../components/FormElements/DatePicker";
import { CheckboxControlGlobal } from "../../components/FormElements/CheckboxControl";
import { addDays } from "date-fns";
import { SearchSelectWithForm } from "../../components/SearchSelect/SearchSelect";
import { FormControl } from "../../components/FormElements/FormControl";
import { formatDate, formatDatePrincing, formatNumber } from "../../utils/common";
import InfoTooltip from "../../components/InfoTooltip";
import { Dropdown } from "react-bootstrap";


interface MyDropdownItemProps {
    children: React.ReactNode;
    newValue: any;
    onChange?: (newValue: any) => void;
}
  
const DropdownField = ({ name, label, defaultName, value, children, required } : {name: any, label:any; defaultName:any; value:any; children:any, required:any}) => {
    const { input, meta } = useField(name);
  
    const validate = (value:any) => {
      if (required && !value) {
        return 'This field is required';
      }
    };
    return (
      <Dropdown className="common-dropdown">
        <label className="form-label">{label}</label>
        <Dropdown.Toggle variant="success">
            <Field
                name={name}
                validate={validate}
                defaultValue={value}
                render={({ input, meta }) => (
                <>
                {input.value ? (
                    // Render the label of the selected option
                    children.find((child:any) => child.props.newValue === input.value)?.props.children || input.value
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

export default function PriceCalculator() {
    const params = useParams();
    const [initData, setInitData] = useState<any>(PRICE_CALCULATOR);
    const [calculatedPrice, setCalculatedPrice] = useState<any>([]);
    const [loader, setLoader] = useState(false);
    const [showForm, setShowForm] = useState(true);
    const [start, setStart] = useState('');
    const navigate = useNavigate();

    const { mutate } = useCustomMutation({
        mutationFn: calculatePrice,
        onSuccess: (res: { data: any }) => {
            setCalculatedPrice(res.data);
            setShowForm(false);
        },
    });

    const onSubmit = (values: any) => {
        // setLoader(true);

        //values.propertyId.value.toString()
        //unitId: values.unitId.value,
        let data = {
            unitId: values.unitId.value,
            startDate: formatDatePrincing(values.startDate),
            endDate: formatDatePrincing(values.endDate),
            isPerDiem: values.isPerDiem,
            petsChargesType: values.petsChargesType.value,
            parkingChargesType: values.parkingChargesType.value,
            petsCharges: values.petsCharges ? parseFloat(values.petsCharges) : 0,
            parkingCharges: values.parkingCharges ? parseFloat(values.parkingCharges) : 0,
            taxAmount: values.taxAmount ? parseFloat(values.taxAmount) : 0,
            isPropertyInMarylandOrVA: values.isPropertyInMarylandOrVA,
            departureCleaningFee: values.departureCleaningFee ? parseFloat(values.departureCleaningFee) : 0
        }

        setStart(formatDate(values.startDate));

        // setInitData((prevState: any) => ({
        //     ...prevState,
        //     propertyId: values.propertyId.value,
        //     startDate: values.startDate,
        //     endDate: values.endDate,
        //     isPerDiem: values.isPerDiem,
        //     petsChargesType: values.petsChargesType,
        //     parkingChargesType: values.parkingChargesType,
        //     petsCharges: values.petsCharges,
        //     parkingCharges: values.parkingCharges,
        //     taxAmount: values.taxAmount,
        //     isPropertyInMarylandOrVA: values.isPropertyInMarylandOrVA,
        //     departureCleaningFee: values.departureCleaningFee
        // }));

        mutate(data);
    };

    function back() {
        setShowForm(true);
    }

    function totalAmount() {
        let amount= calculatedPrice.pricing.reduce((sum:any, item:any) => sum + item.totalAmount, 0);
        return formatNumber(amount);
    }

    return (
        <>

            
                    <div className="rental-portal-container">
                        <div className="container">
                            <div className="rental-portal-content">
                                <div id="rental-inquiry-form">
                                    <div className="owner-inquery-wrapper _addproperty">
                                        <Form
                                            initialValues={initData}
                                            onSubmit={onSubmit}
                                            render={({ handleSubmit, values, form }) => (
                                                <form
                                                    onSubmit={handleSubmit}
                                                    className="owner-inquery-form"
                                                >

                                                    <div className="row">
                                                        <div className="col-12">
                                                            <PropertyListDropDown
                                                                label="Property Name *"
                                                                name="unitId"
                                                                validate={composeValidators(required)}
                                                            />
                                                        </div>
                                                        <div className="col-12">
                                                            <DatePickerControl
                                                                label="Start Date *"
                                                                name="startDate"
                                                                placeholder="MM-DD-YY"
                                                                validate={composeValidators(required)}
                                                                onChange={(newValue: Date) => {
                                                                    newValue &&
                                                                        form.change(
                                                                            "endDate",
                                                                            addDays(newValue, 31)
                                                                        );
                                                                }}
                                                            />
                                                        </div>
                                                        <div className="col-12">
                                                            <DatePickerControl
                                                                label="End Date *"
                                                                name="endDate"
                                                                placeholder="MM-DD-YY"
                                                                minDate={values.startDate}
                                                                validate={composeValidators(required)}
                                                            />
                                                        </div>

                                                        <div className="col-12">
                                                            <CheckboxControlGlobal
                                                                name="isPerDiem"
                                                                label="Is Per Diem Pricing? "
                                                            />
                                                        </div>

                                                        <div className="col-12 custom-select-form">
                                                            <SearchSelectWithForm
                                                                name="petsChargesType"
                                                                label="Pet Charges Type *"
                                                                options={Pet_And_Parking_Charges_Type}
                                                                placeholder={Pet_And_Parking_Charges_Type[0].label}
                                                                validate={composeValidators(requiredSelect)}
                                                            />
                                                            {/* <DropdownField name="petsChargesType" label="Pet Charges Type *" defaultName="Monthly" value="Monthly" required={true}>
                                                                    <MyDropdownItem newValue="OneTime" onChange={handleSubmit}>One Time</MyDropdownItem>
                                                                    <MyDropdownItem newValue="Monthly" onChange={handleSubmit}>Monthly</MyDropdownItem>
                                                            </DropdownField> */}
                                                        </div>

                                                        <div className="col-12">
                                                            <FormControl
                                                                label="Pet Charges *"
                                                                name="petsCharges"
                                                                type="petsCharges"
                                                                placeholder="Enter pet charges"
                                                                validate={
                                                                    composeValidators(
                                                                        required,
                                                                        validAmount
                                                                    )
                                                                }
                                                            />
                                                        </div>

                                                        <div className="col-12 custom-select-form">
                                                            <SearchSelectWithForm
                                                                name="parkingChargesType"
                                                                label="Parking Charges Type *"
                                                                options={Pet_And_Parking_Charges_Type}
                                                                placeholder={Pet_And_Parking_Charges_Type[0].label}
                                                                validate={composeValidators(requiredSelect)}
                                                            />
                                                            {/* <DropdownField name="parkingChargesType" label="Parking Charges Type *" defaultName="Monthly" value="Monthly" required={true}>
                                                                    <MyDropdownItem newValue="OneTime" onChange={handleSubmit}>One Time</MyDropdownItem>
                                                                    <MyDropdownItem newValue="Monthly" onChange={handleSubmit}>Monthly</MyDropdownItem>
                                                            </DropdownField> */}
                                                        </div>

                                                        <div className="col-12">
                                                            <FormControl
                                                                label="Parking Charges *"
                                                                name="parkingCharges"
                                                                type="parkingCharges"
                                                                placeholder="Enter parking charges"
                                                                validate={
                                                                    composeValidators(
                                                                        required,
                                                                        validAmount
                                                                    )
                                                                }
                                                            />
                                                        </div>


                                                        <div className="col-12">
                                                            <FormControl
                                                                label="Tax Amount *"
                                                                name="taxAmount"
                                                                type="taxAmount"
                                                                placeholder="Enter tax amount"
                                                                validate={
                                                                    composeValidators(
                                                                        required,
                                                                        validAmount
                                                                    )
                                                                }
                                                            />
                                                        </div>

                                                        <div className="col-12">
                                                            <CheckboxControlGlobal
                                                                name="isPropertyInMarylandOrVA"
                                                                label="Is property in Maryland and Virginia region?"
                                                            />
                                                        </div>

                                                        <div className="col-12 col-md-12">
                                                            <FormControl
                                                                label="Departure Cleaning Fee *"
                                                                name="departureCleaningFee"
                                                                type="text"
                                                                placeholder="Enter departure cleaning fee"
                                                                validate={
                                                                    composeValidators(
                                                                        required,
                                                                        validAmount
                                                                    )
                                                                }
                                                            />
                                                        </div>
                                                    </div>
                                                    {
                                                        <div className="action-btn-wrapper fixed-bottom ">
                                                            <div className="action-btns oi-action-btn fixwidth2">
                                                                <div className="Continuewrapper">
                                                                    <Button type="submit" className="btn primary minwdth">
                                                                        SUBMIT
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    }

                                                </form>
                                            )}
                                        />
                                    </div>
                                </div>
                            </div>

                            
                        </div>
                    </div>

                            
                    {
                        calculatedPrice.pricing && calculatedPrice.pricing.length > 0 ? 
                           <div className="price-calculator-container">
                            <div className="price-calculator-wrapper property-price-card top-new-property-card">
                                <div className="price-available">

                                    <div className="price-left">
                                        {/* <h4>Available from</h4>
                                        <h5>{start}</h5> */}
                                    </div>
                                    <div className="price-right">
                                        <h4>Average Rate</h4>
                                        <div className="price-format">
                                            <h5>$ <span className="avgprice">{formatNumber(calculatedPrice.monthlyAveragePrice)}</span>
                                                <span className="seprator"></span>
                                                <span className="day">/Month</span>

                                                <InfoTooltip text={'(Includes all utilities, Internet and TV)'} />
                                            </h5>
                                        </div>
                                        <p className="per-month-charges">$<span className="avgprice-month">{formatNumber(calculatedPrice.monthlyAveragePrice)}</span> per 30 nights</p>
                                        <p>(30-day rate, based on average rate using arrival and departure dates)</p>
                                    </div>
                                </div>
                    
                                <div className="price-data-list price-data-list-updated px-30">
                                    {calculatedPrice.pricing &&
                                        calculatedPrice.pricing.map((data: any, key: any) => (
                                        <div className="">
                                            <ul className={`final-prize ${key===0 ? "" : "border-0"}`}>
                                                <li>{data.month}, {data.year}  <br /><p className="cal-prorate-info">({data.totalDays} night{data.totalDays > 1 ? '(s)' : ''} * ${data.priceForEachDay.toFixed(2)} per night)</p> </li>
                                                <li>${formatNumber(data.totalAmount)}</li>
                                            </ul>
                                            {
                                                data.serviceFee > 0 ?

                                                <ul className="bdr">
                                                    <li> Services Fee </li>
                                                    <li>(+) ${formatNumber(data.serviceFee)}</li>
                                                </ul>
                                                :
                                                null
                                            }

                                            {
                                                data.petsCharges > 0 ?

                                                <ul className="bdr">
                                                    <li> Pet Charge </li>
                                                    <li>(+) ${formatNumber(data.petsCharges)}</li>
                                                </ul>
                                                :
                                                null
                                            }

                                            {
                                                data.parkingCharges > 0 ?

                                                <ul className="bdr">
                                                    <li> Parking Fee </li>
                                                    <li>(+) ${formatNumber(data.parkingCharges)}</li>
                                                </ul>
                                                :
                                                null
                                            }
                                            
                                            {
                                                data.taxes > 0 ?
                                                <ul className="bdr">
                                                    <li>Tax
                                                        {
                                                            key === 0
                                                            ?
                                                            <InfoTooltip text={'(Not applicable for properties in Virginia and Maryland. Not applicable if your organization is tax-exempt.)'} />
                                                            :
                                                            null
                                                        }
                                                    </li>
                                                    <li>(+) ${formatNumber(data.taxes)}</li>
                                                </ul>
                                                :
                                                null
                                            }
                                            {
                                                data.departureCleaningFee > 0 ?
                                                <ul className="bdr">
                                                    <li>Departure Cleaning</li>
                                                    <li>(+) ${formatNumber(data.departureCleaningFee)}</li>
                                                </ul>
                                                :
                                                null
                                            }
                                        </div>
                                        
                                    ))}
                                    
                                    <ul className="total-amount-block">
                                        <li className="total-amount-text">Total Amount</li>
                                        <li className="total-amount-count">${calculatedPrice.pricing &&
                                        calculatedPrice.pricing.length > 0 ? totalAmount() : 0}</li>
                                    </ul>
                                </div>
                            </div>
                            </div>
                        :
                        null
                    }
                                
                               

            
        </>
    );
}

const MyDropdownItem: React.FC<MyDropdownItemProps> = ({ children, newValue, onChange = () => {} }) => (
    <Dropdown.Item onClick={() => onChange(newValue)}>{children}</Dropdown.Item>
);
