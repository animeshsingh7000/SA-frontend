import { useEffect, useState } from "react";
import { ROUTE_NAVIGATION_PATH } from "../../../routes/routes";
import { useNavigate } from "react-router-dom";
import Breadcrumb from 'react-bootstrap/Breadcrumb';
import Table from 'react-bootstrap/Table';
import SearchBar from "../../../components/SearchBar";
import "ag-grid-community/styles/ag-grid.css";
import { getRecuuringRate } from "../../../api/admin/opeartions";
import { NoData } from "../../../components";
import { Spinner } from "react-bootstrap";
const INTIAL_OFFSET = 10;

export default function RecurringRateList() {
    const [rowData, setRowData] = useState<any[]>([]);
    const [loader, setLoader] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchData();
    },[]);

    function editRate(id: any) {
        navigate(ROUTE_NAVIGATION_PATH.EDIT_RECURRING_RATE + '/' + id);
    }

    const fetchData = async () => {
        setLoader(true);
        try {
            getRecuuringRate().then((res) => {
                setRowData(res.data);
                setLoader(false);
            });
        } catch (error) {
            setLoader(false);
            console.error("Error fetching data:", error);
        }
    };



    return (
        <>
            <div className="common-right-panel-section">
                <div className="top-right-bar _bdr-none">
                    <Breadcrumb>
                        <Breadcrumb.Item href="#">Operations Manager</Breadcrumb.Item>
                        <Breadcrumb.Item active>Recurring Cleaning Rates</Breadcrumb.Item>
                    </Breadcrumb>
                    <div className="heading">
                        <div className="guest-left">
                            <h1>Recurring Cleaning Rates</h1>
                        </div>
                    </div>

                </div>
                <div className="mid-content-section pt-0">
                    {/* <div className="table-action-content">
                        <div className="_search-bar">
                            <SearchBar placeHolder="Search" />
                        </div>
                    </div> */}

                    <div className="table-section-common _owner-inquiry-table">
                        <Table responsive className="">
                            <thead>
                                <tr>
                                    <th>
                                        <div className="th-data">Property Size</div>
                                    </th>
                                    <th>
                                        <div className="th-data">Weekly</div>
                                    </th>
                                    <th>
                                        <div className="th-data">Bi-weekly</div>
                                    </th>
                                    <th>
                                        <div className="th-data">Three weeks</div>
                                    </th>
                                    <th>
                                        <div className="th-data">Monthly</div>
                                    </th>
                                    <th>
                                        <div className="th-data">One time</div>
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
                                                        <tr key={data._id}>
                                                            <td>
                                                                <div className="t-user" onClick={() => editRate(data._id)}>
                                                                    <div className="t-user-info">{data.propertySize ? data.propertySize : 'NA'}</div>
                                                                </div>
                                                            </td>

                                                            <td>
                                                                {data.weekly ? '$' +data.weekly : 'NA'}
                                                            </td>
                                                            <td>
                                                                {data.biWeekly ? '$' +data.biWeekly : 'NA'}
                                                            </td>
                                                            <td>
                                                                {data.threeWeeks ? '$' +data.threeWeeks : 'NA'}
                                                            </td>
                                                            <td> {data.monthly ? '$' +data.monthly : 'NA'}</td>
                                                            <td>{data.oneTime ? '$' +data.oneTime : 'NA'}</td>
                                                            
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
        </>
    );
}
