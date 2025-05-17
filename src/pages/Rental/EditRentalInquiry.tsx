import Header from "../Header";

import iconOwner from "../../assets/images/owner-green-icon.svg";
import { Breadcrumb } from "../../components";
import AddEditRentalInq from "../../components/Rental/AddEditRentalInq";
import { useEffect, useState } from "react";
import { editRentalInq, getRentalInquiryForLoggedInuser } from "../../api/rental/rentalInquiry";
import {
  BATHROOM_OPTIONS,
  BEDROOM_OPTIONS,
  BUDGET,
  CALLBACK_OPTIONS,
  HOME_SEARCH_REASON,
  HOW_DID_YOU_FIND_US_OPTIONS,
  OCCUPANT_COUNT,
  PET_NUMBER,
  PRIORITY_OPTIONS,
  TIME_ZONE_OPTIONS,
} from "../../constants";
import Spinner from "../../components/Spinner";
import { useCustomMutation } from "../../hooks/useApi";
import { ROUTE_NAVIGATION_PATH } from "../../routes/routes";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export function EditRentalInquiry() {
  const [inquiryData, setInquiryData] = useState({});
  const [loader, setLoader] = useState(true);
  const navigate = useNavigate();

  const { mutate } = useCustomMutation({
    mutationFn: editRentalInq,
    onSuccess: () => {
      const successData = {
        message: "Rental Inquiry has been updated.",
        url: ROUTE_NAVIGATION_PATH.RENTER_DASHBOARD,
      };
      toast.success(successData.message);
      navigate(successData.url);
    },
  });

  const submitData =(data: any) => {
    mutate(data);
  }

  useEffect(() => {
    getRentalInquiryForLoggedInuser().then((res: any) => {
      setInquiryData(res.data);
      const data = res.data;
      setInquiryData({
        _id: data._id,
        unitId: data?.unitId,
        firstName: data?.firstName,
        lastName: data?.lastName,
        email: data?.email,
        mobile: data?.mobile,
        estimatedArrivalDate: new Date(data.estimatedArrivalDate),
        estimatedDepartureDate: new Date(data.estimatedDepartureDate),
        maxMonthlyBudget: data.maxMonthlyBudget,
        minimumNumberOfBeds: data.minimumNumberOfBeds,
        minimumNumberOfBathrooms: data.minimumNumberOfBathrooms,
        occupantCount: data.occupantCount,
        neighborhood: data.neighborhood,
        callMeDetails: data.isCallMe
          ? {
              timeZone: data.callMeDetails?.timeZone,
              callBackOption: data.callMeDetails?.callBackOption,
            }
          : undefined,
        interestedProperties: res.data.interestedProperties && res.data.interestedProperties.length> 0 ? res.data.interestedProperties.map((item:any) => item) : [],
        vehicleSize: data.parkingDetails?.vehicleSize,
        parkingRequirements: data.parkingDetails?.parkingRequirements,
        petCount: data.petDetails?.petCount,
        petDescription: data.petDetails?.petDescription,
        bestPet: data.petDetails?.bestPet,
        findUs:  data.findUs,
        bringsYouTown: data.bringsYouTown,
        firstPriority: data.firstPriority,
        secondPriority: data.secondPriority,
        thirdPriority: data.thirdPriority,
        lastDecisionDate: data.lastDecisionDate
          ? new Date(data.lastDecisionDate)
          : undefined,
        isASAP: data.isASAP,
        isParking: data.isParking,
        isPetAllowed: data.isPetAllowed,
        landmark: data.landmark,
        isCallMe: data.isCallMe,
        isGovtPerDiem: data.isGovtPerDiem,
        isImportantNotesForBudget: data.isImportantNotesForBudget,
        isDepartureDateFlexible: data.isDepartureDateFlexible,
        isArrivalDateFlexible: data.isArrivalDateFlexible,
        budgetDesc: data.budgetDesc,
        flexibleDeparture: data.flexibleDeparture ? {
          numberOfDaysPrior: data.flexibleDeparture.numberOfDaysPrior,
          numberOfDaysAfter: data.flexibleDeparture.numberOfDaysAfter,
          flexiblePlanDesc: data.flexibleDeparture.flexiblePlanDesc,
        } : undefined,
        flexibleArrival: data.flexibleArrival ? { 
          numberOfDaysPrior: data.flexibleArrival.numberOfDaysPrior,
          numberOfDaysAfter: data.flexibleArrival.numberOfDaysAfter,
          flexiblePlanDesc: data.flexibleArrival.flexiblePlanDesc,
        } :undefined
      });
      setLoader(false);
    });
  }, []);

  return (
    <div className="right-container">
      <Header mainClass="with-btn" isNavButton={true} />
      <main className="main-content">
        <Breadcrumb
          icon={iconOwner}
          heading="Edit Rental Inquiry"
          description="Start here to find your fully furnished property for 30 days or longer. Our system will provide you with the closest matching properties at the end of the inquiry. One of our local Attache experts will look through the inventory to see if they have any personal recommendations that may work for your stay. Fewer than half the fields are required to complete, however, the more details you provide the better match we can make for you!"
        />
        {loader ? (
          <Spinner />
        ) : (
          <div className="owner-inquery-wrapper">
            <AddEditRentalInq isEdit data={inquiryData} submitData={submitData}/>
          </div>
        )}
      </main>
    </div>
  );
}
