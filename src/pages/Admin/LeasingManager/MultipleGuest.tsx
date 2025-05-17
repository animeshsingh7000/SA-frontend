import React, { useState, useEffect, useRef } from 'react';
import { Button } from 'react-bootstrap';
import plusGreen from "../../../assets/images/plus-green.svg";
import editIcon from "../../../assets/images/edit.svg";
import deleteIcon from "../../../assets/images/trash.svg";
import dotsthree from "../../../assets/images/dotsthree.svg";
import arrowRight from "../../../assets/images/arrow-right.svg";
import AllUserListDropDown from '../../../components/SearchSelect/AllUserListDropDown';
import { getUserList } from '../../../api/admin/user';
import { SearchSelectWithForm } from '../../../components/SearchSelect/SearchSelect';

interface OwnerFormProps {
  initialOwners: any[];
  onAddOwner: (newOwner: {
    Email: any;
    isPrimary: boolean;
    nteEmail: boolean;
    arrivalDepartureEmail: boolean;
    notifyTheUser: boolean;
    paymentsReminder: boolean;
    viewLeaseOnDashboard: boolean;
    payInvoice: boolean;
  }) => void;
  onEditOwner: (index: number, updatedOwner: {
    Email: any;
    isPrimary: boolean;
    nteEmail: boolean;
    arrivalDepartureEmail: boolean;
    notifyTheUser: boolean;
    paymentsReminder: boolean;
    viewLeaseOnDashboard: boolean;
    payInvoice: boolean;
  }) => void;
  onRemoveOwner: (index: number) => void;
  isLocked?: boolean;
}

const GuestForm: React.FC<OwnerFormProps> = ({ initialOwners, onAddOwner, onEditOwner, onRemoveOwner, isLocked=false }) => {
  const [forms, setForms] = useState<any[]>([]);
  const [editEmailInputs, setEditEmailInputs] = useState<{ [key: number]: { label: string; value: string; isPrimary: boolean; nteEmail: boolean; arrivalDepartureEmail: boolean; notifyTheUser: boolean; paymentsReminder: boolean; viewLeaseOnDashboard: boolean; payInvoice: boolean } }>({});
  const [openToggle, setOpenToggle] = useState<number | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [newEmailInput, setNewEmailInput] = useState<string>('');
  const [options, setOptions] = useState<any>([]);
  const effectRan = useRef(false);

  useEffect(() => {
    setOpenToggle(null);
    setEditingIndex(null);
    const initialInputs = initialOwners.reduce((acc, owner, index) => {
      acc[index] = {
        label: owner.Email.label,
        value: owner.Email.value,
        isPrimary: owner.isPrimary || false,
        nteEmail: owner.nteEmail || false,
        arrivalDepartureEmail: owner.arrivalDepartureEmail || false,
        notifyTheUser: owner.notifyTheUser || false,
        paymentsReminder: owner.paymentsReminder || false,
        viewLeaseOnDashboard: owner.viewLeaseOnDashboard || false,
        payInvoice: owner.payInvoice || false
      };
      return acc;
    }, {} as { [key: number]: any });
    setEditEmailInputs(initialInputs);
  }, [initialOwners]);

  useEffect(() => {
    if (!effectRan.current) {
      const fetchOptions = async () => {
        try {
          let payload = {
              count: 5000,
              page: 1,
              type: -1,
              sortby: JSON.stringify({createdAt: -1}),
          }
          const response = await getUserList(payload);
          let data = response.data.map((item: any) => ({ 
            label: item.fullName + (item.email ? ' - ' +item.email : ''),
            value: item._id,
          }));
          data = [{label: 'Select', value: ''}].concat(data)
          if ((initialOwners.length + forms.length) < 5) {
            const firstArrayValues = initialOwners.map((item:any) => item.Email.value);
            data = data.filter((item:any) => !firstArrayValues.includes(item.value));
          }
  
          setOptions(data);
        } catch (error) {
          console.error("Error fetching data:", error);
          setOptions([]);
        }
      };
      fetchOptions();
    }
    return () => {
        effectRan.current = true;
    };
  }, [setOptions]);

  const handleInputChange = (index: number, value: any) => {

    setEditEmailInputs({
      ...editEmailInputs,
      [index]: {
        ...editEmailInputs[index],
        label: value.label,
        value: value.value,
        isPrimary: value.isPrimary !== undefined ? value.isPrimary : editEmailInputs[index].isPrimary,
        nteEmail: value.nteEmail !== undefined ? value.nteEmail : editEmailInputs[index].nteEmail,
        arrivalDepartureEmail: value.arrivalDepartureEmail !== undefined ? value.arrivalDepartureEmail : editEmailInputs[index].arrivalDepartureEmail,
        notifyTheUser: value.notifyTheUser !== undefined ? value.notifyTheUser : editEmailInputs[index].notifyTheUser,
        paymentsReminder: value.paymentsReminder !== undefined ? value.paymentsReminder : editEmailInputs[index].paymentsReminder,
        viewLeaseOnDashboard: value.viewLeaseOnDashboard !== undefined ? value.viewLeaseOnDashboard : editEmailInputs[index].viewLeaseOnDashboard,
        payInvoice: value.payInvoice !== undefined ? value.payInvoice : editEmailInputs[index].payInvoice
      }
    });
  };

  const handleAdd = (id: any, value: { label: string; value: string; isPrimary: boolean; nteEmail: boolean; arrivalDepartureEmail: boolean; notifyTheUser: boolean; paymentsReminder: boolean; viewLeaseOnDashboard: boolean; payInvoice: boolean }) => {
    if (value) {
      const newOwner = {
        Email: {
          label: value.label,
          value: value.value
        },
        isPrimary: value.isPrimary || false,
        nteEmail: value.nteEmail || false,
        arrivalDepartureEmail: value.arrivalDepartureEmail || false,
        notifyTheUser: value.notifyTheUser || false,
        paymentsReminder: value.paymentsReminder || false,
        viewLeaseOnDashboard: value.viewLeaseOnDashboard || false,
        payInvoice: value.payInvoice || false
      };
      onAddOwner(newOwner);
      setNewEmailInput('');
      handleRemoveForm(id);
    }
  };

  // const handleAddForm = () => {
  //   if ((initialOwners.length + forms.length) < 5) {
  //     setForms([...forms, { id: forms.length }]);
  //   }
  // };

  const handleAddForm = () => {
    if ((initialOwners.length + forms.length) < 5) {
      const firstArrayValues = initialOwners.map((item:any) => item.Email.value);

      // Filter out matching values from the second array
      const filteredData = options.filter((item:any) => !firstArrayValues.includes(item.value));
  
      // Update state
      setOptions(filteredData);
      setForms([
        ...forms,
        {
          id: (Math.floor(Math.random() * 100) + 1),
          email: "",
          isPrimary: false,
          nteEmail: false,
          arrivalDepartureEmail: false,
          notifyTheUser: false,
          paymentsReminder: true, // Default to true
          viewLeaseOnDashboard: true, // Default to true
          payInvoice: true, // Default to true
        },
      ]);
    }
  };

  const handleRemoveForm = (id: number) => {
    setForms(forms.filter((form) => form.id !== id));
  };

  const handleEdit = (index: number, value: { label: string; value: string; isPrimary: boolean; nteEmail: boolean; arrivalDepartureEmail: boolean; notifyTheUser: boolean; paymentsReminder: boolean; viewLeaseOnDashboard: boolean; payInvoice: boolean }) => {
    const editOwner = {
      Email: {
        label: value.label,
        value: value.value
      },
      isPrimary: value.isPrimary || false,
      nteEmail: value.nteEmail || false,
      arrivalDepartureEmail: value.arrivalDepartureEmail || false,
      notifyTheUser: value.notifyTheUser || false,
      paymentsReminder: value.paymentsReminder || false,
      viewLeaseOnDashboard: value.viewLeaseOnDashboard || false,
      payInvoice: value.payInvoice || false
    };
    onEditOwner(index, editOwner);
    setOpenToggle(null);
    setEditingIndex(null);
  };

  const onClickEdit = (index: number) => {
    setOpenToggle(null);
    setEditingIndex(editingIndex === index ? null : index);
  };

  const handleRemove = (index: number) => {
    onRemoveOwner(index);
  };

  const handleToggleClick = (index: number) => {
    setOpenToggle(openToggle === index ? null : index);
  };

  // Function to handle the isPrimary checkbox change
  const handlePrimaryChange = (formId: number, isPrimary: boolean) => {
    // Update the primary state for the current form
    let updatedForms = forms.map((form) => {
      if (form.id === formId) {
        return { ...form, isPrimary };
      }
      return form;
    });

    let updatedSecondForms: any;

    // If the current form is set to primary, uncheck all other forms
    if (isPrimary) {
      updatedForms = updatedForms.map((form) => {
        if (form.id !== formId) {
          return { ...form, isPrimary: false};  // Uncheck other forms
        }
        return {...form, nteEmail: true, arrivalDepartureEmail: true, notifyTheUser: false};
      });

      if (Object.keys(editEmailInputs).length > 0) {
        let updatedSecondForms = [editEmailInputs[formId]];
        updatedSecondForms = updatedSecondForms.map((form: any) => {
          return { ...form, isPrimary: false };  // Uncheck other forms
        });
        setEditEmailInputs(updatedSecondForms);
        initialOwners.forEach((form: any, key: any) => {
          const editOwner = initialOwners[key];
          editOwner.isPrimary = false;
          onEditOwner(key, editOwner);
        });

      }
    }


    // Set the forms with the updated primary state
    setForms(updatedForms);
  };

  const handlePayInvoiceChange = (formId: number, checked: boolean) => {
    setForms((prevForms) => {
      return prevForms.map((form) => {
        if (form.id === formId) {
          // If 'Pay Invoice' is being checked, ensure the other two checkboxes are also checked
          if (checked) {
            return { ...form, payInvoice: true, paymentsReminder: true, viewLeaseOnDashboard: true };
          } else {
            // If 'Pay Invoice' is unchecked, leave the other two checkboxes as they are
            return { ...form, payInvoice: false };
          }
        }
        return form;
      });
    });
  };

  const handleViewLeaseOnDashboardChange = (formId: number, checked: boolean) => {
    setForms((prevForms) => {
      return prevForms.map((form) => {
        if (form.id === formId) {
          if (checked) {
            // If 'View Lease on Dashboard' is being checked, check 'Payments Reminder'
            return {
              ...form,
              viewLeaseOnDashboard: true,
              paymentsReminder: true, // Automatically check 'Payments Reminder' when 'View Lease on Dashboard' is checked
            };
          } else {
            // If 'View Lease on Dashboard' is unchecked, uncheck it
            // Check if 'Pay Invoice' is checked and uncheck it as well
            return {
              ...form,
              viewLeaseOnDashboard: false,
              payInvoice: form.payInvoice ? false : form.payInvoice, // Uncheck 'Pay Invoice' only if it's checked
            };
          }
        }
        return form;
      });
    });
  };


  return (
    <>
      <div className="text-start form-field">
        <div className="contact-header">
          <div className="label">Multiple Guest</div>
          {
            !isLocked && (
              <div className="addphone" onClick={handleAddForm}>
                <img src={plusGreen} alt="Icon" /> Add
              </div>
            )
          }
        </div>

        {initialOwners.map((owner: any, index: number) => (
          <React.Fragment key={index}>
            {editingIndex !== index ? (
              <div className="form-feild-add-info">
                <div className="left-field">
                  <div className="phone-n-info">
                    <div className="_phone">{owner?.Email?.label}</div>
                  </div>
                  <div className="note-info">
                    {
                      owner.isPrimary && (
                        <div className="note-label">
                          <img src={arrowRight} alt="Icon" />
                          Make this user primary guest
                        </div>
                      )
                    }
                    {
                      owner.nteEmail && (
                        <div className="note-label">
                          <img src={arrowRight} alt="Icon" />
                          NTE Email
                        </div>
                      )
                    }
                    {
                      owner.arrivalDepartureEmail && (
                        <div className="note-label">
                          <img src={arrowRight} alt="Icon" />
                          Arrival/Departure Emails
                        </div>
                      )
                    }
                    {
                      owner.notifyTheUser && (
                        <div className="note-label">
                          <img src={arrowRight} alt="Icon" />
                          Notify the user
                        </div>
                      )
                    }
                    {
                      owner.paymentsReminder && (
                        <div className="note-label">
                          <img src={arrowRight} alt="Icon" />
                          Payment Reminders
                        </div>
                      )
                    }
                    {
                      owner.viewLeaseOnDashboard && (
                        <div className="note-label">
                          <img src={arrowRight} alt="Icon" />
                          View Lease on Dashboard
                        </div>
                      )
                    }
                    {
                      owner.payInvoice && (
                        <div className="note-label">
                          <img src={arrowRight} alt="Icon" />
                          Pay Invoice
                        </div>
                      )
                    }
                  </div>
                </div>
                {
                  !isLocked && (
                    <div className="_threedots" onClick={() => handleToggleClick(index)}>
                      <img src={dotsthree} alt="Icon" />
                      {openToggle === index && (
                        <div className="drop-text-edit">
                          <ul>
                            <li onClick={() => onClickEdit(index)}>
                              <img src={editIcon} alt="Edit" /> <span>Edit</span>
                            </li>
                            <li className="_delete" onClick={() => handleRemove(index)}>
                              <img src={deleteIcon} alt="Delete" /> <span>Delete</span>
                            </li>
                          </ul>
                        </div>
                      )}
                    </div>

                  )
                }
                
              </div>
            ) : (
              <div className="email-edit-form _eamil_lease_wrapper" key={index}>
                <div className="col-12">
                  <AllUserListDropDown
                    label="Primary Email"
                    name={`Email-${index}`}
                    email={true}
                    value={editEmailInputs[index].value || ''}
                    isSearchable
                    onChange={(e: any) => handleInputChange(index, e)}
                  />
                </div>
                <div className="col-12 col-md-6 _checkboxmob mb-4">
                  {/* <CheckboxControlGlobal
                    name={`isPrimary-${index}`}
                    label="Make this user Primary Guest"
                    checked={editEmailInputs[index]?.isPrimary || false}
                    onChange={(e: any) => handleInputChange(index, { ...editEmailInputs[index], isPrimary: e.target.checked })}
                  /> */}
                  <div className="custom-checkbox-new">
                    <div className="text-start form-field">
                      <div className="input-group2">
                        <input
                          type="checkbox"
                          checked={editEmailInputs[index]?.isPrimary || false}
                          onChange={(e: any) => handleInputChange(index, { ...editEmailInputs[index], isPrimary: e.target.checked })}
                        />
                      </div>
                    </div>
                    <p>Make this user Primary Guest</p>
                  </div>
                </div>

                <div className="col-12 col-md-6 _checkboxmob mb-4">
                  {/* <CheckboxControlGlobal
                    name={`nteEmail-${index}`}
                    label="NTE Email"
                    checked={editEmailInputs[index]?.nteEmail || false}
                    onChange={(e: any) => handleInputChange(index, { ...editEmailInputs[index], nteEmail: e.target.checked })}
                    /> */}
                  <div className="custom-checkbox-new">
                    <div className="text-start form-field">
                      <div className="input-group2">
                        <input
                          type="checkbox"
                          checked={editEmailInputs[index]?.nteEmail || false}
                          onChange={(e: any) => handleInputChange(index, { ...editEmailInputs[index], nteEmail: e.target.checked })}
                        />
                      </div>

                    </div>
                    <p>NTE Email</p>
                  </div>
                </div>

                <div className="col-12 col-md-6 _checkboxmob mb-4">
                  {/* <CheckboxControlGlobal
                        name={`arrivalDepartureEmail-${index}`}
                        label="Arrival/Departure Emails"
                        checked={editEmailInputs[index]?.arrivalDepartureEmail || false}
                        onChange={(e: any) => handleInputChange(index, { ...editEmailInputs[index], arrivalDepartureEmail: e.target.checked })}
                    /> */}
                  <div className="custom-checkbox-new">
                    <div className="text-start form-field">
                      <div className="input-group2">
                        <input
                          type="checkbox"
                          checked={editEmailInputs[index]?.arrivalDepartureEmail || false}
                          onChange={(e: any) => handleInputChange(index, { ...editEmailInputs[index], arrivalDepartureEmail: e.target.checked })}
                        />
                      </div>
                    </div>
                    <p>Arrival/Departure Emails</p>
                  </div>
                </div>

                <div className="col-12 col-md-6 _checkboxmob mb-4">
                  {/* <CheckboxControlGlobal
                        name={`notifyTheUser-${index}`}
                        label=" Should we notify the User ?"
                        checked={editEmailInputs[index]?.notifyTheUser || false}
                        onChange={(e: any) => handleInputChange(index, { ...editEmailInputs[index], notifyTheUser: e.target.checked })}
                    /> */}
                  <div className="custom-checkbox-new">
                    <div className="text-start form-field">
                      <div className="input-group2">
                        <input
                          type="checkbox"
                          checked={editEmailInputs[index]?.notifyTheUser || false}
                          onChange={(e: any) => handleInputChange(index, { ...editEmailInputs[index], notifyTheUser: e.target.checked })}
                        />
                      </div>
                    </div>
                    <p>Should we notify the User?</p>
                  </div>
                </div>

                <div className="col-12 col-md-6 _checkboxmob mb-4">
                  {/* <CheckboxControlGlobal
                        name={`paymentsReminder-${index}`}
                        label="Payment Reminders "
                        checked={editEmailInputs[index]?.paymentsReminder || false}
                        onChange={(e: any) => handleInputChange(index, { ...editEmailInputs[index], paymentsReminder: e.target.checked })}
                    /> */}
                  <div className="custom-checkbox-new">
                    <div className="text-start form-field">
                      <div className="input-group2">
                        <input
                          type="checkbox"
                          checked={editEmailInputs[index]?.paymentsReminder || false}
                          onChange={(e: any) => handleInputChange(index, { ...editEmailInputs[index], paymentsReminder: e.target.checked })}
                        />
                      </div>
                    </div>
                    <p>Payment Reminders</p>
                  </div>
                </div>

                <div className="col-12 col-md-6 _checkboxmob mb-4">
                  {/* <CheckboxControlGlobal
                        name={`viewLeaseOnDashboard-${index}`}
                        label="View Lease on Dashboard"
                        checked={editEmailInputs[index]?.viewLeaseOnDashboard || false}
                        onChange={(e: any) => handleInputChange(index, { ...editEmailInputs[index], viewLeaseOnDashboard: e.target.checked })}
                    /> */}
                  <div className="custom-checkbox-new">
                    <div className="text-start form-field">
                      <div className="input-group2">
                        <input
                          type="checkbox"
                          checked={editEmailInputs[index]?.viewLeaseOnDashboard || false}
                          onChange={(e: any) => handleInputChange(index, { ...editEmailInputs[index], viewLeaseOnDashboard: e.target.checked })}
                        />
                      </div>
                    </div>
                    <p>View Lease on Dashboard</p>
                  </div>
                </div>

                <div className="col-12 col-md-6 _checkboxmob mb-4">
                  {/* <CheckboxControlGlobal
                        name={`payInvoice-${index}`}
                        label=" Pay Invoice"
                        checked={editEmailInputs[index]?.payInvoice || false}
                        onChange={(e: any) => handleInputChange(index, { ...editEmailInputs[index], payInvoice: e.target.checked })}
                    /> */}
                  <div className="custom-checkbox-new">
                    <div className="text-start form-field">
                      <div className="input-group2">
                        <input
                          type="checkbox"
                          checked={editEmailInputs[index]?.payInvoice || false}
                          onChange={(e: any) => handleInputChange(index, { ...editEmailInputs[index], payInvoice: e.target.checked })}
                        />
                      </div>
                    </div>
                    <p>Pay Invoice</p>
                  </div>
                </div>
                <div className='btn_wrapper_multiple'>

                  <Button variant="primary btn" onClick={() => handleEdit(index, editEmailInputs[index])}>
                    Save
                  </Button>
                  <Button variant="delete btn-white" onClick={() => handleRemove(index)}>
                    Remove
                  </Button>
                </div>
              </div>
            )}
          </React.Fragment>
        ))}


        {forms.map((form) => (
          <div className="email-edit-form _eamil_lease_wrapper" key={form.id}>
            <div className="col-12">
              {/* <AllUserListDropDown
                label="Primary Guest"
                name={`Email-${form.id}`}
                email={true}
                isSearchable
                onChange={(e: any) =>
                  setForms((prevForms) =>
                    prevForms.map((f) =>
                      f.id === form.id ? { ...f, label: e.label, value: e.value } : f
                    )
                  )
                }
              /> */}
              <SearchSelectWithForm
                label="Primary Guest"
                name={`Email-${form.id}`}
                options={options}
                isSearchable={true}
                placeholder=""
                onChange={(e: any) =>
                  setForms((prevForms) =>
                    prevForms.map((f) =>
                      f.id === form.id ? { ...f, label: e.label, value: e.value } : f
                    )
                  )
                }
              />
            </div>

            <div className="col-12 col-md-6 _checkboxmob mb-4">
              <div className="custom-checkbox-new">
                <div className="text-start form-field">
                  <div className="input-group2">
                    <input
                      type="checkbox"
                      checked={form.isPrimary ?? false}
                      onChange={(e) => handlePrimaryChange(form.id, e.target.checked)}
                    />
                  </div>

                </div>
                <p>Make this user Primary Guest</p>
              </div>
            </div>

            <div className="col-12 col-md-6 _checkboxmob mb-4">
              {/* <CheckboxControlGlobal
                name={`nteEmail-${form.id}`}
                label="NTE Email"
                checked={form.nteEmail ?? false}
                onChange={(e: any) => 
                  setForms((prevForms) =>
                    prevForms.map((f) =>
                      f.id === form.id ? { ...f, nteEmail: e.target.checked } : f
                    )
                  )
                }
              /> */}
              <div className="custom-checkbox-new">
                <div className="text-start form-field">
                  <div className="input-group2">
                    <input
                      type="checkbox"
                      checked={form.nteEmail ?? false}
                      onChange={(e: any) =>
                        setForms((prevForms) =>
                          prevForms.map((f) =>
                            f.id === form.id ? { ...f, nteEmail: e.target.checked } : f
                          )
                        )
                      }
                    />
                  </div>

                </div>
                <p>NTE Email</p>
              </div>
            </div>

            <div className="col-12 col-md-6 _checkboxmob mb-4">
              {/* <CheckboxControlGlobal
                name={`arrivalDepartureEmail-${form.id}`}
                label="Arrival/Departure Emails"
                checked={form.nteEmail ?? false}
                onChange={(e: any) => 
                  setForms((prevForms) =>
                    prevForms.map((f) =>
                      f.id === form.id ? { ...f, arrivalDepartureEmail: e.target.checked } : f
                    )
                  )
                }
              /> */}
              <div className="custom-checkbox-new">
                <div className="text-start form-field">
                  <div className="input-group2">
                    <input
                      type="checkbox"
                      checked={form.arrivalDepartureEmail ?? false}
                      onChange={(e: any) =>
                        setForms((prevForms) =>
                          prevForms.map((f) =>
                            f.id === form.id ? { ...f, arrivalDepartureEmail: e.target.checked } : f
                          )
                        )
                      }
                    />
                  </div>

                </div>
                <p>Arrival/Departure Emails</p>
              </div>
            </div>

            <div className="col-12 col-md-6 _checkboxmob mb-4">
              {/* <CheckboxControlGlobal
                name={`notifyTheUser-${form.id}`}
                label="Should we notify the User ?"
                checked={form.nteEmail ?? false}
                onChange={(e: any) => 
                  setForms((prevForms) =>
                    prevForms.map((f) =>
                      f.id === form.id ? { ...f, notifyTheUser: e.target.checked } : f
                    )
                  )
                }
              /> */}
              <div className="custom-checkbox-new">
                <div className="text-start form-field">
                  <div className="input-group2">
                    <input
                      type="checkbox"
                      checked={form.notifyTheUser ?? false}
                      onChange={(e: any) =>
                        setForms((prevForms) =>
                          prevForms.map((f) =>
                            f.id === form.id ? { ...f, notifyTheUser: e.target.checked } : f
                          )
                        )
                      }
                    />
                  </div>

                </div>
                <p>Should we notify the User?</p>
              </div>
            </div>

            <div className="col-12 col-md-6 _checkboxmob mb-4">
              {/* <CheckboxControlGlobal
                name={`paymentsReminder-${form.id}`}
                label="Payment Reminders"
                checked={form.paymentsReminder}  // Remove ?? true
                onChange={(e:any) => 
                  setForms((prevForms) =>
                    prevForms.map((f) =>
                      f.id === form.id ? { ...f, paymentsReminder: e.target.checked } : f
                    )
                  )
                }
              /> */}
              <div className="custom-checkbox-new">
                <div className="text-start form-field">
                  <div className="input-group2">
                    <input
                      type="checkbox"
                      checked={form.paymentsReminder ?? false}
                      onChange={(e: any) =>
                        setForms((prevForms) =>
                          prevForms.map((f) =>
                            f.id === form.id ? { ...f, paymentsReminder: e.target.checked } : f
                          )
                        )
                      }
                    />
                  </div>
                </div>
                <p>Payment Reminders</p>
              </div>
            </div>

            <div className="col-12 col-md-6 _checkboxmob mb-4">
              {/* <CheckboxControlGlobal
                name={`viewLeaseOnDashboard-${form.id}`}
                checked={form.viewLeaseOnDashboard}

                label="View Lease on Dashboard"
                onChange={(e: any) => handleViewLeaseOnDashboardChange(form.id, e.target.checked)}
              /> */}
              <div className="custom-checkbox-new">
                <div className="text-start form-field">
                  <div className="input-group2">
                    <input
                      type="checkbox"
                      checked={form.viewLeaseOnDashboard ?? false}
                      onChange={(e: any) => handleViewLeaseOnDashboardChange(form.id, e.target.checked)}
                    />
                  </div>
                </div>
                <p>View Lease on Dashboard</p>
              </div>
            </div>

            <div className="col-12 col-md-6 _checkboxmob mb-4">
              {/* <CheckboxControlGlobal
                name={`payInvoice-${form.id}`}
                label="Pay Invoice"
                checked={form.payInvoice}
                onChange={(e: any) => handlePayInvoiceChange(form.id, e.target.checked)}
              /> */}
              <div className="custom-checkbox-new">
                <div className="text-start form-field">
                  <div className="input-group2">
                    <input
                      type="checkbox"
                      checked={form.payInvoice ?? false}
                      onChange={(e: any) => handlePayInvoiceChange(form.id, e.target.checked)}
                    />
                  </div>
                </div>
                <p>Pay Invoice</p>
              </div>
            </div>
            <div className='btn_wrapper_multiple'>
              <Button variant="primary btn" onClick={() => handleAdd(form.id, form)}>Add</Button>
              <Button variant="delete btn-white" onClick={() => handleRemoveForm(form.id)}>
                Remove
              </Button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default GuestForm;
