import { useState } from "react";
import { Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { ROUTE_NAVIGATION_PATH, ROUTE_PATH } from "../../routes/routes";
import { formatDate, textToNumber } from "../../utils/common";
import InformationModel from "../Modal/InformationModel";

export default function InquiryDetailBox({
  inquiryData,
  isGuestDashboard,
}: {
  inquiryData: any;
  isGuestDashboard?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const navigate = useNavigate();

  const toggleDropdown = () => {
      setIsOpen(!isOpen);
  };

  const updateListItem = () => {
     navigate(`${ROUTE_NAVIGATION_PATH.RENTAL_INQUIRY_EDIT}/${inquiryData._id}`);
  }
  
  return (
    <>
      <div id="myHeader">
        <div className="inquiry-details-box">
          <div id="message-row"></div>
          <div
            className={`d-flex justify-content-between align-items-center ${isGuestDashboard ? "" : "mb-3"
              }`}
          >
            <h6 className="inquiry-details-box-head">Your Inquiry Details :</h6>
            {isGuestDashboard ? null : (
              <Button
                // to={`${ROUTE_NAVIGATION_PATH.RENTAL_INQUIRY_EDIT}/${inquiryData._id}`}
                className="edit-rental-link"
                onClick={() => setEditDialogOpen(true)}
              >
                Edit Inquiry
              </Button>
            )}
          </div>
          <div className="inquiry-details-box-row d-flex">
            <div className="inquiry-details-box-col flex-fill">
              <p className="inquiry-details-box-label">Start Date</p>
              <p className="inquiry-details-box-data">
                {formatDate(inquiryData?.estimatedArrivalDate)}
              </p>
            </div>
            <div className="inquiry-details-box-col flex-fill">
              <p className="inquiry-details-box-label">End Date</p>
              <p className="inquiry-details-box-data">
                {formatDate(inquiryData?.estimatedDepartureDate)}
              </p>
            </div>
            <div className="inquiry-details-box-col flex-fill">
              <p className="inquiry-details-box-label">Bedrooms</p>
              <p className="inquiry-details-box-data">
                {textToNumber(inquiryData.minimumNumberOfBeds)}
              </p>
            </div>
            <div className="inquiry-details-box-col flex-fill">
              <p className="inquiry-details-box-label">Bathrooms</p>
              <p className="inquiry-details-box-data">
                {textToNumber(inquiryData.minimumNumberOfBathrooms)}
              </p>
            </div>
            <div className="inquiry-details-box-col flex-fill">
              <p className="inquiry-details-box-label">Pets</p>
              <p className="inquiry-details-box-data">
                {inquiryData.isPetAllowed ? "Yes" : "No"}
              </p>
            </div>
            <div className="inquiry-details-box-col flex-fill">
              <p className="inquiry-details-box-label">Parking</p>
              <p className="inquiry-details-box-data">
                {inquiryData.isParking ? "Yes" : "No"}
              </p>
            </div>
            <div className="inquiry-details-box-col flex-fill">
              <p className="inquiry-details-box-label">Budget</p>
              <p className="inquiry-details-box-data">
                {inquiryData.maxMonthlyBudget}
              </p>
            </div>
            <div className="inquiry-details-box-col flex-fill">
              <p className="inquiry-details-box-label">Neighborhood</p>
              <p className="inquiry-details-box-data">
                {inquiryData.neighborhoodNames?.length
                  ? inquiryData.neighborhoodNames[0]
                  : "-" } 
                  {
                    inquiryData.neighborhoodNames?.length > 1 ?
                    <span className="dropdown custom-dropdown-menu inquiry-details-box-dropdown" onClick={toggleDropdown}>
                      <a href="javascript:void(0)"  id="dropdownMenu2" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                        <span className="inquiry-details-box-count">+{inquiryData.neighborhood?.length-1}</span>
                      </a>
                      {isOpen && (
                      <span className="dropdown-menu scrollbar" aria-labelledby="dropdownMenu2">
                        {inquiryData.neighborhoodNames.slice(1).map((item:any, index:any) => (
                          <a className="dropdown-item" key={index}>{item}</a> // Renders "second", "third", "fourth"
                        ))}
                      </span>
                      )}
                    </span>
                    :
                    null
                  }
                
              </p>
            </div>
          </div>
        </div>
      </div>

      {
        editDialogOpen && (
          <InformationModel
              show={editDialogOpen}
              handleClose={() => setEditDialogOpen(false)}
              updateListItem={updateListItem}
            />
        )
      }
    </>
  );
}
