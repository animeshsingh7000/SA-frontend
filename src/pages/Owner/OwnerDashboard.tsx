import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { owner, property } from "../../api";
import { FILTER_TYPE } from "../../constants";
import { useAuth } from "../../hooks/useAuth";
import { ROUTE_NAVIGATION_PATH } from "../../routes/routes";
import { Any } from "../../types/global.type";


export default function OwnerDashboad() {
  const [propertyCount, setPropertyCount] = useState<any>(0);
  const [leaseCount, setLeaseCount] = useState<any>(0);

  const auth = useAuth();

  useEffect(() => {
      owner
      .getOwnerDashboard()
      .then((res: any) => {
        setPropertyCount(res.data.totalPropertyCount);
        setLeaseCount(res.data.totalLeasesCount);
      });
    
  }, []);

  return (
    <>
      <div className="right-container">
        <div className="breadcrumb-module breadcrumb-image-module">
          <div className="container">
            <div className="breadcrumb-row">
              <div className="breadcrumb-content">
                <h4>Welcome {auth?.user.firstName}!</h4>
                <p>Manage your properties and services.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="owner-dashboard-container">
          <div className="add-property-btn-wrap text-right">
            <Link to={ROUTE_NAVIGATION_PATH.ADD_PROPERTY}>
              <button className="btn primary plus-on-btn">
                <span className="plus-text">+</span>
                <span className="add-property">Add property</span>
              </button>
            </Link>
          </div>
          <div className="owner-dashboard-items">
            <div className="row">
              <div className="col-xl-4 col-lg-6 col-md-6">
                <Link to={ROUTE_NAVIGATION_PATH.OWNER_PROPERTY+'?toProperty=0'}>
                  <div className="owner-dashboard-card total-properties">
                    <h6>Total Properties</h6>
                    <span className="owner-dashboard-card-count">{propertyCount}</span>
                  </div>
                </Link>
              </div>
              <div className="col-xl-4 col-lg-6 col-md-6">
                <Link to={ROUTE_NAVIGATION_PATH.OWNER_PROPERTY+'?toProperty=1'}>
                  <div className="owner-dashboard-card current-leases">
                    <h6>Current Leases</h6>
                    <span className="owner-dashboard-card-count"> {leaseCount}</span>
                  </div>
                </Link>
              </div>
              <div className="col-xl-4 col-lg-6 col-md-6 d-none">
                <a href="/portal/owner/sr/list">
                  <div className="owner-dashboard-card service-request">
                    <h6>Service Request</h6>
                    <span className="owner-dashboard-card-count">0</span>
                  </div>
                </a>
              </div>

              <div className="col-xl-4 col-lg-6 col-md-6 d-none">
                <a href="/portal/owner/history/quality">
                  <div className="owner-dashboard-card todo-list">
                    <h6>Quality Control List</h6>
                    <span className="owner-dashboard-card-count">0</span>
                  </div>
                </a>
              </div>
              <div className="col-xl-4 col-lg-6 col-md-6 d-none">
                <div className="owner-dashboard-card total-earnings">
                  <h6>Total Earnings</h6>
                  <span className="owner-dashboard-card-count">$0</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
