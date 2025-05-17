import { Link, useLocation, useNavigate } from "react-router-dom";
import Header from "../Header";
import iconOwner from "../../assets/images/owner-green-icon.svg";
import Footer from "../Footer";
import { ROUTE_NAVIGATION_PATH } from "../../routes/routes";
import { useAuth } from "../../hooks/useAuth";
import { useEffect } from "react";

export default function OwnerServices() {
  const auth = useAuth();
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <>
      <Header mainClass="with-btn" isNavButton={true} />
      <main className="main-content">
        <div className="breadcrumb-module">
          <div className="container">
            <div className="breadcrumb-row align-items-start">
              <div className="breadcrumb-icon">
                <img src={iconOwner} alt="icon blog" />
              </div>
              <div className="breadcrumb-content">
                <h4>The Attache Owner Program</h4>
                <p className="mb-0">
                  The Attache owner program provides great service to our
                  property owners and it's easy to get started. After reviewing
                  our owner services you can inquire about having your property
                  managed by completing a quick owner inquiry
                </p>
                <Link
                  to={auth.user ? "" :ROUTE_NAVIGATION_PATH.OWNER_INQUIRY}
                  title="Owner Inquiry"
                  className={`btn primary owner-inquiry-btn ${auth.user ? 'faded' : ""}`}
                >
                  Owner Inquiry
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="owner-static-wrapper">
          <div className="container">
            <div className="owner-static-content">
              <div className="section-wrap">
                <h5>Marketing</h5>
                <p>
                  We provide all the marketing necessary to attract a qualified
                  guest, including advertising your property locally, regionally
                  and world-wide. Our website is linked to several short-term
                  property websites and search engines.
                </p>
              </div>
              <div className="section-wrap">
                <h5>Showings</h5>
                <p>
                  We take the responsibility for showing your property to
                  prospective guests.
                </p>
              </div>
              <div className="section-wrap">
                <h5>Screening Guests</h5>
                <p>
                  We screen guests thoroughly by ordering credit reports,
                  checking with prior landlords, checking employment and
                  compiling criminal background information.
                </p>
              </div>
              <div className="section-wrap">
                <h5>Lease Agreements</h5>
                <p>
                  We prepare and administer all the necessary paperwork so the
                  guests abide by laws governing the District of Columbia.
                </p>
              </div>
              <div className="section-wrap">
                <h5>Guest Requests</h5>
                <p>
                  We handle all guest requests or concerns, 24 hours a day, 7
                  days a week, including repair and maintenance actions.
                </p>
              </div>
              <div className="section-wrap">
                <h5>Cleaning and Make Ready</h5>
                <p>
                  We quickly prepare vacant properties for occupancy, performing
                  a thorough cleaning and any repairs that may be necessary.
                </p>
              </div>
              <div className="section-wrap">
                <h5>Collection of Rent</h5>
                <p>We collect all income on your behalf, including:</p>
                <ul className="green-bullet-list">
                  <li>Rents ( including complex government per diems )</li>
                  <li>Security Deposits ( when applicable )</li>
                  <li>
                    Pet Fees
                  </li>
                  <li>Taxes ( when applicable )</li>
                </ul>
              </div>
              <div className="section-wrap">
                <h5>Payment of Expenses</h5>
                <p>
                  We maintain a $300 account for each of your properties to
                  handle expenses as needed. The account is replenished when
                  rental payments are made to you.
                </p>
              </div>
              <div className="section-wrap">
                <h5>Accounting</h5>
                <p>
                  We offer complete accounting including 1099s and annual
                  financial reports.
                </p>
              </div>
              <div className="section-wrap">
                <h5>Furnishings</h5>
                <p>
                  As needed, we can provide suggestions on economical and
                  stylish furnishings. We also provide a furnished inventory
                  list to help the owner shop for all the items necessary for a
                  furnished corporate rental.
                </p>
              </div>
              <div className="text-center mt-60">
                <a
                  href="https://stayattache.com/fe/pdf/Attache_Owner_Brochure_2018_v2r1.pdf"
                  target="_top"
                  title="Owner Brochure"
                  className="btn primary"
                >
                  View Owner Brochure
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
