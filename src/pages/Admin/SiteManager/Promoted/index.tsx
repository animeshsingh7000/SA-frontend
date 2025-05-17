import { NoData } from "../../../../components";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTE_NAVIGATION_PATH } from "../../../../routes/routes";
import { Spinner } from "react-bootstrap";
import placeHolder from "../../../../assets/images/ph400x500.png";
import plusWhite from "../../../../assets/images/plus-white.svg";
import Breadcrumb from 'react-bootstrap/Breadcrumb';
import Table from 'react-bootstrap/Table';
import SearchBar from "../../../../components/SearchBar";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { getPromotedPropertyList } from "../../../../api/admin/siteManger";
import { capitalizeFirstWord, formatDate } from "../../../../utils/common";

const INTIAL_OFFSET = 10;
type SortType = Record<string, 1 | -1>;


export default function AdminPromotedListing() {
    const [rowData, setRowData] = useState([]);
    const [loader, setLoader] = useState(true);
    const navigate = useNavigate();

    const fetchData = async () => {
        setLoader(true);
        try {
            getPromotedPropertyList().then((res: any) => {
                setLoader(false);
                setRowData(res.properties);
            });
        } catch (error) {
            setLoader(false);
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        fetchData();
        // Perform any side effects like re-fetching data with the new page number if necessary
    }, []);

    function navigateToEdit(position: any) {
        navigate(ROUTE_NAVIGATION_PATH.EDIT_PROMOTED_PROPERTY + '/' + position);
    }

    function createFeaturette() {
        navigate(ROUTE_NAVIGATION_PATH.CREATE_PROMOTED_PROPERTY);
    }

    return (
        <>
            {/* User Property page  */}
            <div className="common-right-panel-section">
                <div className="top-right-bar">
                    <Breadcrumb>
                        <Breadcrumb.Item href="#">Site Manager</Breadcrumb.Item>
                        <Breadcrumb.Item active>Promoted Properties</Breadcrumb.Item>
                    </Breadcrumb>
                    <div className="heading">
                        <h1>Promoted Properties</h1>
                    </div>

                </div>
                <div className="mid-content-section">
                    <div className="table-action-content ">
                   
                        <button className="btn primary" onClick={createFeaturette}>
                            <img src={plusWhite} alt="Icon" /> New Promoted Properties
                        </button>
                    </div>
                    <div className="table-section-common _owner-inquiry-table">
                        <Table responsive className="">
                            <thead>
                                <tr>
                                    <th>
                                        <div className="th-data firstchild">Property</div>
                                    </th>
                                    <th>
                                        <div className="th-data">Position</div>
                                    </th>
                                    <th>
                                        <div className="th-data">Updated At</div>
                                    </th>
                                </tr>
                            </thead>
                            {
                                loader ?
                                    <div className="spinner-wrapper"><Spinner /></div>
                                    :
                                    <tbody>
                                        {
                                            rowData.length > 0 ?
                                                <>
                                                    {rowData.map((data: any, key: any) => (
                                                        <tr >
                                                            <td>
                                                                <div className="t-user" onClick={() => navigateToEdit(data?.position)}>

                                                                    <div className="t-user-info">{data?.name}</div>
                                                                </div>
                                                            </td>

                                                            <td>{data?.position ? (data?.position) : 'NA'}</td>

                                                            <td>{data.updatedAt ? formatDate(data.updatedAt) : 'NA'}</td>
                                                        </tr>
                                                    ))}
                                                </>
                                                :
                                                <NoData />
                                        }

                                    </tbody>
                            }
                        </Table>
                    </div>
                </div>
            </div>
            {/* User Management page End  */}
        </>
    );
}