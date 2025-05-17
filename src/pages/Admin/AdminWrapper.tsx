import { useEffect, useState, useMemo } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { lockUnlockLease } from "../../api/admin/lease";
import { Breadcrumb, SideBar } from "../../components";
import { HUB_ID } from "../../constants";
import { RENTER_MENUS } from "../../constants/menu";
import { useAuth } from "../../hooks/useAuth";
import { ROUTE_NAVIGATION_PATH } from "../../routes/routes";
import Chat from "../Header/Chat";

export default function AdminWrapper() {
  const auth = useAuth();
  const [isScriptLoaded, setIsScriptLoaded] = useState(false); // Track if script is loaded
  const location = useLocation();
  localStorage.setItem("isDashboard", "2");
  
  const activeRoutes = useMemo(() => {
    return RENTER_MENUS.map((menu) => menu.activeOn).flat();
  }, []);

  useEffect(() => {
      const id = document.getElementById("hubspot-messages-iframe-container");
      if(id) {
        id.setAttribute("style", "display: none !important; visibility: hidden !important;");
      }
  }, [])


  useEffect(() => {
    window.scrollTo(0, 0);
    // Remove existing script if present
   

    if(location.pathname.split("/").slice(0, 3).join("/") != ROUTE_NAVIGATION_PATH.EDIT_LEASING && location.pathname.split("/").slice(0, 3).join("/") != ROUTE_NAVIGATION_PATH.LEASE_INVOICE_DETAIL) {
      if(localStorage.getItem("leaseId")) {
        let locked = localStorage.getItem("isLocked");
        if(locked == 'false') {
          lockUnlockLease(localStorage.getItem("leaseId"), locked == 'false' ? true : false).then((res: any) => {
            //
          })
        }
       
        localStorage.removeItem("isLocked");
        localStorage.removeItem("leaseId");
      }
     
    }

    if (localStorage.getItem("impersonateToken")) {
      if (
        !(
          activeRoutes.includes(location.pathname.split("/").slice(0, 3).join("/")) ||
          activeRoutes.includes(location.pathname.split("/").slice(0, 4).join("/")) ||
          activeRoutes.includes(location.pathname)
        )
      ) {
        localStorage.removeItem("impersonateToken");
        localStorage.removeItem("paymentUser");
      }
    }
  }, [location.pathname, activeRoutes]);

  if (!auth?.user) {
    return <Navigate to={ROUTE_NAVIGATION_PATH.HOME} state={{ from: location }} replace />;
  }

  return (
    <section className="main-container">
      <SideBar isAdmin={true} key={location.pathname} /> 

      <div className="right-container">
        <Outlet />
      </div>
      {/* <Chat /> */}
    </section>

  );
}
