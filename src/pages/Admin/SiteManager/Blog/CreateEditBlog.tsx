import React, { useState, useEffect, useRef } from "react";
import { Form } from "react-final-form";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { composeValidators, required } from "../../../../validations";
import { FormControl } from "../../../../components/FormElements/FormControl";
import { useNavigate, useParams } from "react-router-dom";
import Breadcrumb from 'react-bootstrap/Breadcrumb';
import { createBlog, getBlogDetail, updateBlog } from "../../../../api/admin/siteManger";
import { useCustomMutation } from "../../../../hooks/useApi";
import { ROUTE_NAVIGATION_PATH } from "../../../../routes/routes";
import { toast } from 'react-toastify';
import { Spinner } from "react-bootstrap";
import DeleteBlogModel from "../../../../components/Modal/DeleteBlogModel";
import { Editor } from "primereact/editor";
import { SearchSelectWithForm } from "../../../../components/SearchSelect/SearchSelect";
import { BlogCommentStatus, BlogStatus } from "../../../../constants";
import { AxiosError } from "axios";

const EDIT_BLOG = {
    slug: "",
    title: "",
    content: "",
    excerpt: "",
    blogStatus: "",
    metaTitle: "",
    metaKeyword: "",
    metaDescription: "",
    commentStatus: ""
}

const CreateEditBlog: React.FC = () => {
    const [loader, setLoader] = useState(true);
    const params = useParams();
    const navigate = useNavigate();
    const [initData, setInitData] = useState<any>({
        ...EDIT_BLOG,
        slug: "",
        title: "",
        content: "",
        excerpt: "",
        blogStatus: "",
        metaTitle: "",
        metaKeyword: "",
        metaDescription: "",
        commentStatus: ""
    });
    const handleSubmitRef = useRef<() => void>(() => { }); // Create a ref to store the handleSubmit function
    const [errorMessage, setErrorMessage] = useState("");
    const [featuretteId, setfeaturetteId] = useState("");
    const [featuretteHeading, setFeaturetteHeading] = useState("");
    const [deleteModal, setDeleteModal] = useState(false);
    const [about, setAbout] = useState<any>(null);

    const validateForm = (values: any) => {
        const errors: any = {};    
        // Validate title
        if (!values.title || values.title.trim() === "") {
            errors.title = "This field is required.";
        }
    
        // Validate about content
        if (!about || about.trim() === "") {
            errors.about = "This field is required.";
        }    
        return errors;
    };

    const submitForm = () => {
        if (handleSubmitRef.current) {
            handleSubmitRef.current(); // Programmatically trigger form submission
        }
    };

    useEffect(() => {
        if (params.id) {
            getBlogDetail(params.id).then((res: any) => {
                setInitData((prevState: any) => ({
                    ...prevState,
                    slug: res.data.slug ? res.data.slug : "",
                    title: res.data.title ? res.data.title : "",
                    content: res.data.content ? res.data.content : "",
                    excerpt: res.data.excerpt ? res.data.excerpt : "",
                    blogStatus: res.data.blogStatus ? res.data.blogStatus : "draft",
                    metaTitle: res.data.metaTitle ? res.data.metaTitle : "",
                    metaDescription: res.data.metaDescription ? res.data.metaDescription : "",
                    metaKeyword: res.data.metaKeyword ? res.data.metaKeyword : "",
                    commentStatus: res.data.commentStatus ? res.data.commentStatus : "open"
                }));
                setLoader(false);
                setAbout(res.data.content ? res.data.content : "");
                setFeaturetteHeading(res.data.title);
                setfeaturetteId(res.data._id);
            });
        } else {
            setInitData((prevState: any) => ({
                ...prevState,
                blogStatus:  "draft",
                commentStatus: "open"
            }));
            setLoader(false);
        }

    }, []);

    const onSubmit = (values: any) => {
        
        delete values?.isRemember;
        const data: any = { ...values };
        data.blogStatus = (values.blogStatus.value ? values.blogStatus.value : values.blogStatus);
        data.commentStatus = (values.commentStatus.value ? values.commentStatus.value : values.commentStatus);
        // if (!values.excerpt)
        data.excerpt = data.excerpt ? data.excerpt : "";
        // if (about) {
            data.content = (about ? about : "");
        // }
       
        // if (!data.metaTitle)
        data.metaTitle = data.metaTitle ? data.metaTitle : "";
        mutate(data);

    };

    const { mutate } = useCustomMutation({
        mutationFn: (req: any) => {
            setLoader(true);
            return params.id ? updateBlog(params.id, req) : createBlog(req);
        },
        onSuccess: async () => {
            setLoader(false)
            toast.success(params.id ? `Blog updated successfully` : 'Blog created successfully')
            navigate(ROUTE_NAVIGATION_PATH.ADMIN_BLOG);
        },
        onError: (error: AxiosError<{ message: string; status: number, code: number }>) => {
            setLoader(false);
        },
    });

    const openDeleteModel = () => {
        setDeleteModal(true);
    }

    const navigateToList = () => {
        navigate(ROUTE_NAVIGATION_PATH.ADMIN_BLOG);
    }

    const updateListItem = () => {
        setFeaturetteHeading('');
        setfeaturetteId('');
        navigate(ROUTE_NAVIGATION_PATH.ADMIN_BLOG);
    }

    function setDescription(value:any) {
        setAbout(value);
        if(value) {
            setErrorMessage("");
        }
    }

    return (
        <>
            <div className="common-right-panel-section">
                <div className="top-right-bar">
                    <Breadcrumb>
                        <Breadcrumb.Item href="#">Site Manager</Breadcrumb.Item>
                        <Breadcrumb.Item href={ROUTE_NAVIGATION_PATH.ADMIN_BLOG}>Blog</Breadcrumb.Item>
                        <Breadcrumb.Item active>{params.id ? 'Edit' : 'Create'} Blog</Breadcrumb.Item>

                    </Breadcrumb>
                    <div className="guest-header">
                        <div className="guest-left">
                            <h1>{params.id ? 'Edit' : 'Create'} Blog</h1>
                        </div>
                        <div className="guest-right">
                            {
                                params.id ?
                                    <button className="btn-delete" onClick={() => openDeleteModel()}>Delete Blog</button>
                                    :
                                    <button className="btn-delete" onClick={navigateToList}>Cancel</button>
                            }
                            <button className="btn-primary" onClick={submitForm}>{params.id ? 'Save' : 'Create'} Blog</button>
                        </div>
                    </div>

                </div>
                {loader ? (
                    <div className="spinner-wrapper"><Spinner /></div>
                ) : (
                    <div className="guest-general-information scrollbar">
                        <div className="info-wrapper info-wrapper-multiple">
                            <div className="infoleft">
                                <h2>{params.id ? 'Edit Details' : 'Create Details'}</h2>
                            </div>
                            
                            <div className="info-right">
                                <Form
                                    initialValues={initData}
                                    onSubmit={onSubmit}
                                    validate={validateForm}
                                    render={({ handleSubmit, values, errors, submitFailed }) => {
                                        
                                        // Store the handleSubmit function in the ref so it can be called later
                                        handleSubmitRef.current = handleSubmit;
                                        return (
                                            <form onSubmit={handleSubmit}>
                                                <div className="row">
                                                    <div className="col-12 col-md-12">
                                                        <FormControl
                                                            label="Title"
                                                            name="title"
                                                            type="Name"
                                                        />

                                                    </div>
                                                    <div className="col-12 col-md-12">
                                                        <FormControl
                                                            label=" URL Slug"
                                                            name="slug"
                                                            type="Name"
                                                            disabled={true}
                                                            placeholder="Leave blank to auto generate"
                                                        />
                                                    </div>
                                                    <div className="col-12 editor-common">
                                                        <label className="form-label">Post Content</label>
                                                        <Editor value={about} onTextChange={(e) => setDescription(e.htmlValue)} style={{ height: '320px' }} />
                                                        {submitFailed && errors?.about && <span className="error">{errors.about}</span>}
                                                    </div>

                                                    <div className="col-12 textareafield">
                                                        <FormControl
                                                            label="Excerpt"
                                                            name="excerpt"
                                                            type="textarea"
                                                        />
                                                    </div>

                                                    <div className="col-12 col-md-12 custom-select-form">
                                                        <SearchSelectWithForm
                                                            label="Post Status"
                                                            name="blogStatus"
                                                            options={BlogStatus}
                                                        />
                                                    </div>

                                                    <div className="col-12 col-md-12">
                                                        <FormControl
                                                            label="Meta Title"
                                                            name="metaTitle"
                                                            type="text"

                                                        />
                                                    </div>

                                                    <div className="col-12 col-md-12">
                                                        <FormControl
                                                            label="Meta Description"
                                                            name="metaDescription"
                                                            type="text"
                                                        />
                                                    </div>

                                                
                                                    <div className="col-12 col-md-12">
                                                        <FormControl
                                                            label="Meta Keyword"
                                                            name="metaKeyword"
                                                            type="Name"
                                                        />
                                                    </div>
                                                    <div className="col-12 col-md-12 custom-select-form">
                                                        <SearchSelectWithForm
                                                            label=" Comment Status"
                                                            name="commentStatus"
                                                            options={BlogCommentStatus}
                                                        />
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
                featuretteHeading && deleteModal ? (
                    <DeleteBlogModel
                        show={deleteModal}
                        handleClose={() => setDeleteModal(false)}
                        featuretteId={featuretteId}
                        featuretteHeading={featuretteHeading}
                        updateListItem={updateListItem}
                    />
                )
                    :
                    null
            }
        </>
    );
};

export default CreateEditBlog;