import React, { useState, ChangeEvent, useEffect, useRef } from "react";
import { Form } from "react-final-form";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { useNavigate, useParams } from "react-router-dom";
import Breadcrumb from 'react-bootstrap/Breadcrumb';
import { Editor } from 'primereact/editor';
import { composeValidators, required } from "../../../../validations";
import QuadrantsListDropDown from "../../../../components/SearchSelect/QuadrantsListDropdown";
import { createNeighbourhood, getNeighbourhood, getNeighbourhoodDetail, updateNeighbourhood } from "../../../../api/admin/neighborhood";
import { FILE_SIZE, MAX_FILE_SIZE, MESSAGES } from "../../../../constants";
import { ROUTE_NAVIGATION_PATH } from "../../../../routes/routes";
import { useCustomMutation } from "../../../../hooks/useApi";
import { toast } from 'react-toastify';
import { capitalizeFirstWord, formatDate } from "../../../../utils/common";
import { Spinner } from "react-bootstrap";
import DeleteNeighbourhoodModel from "../../../../components/Modal/DeleteNeighbourhood";
import { FormControl } from "../../../../components/FormElements/FormControl";

const ACCEPT_TYPE = [
    "image/png",
    "image/jpeg",
    "image/jpg",
];

const EDIT_NEIGHBORHOOD = {
    regionId: "",
    name: "",
    quadrants: [],
    createdAt: "",
}

const AddEditNeighborhood: React.FC = () => {
    const [about, setAbout] = useState<any>(null);
    const [image, setImage] = useState('');
    const [file, setFile] = useState<File | null>();
    const [errorMsg, setErrorMsg] = useState('');
    const [initData, setInitData] = useState<any>({
        ...EDIT_NEIGHBORHOOD,
        regionId: "",
        name: "",
        quadrants: []
    });
    const [loader, setLoader] = useState(true);
    const [deleteModal, setDeleteModal] = useState(false);
    const [neighbourhoodId, setneighbourhoodId] = useState("");
    const [neighbourhoodName, setneighbourhoodName] = useState("");

    const params = useParams();
    const navigate = useNavigate();
    const handleSubmitRef = useRef<() => void>(() => { }); // Create a ref to store the handleSubmit function

    useEffect(() => {
        if(params.id){
            getNeighbourhoodDetail(params.id).then((res: any) => {    
                setInitData((prevState: any) => ({
                    ...prevState,
                    regionId: res.data.regionId ? res.data.regionId : "",
                    name: res.data.name ? res.data.name : "",
                    quadrants: res.data.quadrants && res.data.quadrants.length> 0 ? res.data.quadrants.map((item:any) => item._id) : [],
                    createdAt: res.data.createdAt ? res.data.createdAt : "",
                }));
                
                setAbout(res.data.description ? res.data.description : "");
                setImage(res.data.images && res.data.images.length > 0 ?  res.data.images[0].imageUrl: '');
                setLoader(false);
                setneighbourhoodName(res.data.name);
                setneighbourhoodId(res.data._id);
            });
        } else {
            setLoader(false);
        }
        
    }, []);

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

    const submitForm = () => {
        if (handleSubmitRef.current) {
            handleSubmitRef.current(); // Programmatically trigger form submission
        }
    };

    const onSubmit = (values: any) => {
        // var formData = new FormData();
        // if(values.name) {
        //     formData.append("name", values.name)
        // }
        // if (file) {
        //     formData.append('images', file);
        // }
        // if (about) {
        //     formData.append("decsription", about);
        // }
        // if (values.quadrants) {
        //     let quad = values.quadrants.map((item:any) => item.value)
        //     formData.append("quadrants", quad);
        // }
        // if(initData.regionId) {
        //     formData.append("regionId", values.regionId)
        // }

        let data:any = {
            name: values.name,
            regionId: values.regionId,
            description: about ? about : "",
        }
        if(values.quadrants && values.quadrants.length > 0) {
            if(isSimpleArray(values.quadrants)){
                data.quadrants = values.quadrants;
            } else {
                data.quadrants = values.quadrants.map((item:any) => item.value)
            }
        } else {
            delete data.quadrants;
        }
        mutate(data);
        
    };


    function isSimpleArray(arr:any) {
        return Array.isArray(arr) && arr.every(item => typeof item !== 'object' || item === null);
    }

    const { mutate } = useCustomMutation({
        mutationFn: (req: any) => {
            return params.id ? updateNeighbourhood(params.id, req): createNeighbourhood(req);
        },
        onSuccess: async () => {
            toast.success(params.id ? `Neighborhood updated successfully` : 'Neighborhood created successfully')
            localStorage.removeItem("neighbourhood");
            getNeighbourhood().then((res: any) => {         
                localStorage.setItem("neighbourhood", JSON.stringify(res.data.neighbourhoods));
            });
            navigate(ROUTE_NAVIGATION_PATH.NEIGHBORHOOD_LIST);
            
        },
    });

    const openDeleteModel = () => {
        // setUserEmail("sonali@yopmail.com");
        setDeleteModal(true);
    }

    const updateListItem = () => {
        setneighbourhoodName('');
        setneighbourhoodId('');
        navigate(ROUTE_NAVIGATION_PATH.NEIGHBORHOOD_LIST);
    }

    return (
        <>
            <div className="common-right-panel-section">
                <div className="top-right-bar">
                    <Breadcrumb>
                        <Breadcrumb.Item href="#">Property Manager</Breadcrumb.Item>
                        <Breadcrumb.Item href={ROUTE_NAVIGATION_PATH.NEIGHBORHOOD_LIST}>Neighborhood </Breadcrumb.Item>
                        <Breadcrumb.Item active>{params.id ? 'Edit' : 'Create'} Neighborhood </Breadcrumb.Item>
                    </Breadcrumb>
                    <div className="guest-header">
                        <div className="guest-left ">
                            <h2>Neighborhood</h2>
                            {
                                params.id ?
                                <>
                                    <h1>{capitalizeFirstWord(initData.name)}</h1>
                                    <div className="register">Registered on {initData?.createdAt ? formatDate(initData.createdAt) : '-'}</div>
                                </>
                                :
                                null
                            }   

                        </div>
                        <div className="guest-right">
                            {
                                params.id ?
                                <button className="btn-delete" onClick={() => openDeleteModel()}>Delete Neighborhood</button>
                                :
                                null
                            }
                            <button className="btn-primary" onClick={submitForm}>Save Details</button>
                        </div>
                    </div>

                </div>
                {
                    loader ? (
                    <div className="spinner-wrapper"><Spinner /></div>
                    ) : (
                    <div className="guest-general-information scrollbar">
                        <div className="info-wrapper info-wrapper-multiple">
                            <div className="infoleft">
                                <h2>General Details</h2>
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

                                                    {/* <div className="col-12">
                                                        <div className="imagetxt2">Images</div>
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
                                                    </div> */}
                                                    <div className="col-12 col-md-12 custom-select-form">
                                                        <div className="text-start form-field">
                                                            <FormControl
                                                                label="Neighborhood"
                                                                name="name"
                                                                type="name"
                                                                validate={composeValidators(required)}
                                                            />
                                                        </div>
                                                        <div className="col-12 editor-common">
                                                            <label className="form-label">Description</label>
                                                            <Editor value={about} onTextChange={(e) => setAbout(e.htmlValue)} style={{ height: '320px' }} />
                                                        </div>
                                                        <div className="col-12 col-md-12 custom-select-form _editchips">
                                                                <QuadrantsListDropDown
                                                                    label="Quadrants"
                                                                    name="quadrants"
                                                                    placeholder={"Select multiple"}
                                                                    isMulti={true}
                                                                    isSearchable
                                                                    validate={composeValidators(required)}
                                                                />
                                                        </div>
                                                    </div>
                                                </div>
                                            </form>
                                        );
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                    )
                }
            </div>

            {
                neighbourhoodName && deleteModal ?  (
                    <DeleteNeighbourhoodModel
                        show={deleteModal}
                        handleClose={() => setDeleteModal(false)}
                        neighbourhoodId={neighbourhoodId}
                        neighbourhood={neighbourhoodName}
                        updateListItem={updateListItem}
                    />
                )
                :
                null
            }
            
        </>
    );
};

export default AddEditNeighborhood;
