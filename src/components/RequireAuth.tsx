import { useEffect } from "react";
import { Navigate, useLocation, Outlet } from "react-router-dom";
import { SideBar } from ".";
import { RENTER_MENUS } from "../constants/menu";
import { useAuth } from "../hooks/useAuth";
import { ROUTE_NAVIGATION_PATH } from "../routes/routes";

export default function RequireAuth() {
  let { user } = useAuth();
  let location = useLocation();
  const activeRoutes = RENTER_MENUS.map((menu:any) => menu.activeOn).flat();

  if (!user) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.
    return (
      <Navigate
        to={ROUTE_NAVIGATION_PATH.HOME}
        state={{ from: location }}
        replace
      />
    );
    
  }

  if(localStorage.getItem("isDashboard") == '0' || localStorage.getItem("isDashboard") == '2') {
    if(!(activeRoutes.includes(location.pathname.split("/").slice(0, 3).join("/"))
      || activeRoutes.includes(location.pathname.split("/").slice(0, 4).join("/"))
      || activeRoutes.includes(location.pathname))) {
        localStorage.removeItem("impersonateToken")
        localStorage.removeItem("paymentUser")
      }
  }

  return (
    <>
      {/* <Header /> */}
      <section className="main-container">
        {
          !(location.pathname === ROUTE_NAVIGATION_PATH.ADD_PROPERTY || window.location.pathname.startsWith(ROUTE_NAVIGATION_PATH.EDIT_PROPERTY) || window.location.pathname.startsWith(ROUTE_NAVIGATION_PATH.PAYMENT_SUCCESS))
          ?
          <SideBar />
          :
          null
        }
        <Outlet />
      </section>
      {
        !(location.pathname === ROUTE_NAVIGATION_PATH.ADD_PROPERTY || location.pathname === ROUTE_NAVIGATION_PATH.EDIT_PROPERTY)
        ?
        <footer className="main-footer pl-200">
          <div className="container">
            © 2024 Stay Attache. All rights reserved.
          </div>
        </footer>
        :
        null
      }
      
    </>
  );
}
