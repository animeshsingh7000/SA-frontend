import { FormControl } from "../FormElements/FormControl";
import { SearchSelectWithForm } from "../SearchSelect/SearchSelect";
import { YES_NO } from "../../constants";
import { composeValidators, requiredSelect } from "../../validations";


export default function MarketingInfo({
    handleSubmit,
    editable = false,
    disabled = false
}: {
    handleSubmit?: () => void;
    editable?: boolean;
    disabled?: boolean
}) {

    return (
        <>
            <div className="row ">
                <div className="col-12 custom-select-form">
                    <div className="text-start form-field">
                        <SearchSelectWithForm
                            name="marketingInfo.isBusinessLicense"
                            label="Do you have a basic business licence? *"
                            options={YES_NO}
                            placeholder={YES_NO[0].label}
                            validate={composeValidators(requiredSelect)}
                        />
                    </div>
                </div>
                <div className="col-12 custom-select-form">
                    <div className="text-start form-field">
                        <SearchSelectWithForm
                            name="marketingInfo.isAssistanceRequiredForBusinessLicense"
                            label="If no, do you need assistance in getting a basic business license?"
                            options={YES_NO}
                            placeholder={YES_NO[0].label}
                        />
                    </div>
                </div>
                <div className="col-12">
                    <FormControl
                        label="What are the closest metro stops to your property?"
                        name="marketingInfo.closestMetroStopsDesc"
                        type="text"
                    />
                </div>
                <div className="col-12 custom-select-form">
                    <div className="text-start form-field">
                        <SearchSelectWithForm
                            name="marketingInfo.isSecurePackageAcceptance"
                            label="Does your building have secure package acceptance? *"
                            options={YES_NO}
                            placeholder={YES_NO[0].label}
                            validate={composeValidators(requiredSelect)}
                        />
                    </div>
                </div>
                <div className="col-12 col-md-6 custom-select-form">
                    <div className="text-start form-field">
                        <SearchSelectWithForm
                            name="marketingInfo.isFloorPlanAvailable"
                            label="Do you have a floor plan to enhance your listing? *"
                            options={YES_NO}
                            placeholder={YES_NO[0].label}
                            validate={composeValidators(requiredSelect)}
                        />
                    </div>
                </div>
                <div className="col-12 col-md-6 custom-select-form">
                    <div className="text-start form-field">
                        <SearchSelectWithForm
                            name="marketingInfo.isFloorAssistanceRequired"
                            label="If no, do you need assistance in getting a floor plan?"
                            options={YES_NO}
                            placeholder={YES_NO[0].label}
                            validate={composeValidators(requiredSelect)}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}
