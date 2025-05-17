import React, { useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { toast } from 'react-toastify';
import Button from "react-bootstrap/Button";
import { getInquires, updateStatus } from "../../api/admin/ownerInquiry";
import { OWNER_INQUIRY_STATUS, OWNER_INQUIRY_TYPE } from "../../constants";
import { Form } from "react-final-form";
import { AuthType } from "../../types/User";
import Form2 from 'react-bootstrap/Form';
import { composeValidators, required, validEmail } from "../../validations";
import { FormControl } from "../../components/FormElements/FormControl";
import PasswordField from "../../components/FormElements/PasswordField";
import { CheckboxControl } from "../../components/FormElements/CheckboxControl";

import SearchBar from "../../components/SearchBar";
import { useSearchParams } from "react-router-dom";
import Spinner from "../../components/Spinner";
import approveICon from "../../assets/images/approve.svg";
import inquiryIcon from "../../assets/images/inquiry-icon.svg";
import deleteIcon2 from "../../assets/images/trash.svg";
import proImg from "../../assets/images/slider-image.png";
import proInfo from "../../assets/images/Info.svg";
import deleteIcon from "../../assets/images/remove-red-icon.svg";
import rejectIcon from "../../assets/images/close-icon-red.svg";
import editIcon from "../../assets/images/edit-icon.svg";
import tuserIcon from "../../assets/images/t-user-icon.svg";
import buildingIcon from "../../assets/images/building.svg";
import greenIcon from "../../assets/images/green-tick.svg";
import crossIcon from "../../assets/images/crossx.svg";
import plusIcon from "../../assets/images/Plus.svg";
import userIconImg from "../../assets/images/the-way-banner.jpg";
import plusGreen from "../../assets/images/plus-green.svg";
import sortIcon from "../../assets/images/Sort.svg";
import filterIcon from "../../assets/images/filter-icon.svg";
import displayIcon from "../../assets/images/display.svg";
import SortAscending from "../../assets/images/SortAscending.svg";
import SortDscending from "../../assets/images/SortDscending.svg";
import checkgrey from "../../assets/images/checkgrey.svg";
import closeIcon from "../../assets/images/close.svg";
import plusWhite from "../../assets/images/plus-white.svg";
import threedots from "../../assets/images/dotsthree.svg";
import emailIcon from "../../assets/images/email-icon.svg";
import monitorIcon from "../../assets/images/monitor-arrow-up.svg";
import buildingIcon2 from "../../assets/images/view-building.svg";




import { AxiosError } from "axios";
import Breadcrumb from 'react-bootstrap/Breadcrumb';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Table from 'react-bootstrap/Table';
const INTIAL_OFFSET = 10;

interface OwnerInquiry {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  address: {
    addressLine1: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  unitSize: number;
  unitBedrooms: string;
  unitBathrooms: string;
  homePhoneNo?: string;
  workPhoneNo?: string;
  mobile: string;
  propertyAvailableFrom: string;
  askUsAnything?: string;
  minimumReservationTerm: number;
  createdBy: string | null;
  updatedBy: string | null;
  status: number;
  createdAt: null | string;
  updatedAt: null | string;
}

interface ApiResponse {
  data: {
    ownerInquiries: OwnerInquiry[];
    totalOwnerInquiriesCount: number;
  };
  error: string | null;
  message: string;
}

const OwnerInquiryItem: React.FC = () => {
  const [rowData, setRowData] = useState<OwnerInquiry[]>([]);
  const [totalRows, setTotalRows] = useState<number>(0);
  const [paginationPageSize, setPaginationPageSize] =
    useState<number>(INTIAL_OFFSET);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string | null>("");
  const [loader, setLoader] = useState(false);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    if (searchParams.get("query") !== searchQuery) {
      setPageNumber(1);
      setSearchQuery(searchParams.get("query"));
    }
  }, [searchParams]);

  useEffect(() => {
    fetchData(pageNumber);
  }, [pageNumber, searchQuery]);

  const fetchData = async (page: number) => {
    setLoader(true);
    try {
      getInquires({
        count: paginationPageSize,
        page,
        status: OWNER_INQUIRY_TYPE.ALL,
        search: searchQuery,
      }).then((res) => {
        setRowData(res.data);
        setTotalRows(res.count);
        setLoader(false);
      });
    } catch (error) {
      setLoader(false);
      console.error("Error fetching data:", error);
    }
  };

  const gridOptions = {
    pagination: true,
    paginationPageSize: paginationPageSize,
  };

  const onPageSizeChanged = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setPaginationPageSize(parseInt(event.target.value, INTIAL_OFFSET));
  };

  const onPaginationChanged = (event: any) => {
    if (
      event.newPage &&
      event.api.paginationGetCurrentPage() + 1 !== pageNumber
    ) {
      setPageNumber(+event.api.paginationGetCurrentPage() + 1);
    }
  };

  const updateOiStatus = (status: number, id: string) => {
    setLoader(true);
    updateStatus({
      ownerInquiryId: id,
      approvalType: OWNER_INQUIRY_STATUS[status],
    })
      .then((res) => {
        toast.success(`Inquiry has been ${OWNER_INQUIRY_STATUS[status]}ed.`)
        setLoader(false);
        fetchData(pageNumber);
      })
      .catch((error: AxiosError<{ message: string; status: number }>) => {
        setLoader(false);
        toast.error(error.response?.data?.message as string);
      });
  };
  const onSubmit = (values: AuthType) => {
    delete values?.isRemember;
    const data = { ...values };

  };

  return (
    <>
      <div className="admin-owner-inquiry">
        {loader && <Spinner />}
        <div style={{ width: "99%", height: "550px" }} className="mx-2">
          <SearchBar placeHolder="Search" />
          <div className="ag-theme-alpine" style={{ height: "100%" }}>
            <AgGridReact
              rowData={rowData}
              gridOptions={gridOptions}
              pagination={true}
              paginationPageSize={paginationPageSize}
              onPaginationChanged={onPaginationChanged}
              columnDefs={[
                {
                  headerName: "Name",
                  width: 120,
                  valueFormatter: (col) => `${col.data?.firstName} ${col.data?.lastName}`,
                },
                { field: "email", width: 120 },
                {
                  headerName: "Address",
                  children: [
                    {
                      headerName: "Street",
                      field: "address",
                      width: 120,
                      valueFormatter: (col) => col.value.addressLine1,
                    },
                    {
                      headerName: "City",
                      field: "address",
                      width: 120,
                      valueFormatter: (col) => col.value.city,
                    },
                    {
                      headerName: "Country",
                      field: "address",
                      width: 140,
                      valueFormatter: (col) => col.value.country,
                    },
                  ],
                },
                {
                  headerName: "Unit Size",
                  field: "unitSize",
                  width: 150,
                  valueFormatter: (col) => col.value + " sqft",
                },
                { headerName: "#Beds", field: "unitBedrooms", width: 120 },
                { headerName: "#Baths", field: "unitBathrooms", width: 120 },
                {
                  headerName: "Actions",
                  width: 180,
                  autoHeight: true,
                  field: "status",
                  cellRenderer: (value: any) => {
                    return (
                      <div className="d-flex flex-wrap gap-2 justify-content-between inquiry-action-btn">
                        {value.value === OWNER_INQUIRY_TYPE.PENDING ? (
                          <Button
                            onClick={() =>
                              updateOiStatus(
                                OWNER_INQUIRY_TYPE.ACTIVE,
                                value.data._id
                              )
                            }
                            className="btn primary approve"
                            variant="link"
                          >
                            <img
                              className="_icons"
                              src={approveICon}
                              alt="Approve"
                            ></img>
                            Approve
                          </Button>
                        ) : null}
                        {value.value === OWNER_INQUIRY_TYPE.PENDING ? (
                          <Button
                            onClick={() =>
                              updateOiStatus(
                                OWNER_INQUIRY_TYPE.REJECTED,
                                value.data._id
                              )
                            }
                            className="btn primary rejected"
                            variant="link"
                          >
                            <img
                              className="_icons"
                              src={rejectIcon}
                              alt="Reject"
                            ></img>
                            Reject
                          </Button>
                        ) : null}
                        {/* <Button
                        onClick={() => console.log("Button 2 clicked")}
                        className="btn primary edit"
                        variant="link"
                      >
                        <img className="_icons" src={editIcon} alt="Edit"></img>
                        Edit
                      </Button>
                      <Button
                        onClick={() =>
                          updateOiStatus(
                            OWNER_INQUIRY_TYPE.DELETED,
                            value.data._id
                          )
                        }
                        className="btn primary delete"
                        variant="link"
                      >
                        <img
                          className="_icons"
                          src={deleteIcon}
                          alt="Delete"
                        ></img>
                        Delete
                      </Button> */}
                        -
                      </div>
                    );
                  },
                },
              ]}
            ></AgGridReact>
          </div>
        </div>
      </div>
    </>
  );
};

export default OwnerInquiryItem;
