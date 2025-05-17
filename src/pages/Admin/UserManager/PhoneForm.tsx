import React, { useState, useEffect } from 'react';
import { Button, Dropdown } from 'react-bootstrap';
import { FormControl } from '../../../components/FormElements/FormControl';
import { composeValidators, minValue, required } from '../../../validations'; // Assuming validEmail is removed or modified
import plusGreen from "../../../assets/images/plus-green.svg";
import editIcon from "../../../assets/images/edit.svg";
import deleteIcon from "../../../assets/images/trash.svg";
import dotsthree from "../../../assets/images/dotsthree.svg";
import { Field, useField } from 'react-final-form';
import { VALIDATIONS } from '../../../constants';
import downArrow from "../../../assets/images/down-arrow.png";
import { formatPhoneNumber } from '../../../utils/common';
import plusIcon from "../../../assets/images/Plus.svg";


interface MyDropdownItemProps {
  children: React.ReactNode;
  newValue: any;
  onChange: (newValue: any) => void;
}

const DropdownField = ({ name, label, defaultName, value, children, required }: { name: any, label: any; defaultName: any; value: any; children: any, required: any }) => {
  const { input, meta } = useField(name);

  const validate = (value: any) => {
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


interface PhoneFormProps {
  initialPhones: any[];
  onAddPhone: (newPhone: { phone: string, type: string, note: string }) => void;
  onEditPhone: (index: number, updatedPhone: { phone: string, type: string, note: string }) => void;
  onRemovePhone: (index: number) => void;
}

const PhoneForm: React.FC<PhoneFormProps> = ({ initialPhones, onAddPhone, onEditPhone, onRemovePhone }) => {
  const [forms, setForms] = useState<any[]>([]);
  const [editInputs, setEditInputs] = useState<{ [key: number]: { phone: string, type: string, note: string } }>({});
  const [newPhoneInput, setNewPhoneInput] = useState<{ phone: string, type: string, note: string }>({ phone: '', type: '', note: '' });
  const [openToggle, setOpenToggle] = useState<number | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [openDropdownToggle, setOpenDropdownToggle] = useState<number | null>(null);
  const [editingTypeIndex, setEditingTypeIndex] = useState<number | null>(null);

  useEffect(() => {
    const initialInputs = initialPhones.reduce((acc, phone, index) => {
      acc[index] = { phone: phone.phone, type: phone.type, note: phone.note };
      return acc;
    }, {} as { [key: number]: { phone: string, type: string, note: string } });
    setEditInputs(initialInputs);
  }, [initialPhones]);

  const handleInputChange = (index: number, field: string, value: string) => {
    setEditInputs({
      ...editInputs,
      [index]: { ...editInputs[index], [field]: value }
    });
    if(field == 'type') {
      setEditingTypeIndex(null);
    }
  };

  const handleAddForm = () => {
    if ((initialPhones.length + forms.length) < 5) {
      setForms([...forms, { id: forms.length, phone: '', type: '', note: '' }]);
    }
  };

  const handleAdd = (id: number) => {
    if (newPhoneInput.phone) {
      onAddPhone(newPhoneInput);
      setNewPhoneInput({ phone: '', type: '', note: '' });
      handleRemoveForm(id);
    }
  };

  const handleEdit = (index: number) => {
    const updatedPhone = editInputs[index];
    onEditPhone(index, updatedPhone);
    setOpenToggle(null);
    setEditingIndex(null);
  };

  const handleRemoveForm = (id: number) => {
    setForms(forms.filter((form) => form.id !== id));
  };

  const handleRemove = (index: number) => {
    onRemovePhone(index);
  };

  const onClickEdit = (index: number) => {
    setOpenToggle(null); // Close the menu
    setEditingIndex(editingIndex === index ? null : index); // Set the editing index
  }

  const handleDropdownChange = (newType: string) => {
    setNewPhoneInput({ ...newPhoneInput, type: newType });
  };

  const checkingType = (newValue: string) => {
    handleDropdownChange(newValue);
    setOpenDropdownToggle(null);
  };

  const handleToggleClick = (ind: any) => {
    setOpenDropdownToggle(openDropdownToggle === ind ? null : ind);
  };

  const handleEdiitingToggleClick = (index:any) => {
    setEditingTypeIndex(editingTypeIndex === index ? null : index);
  }

  const handleThreeToggleClick = (index: number) => {
    setOpenToggle(openToggle === index ? null : index); // Toggle open/close for the edit menu
  };

  return (
    <div className="col-12 _add-email-data _add-contact-data">
      <div className="text-start form-field">
        <div className="contact-header">
          {initialPhones.length > 0 || forms.length >= 1 ?
            <>
              <div className="label">Phone</div>
              <div className="addphone" onClick={handleAddForm}>
                <img src={plusGreen} alt="Icon" /> Add
              </div>
            </>
            :
            null
          }
        </div>

        {initialPhones.map((data: any, index: any) => (
          <div key={index}>
            {editingIndex !== index ? (
              <div className="form-feild-add-info">
                <div className="left-field">
                  <div className="phone-n-info">
                    <div className="_phone">{formatPhoneNumber(data.phone)}</div>
                    <div className="hometxt">{data.type}</div>
                  </div>
                  <div className="note-info">
                    <div className="note-label">Note</div>
                    <div className="note-desc">{data.note}</div>
                  </div>
                </div>
                <div className="_threedots" onClick={() => handleThreeToggleClick(index)}>
                  <img src={dotsthree} alt="Icon" />
                  {openToggle === index && (
                    <div className="drop-text-edit">
                      <ul>
                        <li onClick={() => onClickEdit(index)}>
                          <img src={editIcon} alt="Edit" /><span>Edit</span>
                        </li>
                        <li className="_delete" onClick={() => handleRemove(index)}>
                          <img src={deleteIcon} alt="Delete" /><span>Delete</span>
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="email-edit-form" key={index}>
                <FormControl
                  label="Edit Phone"
                  name={`Phone-${index}`}
                  type="mobile"
                  maxlength={12}
                  placeholder="Phone"
                  value={editInputs[index]?.phone || ''}
                  fillValue={true}
                  onChange={(e: any) => handleInputChange(index, 'phone', e.target.value)}
                  validate={composeValidators(
                    required,
                    minValue(VALIDATIONS.MIN_PHONE)
                  )}
                />
                <div className="col-12 custom-select-form">
                  <div className="text-start form-field">
                  <label className="form-label">Type</label>
                    <div className="customfieldselect">
                                                
                        <div className="value-selected" onClick={() => handleEdiitingToggleClick(index)}>
                          {editInputs[index]?.type || ''}
                          <img className="arrowdown" src={downArrow} alt="Arrow" />
                        </div>

                        {
                          editingTypeIndex === index ? 
                            <div className="customdrop-down-select">
                              <ul>
                                <li onClick={(e: any) => handleInputChange(index, 'type', 'Mobile')}>Mobile</li>
                                <li onClick={(e: any) => handleInputChange(index, 'type', 'Work')}>Work</li>
                                <li onClick={(e: any) => handleInputChange(index, 'type', 'Home')}>Home</li>
                                <li onClick={(e: any) => handleInputChange(index, 'type', 'Fax')}>Fax</li>
                              </ul>
                            </div>
                          :
                          null
                        }
                        
                    </div>
                    {/* <FormControl
                      label="Edit Type"
                      name={`Type-${index}`}
                      type="text"
                      placeholder="Type"
                      value={editInputs[index]?.type || ''}
                      fillValue={true}
                      onChange={(e: any) => handleInputChange(index, 'type', e.target.value)}
                      validate={composeValidators(required)}
                    /> */}
                  </div>
                </div>
                <div className="col-12 textareafield">
                  <FormControl
                    label="Edit Note"
                    name={`Note-${index}`}
                    type="text"
                    placeholder="Note"
                    value={editInputs[index]?.note || ''}
                    fillValue={true}
                    onChange={(e: any) => handleInputChange(index, 'note', e.target.value)}
                  />
                </div>
                <div className="action-btn">
                  <Button variant="primary btn" onClick={() => handleEdit(index)}>Edit Phone</Button>
                  <Button variant="delete btn-white" onClick={() => setEditingIndex(null)}>Cancel</Button>
                </div>
              </div>
            )}
          </div>
        ))}

        {
          initialPhones.length == 0 && forms.length == 0 ?
            <>
              <label className="form-label">Phone</label>
              <div className="add-email" onClick={handleAddForm}>
                <img src={plusIcon} alt="Icon" /> Add Phone
              </div>
            </>
            :
            null
        }

        {forms.map((form:any, ind:any) => (
          <div key={form.id} className="email-edit-form">
            <FormControl
              label="Phone"
              name={`Phone-${form.id}`}
              type="mobile"
              maxlength={12}
              placeholder="Phone"
              value={newPhoneInput.phone}
              fillValue={true}
              onChange={(e: any) => setNewPhoneInput({ ...newPhoneInput, phone: e.target.value })}
              validate={composeValidators(
                required,
                minValue(VALIDATIONS.MIN_PHONE)
              )}
            />
            <div className="col-12 custom-select-form">
              <div className="text-start form-field">
                {/* <FormControl
                    label="Type"
                    name={`Type-${form.id}`}
                    type="text"
                    placeholder="Type"
                    value={newPhoneInput.type}
                    fillValue={true}
                    onChange={(e: any) => setNewPhoneInput({ ...newPhoneInput, type: e.target.value })}
                    validate={composeValidators(required)}
                  /> */}
                {/* <DropdownField name={`Type-${form.id}`} label="Type" defaultName={newPhoneInput.type} value={newPhoneInput.type} required={true}>
                  <MyDropdownItem newValue="Mobile" onChange={(e: any) => checkingType(e)}>Mobile</MyDropdownItem>
                  <MyDropdownItem newValue="Work" onChange={(e: any) => setNewPhoneInput({ ...newPhoneInput, type: e.target.value })}>Work</MyDropdownItem>
                  <MyDropdownItem newValue="Home" onChange={(e: any) => setNewPhoneInput({ ...newPhoneInput, type: e.target.value })}>Home</MyDropdownItem>
                  <MyDropdownItem newValue="Other" onChange={(e: any) => setNewPhoneInput({ ...newPhoneInput, type: e.target.value })}>Other</MyDropdownItem>
                </DropdownField> */}
                <label className="form-label">Type</label>
                <div className="customfieldselect">
                                            
                    <div className="value-selected" onClick={() => handleToggleClick(ind)}>
                      {newPhoneInput.type}
                      <img className="arrowdown" src={downArrow} alt="Arrow" />
                    </div>

                    {
                      openDropdownToggle === ind ? 
                        <div className="customdrop-down-select">
                          <ul>
                            <li onClick={(e: any) => checkingType('Mobile')}>Mobile</li>
                            <li onClick={(e: any) => checkingType('Work')}>Work</li>
                            <li onClick={(e: any) => checkingType('Home')}>Home</li>
                            <li onClick={(e: any) => checkingType('Other')}>Other</li>
                          </ul>
                        </div>
                      :
                      null
                    }
                    
                </div>
              </div>
            </div>
            <div className="col-12 textareafield">
              <FormControl
                label="Note"
                name={`Note-${form.id}`}
                type="textarea"
                placeholder="Note"
                value={newPhoneInput.note}
                fillValue={true}
                onChange={(e: any) => setNewPhoneInput({ ...newPhoneInput, note: e.target.value })}
              />
            </div>
            <div className="action-btn">
              <Button variant="primary btn" onClick={() => handleAdd(form.id)}>Add Phone</Button>
              <Button variant="delete btn-white" onClick={() => handleRemoveForm(form.id)}>Cancel</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PhoneForm;

const MyDropdownItem: React.FC<MyDropdownItemProps> = ({ children, newValue, onChange }) => (
  <Dropdown.Item onClick={() => onChange(newValue)}>
    {children}
  </Dropdown.Item>
);
