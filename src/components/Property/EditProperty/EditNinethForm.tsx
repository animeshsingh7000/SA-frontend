import { Field, useField } from "react-final-form";
import { FormControl } from "../../FormElements/FormControl";
import { Dropdown } from "react-bootstrap";
import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";

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
  
export default function EditNinethForm({
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
                Maintenance and Operations
            </p>

            <div className="row">
                <div className="col-12 col-md-12">
                    <FormControl
                        label="Please provide details of your AC system - include make, model, year, last service if known, including if it is controlled by the building."
                        name="maintenanceAndOperation.acSystemDesc"
                        type="text"
                        disabled={disabled}
                        placeholder="Your answer"
                    />
                </div>

                <div className="col-12 col-md-12">
                    <FormControl
                        label="What is the AC filter size"
                        name="maintenanceAndOperation.acFilterSize"
                        type="text"
                        disabled={disabled}
                        placeholder="Your answer"
                    />
                </div>

                <div className="col-12 col-md-12">
                    <FormControl
                        label="Who is the HVAC service provider for this listing?"
                        name="maintenanceAndOperation.hvacServiceProvider"
                        type="text"
                        placeholder="Your answer"
                        disabled={disabled}
                        toolTipInfo={
                            'Attache has developed a comprehensive HVAC program to ensure that all our properties have suitably maintained air-conditioning and heating systems. As this is the main cause of guest issues, we require our owners to participate in system checks to minimize breakdowns. If we are servicing your system, please simply write "Attache", if you are opting out of the program, please provide details of the company and service schedule you have selected for your HVAC system.'
                        }
                    />
                </div>

                <div className="col-12 col-md-12">
                    <FormControl
                        label="Please provide details of your heating system - include make, model, year, last service if known, including if it is controlled by the building."
                        name="maintenanceAndOperation.heatingSystemDesc"
                        type="textarea"
                        rows="3"
                        disabled={disabled}
                        placeholder="Your answer"
                    />
                </div>

                <div className="col-12 col-md-12">
                    <FormControl
                        label="Where is the thermostat located? Are there clear instructions for use?"
                        name="maintenanceAndOperation.thermostatLocation"
                        type="text"
                        disabled={disabled}
                        placeholder="Your answer"
                    />
                </div>

                <div className="col-12 col-md-12">
                    <FormControl
                        label="Please provide details of the trash. Location, Pick-up days for regular trash, pick-up days for recycling and green waste if different."
                        name="maintenanceAndOperation.trashLocation"
                        type="textarea"
                        rows="3"
                        disabled={disabled}
                        placeholder="Your answer"
                    />
                </div>

                <div className="col-12 col-md-12 custom-select-form">
                    {
                        disabled ? 
                            <FormControl
                                label="Is a key required to access the trash?"
                                name="maintenanceAndOperation.isKeyRequiredToAccessTrash"
                                type="text"
                                disabled={disabled}
                                placeholder="Your answer"
                            />
                        :
                        <DropdownField name="maintenanceAndOperation.isKeyRequiredToAccessTrash" label="Is a key required to access the trash?" defaultName="No" value="No" required={false}>
                            <MyDropdownItem newValue="Yes" onChange={handleSubmit}>Yes</MyDropdownItem>
                            <MyDropdownItem newValue="No" onChange={handleSubmit}>No</MyDropdownItem>
                        </DropdownField>
                    }
                </div>

                <div className="col-12 col-md-12">
                    <FormControl
                        label="Where is the breaker (fuse) box located?"
                        name="maintenanceAndOperation.breakerFuseLocation"
                        type="text"
                        disabled={disabled}
                        placeholder="Your answer"
                    />
                </div>

                <div className="col-12 col-md-12">
                    <FormControl
                        label="Where is the water shut-off valve located? For the apartment, for the building?"
                        name="maintenanceAndOperation.waterShutOffValveLocation"
                        type="text"
                        disabled={disabled}
                        placeholder="Your answer"
                    />
                </div>

                <div className="col-12 col-md-12">
                    <FormControl
                        label="Please provide details of the hot water service. Where is it located, what is the make, model, when was it last serviced?"
                        name="maintenanceAndOperation.hotWaterServiceDesc"
                        type="textarea"
                        rows="3"
                        disabled={disabled}
                        placeholder="Your answer"
                    />
                </div>

                <div className="col-12 col-md-12">
                    <FormControl
                        label="Please provide details of where important mail should be sent."
                        name="maintenanceAndOperation.importantMailSentDesc"
                        type="textarea"
                        rows="3"
                        placeholder="Your answer"
                        disabled={disabled}
                        toolTipInfo={
                            'Your mailing address, an agent (give details) etc?'
                        }
                    />
                </div>

                <div className="col-12 col-md-12">
                    <FormControl
                        label="Please detail any special property access or building information."
                        name="maintenanceAndOperation.buildingOrPropertyAccessInfoDesc"
                        type="text"
                        disabled={disabled}
                        placeholder="Your answer"
                    />
                </div>

                <div className="col-12 col-md-12">
                    <FormControl
                        label="When was the property last painted? (Interior / exterior)"
                        name="maintenanceAndOperation.propertyLastPainted"
                        type="text"
                        disabled={disabled}
                        placeholder="Your answer"
                    />
                </div>

                <div className="col-12 col-md-12 custom-select-form">
                    {
                        disabled ? 
                            <FormControl
                                label="Are you getting the contractor inspection from Attache to ensure your property is ready for listing?"
                                name="maintenanceAndOperation.isContractorInspected"
                                type="text"
                                disabled={disabled}
                                placeholder="Your answer"
                            />
                        :
                        <DropdownField name="maintenanceAndOperation.isContractorInspected" label="Are you getting the contractor inspection from Attache to ensure your property is ready for listing?" defaultName="No" value="No" required={false}>
                            <MyDropdownItem newValue="Yes" onChange={handleSubmit}>Yes</MyDropdownItem>
                            <MyDropdownItem newValue="No" onChange={handleSubmit}>No</MyDropdownItem>
                        </DropdownField>
                    }
                </div>

                <div className="col-12 col-md-12">
                    <FormControl
                        label="The management contract authorizes us to spend $300 per 30 days on your property to take care of any required repairs. If you are not allowing this, please indicate below."
                        name="maintenanceAndOperation.repairsNotAllowedDesc"
                        type="textarea"
                        rows="3"
                        disabled={disabled}
                        placeholder="Your answer"
                    />
                </div>

                <div className="col-12 col-md-12">
                    <FormControl
                        label="Are there any repair items that need attention to your knowledge?"
                        name="maintenanceAndOperation.repairItemsDesc"
                        type="text"
                        disabled={disabled}
                        placeholder="Your answer"
                    />
                </div>
            </div>
        </>
    );
}

const MyDropdownItem: React.FC<MyDropdownItemProps> = ({ children, newValue, onChange = () => {} }) => (
    <Dropdown.Item onClick={() => onChange(newValue)}>{children}</Dropdown.Item>
);
