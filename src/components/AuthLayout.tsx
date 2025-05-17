import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import iconGreen from "../assets/images/icon_green_mini.png";
import logo from "../assets/images/svg/attache-logo.svg";
import { useEffect, useState } from "react";
import TermsModal from "./Modal/TermsModal";
import { Navigate } from "react-router-dom";
import { ROUTE_NAVIGATION_PATH } from "../routes/routes";

export default function AuthLayout({
  leftContent,
  rightContent,
}: {
  leftContent: React.ReactNode;
  rightContent: React.ReactNode;
}) {
  const auth = useAuth();
  const [modalVisible, setModalVisible] = useState('');

  const legalLinks = [
    {
      href: "https://www.iubenda.com/privacy-policy/24350646",
      title: "Privacy Policy",
    },
    {
      href: "https://www.iubenda.com/terms-and-conditions/24350646",
      title: "Terms and Conditions",
    },
  ];

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://cdn.iubenda.com/iubenda.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  if (auth.user) {
    return (auth.user.isOwner) ? (
      <Navigate to={ROUTE_NAVIGATION_PATH.OWNER_DASHBOARD} replace />
    ) : (
      <Navigate to={ROUTE_NAVIGATION_PATH.HOME} replace />
    );
  }
  return (
    <>
    <main className="main-content login-pages-container">
      <div className="login-pages-wrapper">
        {leftContent}

        <div className="login-page-form-wrapper justify-content-between">
            <div className="form-wrapper">
              <div className="logo">
                <a href="/">
                  <img alt="stayattache" className="img-responsive" src={logo} />
                </a>
              </div>
            </div>

            {rightContent}
            <footer className="login-fooer">
              <Link
                to="https://www.iubenda.com/terms-and-conditions/24350646"
                className="iubenda-white iubenda-embed"
                title="Terms and Conditions"
              >
                Terms and Conditions
              </Link>
              <span>&</span>
              <Link
                className="privacy"
                to=""
                title="Privacy Policy"
              >
                privacy policy
              </Link>
            </footer>
       </div>
        
      </div>
    </main>
    <TermsModal
     url={modalVisible}
     handleClose={() => setModalVisible('')}
    />
     </>
  );
}
