import { useSearchParams } from "react-router-dom";
import ExtraInfo from "./ExtraInfo";
import InquiryDetailBox from "./InquiryDetailBox";
import MatchingPropertyInfo from "./MatchingPropertyInfo";
import PropertyList from "./PropertyList";
import { TABS_KEYS } from "../../constants";

export default function RentalFilters({
  isGuestDashboard,
  inquiryData,
}: {
  isGuestDashboard?: boolean;
  inquiryData?: any;
}) {
  const [searchParams] = useSearchParams();
  const type = searchParams.get('type');
  const view = searchParams.get('view');

  return (
    <div className="rental-card-content">
      {type === TABS_KEYS.dislike ? null : <MatchingPropertyInfo />}
      {inquiryData && !searchParams.get('type') && (
        <InquiryDetailBox
          inquiryData={inquiryData}
          isGuestDashboard={isGuestDashboard}
        />
      )}
      {inquiryData && (
        <PropertyList
          inqId={inquiryData?._id}
          inquiryData={inquiryData}
          isGuestDashboard={isGuestDashboard}
        />
      )}
      {view !== 'map' ? <ExtraInfo isGuestDashboard={isGuestDashboard} />: null}
    </div>
  );
}
