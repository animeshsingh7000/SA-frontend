import { useEffect, useState } from "react";
import MatchingProperty from "../../components/Rental/MatchingProperty";
import Header from "../Header";
import { getRentalInquiryById } from "../../api/rental/rentalInquiry";
import { useParams } from "react-router-dom";

export default function GuestMatchingProperty() {
  const params = useParams();
  const [inquiryData, setInquiryData] = useState({});

  useEffect(() => {
    if (params.id) {
      getRentalInquiryById(params.id as string).then((res: any) => {
        setInquiryData(res.data);
      });
    }
  }, [params.id]);

  return (
    <>
      <Header mainClass="with-btn" isNavButton={true} />
      <main className="main">
        <MatchingProperty isRentalTabs={false} isGuestDashboard={true} inquiryData={inquiryData}/>
      </main>
    </>
  );
}
