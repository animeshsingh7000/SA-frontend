import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";
import Breadcrumb from 'react-bootstrap/Breadcrumb';
import arrowDown from "../../../assets/images/down-arrow.png";
import sortIcon from "../../../assets/images/Sort.svg";
import arrowRight from "../../../assets/images/CaretRight.svg";
import placeHolder from "../../../assets/images/placeHolder.png";
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Table from 'react-bootstrap/Table';
import "ag-grid-community/styles/ag-grid.css";
import { BATHROOM_OPTIONS, DEFAULT_OFFSET } from "../../../constants";
import { ROUTE_NAVIGATION_PATH } from "../../../routes/routes";
import { property } from "../../../api";
import RecurringCleaningSchedule from "./RecurringCleaningSchedule";
import DepartureCleaningSchedule from "./DepartureCleaningSchedule";
const INTIAL_OFFSET = 10;

export default function CleaningScheduleList() {
    const [activeTab, setActiveTab] = useState(0);
    const [activeKey, setActiveKey] = useState('RecurringCleaningSchedule');
    const handleSelect = (key:any) => {
        setActiveKey(key); // Set the active tab
        let typeOfuser = (key === 'RecurringCleaningSchedule' ? 0 : 1);
        setActiveTab(typeOfuser);
    };

    return (
        <>

            <div className="common-right-panel-section">
                <div className="top-right-bar">
                    <Breadcrumb>
                        <Breadcrumb.Item href="#">Operations Manager</Breadcrumb.Item>
                        <Breadcrumb.Item href="#">{activeTab === 1 ? 'Recurring Cleaning Schedule' : 'Departure Cleaning Schedule'}</Breadcrumb.Item>
                    </Breadcrumb>
                    <div className="heading _bottom-tabs-space">
                        <div className="guest-left">
                            <h1>Cleaning Schedule</h1>
                        </div>
                    </div>

                </div>
                <div className="mid-content-section">
                    <Tabs
                        activeKey={activeKey}
                        onSelect={handleSelect}
                        id="fill-tab-example"
                        className="mb-3"
                        fill
                    >
                        <Tab eventKey="RecurringCleaningSchedule" title="Recurring Cleaning Schedule">
                            {
                                activeTab === 0 && (
                                    <RecurringCleaningSchedule />
                                )
                            }
                        </Tab>


                        <Tab eventKey="DepartureCleaningSchedule" title="Departure Cleaning Schedule">
                           
                           {
                                activeTab === 1 && (
                                    <DepartureCleaningSchedule />
                                )
                            }
                        </Tab>

                        {/* <Tab eventKey="RecurringDepartureCleaningRates" title="Recurring/Departure Cleaning Rates">
                            <div className="table-section-common _owner-inquiry-table">

                                <Table responsive className="">
                                    <thead>
                                        <tr>

                                            <th><div className="th-data firstchild">Property Size <div className="sort-table"><img src={sortIcon} alt="sort" /></div></div></th>
                                            <th>
                                                <div className="th-data ">Weekly <div className="sort-table"><img src={sortIcon} alt="sort" /></div></div>
                                            </th>
                                            <th>
                                                <div className="th-data">Bi-Weekly

                                                </div>
                                            </th>
                                            <th><div className="th-data">Three Weeks <div className="sort-table"><img src={sortIcon} alt="sort" /></div></div></th>

                                            <th><div className="th-data">Monthly <div className="sort-table"><img src={sortIcon} alt="sort" /></div></div></th>
                                            <th><div className="th-data">One Time <div className="sort-table"><img src={sortIcon} alt="sort" /></div></div></th>

                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>
                                                <div className="t-user">
                                                    <div className="t-user-info">Studio or 1 Bedroom</div>
                                                </div>
                                            </td>
                                            <td>
                                                $710.68
                                            </td>
                                            <td>$710.68</td>
                                            <td>$710.68</td>

                                            <td>
                                                $710.68
                                            </td>
                                            <td>
                                                $710.68
                                            </td>

                                        </tr>
                                        <tr>
                                            <td>
                                                <div className="t-user">
                                                    <div className="t-user-info">Studio or 1 Bedroom</div>
                                                </div>
                                            </td>
                                            <td>
                                                $710.68
                                            </td>
                                            <td>$710.68</td>
                                            <td>$710.68</td>

                                            <td>
                                                $710.68
                                            </td>
                                            <td>
                                                $710.68
                                            </td>

                                        </tr>


                                    </tbody>
                                </Table>
                            </div>
                        </Tab> */}

                    </Tabs>

                    
                </div>

            </div>

        </>
    );
}
