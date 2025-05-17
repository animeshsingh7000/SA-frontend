import React from "react";
import { FormControl } from "../FormElements/FormControl";
import { CheckboxControlGlobal } from "../FormElements/CheckboxControl";

export default function Accessibility({
    handleSubmit,
    disabled = false
}: {
    handleSubmit?: () => void;
    disabled?: boolean
}) {
    return (
        <>
            <div className="row">
                <div className="col-12 _mob-padding">
                    <div className="termstext">
                        <CheckboxControlGlobal
                            name="accessibility.isAccessDisabled"
                            label="Disabled Access"
                        />

                    </div>
                </div>
                <div className="col-12 textareafield">
                    <FormControl
                        label="Disabled Note"
                        name="accessibility.disabledNote"
                        type="textarea"
                    />
                </div>
            </div>
        </>
    );
}
