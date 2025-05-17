import ownerIcon from "../../assets/images/owner-icon.svg";
import greenRentalIcon from "../../assets/images/svg/green-rental-icon.svg";
import searchWhiteIcon from "../../assets/images/svg/search-white-icon.svg";
import ownerWhiteIcon from "../../assets/images/svg/owner-white-icon.svg";
import locationIncon from "../../assets/images/svg/location.svg";
import locationWhiteIcon from "../../assets/images/svg/location-white.svg";
import { Link } from "react-router-dom";
import { ROUTE_NAVIGATION_PATH } from "../../routes/routes";

export default function InquirySection() {
  return (
    <>
      <section className="home-widget home-widget-update">
        <div className="home-widget-item">
          <div className="home-searchForm rental-inquiry-updated">
            <strong>
              <img src={greenRentalIcon} alt="Rental Inquiry Icon" />
              <span className="subheading-title">Rental Inquiry</span>
            </strong>
            <p>
              I would like Attache's team of locals to send me some awesome
              furnished properties.
            </p>
            <div className="form-group-btn">
              <Link
                to={ROUTE_NAVIGATION_PATH.RENTAL_INQUIRY}
                title="Submit a rental inquiry."
                className="btn primary"
              >
                Inquire Now
              </Link>
            </div>
          </div>
        </div>
        <div className="home-widget-item">
          <Link to={ROUTE_NAVIGATION_PATH.BROWSE} className="home-widget-item">
            <div className="home-widget-content">
              <h4>
                <img className="icon-white" src={searchWhiteIcon} alt="search"/>
                <span className="subheading-title">Browse Properties</span>
              </h4>
              <p className="desc">
                We offer the finest corporate housing and furnished apartments
                in Washington DC
              </p>
              <div>
                <em className="icons icon-next"></em>
              </div>
            </div>
          </Link>
        </div>
        <div className="home-widget-item">
          <Link to={ROUTE_NAVIGATION_PATH.OWNER_SERVICES} className="home-widget-item">
            <div className="home-widget-content">
              <h4>
                <img className="icon-default" src={ownerIcon} alt="owner" />
                <img
                  className="icon-white"
                  src={ownerWhiteIcon}
                  alt="owner white"
                />
                <span className="subheading-title">Owner Inquiry </span>
              </h4>
              <p className="desc">
                I would like Attache's team of locals to send me information
                about adding my property to this awesome website.
              </p>
              <div>
                <em className="icons icon-next"></em>
              </div>
            </div>
          </Link>
        </div>
        <Link to={ROUTE_NAVIGATION_PATH.BROWSE_MAP} className="home-widget-item">
          <div className="home-widget-content">
            <h4>
              <img
                className="icon-default"
                src={locationIncon}
                alt="location"
              />
              <img
                className="icon-white"
                src={locationWhiteIcon}
                alt="location white"
              />
              <span className="subheading-title">Browse All Map</span>
            </h4>
            <p className="desc">
              Check out all our properties in Washington DC
            </p>
            <div>
              <em className="icons icon-next"></em>
            </div>
          </div>
        </Link>
      </section>
    </>
  );
}
