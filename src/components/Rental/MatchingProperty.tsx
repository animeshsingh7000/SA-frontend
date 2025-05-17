import { useEffect, useState } from "react";
import { getMatchingPropertiesByInq, getPropertiesByInq } from "../../api/property";
import Breadcrumb from "../Breadcrumb";
import RentalConnectInfo from "./RentalConnectInfo";
import RentalFilters from "./RentalFilters";
import RentalTabs from "./RentalTabs";

export default function MatchingProperty({
  guestPortalClasses = "",
  isRentalTabs = true,
  isGuestDashboard = false,
  inquiryData,
}: {
  guestPortalClasses?: string;
  isRentalTabs?: boolean;
  isGuestDashboard?: boolean;
  inquiryData?: any;
}) {
  const [allFilters, setAllFilters] = useState({});
  const [totalCount, setTotalCount] = useState(0);
  let page =1;

  useEffect(() => {
    if(isRentalTabs) {
      getMatchingPropertiesByInq({
        rentalInquiryId: inquiryData._id,
        page,
        count: 100,
        ...allFilters,
      }).then(
        (res) => {
         setTotalCount(res.data.count);
        },
        (error) => {
          
        }
      );
    }
    

  }, [])

  return (
    <>
      <Breadcrumb
        heading={`Welcome ${inquiryData?.firstName ? inquiryData?.firstName: ''}!`}
        description={
          <>
            Have Questions? Email us at{" "}
            <a href="mailto:reservations@stayattache.com">
              reservations@stayattache.com
            </a>{" "}
            or call 800-916-4903 ext 1
          </>
        }
        breadcrumbModuleClassName="breadcrumb-image-module"
        breadcrumbModuleRowClassName={isGuestDashboard ? "container": ""}
      />
      <RentalConnectInfo isGuestDashboard={isGuestDashboard}/>
      <div className={`container guest-portal-tabs ${guestPortalClasses}`}>
        {isRentalTabs ? (
          <RentalTabs />
        ) : (
          <div className="rental-card-result mt-4">Matching Properties ({totalCount})</div>
        )}
        <RentalFilters
          isGuestDashboard={isGuestDashboard}
          inquiryData={inquiryData}
        />
      </div>
    </>
  );
}
