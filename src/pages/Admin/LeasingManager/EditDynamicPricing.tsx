import { Button } from "react-bootstrap";
import { Form } from "react-final-form";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCustomMutation } from "../../../hooks/useApi";
import { getDynamicPricingList, updateDynamicPricing } from "../../../api/admin/ownerInquiry";
import { toast } from 'react-toastify';
import { composeValidators, required, validAmount } from "../../../validations";
import { ROUTE_NAVIGATION_PATH } from "../../../routes/routes";
import { FormControl } from "../../../components/FormElements/FormControl";


interface DynamicPricing {
    _id: string;
    monthName: string;
    value: number;
    monthEnum: number;
    perDiemRate: number;
}

const createValidate = (currentItems: DynamicPricing[]) => (values: any) => {
    const errors: { [key: string]: string } = {};
    currentItems.forEach((item: DynamicPricing) => {
        const monthFieldName = `month_${item.monthEnum}`;
        const diemFieldName = `diem_${item.monthEnum}`;
        
        if (values[monthFieldName] < 0) {
            errors[monthFieldName] = 'Month value cannot be negative';
        }
        
        if (values[diemFieldName] < 0) {
            errors[diemFieldName] = 'Per diem rate cannot be negative';
        }
    });
    
    return errors;
};

const EditDynamicPricing = () => {
    const [currentItems, setCurrentItems] = useState<any>([]);
    const [loader, setLoader] = useState(true);
    const fromPerDiem= new URLSearchParams(document.location.search).get('fromPerDiem');
    const navigate = useNavigate();

    useEffect(() => {
        if(localStorage.getItem("isPerDiemPasswordProvided")) {
            getDynamicPricingList("helloworld").then((res: any) => {
                setCurrentItems(res);
            });
        } else {
            getDynamicPricingList().then((res: any) => {
                setCurrentItems(res);
            });
        }
        
    }, [])

    const { mutate } = useCustomMutation({
        mutationFn: updateDynamicPricing,
        onSuccess: (res: { data: any }) => {
            toast.success(`Pricing has been updated successfully!`)
            navigate(fromPerDiem ? ROUTE_NAVIGATION_PATH.PER_DIEM_LISTING : ROUTE_NAVIGATION_PATH.DYNAMIC_PRICING)
        },
    });

    const onSubmit = (values: any) => {
         const transformedValues = currentItems.map((item:any) => ({
            _id: item._id,
            value: values[`month_${item.monthEnum}`],
            perDiemRate: values[`diem_${item.monthEnum}`]
        }));
        mutate(transformedValues);
    };

    return (
        <>
            <div className="rental-portal-container _dynamic-pricing">
                <div className="container">
                    <legend>Editing {fromPerDiem ? 'Per Diem' : 'Dynamic Pricing' }
                        {/* <small> last updated {currentItems ? formatDate(currentItems[0]?.updatedAt) : ''}</small> */}
                    </legend>
                    <div className="rental-portal-content">
                        <div id="rental-inquiry-form">
                            <div className="owner-inquery-wrapper _addproperty">
                                <Form
                                    onSubmit={onSubmit}
                                    render={({ handleSubmit }) => (
                                    <form onSubmit={handleSubmit}>
                                        {currentItems.map((item:any) => (
                                            <div key={item._id} className="dynamicfield">
                                                <label>{fromPerDiem ? 'Per Diem' : 'Dynamic pricing'} for {item.monthName}</label>
                                                <div className="field-right">
                                               
                                                {/* <Field
                                                    name={`month_${item.monthEnum}`}
                                                    component="input"
                                                    type="number"
                                                    parse={value => (value ? parseInt(value, 10) : '')}
                                                    initialValue={item.value}
                                                >
                                                    {({ input, meta }) => (
                                                        <div>
                                                            <input {...input} />
                                                            {meta.error && meta.touched && <span>{meta.error}</span>}
                                                        </div>
                                                    )}
                                                </Field> */}
                                                {/* <br /> */}
                                                {/* <Field
                                                    name={`diem_${item.monthEnum}`}
                                                    component="input"
                                                    type="number"
                                                    parse={value => (value ? parseInt(value, 10) : '')}
                                                    initialValue={item.perDiemRate}
                                                >
                                                    {({ input, meta }) => (
                                                        <div>
                                                            <input {...input} />
                                                            {meta.error && meta.touched && <span>{meta.error}</span>}
                                                        </div>
                                                    )}
                                                </Field> */}
                                                {
                                                    fromPerDiem ?
                                                    <div className="inputfield-txt">
                                                        <FormControl
                                                            name={`diem_${item.monthEnum}`}
                                                            type="text"
                                                            placeholder="Enter Per Diem"
                                                            initialValue={item.perDiemRate}
                                                            validate={
                                                                composeValidators(
                                                                    required,
                                                                    validAmount
                                                                )
                                                            }
                                                        />
                                                        {/* <span className="input-group-addon">%</span> */}
                                                    </div>

                                                    :
                                                    <div className="inputfield-txt">
                                                        <FormControl
                                                            name={`month_${item.monthEnum}`}
                                                            type="text"
                                                            placeholder="Enter Pecentage"
                                                            initialValue={item.value}
                                                            validate={
                                                                composeValidators(
                                                                    required,
                                                                    validAmount
                                                                )
                                                            }
                                                        />
                                                        <span className="input-group-addon">%</span>
                                                    </div>
                                                }
                                                
                                                </div>
                                            </div>
                                        ))}
                                        <div className="action-btn-wrapper fixed-bottom">
                                            <div className="action-btns oi-action-btn fixwidth2">
                                                <div className="Continuewrapper">
                                                    <Button type="submit" className="btn primary minwdth">
                                                        SUBMIT
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                    )}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default EditDynamicPricing;

