import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import plusGreen from "../../../../assets/images/plus-green.svg";
import editIcon from "../../../../assets/images/edit.svg";
import deleteIcon from "../../../../assets/images/trash.svg";
import plusIcon from "../../../../assets/images/Plus.svg";
import dotsthree from "../../../../assets/images/dotsthree.svg";
import { FormControl } from '../../../../components/FormElements/FormControl';
import OwnerUserListDropDown from '../../../../components/SearchSelect/OwnerUserListDropDown';

interface OwnerFormProps {
    initialOwners: any[];
    onAddOwner: (newOwner: { label: string, value: string }) => void; // Function to pass the filled email to the parent
    onEditOwner: (index: number, updatedOwner: { label: string, value: string }) => void; // Function to pass the edited email
    onRemoveOwner: (index: number) => void; // Function to remove the email
}

const OwnerForm: React.FC<OwnerFormProps> = ({ initialOwners, onAddOwner, onEditOwner, onRemoveOwner }) => {
  const [forms, setForms] = useState<any[]>([]);
  // Track new email input value in the state (for adding)
  const [newEmailInput, setNewEmailInput] = useState<any>({});
  // Track new email input value in the state (for adding)
  const [editEmailInputs, setEditEmailInputs] = useState<{
    [key: number]: { label: string; value: string };
  }>({});
  const [openToggle, setOpenToggle] = useState<number | null>(null); // Track which toggle is open
  const [editingIndex, setEditingIndex] = useState<number | null>(null); // Track which email is being edited

  // Initialize editEmailInputs based on initialOwners
  useEffect(() => {
    setOpenToggle(null);
    setEditingIndex(null);
    const initialInputs = initialOwners.reduce((acc, owner, index) => {
      acc[index] = { label: owner.label, value: owner.value }; // Include both label and value
      return acc;
    }, {} as { [key: number]: { label: string; value: string } });
    setEditEmailInputs(initialInputs);
  }, [initialOwners]);



  // Function to handle input changes (edit functionality)
  const handleInputChange = (index: number, value: any) => {
    setEditEmailInputs({
      ...editEmailInputs,
      [index]: { ...editEmailInputs[index], label: value.label, value: value.value }
    });
    // setTimeout(() => {
      handleEdit(index, value);
    // }, 10000);
    
    // setEditEmailInputs({ ...editEmailInputs, [index]: value }); // Update the specific email input
  };


  // Function to add a filled email form
  const handleAdd = (id: any, value:any) => {
    if (value) {
      onAddOwner(value); // Send the filled new email to the parent component
      setNewEmailInput(''); // Clear the input field after adding
      handleRemoveForm(id);
    }
  };

  const handleAddForm = () => {
    if ((initialOwners.length + forms.length) < 5) {
      setForms([...forms, { id: forms.length, email: '' }]); // Add empty form with unique ID
    }
  };

  // Function to remove a specific form
  const handleRemoveForm = (id: number) => {
    setForms(forms.filter((form) => form.id !== id)); // Remove the form with the specific ID
  };

  const handleEdit = (index: number, value:any) => {
    // const updatedEmail = editEmailInputs[index]; // Get the current value for the specific email
    onEditOwner(index, value);
    setOpenToggle(null); // Close the menu
    setEditingIndex(null); // Reset editing index
  };

  const onClickEdit = (index: number) => {
    setOpenToggle(null); // Close the menu
    setEditingIndex(editingIndex === index ? null : index); // Set the editing index
  }

  const handleRemove = (index: number) => {
    onRemoveOwner(index); // Call the remove email function
  };

  const handleToggleClick = (index: number) => {
    setOpenToggle(openToggle === index ? null : index); // Toggle open/close for the edit menu
  };

  return (
    <>
      <div className="text-start form-field">
        <div className="contact-header">
          {
            initialOwners.length > 0 || forms.length >= 1 ?
              <>
                <div className="label">Multiple Owner</div>
               
                  <div className="addphone" onClick={handleAddForm}>
                    <img src={plusGreen} alt="Icon" /> Add
                  </div>
              </>
              :
              null
          }
        </div>
        {
          initialOwners.length > 0 ?

            initialOwners.map((email: any, index: any) => (
              <>
                {
                  editingIndex !== index ? (
                    <div className="form-feild-add-info">
                      <div className="left-field">
                        <div className="note-info">
                          <div className="note-desc">{email.label}</div>
                        </div>

                      </div>
                      <div className="_threedots" onClick={() => handleToggleClick(index)}>
                        <img src={dotsthree} alt="Icon" />
                        {openToggle == index ?
                          <div className="drop-text-edit">
                            <ul>
                              <li onClick={() => onClickEdit(index)}>
                                <img src={editIcon} alt="Edit" /><span>Edit</span>
                              </li>
                              <li className="_delete" onClick={() => handleRemove(index)}>
                                <img src={deleteIcon} alt="Edit" /><span>Delete</span>
                              </li>
                            </ul>
                          </div>
                          :
                          null
                        }
                      </div>
                    </div>
                  )
                    :
                    null
                }

                {editingIndex === index ? (
                  <div className="email-edit-form" key={index}>
                    <div className="col-12">
                        <OwnerUserListDropDown
                            label="Owner*"
                            name={`Email-${index}`}
                            email={true}
                            isSearchable
                            onChange={(e: any) => {
                              handleInputChange(index, e);
                              // handleEdit(index);
                            }}
                        />
                    </div>
                    <div className="action-btn">
                      {/* <Button variant="delete btn-white" onClick={()=> handleEdit(index)}>
                        Edit
                      </Button> */}
                      <Button variant="primary btn" onClick={() => handleRemoveForm(index)}>
                        Remove Email
                      </Button>
                      
                    </div>
                  </div>
                )
                  :
                  null
                }
              </>


            ))
            :
            null
        }

      </div>

      <div className="text-start form-field">
        {
          initialOwners.length == 0 && forms.length == 0 ?
            <>
                <div className="contact-header">
                    <div className="label">Multiple Owner</div>
                    <button className="addphone" onClick={handleAddForm}>
                        <img src={plusGreen} alt="Icon" />Add
                    </button>
                </div>
              
            </>
            :
            null
        }

        {forms.map((form) => (
          <div className="email-edit-form ">
            <div className="col-12">
                <OwnerUserListDropDown
                    label="Owner*"
                    name={`Email-${form.id}`}
                    email={true}
                    isSearchable
                    onChange={(e: any) => {
                      // setNewEmailInput(e);
                      handleAdd(form.id, e);
                    }}
                />
            </div>
            <div className="action-btn">
              {/* <Button variant="primary btn" onClick={() => handleAdd(form.id)}>
                Add Owner
              </Button> */}
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

export default OwnerForm;