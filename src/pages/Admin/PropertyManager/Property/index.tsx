import Breadcrumb from 'react-bootstrap/Breadcrumb';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { useEffect, useState } from 'react';
import AllProperty from './AllProperty';
import ActiveProperty from './ActiveProperty';
import AvailableProperty from './AvailableProperty';
import OnLeaseProperty from './OnLeaseProperty';
import { useNavigate } from 'react-router-dom';
const INTIAL_OFFSET = 10;
type SortType = Record<string, 1 | -1>;


export default function PropertyList() {
    const editActiveType= new URLSearchParams(document.location.search).get('activeTab');
    const editType= new URLSearchParams(document.location.search).get('type');
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState(editType ? Number(editType) : 1);
    const [activeKey, setActiveKey] = useState(editActiveType ? editActiveType : 'currentActive');


    const handleSelect = (key:any) => {
        setActiveKey(key); // Set the active tab
        let typeOfuser = key === 'allProperties' ? 0 : (key === 'currentActive' ? 1 : (key === 'available' ? 2 : 3));
        setActiveTab(typeOfuser);
        clearParams();

    };

    

    const clearParams = () => {
        // Navigate to the current pathname without parameters
        navigate(window.location.pathname, { replace: true });
    };


     return (
        <>
            {/* User Property page  */}
            <div className="common-right-panel-section">
                <div className="top-right-bar">
                    <Breadcrumb>
                        <Breadcrumb.Item href="#">Property Manager</Breadcrumb.Item>
                        <Breadcrumb.Item href="#">Property</Breadcrumb.Item>
                        <Breadcrumb.Item active>{activeTab === 1 ? 'Listed' : (activeTab === 0 ? 'All Properties' : activeTab === 2 ? 'Available' : 'Rented') }</Breadcrumb.Item>
                    </Breadcrumb>
                    <div className="heading _bottom-tabs-space">
                        <h1>Properties</h1>
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
                        

                        <Tab eventKey="currentActive" title="Listed">
                            {
                                activeTab === 1 && (
                                    <ActiveProperty />
                                )
                            }
                        </Tab>

                        <Tab eventKey="allProperties" title="All Properties">
                            {
                                activeTab === 0 && (
                                    <AllProperty />
                                )
                            }
                           
                        </Tab>

                        <Tab eventKey="available" title="Available">
                            {
                                activeTab === 2 && (
                                    <AvailableProperty />
                                )
                            }
                        </Tab>
                        <Tab eventKey="onLease" title="Rented">
                            {
                                activeTab === 3 && (
                                    <OnLeaseProperty />
                                )
                            }
                        </Tab>
                    </Tabs>
                </div>
            </div>
            {/* User Management page End  */}
        </>
    );
}