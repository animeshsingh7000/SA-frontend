import { useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { ROUTE_NAVIGATION_PATH } from "../routes/routes";

export default function Main() {
  let auth = useAuth();
  let location = useLocation();

  if (location.pathname === "/") {
    if (!auth.user) {
      return (
        <Navigate
          to={ROUTE_NAVIGATION_PATH.HOME}
          state={{ from: location }}
          replace
        />
      );
    }
  }
  return <Outlet />;
}
