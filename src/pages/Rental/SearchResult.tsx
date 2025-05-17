import { useEffect, useState } from "react";
import MatchingProperty from "../../components/Rental/MatchingProperty";
import {
  getRentalInquiryForLoggedInuser,
} from "../../api/rental/rentalInquiry";
import { RentalPropertyProvider } from "../../contexts/RentalPropertyProvider";

export default function SearchResult() {
  const [inquiryData, setInquiryData] = useState({});

  useEffect(() => {
    getRentalInquiryForLoggedInuser().then((res: any) => {
      setInquiryData(res.data);
    });
  }, []);
  return (
    <RentalPropertyProvider>
      <div className="right-container">
        <MatchingProperty
          guestPortalClasses="change-right-container"
          inquiryData={inquiryData}
        />
      </div>
    </RentalPropertyProvider>
  );
}
