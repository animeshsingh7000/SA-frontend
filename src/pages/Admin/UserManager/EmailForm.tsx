import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { FormControl } from '../../../components/FormElements/FormControl';
import { composeValidators, required, validEmail } from '../../../validations';
import userIconImg from "../../../assets/images/profile-thumbnail-placeholder.png";
import plusGreen from "../../../assets/images/plus-green.svg";
import editIcon from "../../../assets/images/edit.svg";
import deleteIcon from "../../../assets/images/trash.svg";
import minusIcon from "../../../assets/images/minus.svg";
import plusBlack from "../../../assets/images/plus-black.svg";
import plusIcon from "../../../assets/images/Plus.svg";
import dotsthree from "../../../assets/images/dotsthree.svg";

interface EmailFormProps {
  initialEmails: any[];
  type?: any; // Prop for the initial email values
  onAddEmail: (newEmail: string) => void; // Function to pass the filled email to the parent
  onEditEmail: (index: number, updatedEmail: string) => void; // Function to pass the edited email
  onRemoveEmail: (index: number) => void; // Function to remove the email
}

const EmailForm: React.FC<EmailFormProps> = ({ initialEmails, type, onAddEmail, onEditEmail, onRemoveEmail }) => {
  const [forms, setForms] = useState<any[]>([]);
  // Track new email input value in the state (for adding)
  const [newEmailInput, setNewEmailInput] = useState<string>('');
  // Track new email input value in the state (for adding)
  const [editEmailInputs, setEditEmailInputs] = useState<{ [key: number]: string }>({}); // Track input for each email
  const [openToggle, setOpenToggle] = useState<number | null>(null); // Track which toggle is open
  const [editingIndex, setEditingIndex] = useState<number | null>(null); // Track which email is being edited

  // Initialize editEmailInputs based on initialEmails
  useEffect(() => {
    setOpenToggle(null);
    setEditingIndex(null);
    const initialInputs = initialEmails.reduce((acc, email, index) => {
      acc[index] = email; // Set initial values for the input state
      return acc;
    }, {} as { [key: number]: string });
    setEditEmailInputs(initialInputs);
  }, [initialEmails]);



  // Function to handle input changes (edit functionality)
  const handleInputChange = (index: number, value: string) => {
    setEditEmailInputs({ ...editEmailInputs, [index]: value }); // Update the specific email input
  };


  // Function to add a filled email form
  const handleAdd = (id: any) => {
    if (newEmailInput) {
      onAddEmail(newEmailInput); // Send the filled new email to the parent component
      setNewEmailInput(''); // Clear the input field after adding
      handleRemoveForm(id);
    }
  };

  const handleAddForm = () => {

    if ((initialEmails.length + forms.length) < 5) {
      setForms([...forms, { id: forms.length, email: '' }]); // Add empty form with unique ID
    }
  };

  // Function to remove a specific form
  const handleRemoveForm = (id: number) => {
    setForms(forms.filter((form) => form.id !== id)); // Remove the form with the specific ID
  };

  const handleEdit = (index: number) => {
    const updatedEmail = editEmailInputs[index]; // Get the current value for the specific email
    onEditEmail(index, updatedEmail);
    setOpenToggle(null); // Close the menu
    setEditingIndex(null); // Reset editing index
  };

  const onClickEdit = (index: number) => {
    setOpenToggle(null); // Close the menu
    setEditingIndex(editingIndex === index ? null : index); // Set the editing index
  }

  const handleRemove = (index: number) => {
    onRemoveEmail(index); // Call the remove email function
  };

  const handleToggleClick = (index: number) => {
    setOpenToggle(openToggle === index ? null : index); // Toggle open/close for the edit menu
  };

  return (
    <div className="col-12 _add-email-data _add-contact-data">
      <div className="text-start form-field">
        <div className="contact-header">
          {
            initialEmails.length > 0 || forms.length >= 1 ?
              <>
                <div className="label">Email</div>
                { type !== '1' ? 
                  <div className="addphone" onClick={handleAddForm}>
                    <img src={plusGreen} alt="Icon" /> Add {type === '1' ? ''  : '(Max 5)'}
                  </div>
                  : null
                }
                
              </>
              :
              null
          }
        </div>
        {
          initialEmails.length > 0 ?

            initialEmails.map((email: any, index: any) => (
              <>
                {
                  editingIndex !== index ? (
                    <div className="form-feild-add-info">
                      <div className="left-field">
                        <div className="note-info">
                          <div className="note-desc">{email}</div>
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
                      <FormControl
                        label="Edit Email"
                        name={`Email-${index}`}
                        type="email"
                        placeholder="Email"
                        value={editEmailInputs[index] || ''}
                        fillValue={true}// Use the state for editing
                        onChange={(e: any) => handleInputChange(index, e.target.value)} // Update state on input change
                        validate={composeValidators(required, validEmail)}
                      />
                    </div>
                    <div className="action-btn">
                      <Button variant="primary btn" onClick={() => handleEdit(index)}>
                        Edit Email
                      </Button>
                      <Button variant="delete btn-white">
                        Cancel
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
          initialEmails.length == 0 && forms.length == 0 ?
            <>
              <label className="form-label">Email</label>
              <div className="add-email" onClick={handleAddForm}>
                <img src={plusIcon} alt="Icon" /> Add Email
              </div>
            </>
            :
            null
        }

        {forms.map((form) => (
          <div className="email-edit-form">
            <div className="col-12">
              <FormControl
                label="Add Email"
                name={`Email-${form.id}`} // Unique name for each email field
                type="email"
                placeholder="Email"
                value={newEmailInput}
                fillValue={true}
                onChange={(e: any) => setNewEmailInput(e.target.value)}
                validate={composeValidators(required, validEmail)} // Validation logic
              />
            </div>
            <div className="action-btn">
              <Button variant="primary btn" onClick={() => handleAdd(form.id)}>
                Add Email
              </Button>
              <Button variant="delete btn-white" onClick={() => handleRemoveForm(form.id)}>
                Cancel
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmailForm;