import { Link, useParams, useSearchParams } from "react-router-dom";
import { toast } from 'react-toastify';
import logo from "../../assets/images/svg/attache-logo.svg";
import { useCustomMutation } from "../../hooks/useApi";
import { invoicePay } from "../../api/rental/rentalInquiry";
import { useEffect } from "react";
import moment from "moment";
import { ROUTE_NAVIGATION_PATH } from "../../routes/routes";
import { paymentSummary } from "../../api/admin/lease";

export default function PaymentInfo() {
  const [searchParams] = useSearchParams();
  const paymentStatus = searchParams.get("status");

  const mutation = useCustomMutation({
    mutationFn: invoicePay,
    onSuccess: () => {
      localStorage.removeItem("hmac");
      localStorage.removeItem("ipnCustom");
      localStorage.removeItem("propertyId");
      localStorage.removeItem("amount");
      localStorage.removeItem("impersonatedBy")
      localStorage.removeItem("residentId")
      toast.success('Payment done!!')
    },
  });

  const onSubmit = () => {
    const data = {
        residentId: searchParams.get("resident_id"), 
        propertyId: searchParams.get("property_id"),
        ipnCustom: searchParams.get("ipn_custom") ? searchParams.get("ipn_custom") : localStorage.getItem("ipnCustom"),
        transactionId: searchParams.get("transaction_id"),
        totalAmount: searchParams.get("total_amount"),
        transactionType: searchParams.get("transaction_type"),
        transactionDate: searchParams.get("transaction_date") ? searchParams.get("transaction_date") : moment().format("YYYY-MM-DD HH:mm:ss"),
        status: searchParams.get("status"),
        unitAmount: searchParams.get("unit_amount"),
        ccType: searchParams.get("cc_type"),
        impersonatedBy: localStorage.getItem("impersonateToken") ? localStorage.getItem("impersonatedBy") : null,
        hmac: localStorage.getItem("hmac"),
        feeAmount: searchParams.get("fee_amount"),
        lastFour: searchParams.get("last_four"),
    }

    const postFields =  { ...data };

    const payload = {
      ...data,
      postFields: JSON.stringify(postFields)
    }
    mutation.mutate(payload);
  };

  useEffect(() => {
    if(searchParams.get("transaction_id")) {
      onSubmit();
    }
  }, [])

  return (
    <main className="main-content login-pages-container">
      <div className="login-pages-wrapper payment_failed_page">
        {/* <div className="login-banner">
          <div className="login-banner-welcome-card">
            <h1>
              <span>Stay Attache</span>
            </h1>
            <p className="welcome-caption">
              Just bring your luggage and a laptop. All properties are
              fully-furnished and include all utilities, internet and cable.
            </p>
          </div>
        </div> */}

        <div className="login-page-form-wrapper forgot-password-wrapper justify-content-between">
          <div className="form-wrapper">
            <div className="logo">
              <a href="/">
                <img alt="stayattache" className="img-responsive" src={logo} />
              </a>
            </div>
                <span className={`d-block caption ${paymentStatus && paymentStatus.toString().toLowerCase() == 'success' ? 'caption-success' : 'caption'}`}>
                    Your Payment is {paymentStatus ? paymentStatus : 'FAILED'}
                </span>
            </div>
          <div className="backtohome">
              <Link
                to={ROUTE_NAVIGATION_PATH.RENTAL_LEASE}
                className="back-to-login"
              >
                Back
              </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
