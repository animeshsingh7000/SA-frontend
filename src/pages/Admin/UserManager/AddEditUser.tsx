
import React, { ChangeEvent, useRef, useState } from 'react';
import { Form, Field } from "react-final-form";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useCustomMutation } from "../../../hooks/useApi";
import { toast } from 'react-toastify';
import { composeValidators, required, validEmail } from "../../../validations";
import { ROUTE_NAVIGATION_PATH } from "../../../routes/routes";
import { FormControl } from "../../../components/FormElements/FormControl";
import Breadcrumb from 'react-bootstrap/Breadcrumb';
import plusIcon from "../../../assets/images/Plus.svg";
import userIconImg from "../../../assets/images/profile-thumbnail-placeholder.png";
import minusIcon from "../../../assets/images/minus.svg";
import plusBlack from "../../../assets/images/plus-black.svg";
import { CheckboxControlGlobal } from "../../../components/FormElements/CheckboxControl";
import DeleteUserModel from "../../../components/Modal/DeleteuserModel";
import { Editor } from 'primereact/editor';
import { FILE_SIZE, MAX_FILE_SIZE, MESSAGES, USER_DETAILS } from '../../../constants';
import { addUser, getUserDetail, updateUser } from '../../../api/admin/user';
import { encryptPassword } from '../../../utils';
import EmailForm from './EmailForm';
import { capitalizeFirstWord, formatDate } from '../../../utils/common';
import PhoneForm from './PhoneForm';
import UserGroupDropdown from '../../../components/SearchSelect/UserGroupDropdown';

const ACCEPT_TYPE = [
    "image/png",
    "image/jpeg",
    "image/jpg",
];

const AddEditUser = () => {
    const [deleteModal, setDeleteModal] = useState(false);
    const [userEmail, setUserEmail] = useState("");
    const navigate = useNavigate();
    const [about, setAbout] = useState<any>(null);
    const [aboutSecondary, setAboutSecondary] = useState<any>(null);
    const params = useParams();
    const [profileEditDeleteOpen, setProfileEditDeleteOpen] = useState(false);
    const [image, setImage] = useState('');
    const [file, setFile] = useState<File | null>();
    const [errorMsg, setErrorMsg] = useState('');
    const [initData, setInitData] = useState<any>({
        ...USER_DETAILS,
        firstName: "",
        lastName: "",
        email: "",
    });
    const handleSubmitRef = useRef<() => void>(() => { }); // Create a ref to store the handleSubmit function
    const [activeTab, setActiveTab] = useState<any>('');
    const [initialEmails, setInitialEmails] = useState<string[]>([]);
    const [initialPhones, setInitialPhones] = useState<any[]>([]);


    useEffect(() => {
        if(params.userId && params.userId != '0') {
            getUserDetail(params.userId).then((res: any) => {
                setInitData((prevState: any) => ({
                    ...prevState,
                    firstName: res.data.data.firstName ? res.data.data.firstName : null,
                    lastName: res.data.data.lastName ? res.data.data.lastName : null,
                    email: res.data.data.email ? res.data.data.email : null,
                    password: res.data.data.password ? res.data.data.password : null,
                    linkedIn: res.data.data.linkedIn ? res.data.data.linkedIn : null,
                    teamSort: res.data.data.teamSort ? res.data.data.teamSort.toString() : "0",
                    tagline: res.data.data.tagline ? res.data.data.tagline : null,
                    status: res.data.data.status && res.data.data.status == 1 ? true : false,
                    alternatePhoneNo: null,
                    alternateEmailId: null,
                    showOnTeam: res.data.data.showOnTeam ? res.data.data.showOnTeam : false,
                    createdAt: res.data.data.createdAt ? res.data.data.createdAt : null
                }));
                setAbout(res.data.data.about ? res.data.data.about : null);
                setAboutSecondary(res.data.data.aboutSecondary ? res.data.data.aboutSecondary : null);
                setImage(res.data.data.images && res.data.data.images.length > 0 ?  res.data.data.images[0].imageUrl: '');
                if (res.data.data.alternateEmailIds && res.data.data.alternateEmailIds.length > 0) {
                    setInitialEmails([...initialEmails, ...res.data.data.alternateEmailIds]);
                }
                if (Array.isArray(res.data.data.alternatePhoneIds) && res.data.data.alternatePhoneIds.length > 0) {
                    setInitialPhones([...initialPhones, ...res.data.data.alternatePhoneIds]);
                }
                setUserEmail(res.data.data.email);
            });
        }
    }, []);

    useEffect(() => {
        let tabDetails = params.type == '1' ? 'owners' : (params.type == '3' ? 'renters' : (params.type == '2' ? 'attache' : (params.type == '0' ? 'currentGuests' : 'allUser')));
        setActiveTab(tabDetails);
    }, [activeTab])

    const handleAddEmail = (newEmail: string) => {
        if (newEmail) {
            setInitialEmails([...initialEmails, newEmail]); // Add the new filled email to the array
        }
    };

    const handleEditEmail = (index: number, updatedEmail: string) => {
        const updatedEmails = initialEmails.map((email, i) =>
            i === index ? updatedEmail : email
        );
        setInitialEmails(updatedEmails); // Update the email at the specified index
    };

    const handleRemoveEmail = (index: number) => {
        const updatedEmails = initialEmails.filter((_, i) => i !== index);
        setInitialEmails(updatedEmails); // Remove email at the specified index
    };

    const handleAddPhone = (newPhone: { phone: string; type: string; note: string }) => {
        setInitialPhones([...initialPhones, newPhone]);
    };

    // Function to handle editing an existing phone
    const handleEditPhone = (index: number, updatedPhone: { phone: string; type: string; note: string }) => {
        const updatedPhones = [...initialPhones];
        updatedPhones[index] = updatedPhone; // Update the specific phone entry
        setInitialPhones(updatedPhones);
    };

    // Function to handle removing a phone
    const handleRemovePhone = (index: number) => {
        const updatedPhones = initialPhones.filter((_, i) => i !== index); // Remove the phone at the specified index
        setInitialPhones(updatedPhones);
    };


    const { mutate } = useCustomMutation({
        mutationFn: (req: any) => {
            return params.userId && params.userId != '0' ? updateUser(params.userId, req) : addUser(req);
        },
        onSuccess: async () => {
            toast.success(params.userId && params.userId != '0' ? `User updated successfully!` : 'User added successfully!')
            navigate(params.userId && params.userId != '0' ? ROUTE_NAVIGATION_PATH.USER_MANAGEMENT + '?activeTab=' + activeTab + '&type=' + params.type : ROUTE_NAVIGATION_PATH.USER_MANAGEMENT);
        },
    });


    const onSubmit = (values: any) => {
        let enable = (values.status == true ? 1 : 2).toString();
        let teamSorting = values.teamSort ? Number(values.teamSort).toString() : null;
        var formData = new FormData();
        formData.append("firstName", values.firstName);
        formData.append("lastName", values.lastName);
        formData.append("email", values.email);
        if(values.password) {
            formData.append("password", encryptPassword(values.password))
        }
        if (file) {
            formData.append('images', file);
        }
        if (about) {
            formData.append("about", about);
        }
        if (aboutSecondary) {
            formData.append("aboutSecondary", aboutSecondary);
        }
        if (values.linkedIn) {
            formData.append("linkedIn", values.linkedIn);
        }
        if(teamSorting) {
            formData.append("teamSort", teamSorting);
        }
        if (values.tagline) {
            formData.append("tagline", values.tagline);
        }
        formData.append("showOnTeam", values.showOnTeam);
        formData.append("status", enable);
        // formData.append("alternatePhoneNo", values.alternatePhoneNo);
        // formData.append("alternateEmailId", values.alternateEmailId);
        if (initialEmails.length > 0) {
            // for (var i = 0; i < initialEmails.length; i++) {
                formData.append('alternateEmailIds', initialEmails.join(", "));
            // }
        }
        if(values.userGroup && values.userGroup.length > 0) {
            let groups = values.userGroup.map((item:any) => item.value);
            formData.append('userGroup', groups.join(", "));
        }
        if (initialPhones.length > 0) {
            const combinedString = initialPhones.map(obj => JSON.stringify(obj)).join(", ");
                formData.append('alternatePhoneIds', combinedString);
            
        }
        mutate(formData);
    };

    const submitForm = () => {
        if (handleSubmitRef.current) {
            handleSubmitRef.current(); // Programmatically trigger form submission
        }
    };

    const updateListItem = () => {
        setUserEmail('');
        navigate(ROUTE_NAVIGATION_PATH.USER_MANAGEMENT);
    }

    const openDeleteModel = () => {
        // setUserEmail("sonali@yopmail.com");
        setDeleteModal(true);
    }
    const toggleEditDeleteOpen = () => {
        setProfileEditDeleteOpen(!profileEditDeleteOpen);
    };


    const onImageChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setImage('');
            setErrorMsg('');
            const file = event.target.files[0];
            const selectedFile = event.target.files[0].size
            const fileSizeKiloBytes = selectedFile / FILE_SIZE;
            if (!ACCEPT_TYPE.includes(file.type)) {
                setErrorMsg("Only png, jpg, jpeg files are allowed.");
                event.target.value = "";
            } else if (fileSizeKiloBytes > MAX_FILE_SIZE) {
                setErrorMsg(MESSAGES.FILE_SIZE_ERROR);
                return;
            } else {
                setImage(URL.createObjectURL(event.target.files[0]));
                updateImage(event.target.files[0]);
            }
            
        }
    };

    const updateImage = (file: File | null) => {
        file ? setFile(file) : setFile(null);
    };

    const increaseCount = () => {
        setInitData((prevState: any) => ({
            ...prevState,
            teamSort: Number(initData.teamSort) + 1
        }));
    }

    const decreaseCount = () => {
        if (Number(initData.teamSort) == 0) {
            return;
        } else {
            setInitData((prevState: any) => ({
                ...prevState,
                teamSort: Number(initData.teamSort) - 1
            }));
        }
    }


    return (
        <>
            {/* User Management Current Guest  */}

            <div className="common-right-panel-section">
                <div className="top-right-bar">
                    <Breadcrumb>
                        <Breadcrumb.Item href="#">User Manager</Breadcrumb.Item>
                        <Breadcrumb.Item href={ROUTE_NAVIGATION_PATH.USER_MANAGEMENT + '?activeTab=' + activeTab + '&type=' + params.type}>{params.type == '1' ? 'Owners' : (params.type == '3' ? 'Renters' : (params.type == '2' ? 'Attache Users' : (params.type == '0' ? 'Current Guests' : 'All Users')))}</Breadcrumb.Item>
                        <Breadcrumb.Item active>Edit {params.type == '1' ? 'Owner' : (params.type == '3' ? 'Renter' : (params.type == '2' ? 'Attache User' : (params.type == '0' ? 'Current Guest' : 'All User')))}</Breadcrumb.Item>
                    </Breadcrumb>
                    <div className="guest-header">
                        {
                            params.userId && params.userId != '0' ?
                            <>
                                <div className="guest-left">
                                    <h2>{params.type == '1' ? 'Owner' : (params.type == '3' ? 'Renter' : (params.type == '2' ? 'Attache User' : (params.type == '0' ? 'Current Guest' : 'All Users')))}</h2>
                                    <h1>{capitalizeFirstWord(initData.firstName)} {capitalizeFirstWord(initData.lastName)}</h1>
                                    <div className="register">Registered on {initData?.createdAt ? formatDate(initData.createdAt) : '-'}</div>
                                </div>
                                
                            </>
                            :
                            <div className="guest-left">
                                <h1>Create User</h1>
                            </div>
                        }
                        <div className="guest-right">
                            {/* <button  className="btn-delete" onClick={() => openDeleteModel()}>Delete User</button> */}
                            <button className="btn-primary" onClick={submitForm}>Save Details</button>
                        </div>
                    </div>

                </div>
                <div className="guest-general-information scrollbar">
                    <div className="info-wrapper">
                        <div className="infoleft">
                            <h2>General Information</h2>
                        </div>
                        <div className="info-right">
                            <Form
                                initialValues={initData}
                                onSubmit={onSubmit}
                                render={({ handleSubmit, values }) => {
                                    // Store the handleSubmit function in the ref so it can be called later
                                    handleSubmitRef.current = handleSubmit;
                                    return (
                                        <form onSubmit={handleSubmit}>
                                            <div className="row">
                                                <div className="col-12 col-md-6">
                                                    <FormControl
                                                        label="First Name"
                                                        name="firstName"
                                                        type="Name"
                                                        placeholder="First Name"
                                                        onChange={(e:any) => {
                                                            setInitData({
                                                              ...initData,
                                                              firstName: e.target.value,
                                                            });
                                                          }}
                                                        validate={composeValidators(required)}
                                                    />
                                                </div>
                                                <div className="col-12 col-md-6">
                                                    <FormControl
                                                        label="Last Name"
                                                        name="lastName"
                                                        type="Last"
                                                        placeholder="Last Name"
                                                        onChange={(e:any) => {
                                                            setInitData({
                                                              ...initData,
                                                              lastName: e.target.value,
                                                            });
                                                        }}
                                                        validate={composeValidators(required)}
                                                    />
                                                </div>
                                                {
                                                    params.type == '2' ?
                                                        <div className="col-12">
                                                            <label className="form-label">Images</label>
                                                            <div className="input-file-ws">
                                                                <div className="thumb-image">
                                                                    <img src={image ? image : userIconImg} alt="Image" />
                                                                </div>
                                                                <div className="file-input">
                                                                    <input
                                                                        type="file"
                                                                        onChange={onImageChange}
                                                                        name="file-input"
                                                                        id="file-input"
                                                                        className="file-input__input"
                                                                        accept=".png,.jpg,.jpeg"
                                                                    />
                                                                    <label className="file-input__label" htmlFor="file-input">
                                                                        <span>
                                                                            <div className="fileupload">
                                                                                <img src={plusIcon} alt="Icon" />
                                                                            </div>
                                                                        </span>
                                                                    </label>
                                                                </div>
                                                            </div>
                                                            {
                                                                errorMsg ?
                                                                    <div className="error mt-0">{errorMsg}</div>
                                                                    :
                                                                    null
                                                            }
                                                        </div>
                                                        :
                                                        null
                                                }
                                                <div className="col-12">
                                                    <FormControl
                                                        label="Email"
                                                        name="email"
                                                        type="Email"
                                                        placeholder="Email"
                                                        onChange={(e:any) => {
                                                            setInitData({
                                                              ...initData,
                                                              email: e.target.value,
                                                            });
                                                        }}
                                                        disabled={params.userId && params.userId != '0' ? true : false}
                                                        validate={composeValidators(required, validEmail)}
                                                    />
                                                </div>
                                                <div className="col-12">
                                                    <FormControl
                                                        label="Password"
                                                        name="password"
                                                        type="password"
                                                        onChange={(e:any) => {
                                                            setInitData({
                                                              ...initData,
                                                              password: e.target.value,
                                                            });
                                                        }}
                                                        autocomplete="off"
                                                        placeholder="password"
                                                    />
                                                </div>

                                                {/* <div className="col-12 custom-select-form">
                                                    <UserGroupDropdown
                                                        name="userGroup"
                                                        label="Groups"
                                                        isSearchable
                                                        isMulti={true}
                                                    />
                                                </div> */}

                                                {
                                                    params.type == '2' ?
                                                        <>
                                                            <div className="col-12 editor-common">
                                                                <label className="form-label">About</label>
                                                                <Editor value={about} onTextChange={(e) => setAbout(e.htmlValue)} style={{ height: '320px' }} />
                                                            </div>
                                                            <div className="col-12 editor-common">
                                                                <label className="form-label">Secondary About</label>
                                                                <Editor value={aboutSecondary} onTextChange={(e) => setAboutSecondary(e.htmlValue)} style={{ height: '320px' }} />
                                                            </div>
                                                        </>
                                                        :
                                                        null
                                                }


                                                <EmailForm
                                                    initialEmails={initialEmails}
                                                    type={params.type}
                                                    onAddEmail={handleAddEmail}
                                                    onEditEmail={handleEditEmail} // Pass edit handler
                                                    onRemoveEmail={handleRemoveEmail} // Pass remove handler
                                                />

                                                <PhoneForm
                                                    initialPhones={initialPhones}
                                                    onAddPhone={handleAddPhone}
                                                    onEditPhone={handleEditPhone} // Pass edit handler
                                                    onRemovePhone={handleRemovePhone} // Pass remove handler
                                                />

                                                {
                                                    params.type == '2' ?
                                                        <>
                                                            <div className="col-12">
                                                                <FormControl
                                                                    label="Tagline"
                                                                    name="tagline"
                                                                    onChange={(e:any) => {
                                                                        setInitData({
                                                                          ...initData,
                                                                          tagline: e.target.value,
                                                                        });
                                                                    }}
                                                                    type="text"
                                                                />
                                                            </div>
                                                            <div className="col-12">
                                                                <FormControl
                                                                    label="Linkedin Url"
                                                                    name="linkedIn"
                                                                    onChange={(e:any) => {
                                                                        setInitData({
                                                                          ...initData,
                                                                          linkedIn: e.target.value,
                                                                        });
                                                                    }}
                                                                    type="text"
                                                                />
                                                            </div>
                                                        </>
                                                        :
                                                        null
                                                }
                                                <div className="toggle-switch-btn mb-4">
                                                    <div className="col-12 col-md-4">
                                                        <Field name="status" type="checkbox">
                                                            {({ input }) => (
                                                                <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>

                                                                    {/* Custom Toggle Switch */}
                                                                    <div className="toggle-container" style={{ position: 'relative' }}>
                                                                        <input
                                                                            {...input}
                                                                            type="checkbox"
                                                                            id="toggleSwitch"
                                                                            style={{ display: 'none' }}
                                                                            onChange={(e:any) => {
                                                                                setInitData({
                                                                                  ...initData,
                                                                                  status: e.target.checked,
                                                                                });
                                                                            }}
                                                                            // Hide default checkbox
                                                                        />
                                                                        {/* Label acting as the toggle switch */}
                                                                        <label
                                                                            htmlFor="toggleSwitch"
                                                                            style={{
                                                                                display: 'inline-block',
                                                                                width: '50px',
                                                                                height: '24px',
                                                                                backgroundColor: initData.status === true ? '#4CAF50' : '#ccc',
                                                                                borderRadius: '50px',
                                                                                position: 'relative',
                                                                                cursor: 'pointer',
                                                                                transition: 'background-color 0.3s',
                                                                            }}
                                                                        >
                                                                            {/* Circle inside the toggle */}
                                                                            <span
                                                                                style={{
                                                                                    position: 'absolute',
                                                                                    top: '2px',
                                                                                    left: input.checked ? '26px' : '2px',
                                                                                    width: '20px',
                                                                                    height: '20px',
                                                                                    backgroundColor: 'white',
                                                                                    borderRadius: '50%',
                                                                                    transition: 'left 0.3s',
                                                                                }}
                                                                            />
                                                                        </label>
                                                                    </div>

                                                                    <label className="form-label" style={{ marginRight: '10px',  marginBottom: '4px' }}>Enabled</label>

                                                                </div>
                                                            )}
                                                        </Field>
                                                    </div>
                                                    {
                                                    params.type == '2' ?
                                                    <div className="col-12 col-md-6 _checkboxmob">
                                                        {/* <CheckboxControlGlobal
                                                            name="showOnTeam"
                                                            label="Show on Team Page"
                                                            onChange={(e:any) => {
                                                                setInitData({
                                                                  ...initData,
                                                                  showOnTeam: e.target.value,
                                                                });
                                                            }}
                                                        /> */}
                                                        <div className="custom-checkbox-new">
                                                            <FormControl
                                                                name="showOnTeam"
                                                                type="checkbox"
                                                                onChange={(e:any) => {
                                                                    setInitData({
                                                                    ...initData,
                                                                        showOnTeam: e.target.checked,
                                                                    });
                                                                }}
                                                            />
                                                            <p>Show on Team Page</p>
                                                        </div>
                                                    </div>
                                                    :
                                                    null

                                                }
                                               
                                                </div>
                                                {
                                                    params.type == '2' ?
                                                        <div className="col-12 col-md-6 teamsort">
                                                            <FormControl
                                                                label="Team Sort"
                                                                name="teamSort"
                                                                type="input-number"
                                                                onChange={(e:any) => {
                                                                    setInitData({
                                                                    ...initData,
                                                                        teamSort: e.target.value,
                                                                    });
                                                                }}
                                                            />
                                                            <div className="plusminus">
                                                                <div className="boxes" onClick={() => decreaseCount()}><img src={minusIcon} alt="Icon" /></div>
                                                                <div className="boxes" onClick={() => increaseCount()}><img src={plusBlack} alt="Icon" /></div>

                                                            </div>

                                                        </div>
                                                        :
                                                        null
                                                }

                                            </div>
                                        </form>
                                    );
                                }}
                            />

                        </div>
                    </div>
                </div>
            </div>

            {/* User Management Current Guest page End  */}

            {/* {
                userEmail ?
                    <DeleteUserModel
                        show={deleteModal}
                        handleClose={() => setDeleteModal(false)}
                        email={userEmail}
                        updateListItem={updateListItem}
                    />
                    : null

            } */}

        </>

    );
}

export default AddEditUser;

