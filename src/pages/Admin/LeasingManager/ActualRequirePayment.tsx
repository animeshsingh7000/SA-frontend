import React, { useEffect, useState } from "react";
import Table from 'react-bootstrap/Table';
import deleteIcon from "../../../assets/images/trash.svg";
import dollarIcon from "../../../assets/images/dollar.svg";
import plusIcon from "../../../assets/images/Plus.svg";
import { Form, Field } from "react-final-form";
import arrayMutators from "final-form-arrays";
import { DatePickerControl } from "../../../components/FormElements/DatePicker";
import { FieldArray } from "react-final-form-arrays";
import { FormControl } from "../../../components/FormElements/FormControl";
import moment from "moment";
import { SearchSelectWithForm } from "../../../components/SearchSelect/SearchSelect";
import { RENT_PAYMENT_TYPE } from "../../../constants";
import { NoData } from "../../../components";
import lockedIcon from "../../../assets/images/Locked.svg";

export default function ActualRequirePayment({
    payments,
    isLocked,
    disabled = false,
    updateDeletedItems,
    updatePayments
}: {
    payments: any;
    isLocked: boolean;
    disabled?: boolean;
    updateDeletedItems: (data: any | undefined) => void;
    updatePayments: (data: any) => void;
}) {
    const [initialValues, setInitialValues] = useState<any>({ payments: [] });
    const [selectAll, setSelectAll] = useState(false); // Always starts as selected

    useEffect(() => {
        let detail = payments && payments.length > 0 ? [...payments] : [];
        if (payments && payments.length > 0) {
            detail.forEach((element: any) => {
                element.includeInBillingSchedule = element.includeInBillingSchedule ?? true; // Default all to checked
                // element.dueDateStart = element.dueDateStart;
                // element.dueDateEnd = element.dueDateEnd;
            });
        }
        setInitialValues({ payments: detail });
    }, [payments]);

    const onSubmit = () => { };

    const formatDate = (date:any) => {
        if (!date) return null;
        const dt = new Date(date);  // Convert string to Date object (keeps UTC)
        
        return dt.toISOString().slice(0, 19).replace("T", " ");  // Keeps UTC format
    };

    // const onFieldChange = (index: number, fieldName: string, value: any) => {
    //     const updatedPayments = [...initialValues.payments];
    //     updatedPayments[index][fieldName] = value;
    //     setInitialValues({ payments: updatedPayments });
    //     updatePayments(updatedPayments);
    // };

    const onFieldChange = (index: number, fieldName: string, value: any) => {
        setInitialValues((prevState: any) => {
            const updatedPayments = [...prevState.payments];
            updatedPayments[index][fieldName] = value;
            updatePayments(updatedPayments); // Send updated data to the parent component
            return { payments: updatedPayments };
        });
    };

    const addPayment = (form: any) => {
        const newPayment = {
            includeInBillingSchedule: false,
            dueDateStart: null,  // Keep it null initially
            dueDateEnd: null,    
            amount: 0,
            message: "",
            paymentType: "Standard Rent",
            locked: false,
            status: 10
        };
    
        form.mutators.push("payments", newPayment);
    
        setInitialValues((prevState: any) => {
            const updatedPayments = [...prevState.payments, newPayment];
            updatePayments(updatedPayments);
            return { payments: updatedPayments };
        });
    };

    const deletePayment = (invoiceId: any, id: any, index: number, fields: any, form: any) => {
        if (invoiceId) {
            updateDeletedItems({ invoiceId, id });
            return;
        }
    
        // Remove from Final Form state first
        fields.remove(index);
    
        // Ensure local state updates AFTER form state changes
        setTimeout(() => {
            const currentPayments = form.getState().values.payments || [];
            
            // Ensure no empty objects sneak into state
            const updatedPayments = currentPayments.filter((item: any) => Object.keys(item).length !== 0);
    
            setInitialValues({ payments: updatedPayments });
            updatePayments(updatedPayments);
        }, 0);
    };

    const delPayment = (invoiceId: any, id:any) => {
        updateDeletedItems({
            invoiceId: invoiceId,
            id: id
        });
    };
    
    
    

    return (
        <div className="table-section-common _leasing-manager-table billing_payment_info">
            {payments && payments.length > 0 ? (
                <Form
                    onSubmit={onSubmit}
                    initialValues={initialValues}
                    mutators={{ ...arrayMutators }}
                    render={({ handleSubmit, form }) => (
                        <form onSubmit={handleSubmit}>
                            <FieldArray name="payments">
                                {({ fields }) => {
                                    return (
                                        <Table responsive>
                                            <thead>
                                                <tr>
                                                    <th style={{ minWidth: '50px' }}>
                                                        <div className="th-data">
                                                            <div className="check-group commocheckbox">
                                                                <input
                                                                    type="checkbox"
                                                                    id="selectAll"
                                                                    checked={selectAll}
                                                                    disabled={isLocked}
                                                                    onChange={() => {
                                                                        const newSelectAll = !selectAll;
                                                                        setSelectAll(newSelectAll);
                                                                        form.change(
                                                                            "payments",
                                                                            fields.value.map((item: any) => ({
                                                                                ...item,
                                                                                includeInBillingSchedule: newSelectAll
                                                                            }))
                                                                        );
                                                                    }}
                                                                />
                                                                <label htmlFor="selectAll"></label>
                                                            </div>
                                                        </div>
                                                    </th>
                                                    <th><div className="th-data">Start Date</div></th>
                                                    <th><div className="th-data">End Date</div></th>
                                                    <th><div className="th-data">Amount Due</div></th>
                                                    <th><div className="th-data">Message</div></th>
                                                    <th><div className="th-data">Type</div></th>
                                                    <th><div className="th-data">Action</div></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {fields.map((name: string, index: number) => (
                                                    <tr key={name}>
                                                        <td>
                                                            <div className="check-group commocheckbox">
                                                                <Field
                                                                    name={`${name}.includeInBillingSchedule`}
                                                                    type="checkbox"
                                                                    component="input"
                                                                    disabled={isLocked}
                                                                    onChange={(e: any) => {
                                                                        const newChecked = e.target.checked;
                                                                        // Update Final Form's state
                                                                        form.change(`${name}.includeInBillingSchedule`, newChecked);
                                                                        // Update local state
                                                                        onFieldChange(index, "includeInBillingSchedule", newChecked);
                                                                        // Check if all checkboxes are selected
                                                                        const allChecked = form.getState().values.payments.every((p: any) => p.includeInBillingSchedule);
                                                                        setSelectAll(allChecked);
                                                                    }}
                                                                />
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <div className="calendarIcon _datepickerform">
                                                                <DatePickerControl
                                                                    name={`${name}.dueDateStart`}
                                                                    type="datepicker"
                                                                    placeholder="MM-DD-YY"
                                                                    disabled={isLocked}
                                                                    value={
                                                                        fields.value[index].dueDateStart
                                                                            ? fields.value[index].dueDateStart // Ensures correct UTC date without shifting time
                                                                            : null
                                                                    }
                                                                    onChange={(value: any) => {
                                                                        onFieldChange(index, "dueDateStart", value);
                                                                    }}
                                                                    // onChange={(value:any) => onFieldChange(index, 'dueDateStart', value)}
                                                                />
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <div className="calendarIcon _datepickerform">
                                                                <DatePickerControl
                                                                    name={`${name}.dueDateEnd`}
                                                                    type="datepicker"
                                                                    placeholder="MM-DD-YY"
                                                                    value={
                                                                        fields.value[index].dueDateEnd
                                                                            ? fields.value[index].dueDateEnd // Ensures correct UTC date without shifting time
                                                                            : null
                                                                    }
                                                                    disabled={isLocked}
                                                                    onChange={(value:any) => onFieldChange(index, 'dueDateEnd', value)}
                                                                />
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <div className="dollortd _dollar">
                                                                <img src={dollarIcon} alt="Icon" />
                                                                <FormControl
                                                                    name={`${name}.amount`}
                                                                    type="input-decimal"
                                                                    disabled={isLocked}
                                                                    onChange={(e: any) => onFieldChange(index, 'amount', e.target.value)}
                                                                />
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <FormControl
                                                                name={`${name}.message`}
                                                                type="text"
                                                                disabled={isLocked}
                                                                onChange={(e: any) => onFieldChange(index, 'message', e.target.value)}
                                                            />
                                                        </td>
                                                        <td>
                                                            <SearchSelectWithForm
                                                                name={`${name}.paymentType`}
                                                                options={RENT_PAYMENT_TYPE}
                                                                placeholder={RENT_PAYMENT_TYPE[0].label}
                                                                disabled={isLocked}
                                                                onChange={(value:any) => onFieldChange(index, 'paymentType', value.value)}
                                                            />
                                                        </td>
                                                        <td>
                                                            <div className="_action-info-td">
                                                                {
                                                                    fields.value[index].locked && (
                                                                        <div className="t-locked _unlocked">
                                                                            <div className="t-lock-icon">
                                                                                <img src={lockedIcon} alt="icon" />
                                                                            </div>
                                                                            <div className="t-lock-info">Locked</div>
                                                                        </div>
                                                                    )
                                                                } 
                                                                {/* {fields.value[index].invoiceId ? (
                                                                    <button
                                                                        className={`_delete-btn ${isLocked ? 'disabled' : ''}`}
                                                                        onClick={() => delPayment(fields.value[index].invoiceId, fields.value[index]._id)}
                                                                    >
                                                                        <img src={deleteIcon} alt="Delete" /> Delete 112
                                                                    </button>
                                                                ) : ( */}
                                                                    <button
                                                                        className={`_delete-btn ${isLocked ? 'disabled' : ''}`}
                                                                        onClick={() => deletePayment(fields.value[index].invoiceId, fields.value[index]._id, index, fields, form)}
                                                                    >
                                                                        <img src={deleteIcon} alt="Delete" /> Delete
                                                                    </button>
                                                                {/* )} */}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                                <tr>
                                                    <td colSpan={6}>
                                                        {
                                                            isLocked ?
                                                                <div className="add-email">
                                                                    <img src={plusIcon} alt="Icon" /> Add Payment
                                                                </div>
                                                                :
                                                                <div
                                                                    className="add-email"
                                                                    onClick={() => addPayment(form)}
                                                                >
                                                                    <img src={plusIcon} alt="Icon" /> Add Payment
                                                                </div>
                                                        }
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </Table>
                                    );
                                }}
                            </FieldArray>
                        </form>
                    )}
                />
            ) : (
                <div className="outert_able_data"><NoData /></div>
            )}
        </div>
    );
}
 