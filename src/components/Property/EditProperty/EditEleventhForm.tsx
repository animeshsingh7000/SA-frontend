import { FormControl } from "../../FormElements/FormControl";
import { composeValidators, required } from "../../../validations";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

  
export default function EditEleventhForm({
    handleSubmit,
    disabled = false
} : {
    handleSubmit: () => void;
    disabled?: boolean
}) {
    const { pathname } = useLocation();
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return (
        <>
            <p className="edit-property-heading">
                Utilities
            </p>

            <div className="row">
                
                <div className="col-12 col-md-12">
                    <FormControl
                        label="Please provide details of your Electricity provider. Account number, the name on the account, associated phone number."
                        name="utilities.electricityProviderDesc"
                        type="textarea"
                        disabled={disabled}
                        placeholder="Your answer"
                    />
                </div>

                <div className="col-12 col-md-12">
                    <FormControl
                        label="Please provide details of your Gas provider. Account number, the name on the account, associated phone number."
                        name="utilities.gasProviderDesc"
                        type="textarea"
                        disabled={disabled}
                        placeholder="Your answer"
                    />
                </div>
                
                <div className="col-12 col-md-12">
                    <FormControl
                        label="Please provide details of your Water provider. Account number, the name on the account, associated phone number."
                        name="utilities.waterProviderDesc"
                        type="textarea"
                        disabled={disabled}
                        placeholder="Your answer"
                    />
                </div>

                <div className="col-12 col-md-12">
                    <FormControl
                        label="Please provide details of your cable provider. Account number, the name on the account, associated phone number."
                        name="utilities.cableProviderDesc"
                        type="textarea"
                        disabled={disabled}
                        placeholder="Your answer"
                    />
                </div>

                <div className="col-12 col-md-12">
                    <FormControl
                        label="Please provide the wireless network name *"
                        name="utilities.wirelessNetworkName"
                        type="text"
                        placeholder="Your answer"
                        disabled={disabled}
                        validate={composeValidators(
                            required
                        )}
                    />
                </div>

                <div className="col-12 col-md-12">
                    <FormControl
                        label="Please provide the wireless network password *"
                        name="utilities.wirelessNetworkPassword"
                        type="text"
                        placeholder="Your answer"
                        disabled={disabled}
                        validate={composeValidators(
                            required
                        )}
                    />
                </div>

                <div className="col-12 col-md-12">
                    <FormControl
                        label="Where is the router located? *"
                        name="utilities.routerLocationDesc"
                        type="text"
                        placeholder="Your answer"
                        disabled={disabled}
                        validate={composeValidators(
                            required
                        )}
                    />
                </div>

                <div className="col-12 col-md-12">
                    <FormControl
                        label="Please provide details of any other premium service you are offering as part of your listing. *"
                        name="utilities.premiumServiceDesc"
                        type="textarea"
                        placeholder="Your answer"
                        disabled={disabled}
                        validate={composeValidators(
                            required
                        )}
                    />
                </div>
            </div>
        </>
    );
}
