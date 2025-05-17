import { createBrowserRouter, Outlet } from "react-router-dom";
import { RequireAuth } from "../components";
import { 
  App,
  Browse,
  FAQ,
  Home,
  SignIn,
  ForgotPassword,
  ResetPassword,
  Team,
  BrowseMap,
  PropertyDetail,
  ContactUs,
  News,
  NewsDetail,
  PrivacyPolicy,
  TeamMemberDetail
} from "../pages";
import CoporateHousingWashingtonDC from "../pages/Auth/FooterPages/CoporateHousingWashingtonDC";
import CorporateApartmentsWashingtonDC from "../pages/Auth/FooterPages/CorporateApartmentsWashingtonDC";
import FurnishedApartmentsInWashingtonDC from "../pages/Auth/FooterPages/FurnishedApartmentsInWashingtonDC";
import FurnishedRentalsWashingtonDC from "../pages/Auth/FooterPages/FurnishedRentalsWashingtonDC";
import MilitaryHousingWashingtonDC from "../pages/Auth/FooterPages/MilitaryHousingWashingtonDC";
import ShortTermFurnishedrentalWashingtonDC from "../pages/Auth/FooterPages/ShortTermFurnishedrentalWashingtonDC";
import ShortTermHousingWashingtonDC from "../pages/Auth/FooterPages/ShortTermHousingWashingtonDC";
import WashingtonDCCorporateHousing from "../pages/Auth/FooterPages/WashingtonDCCorporateHousing";
import WashingtonDCTemporaryHousing from "../pages/Auth/FooterPages/WashingtonDCTemporaryHousing";
import OwnerServices from "../pages/Owner";
import AddProperty from "../pages/Owner/AddProperty";
import EditProperty from "../pages/Owner/EditProperty";
import OwnerLease from "../pages/Owner/OnwerLease";
import OwnerProfile from "../pages/Owner/OnwerProfile";
import OwnerBlockProperty from "../pages/Owner/OwnerBlockProperty";
import OwnerDashboad from "../pages/Owner/OwnerDashboard";
import OwnerInquiry from "../pages/Owner/OwnerInquiry";
import OwnerProperty from "../pages/Owner/OwnerProperty";
import { ROUTE_NAVIGATION_PATH, ROUTE_PATH } from "./routes";
import AdminWrapper from "../pages/Admin/AdminWrapper";
import { SubmitRentalInquiry, SearchResult } from "../pages/Rental";
import Comparision from "../pages/Rental/Comparision";
import RentalLease from "../pages/Rental/RentalLease";
import RentalLeaseDetail from "../pages/Rental/RentalLeaseDetail";
import GuestMatchingProperty from "../pages/Rental/GuestMatchingProperty";
import { EditRentalInquiry } from "../pages/Rental/EditRentalInquiry";
import PriceCalculator from "../pages/Admin/PriceCalculator";
import DynamicPriceList from "../pages/Admin/LeasingManager/DynamicPriceList";
import EditDynamicPricing from "../pages/Admin/LeasingManager/EditDynamicPricing";
import PerDiemListing from "../pages/Admin/PerDiemListing";
import FeaturetteListing from "../pages/Admin/FeaturetteListing";
import AddEditFeaturette from "../pages/Admin/AddEditFeaturette";
import FeatureListing from "../pages/Admin/FeatureListing";
import UserManagerList from "../pages/Admin/UserManager";
import AddEditUser from "../pages/Admin/UserManager/AddEditUser";
import RenterInquiryList from "../pages/Admin/Inquiry/RenterList";
import OwnerInquiryList from "../pages/Admin/Inquiry/OwnerList";
import AddEditRenterInquiry from "../pages/Admin/Inquiry/AddEditRenterInquiry";
import AddEditOnwerInquiry from "../pages/Admin/Inquiry/AddEditOwnerInquiry";
import AdminEditProperty from "../pages/Admin/PropertyManager/Property/EditProperty";
import AdminPropertyList from "../pages/Admin/PropertyManager/Property";
import CreateProperty from "../pages/Admin/PropertyManager/Property/CreateProperty";
import Buildings from "../pages/Admin/PropertyManager/Building/Buildings";
import Neighborhood from "../pages/Admin/PropertyManager/Neighbourhood/Neighborhood";
import AddEditBuilding from "../pages/Admin/PropertyManager/Building/AddEditBuilding";
import AddEditNeighborhood from "../pages/Admin/PropertyManager/Neighbourhood/AddEditNeighborhood";
import Regions from "../pages/Admin/PropertyManager/Region/Regions";
import AddEditRegions from "../pages/Admin/PropertyManager/Region/AddEditRegions";
import DatesBlockList from "../pages/Admin/PropertyManager/BlockDates/DatesBlockList";
import AddEditBlockDates from "../pages/Admin/PropertyManager/BlockDates/AddEditBlockDates";
import AdminFeaturetteListing from "../pages/Admin/SiteManager/Featurette";
import CreateEditFeaturettes from "../pages/Admin/SiteManager/Featurette/CreateEditFeaturettes";
import UpdateProperty from "../pages/Admin/PropertyManager/Property/EditProperty";
import AdminBlogListing from "../pages/Admin/SiteManager/Blog";
import CreateEditBlog from "../pages/Admin/SiteManager/Blog/CreateEditBlog";
import CreateEditPromoted from "../pages/Admin/SiteManager/Promoted/CreateEditPromoted";
import AdminPromotedListing from "../pages/Admin/SiteManager/Promoted";
import AddEditLease from "../pages/Admin/LeasingManager/AddEditLease";
import AddLease from "../pages/Admin/LeasingManager/AddLease";
import LeasingManagerList from "../pages/Admin/LeasingManager";
import CurrentLeaseList from "../pages/Admin/LeasingManager/CurrentLeasesList";
import FutureLeaseList from "../pages/Admin/LeasingManager/FutureLeaseList";
import CurrentPastLeaseList from "../pages/Admin/LeasingManager/CurrentPastLeaseList";
import CurrentFutureLeaseList from "../pages/Admin/LeasingManager/CurrentFutureLeaseList";
import InPreperationLeaseList from "../pages/Admin/LeasingManager/InPreperationLeaseList";
import OwnerLeaseDetail from "../pages/Owner/OwnerLeaseDetail";
import DocumentList from "../pages/Admin/OperationsManager/DocumentList";
import RecurringRateList from "../pages/Admin/OperationsManager/RecurringRateList";
import EditRecurringRate from "../pages/Admin/OperationsManager/EditRecurringRate";
import EditTemplate from "../pages/Admin/OperationsManager/EditTemplate";
import LeaseInvoiceDetail from "../pages/Admin/LeasingManager/LeaseInvoiceDetail";
import InvoiceDetail from "../pages/Rental/InvoiceDetail";
import PaymentInfo from "../pages/Rental/PaymentInfo";
import CleaningScheduleList from "../pages/Admin/OperationsManager/CleaningScheduleList";

export const router = createBrowserRouter([
  {
    path: '*',
    element: <App />,
    children: []
  },
  {
    path: ROUTE_PATH.ROOT,
    element: <Outlet />,
    children: [
      {
        element: <Home />,
        index: true,
      },
      {
        path: ROUTE_PATH.SIGN_IN,
        element: <SignIn />,
      },
      {
        path: ROUTE_PATH.TEAM,
        element: <Team />
      },
      {
        path: ROUTE_PATH.TEAM_DETAIL + '/:id',
        element: <TeamMemberDetail />
      },
      {
        path: ROUTE_PATH.FAQ,
        element: <FAQ />
      },
      {
        path: ROUTE_PATH.BLOG,
        element: <News />
      },
      {
        path: ROUTE_PATH.CONTACT_US,
        element: <ContactUs />
      },
      {
        path: ROUTE_PATH.BLOG_DETAIL + '/:slug',
        element: <NewsDetail />
      },
      {
        path: ROUTE_PATH.BROWSE,
        element: <Browse />
      },
      {
        path: ROUTE_PATH.BROWSE_MAP,
        element: <BrowseMap />
      },
      {
        path: ROUTE_PATH.BROWSE_MAP_FULL,
        element: <BrowseMap />
      },
      {
        path: ROUTE_PATH.PROPERTY_DETAIL + '/:id',
        element: <PropertyDetail />
      },
      {
        path: '/:state/:neighbourhood/:isFurnished/:id',
        element: <PropertyDetail />
      },
      
      {
        path: ROUTE_PATH.COPORATE_HOUSING_DC,
        element: <CoporateHousingWashingtonDC />
      },
      {
        path: ROUTE_PATH.FURNISHED_APPARTMENT_DC,
        element: <FurnishedApartmentsInWashingtonDC/>
      },
      {
        path: ROUTE_PATH.WASHINGTON_DC_COPORATE_HOUSING,
        element: <WashingtonDCCorporateHousing />
      },
      {
        path: ROUTE_PATH.WASHINGTON_DC_TEMPORARY_HOUSING,
        element: <WashingtonDCTemporaryHousing />
      },
      {
        path: ROUTE_PATH.SHORT_TERM_RENTAL_DC,
        element: <ShortTermFurnishedrentalWashingtonDC />
      },
      {
        path: ROUTE_PATH.SHORT_TERM_HOUSING_DC,
        element: <ShortTermHousingWashingtonDC />
      },
      {
        path: ROUTE_PATH.COPORATE_APPARTMENTS_DC,
        element: <CorporateApartmentsWashingtonDC />
      },
      {
        path: ROUTE_PATH.FURNISHED_RENTALS,
        element: <FurnishedRentalsWashingtonDC />
      },
      {
        path: ROUTE_PATH.MILITARY_HOUSING_DC,
        element: <MilitaryHousingWashingtonDC />
      },
      {
        path: ROUTE_PATH.FORGOT_PASSWORD,
        element: <ForgotPassword />
      },
      {
        path: ROUTE_PATH.RESET_PASSWORD+ "/:token",
        element: <ResetPassword />
      },
      {
        path: ROUTE_PATH.PRIVACY_POLICY,
        element: <PrivacyPolicy />
      },
      {
        path: ROUTE_PATH.OWNER_SERVICES,
        element: <OwnerServices />
      },
      {
        path: ROUTE_PATH.OWNER_INQUIRY,
        element: <OwnerInquiry />
      },
      {
        path: ROUTE_PATH.PROPERTY_COMPARE,
        element: <Comparision/>
      },
      {
        path: ROUTE_PATH.RENTAL_INQUIRY,
        element: <SubmitRentalInquiry />,
      },
      {
        path: ROUTE_PATH.RENTAL_SEARCH_RESULT,
        element: <SearchResult/>
      },
      {
        path: ROUTE_PATH.RENTAL_MATCHING_PROPERTIES + "/:id",
        element: <GuestMatchingProperty/>
      }
    ],
  },
  {
    path: ROUTE_PATH.OWNER,
    element: <RequireAuth />,
    // element: <Outlet />,
    children: [
      {
        path: ROUTE_PATH.OWNER_DASHBOARD,
        element: <OwnerDashboad />
      },
      {
        path: ROUTE_PATH.OWNER_PROPERTY,
        element: <OwnerProperty />
      },
      {
        path: ROUTE_PATH.OWNER_PROPERTY_LEASE,
        element: <OwnerLease />
      },
      {
        path: ROUTE_PATH.OWNER_BLOCK_PROPERTY,
        element: <OwnerBlockProperty />
      },
      {
        path: ROUTE_PATH.OWNER_PROFILE,
        element: <OwnerProfile />
      },
      {
        path: ROUTE_PATH.ADD_PROPERTY,
        element: <AddProperty />
      },
      {
        path: ROUTE_PATH.EDIT_PROPERTY + '/:propertyId',
        element: <EditProperty />
      },
      {
        path: ROUTE_PATH.OWNER_LEASE_DETAIL + '/:id',
        element: <OwnerLeaseDetail />
      },
    ],
  },
  {
    path: ROUTE_PATH.RENTAL,
    element: <RequireAuth />,
    children: [
      {
        path: ROUTE_PATH.RENTAL_INQUIRY,
        element: <SubmitRentalInquiry />
      },
      {
        path: ROUTE_PATH.RENTAL_LEASE,
        element: <RentalLease />
      },
      {
        path: ROUTE_PATH.RENTAL_LEASE_DETAIL + '/:id',
        element: <RentalLeaseDetail />
      },
      {
        path: ROUTE_PATH.RENTAL_INVOICE_DETAIL + '/:id',
        element: <InvoiceDetail />
      },
      {
        path: ROUTE_PATH.RENTER_DASHBOARD,
        element: <SearchResult />
      },
      {
        path: ROUTE_PATH.RENTAL_INQUIRY_EDIT+ '/:id',
        element: <EditRentalInquiry />
      },
      {
        path: ROUTE_PATH.PAYMENT_SUCCESS,
        element: <PaymentInfo />
      }
    ],
  },
  {
    path: ROUTE_PATH.ADMIN,
    element: <AdminWrapper />,
    children: [
      {
        path: ROUTE_PATH.USER_MANAGEMENT,
        element: <UserManagerList />
      },
      {
        path: ROUTE_PATH.ADD_EDIT_USERS+ '/:userId' + '/:type',
        element: <AddEditUser />
      },
      {
        path: ROUTE_NAVIGATION_PATH.ADMIN_RENTER_INQUIRY_LIST,
        element: <RenterInquiryList />
      },
      {
        path: ROUTE_NAVIGATION_PATH.ADD_EDIT_RENTAL_INQUIRY+ '/:id',
        element: <AddEditRenterInquiry />
      },
      {
        path: ROUTE_PATH.OWNER_INQUIRY_LIST,
        element: <OwnerInquiryList />
      },
      {
        path: ROUTE_NAVIGATION_PATH.ADD_EDIT_OWNER_INQUIRY+ '/:id',
        element: <AddEditOnwerInquiry />
      },
      {
        path: ROUTE_PATH.OWNER_PROPERTY_LIST,
        element: <AdminPropertyList />
      },
      {
        path: ROUTE_PATH.OWNER_EDIT_PROPERTY,
        element: <AdminEditProperty />
      },
      {
        path: ROUTE_PATH.CREATE_PROPERTY+ '/:type',
        element: <CreateProperty />
      },
      {
        path: ROUTE_PATH.UPDATE_PROPERTY+'/:id' + '/:type',
        element: <UpdateProperty />
      },
      {
        path: ROUTE_PATH.BUILDING_LIST,
        element: <Buildings />
      },
      {
        path: ROUTE_PATH.NEIGHBORHOOD_LIST,
        element: <Neighborhood />
      },
      {
        path: ROUTE_NAVIGATION_PATH.EDIT_NEIGHBORHOOD+ '/:id',
        element: <AddEditNeighborhood />
      },
      {
        path: ROUTE_PATH.CREATE_NEIGHBORHOOD,
        element: <AddEditNeighborhood />
      },
      {
        path: ROUTE_PATH.CREATE_BUILDING,
        element: <AddEditBuilding />
      },
      {
        path: ROUTE_NAVIGATION_PATH.EDIT_BUILDING+ '/:id',
        element: <AddEditBuilding />
      },
      {
        path: ROUTE_PATH.REGIONS_LIST,
        element: <Regions />
      },
      {
        path: ROUTE_NAVIGATION_PATH.EDIT_REGION+ '/:id',
        element: <AddEditRegions />
      },
      {
        path: ROUTE_PATH.CREATE_REGION,
        element: <AddEditRegions />
      },
      {
        path: ROUTE_PATH.BLOCK_DATES_LIST,
        element: <DatesBlockList />
      },
      {
        path: ROUTE_PATH.CREATE_EDIT_DATE_BLOCK,
        element: <AddEditBlockDates />
      },
      {
        path: ROUTE_PATH.LEASE_MANAGER,
        element: <Neighborhood />
      },
      {
        path: ROUTE_PATH.OPERATION_MANAGER,
        element: <Neighborhood />
      },
      {
        path: ROUTE_PATH.ACCOUNTING_MANAGER,
        element: <Regions />
      },
      {
        path: ROUTE_PATH.FEATURETTE,
        element: <AdminFeaturetteListing />
      },
      {
        path: ROUTE_PATH.CREATE_FEATURETTE,
        element: <CreateEditFeaturettes />
      },
      {
        path: ROUTE_PATH.EDIT_FEATURETTE + '/:id',
        element: <CreateEditFeaturettes />
      },
      {
        path: ROUTE_PATH.ADMIN_BLOG,
        element: <AdminBlogListing />
      },
      {
        path: ROUTE_PATH.CREATE_BLOG,
        element: <CreateEditBlog />
      },
      {
        path: ROUTE_PATH.EDIT_BLOG + '/:id',
        element: <CreateEditBlog />
      },
      {
        path: ROUTE_PATH.ADMIN_PROMOTED_PROPERTY,
        element: <AdminPromotedListing />
      },
      {
        path: ROUTE_PATH.CREATE_PROMOTED_PROPERTY,
        element: <CreateEditPromoted />
      },
      {
        path: ROUTE_PATH.EDIT_PROMOTED_PROPERTY + '/:id',
        element: <CreateEditPromoted />
      },
      {
        path: ROUTE_PATH.PRICE_CALCULATOR,
        element: <PriceCalculator />
      },
      {
        path: ROUTE_PATH.DYNAMIC_PRICING,
        element: <DynamicPriceList />
      },
      {
        path: ROUTE_PATH.PER_DIEM_LISTING,
        element: <PerDiemListing />
      },
      {
        path: ROUTE_PATH.FEATURETTE_LISTING,
        element: <FeaturetteListing />
      },
      {
        path: ROUTE_PATH.ADD_EDIT_FEATURETTE,
        element: <AddEditFeaturette />
      },
      {
        path: ROUTE_PATH.EDIT_DYNAMIC_PRINCING,
        element: <EditDynamicPricing />
      },
      {
        path: ROUTE_PATH.FEATURE_LISTING,
        element: <FeatureListing />
      },
      {
        path: ROUTE_PATH.LEASING_MANAGER_LIST,
        element: <LeasingManagerList />
      },
      {
        path: ROUTE_PATH.LEASE_INVOICE_DETAIL + '/:id',
        element: <LeaseInvoiceDetail />
      },
      {
        path: ROUTE_PATH.EDIT_LEASING + '/:id' + '/:type',
        element: <AddEditLease />
      },
      {
        path: ROUTE_PATH.ADD_LEASING,
        element: <AddLease />
      },
      {
        path: ROUTE_PATH.CURRENT_LEASESE,
        element: <CurrentLeaseList />
      },
      {
        path: ROUTE_PATH.FUTURE_LEASES,
        element: <FutureLeaseList />
      },
      {
        path: ROUTE_PATH.INPREPERATION_LEASES,
        element: <InPreperationLeaseList />
      },
      {
        path: ROUTE_PATH.CURRENT_PAST_LEASES,
        element: <CurrentPastLeaseList />
      },
      {
        path: ROUTE_PATH.CURRENT_FUTURE_LEASES,
        element: <CurrentFutureLeaseList />
      },
      {
        path: ROUTE_PATH.DOCUMENT_LIST,
        element: <DocumentList />
      },
      {
        path: ROUTE_PATH.DOCUMENT_VIEW + '/:id',
        element: <EditTemplate />
      },
      {
        path: ROUTE_PATH.RECURRING_RATE,
        element: <RecurringRateList />
      },
      {
        path: ROUTE_PATH.EDIT_RECURRING_RATE + '/:id',
        element: <EditRecurringRate />
      },
      {
        path: ROUTE_PATH.CLEANING_SCHEDULE,
        element: <CleaningScheduleList />
      },
    ]
  },
]);
