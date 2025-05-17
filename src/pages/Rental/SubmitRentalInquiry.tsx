import Header from "../Header";
import { toast } from "react-toastify";
import iconOwner from "../../assets/images/owner-green-icon.svg";
import { Breadcrumb } from "../../components";
import AddEditRentalInq from "../../components/Rental/AddEditRentalInq";
import { useLocation, useNavigate } from "react-router-dom";
import { ROUTE_NAVIGATION_PATH } from "../../routes/routes";
import { useCustomMutation } from "../../hooks/useApi";
import {
  addRentalInquiry,
  submitRentalInquiry,
} from "../../api/rental/rentalInquiry";
import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";

export function SubmitRentalInquiry() {
  const location = useLocation();
  const [isLogin, setIsLogin] = useState(false);
  const auth = useAuth();

  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [])

  const { mutate } = useCustomMutation({
    mutationFn: auth.user ? addRentalInquiry : submitRentalInquiry,
    onSuccess: (res: { data: string }) => {
      const successData = isLogin
        ? {
            message:
              "Rental Inquiry has been sent. Please log in to see inquiry results.",
            url: ROUTE_NAVIGATION_PATH.SIGN_IN,
          }
        : {
            message: "Rental Inquiry has been sent.",
            url: `${ROUTE_NAVIGATION_PATH.MATCHING_PROPERTY}/${res.data}`,
          };
      toast.success(successData.message);
      navigate(successData.url);
    },
  });

  const submitData = (data: any, isLogin?: boolean) => {
    setIsLogin(isLogin as boolean);
    mutate(data);
  };

  return (
    <div
      className={`${
        location.pathname === ROUTE_NAVIGATION_PATH.RENTAL_INQUIRY
          ? ""
          : "right-container"
      }`}
    >
      <Header mainClass="with-btn" isNavButton={false} />
      <main className="main-content">
        <Breadcrumb
          icon={iconOwner}
          heading="Rental Inquiry"
          description="Start here to find your fully furnished property for 30 days or longer. Our system will provide you with the closest matching properties at the end of the inquiry. One of our local Attache experts will look through the inventory to see if they have any personal recommendations that may work for your stay. Fewer than half the fields are required to complete, however, the more details you provide the better match we can make for you!"
        />
        <div className="owner-inquery-wrapper">
          <AddEditRentalInq
            submitData={submitData}
            data={{
              firstName: auth.user?.firstName,
              lastName: auth.user?.lastName,
              email: auth.user?.email,
              mobile: auth.user?.mobile,
            }}
          />
        </div>
      </main>
    </div>
    
  );
}
