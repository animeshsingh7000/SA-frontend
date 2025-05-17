import { ROUTE_NAVIGATION_PATH } from "../routes/routes";
import dashboardDefault from "../assets/images/owner-sidebar/dashboard-default.svg";
import dashboardActive from "../assets/images/owner-sidebar/owner-dashboard-active.svg";
import propertiesDefault from "../assets/images/owner-sidebar/my-properties.svg";
import propertiesActive from "../assets/images/owner-sidebar/my-properties-active.svg";
import leaseDefault from "../assets/images/owner-sidebar/lease-default.svg";
import leaseActive from "../assets/images/owner-sidebar/lease-active.svg";
import calenderDefault from "../assets/images/owner-sidebar/calendar.svg";
import calenderActive from "../assets/images/owner-sidebar/calendar-active.svg";
import compareDefault from "../assets/images/owner-sidebar/compare-default.svg";
import compareActive from "../assets/images/owner-sidebar/compare-active.svg";
import rentalActive from "../assets/images/rental-active.svg";
import rentalDefault from "../assets/images/rental-default.svg";
import serviceRequest from "../assets/images/owner-sidebar/sr-default.svg";
import userManagerIcon from "../assets/images/UserCircle.svg";
import userManagerIconActive from "../assets/images/UserCircle.svg";
import PropertyhomeIcon from "../assets/images/home-icon.svg";
import leasesIcon from "../assets/images/accounting-manager.svg";
import inquiryIcon from "../assets/images/Inquiry.svg";
import oprationsIcon from "../assets/images/GearFine.svg";
import accountingIcon from "../assets/images/BookOpenText.svg";
import siteIcon from "../assets/images/TreeStructure.svg";

export const OWNER_MENU = {
  DASHBOARD: {
    url: ROUTE_NAVIGATION_PATH.OWNER_DASHBOARD,
    title: "Dashboard",
    icon: dashboardActive,
    deafultIcon: dashboardDefault,
    activeOn: [ROUTE_NAVIGATION_PATH.OWNER_DASHBOARD],
    subMenu: []
  },
  MY_PROPERTIES: {
    url: ROUTE_NAVIGATION_PATH.OWNER_PROPERTY,
    title: "My Properties",
    icon: propertiesActive,
    deafultIcon: propertiesDefault,
    activeOn: [ROUTE_NAVIGATION_PATH.OWNER_PROPERTY],
    subMenu: []
  },
  LEASE_PROPERTIES: {
    url: ROUTE_NAVIGATION_PATH.OWNER_PROPERTY_LEASE,
    title: "Leases",
    icon: leaseActive,
    deafultIcon: leaseDefault,
    activeOn: [
      ROUTE_NAVIGATION_PATH.OWNER_PROPERTY_LEASE,
      ROUTE_NAVIGATION_PATH.OWNER_LEASE_DETAIL
    ],
    subMenu: []
  },
  // BLOCK_PROPERTIES: {
  //   url: ROUTE_NAVIGATION_PATH.OWNER_BLOCK_PROPERTY,
  //   title: "Block Dates",
  //   icon: calenderActive,
  //   deafultIcon: calenderDefault,
  //   activeOn: [ROUTE_NAVIGATION_PATH.OWNER_BLOCK_PROPERTY],
  //   subMenu: []
  // },
};

export const OWNERS_MENUS = [
  OWNER_MENU.DASHBOARD,
  OWNER_MENU.MY_PROPERTIES,
  OWNER_MENU.LEASE_PROPERTIES,
  //OWNER_MENU.BLOCK_PROPERTIES,
];

export const RENTER_MENU = {
  DASHBOARD: {
    url: ROUTE_NAVIGATION_PATH.RENTER_DASHBOARD,
    title: "Dashboard",
    icon: dashboardActive,
    deafultIcon: dashboardDefault,
    activeOn: [ROUTE_NAVIGATION_PATH.RENTER_DASHBOARD],
    subMenu: []
  },
  LEASE_INVOICES : {
      url: ROUTE_NAVIGATION_PATH.RENTAL_LEASE,
      title: "Lease Invoices",
      icon: leaseActive,
      deafultIcon: leaseDefault,
      activeOn: [
          ROUTE_NAVIGATION_PATH.RENTAL_LEASE,
          ROUTE_NAVIGATION_PATH.RENTAL_LEASE_DETAIL,
          ROUTE_NAVIGATION_PATH.RENTAL_INVOICE_DETAIL
      ],
      subMenu: []
  },
  NEW_RENTAL_INQUIRY : {
      url: ROUTE_NAVIGATION_PATH.RENTAL_INQUIRY_NEW,
      title: "New Rental Inquiry",
      icon: rentalActive,
      deafultIcon: rentalDefault,
      activeOn: [
          ROUTE_NAVIGATION_PATH.RENTAL_INQUIRY_NEW   
      ],
      subMenu: []
  },
  COMPARE_PROPERTIES: {
      url: ROUTE_NAVIGATION_PATH.PROPERTY_COMPARE,
      title: "Compare Properties",
      icon: compareActive,
      deafultIcon: compareDefault,
      activeOn: [
          ROUTE_NAVIGATION_PATH.PROPERTY_COMPARE
      ],
      subMenu: []
  },
  SERVICE_REQUEST: {
      url: ROUTE_NAVIGATION_PATH.PROPERTY_COMPARE,
      title: "Service Request",
      icon: serviceRequest,
      deafultIcon: serviceRequest,
      activeOn: [
          ROUTE_NAVIGATION_PATH.PROPERTY_COMPARE
      ],
      subMenu: []
  }
};

export const RENTER_MENUS = [
  RENTER_MENU.DASHBOARD,
  RENTER_MENU.LEASE_INVOICES,
  RENTER_MENU.NEW_RENTAL_INQUIRY,
  RENTER_MENU.COMPARE_PROPERTIES,
  //RENTER_MENU.SERVICE_REQUEST
];

export const ADMIN_MENU = {
  USER_MANAGEMENT : {
    url: ROUTE_NAVIGATION_PATH.USER_MANAGEMENT,
    title: "User Manager",
    icon: userManagerIconActive,
    deafultIcon: userManagerIcon,
    activeOn: [ROUTE_NAVIGATION_PATH.USER_MANAGEMENT],
    subMenu: []
  },
  PROPERTIES: {
    url: ROUTE_NAVIGATION_PATH.ADMIN_OWNER_PROPERTY_LIST,
    title: "Property Manager",
    icon: PropertyhomeIcon,
    deafultIcon: PropertyhomeIcon,
    activeOn: [
      ROUTE_NAVIGATION_PATH.ADMIN_OWNER_PROPERTY_LIST,
      ROUTE_NAVIGATION_PATH.CREATE_PROPERTY,
      ROUTE_NAVIGATION_PATH.UPDATE_PROPERTY,
      ROUTE_NAVIGATION_PATH.NEIGHBORHOOD_LIST,
      ROUTE_NAVIGATION_PATH.CREATE_NEIGHBORHOOD,
      ROUTE_NAVIGATION_PATH.EDIT_NEIGHBORHOOD,
      ROUTE_NAVIGATION_PATH.BUILDING_LIST,
      ROUTE_NAVIGATION_PATH.CREATE_BUILDING,
      ROUTE_NAVIGATION_PATH.EDIT_BUILDING,
      ROUTE_NAVIGATION_PATH.REGIONS_LIST,
      ROUTE_NAVIGATION_PATH.CREATE_REGION,
      ROUTE_NAVIGATION_PATH.EDIT_REGION,
      //ROUTE_NAVIGATION_PATH.BLOCK_DATES_LIST,
      ROUTE_NAVIGATION_PATH.CREATE_EDIT_DATE_BLOCK,
    ],
    subMenu: [
      {
        url: ROUTE_NAVIGATION_PATH.ADMIN_OWNER_PROPERTY_LIST,
        title: "Properties",
        activeOn: [
          ROUTE_NAVIGATION_PATH.ADMIN_OWNER_PROPERTY_LIST,
          ROUTE_NAVIGATION_PATH.CREATE_PROPERTY,
          ROUTE_NAVIGATION_PATH.ADMIN_OWNER_EDIT_PROPERTY
        ]
      },
      {
        url: ROUTE_NAVIGATION_PATH.BUILDING_LIST,
        title: "Buildings",
        activeOn: [
          ROUTE_NAVIGATION_PATH.BUILDING_LIST,
          ROUTE_NAVIGATION_PATH.CREATE_BUILDING,
          ROUTE_NAVIGATION_PATH.EDIT_BUILDING

        ]
      },
      {
        url: ROUTE_NAVIGATION_PATH.NEIGHBORHOOD_LIST,
        title: "Neighborhood",
        activeOn: [
          ROUTE_NAVIGATION_PATH.NEIGHBORHOOD_LIST,
          ROUTE_NAVIGATION_PATH.CREATE_NEIGHBORHOOD,
          ROUTE_NAVIGATION_PATH.EDIT_NEIGHBORHOOD,
        ]
      },
      {
        url: ROUTE_NAVIGATION_PATH.REGIONS_LIST,
        title: "Regions",
        activeOn: [
          ROUTE_NAVIGATION_PATH.REGIONS_LIST,
          ROUTE_NAVIGATION_PATH.CREATE_REGION,
          ROUTE_NAVIGATION_PATH.EDIT_REGION,

        ]
      },
      // {
      //   url: ROUTE_NAVIGATION_PATH.BLOCK_DATES_LIST,
      //   title: "Block Dates",
      //   activeOn: [
      //     ROUTE_NAVIGATION_PATH.BLOCK_DATES_LIST,
      //     ROUTE_NAVIGATION_PATH.CREATE_EDIT_DATE_BLOCK,
      //   ]
      // }
      
    ]
  },
  LEASE: {
    url: ROUTE_NAVIGATION_PATH.LEASING_MANAGER_LIST,
    title: "Leasing Manager",
    icon: leasesIcon,
    deafultIcon: leasesIcon,
    activeOn: [
      ROUTE_NAVIGATION_PATH.LEASING_MANAGER_LIST,
      ROUTE_NAVIGATION_PATH.CURRENT_LEASESE,
      ROUTE_NAVIGATION_PATH.CURRENT_PAST_LEASES,
      ROUTE_NAVIGATION_PATH.CURRENT_FUTURE_LEASES,
      ROUTE_NAVIGATION_PATH.FUTURE_LEASES,
      ROUTE_NAVIGATION_PATH.INPREPERATION_LEASES,
      ROUTE_NAVIGATION_PATH.ADD_LEASING,
      ROUTE_NAVIGATION_PATH.DYNAMIC_PRICING,
      ROUTE_NAVIGATION_PATH.EDIT_DYNAMIC_PRINCING
    ],
    subMenu: [
      {
        url: ROUTE_NAVIGATION_PATH.LEASING_MANAGER_LIST,
        title: "All Leases",
        activeOn: [
          ROUTE_NAVIGATION_PATH.LEASING_MANAGER_LIST,
        ]
      },
      {
        url: ROUTE_NAVIGATION_PATH.CURRENT_LEASESE,
        title: "Current Leases",
        activeOn: [
          ROUTE_NAVIGATION_PATH.CURRENT_LEASESE,
        ]
      },
      {
        url: ROUTE_NAVIGATION_PATH.CURRENT_PAST_LEASES,
        title: "Current + Past Leases",
        activeOn: [
          ROUTE_NAVIGATION_PATH.CURRENT_PAST_LEASES,
        ]
      },
      {
        url: ROUTE_NAVIGATION_PATH.CURRENT_FUTURE_LEASES,
        title: "Current + Future Leases",
        activeOn: [
          ROUTE_NAVIGATION_PATH.CURRENT_FUTURE_LEASES,
        ]
      },
      {
        url: ROUTE_NAVIGATION_PATH.FUTURE_LEASES,
        title: "Future Leases",
        activeOn: [
          ROUTE_NAVIGATION_PATH.FUTURE_LEASES,
        ]
      },
      {
        url: ROUTE_NAVIGATION_PATH.INPREPERATION_LEASES,
        title: "In Preparation",
        activeOn: [
          ROUTE_NAVIGATION_PATH.INPREPERATION_LEASES,
        ]
      },
      {
        url: ROUTE_NAVIGATION_PATH.ADD_LEASING,
        title: "Add Lease",
        activeOn: [
          ROUTE_NAVIGATION_PATH.ADD_LEASING,
        ]
      },
      {
        url: ROUTE_NAVIGATION_PATH.DYNAMIC_PRICING,
        title: "Dynamic Pricing",
        activeOn: [
          ROUTE_NAVIGATION_PATH.DYNAMIC_PRICING,
          ROUTE_NAVIGATION_PATH.EDIT_DYNAMIC_PRINCING
        ],
      },
      // {
      //   url: ROUTE_NAVIGATION_PATH.LEASING_INVOICE,
      //   title: "Invoice",
      //   activeOn: [
      //     ROUTE_NAVIGATION_PATH.LEASING_INVOICE,
      //   ]
      // }
      
    ]
  },
  OWNER_INQUIRY: {
    url: ROUTE_NAVIGATION_PATH.ADMIN_RENTER_INQUIRY_LIST,
    title: "Inquiry",
    icon: inquiryIcon,
    deafultIcon: inquiryIcon,
    activeOn: [
      ROUTE_NAVIGATION_PATH.ADMIN_RENTER_INQUIRY_LIST,
      ROUTE_NAVIGATION_PATH.ADMIN_OWNER_INQUIRY_LIST,
      ROUTE_NAVIGATION_PATH.ADD_EDIT_OWNER_INQUIRY,
      ROUTE_NAVIGATION_PATH.ADD_EDIT_RENTAL_INQUIRY
    ],
    subMenu: [
      {
        url: ROUTE_NAVIGATION_PATH.ADMIN_RENTER_INQUIRY_LIST,
        title: "Rental Inquiry",
        activeOn: [
          ROUTE_NAVIGATION_PATH.ADMIN_RENTER_INQUIRY_LIST,
          ROUTE_NAVIGATION_PATH.ADD_EDIT_RENTAL_INQUIRY
        ]
      },
      {
        url: ROUTE_NAVIGATION_PATH.ADMIN_OWNER_INQUIRY_LIST,
        title: "Owner Inquiry",
        activeOn: [
          ROUTE_NAVIGATION_PATH.ADMIN_OWNER_INQUIRY_LIST,
          ROUTE_NAVIGATION_PATH.ADD_EDIT_OWNER_INQUIRY
        ]
      },
    ]
  },
  OPERATIONS: {
    url: ROUTE_NAVIGATION_PATH.CLEANING_SCHEDULE,
    title: "Operations Manager",
    icon: oprationsIcon,
    deafultIcon: dashboardDefault,
    activeOn: [
      ROUTE_NAVIGATION_PATH.CLEANING_SCHEDULE,
      ROUTE_NAVIGATION_PATH.RECURRING_RATE,
      ROUTE_NAVIGATION_PATH.EDIT_RECURRING_RATE,
      ROUTE_NAVIGATION_PATH.DOCUMENT_LIST,
      ROUTE_NAVIGATION_PATH.DOCUMENT_VIEW,
    ],
    subMenu: [
      // {
      //   url: ROUTE_NAVIGATION_PATH.ADMIN_OWNER_PROPERTY_LIST,
      //   title: "Reservations",
      //   activeOn: [
      //     ROUTE_NAVIGATION_PATH.ADMIN_RENTER_INQUIRY_LIST,
      //   ]
      // },
      // {
      //   url: ROUTE_NAVIGATION_PATH.ADMIN_OWNER_PROPERTY_LIST,
      //   title: "Arrivals",
      //   activeOn: [
      //     ROUTE_NAVIGATION_PATH.ADMIN_RENTER_INQUIRY_LIST,
      //   ]
      // },
      // {
      //   url: ROUTE_NAVIGATION_PATH.ADMIN_OWNER_PROPERTY_LIST,
      //   title: "Departures",
      //   activeOn: [
      //     ROUTE_NAVIGATION_PATH.ADMIN_RENTER_INQUIRY_LIST,
      //   ]
      // },
      {
        url: ROUTE_NAVIGATION_PATH.CLEANING_SCHEDULE,
        title: "Cleaning Schedule",
        activeOn: [
          ROUTE_NAVIGATION_PATH.CLEANING_SCHEDULE,
        ]
      },
      {
        url: ROUTE_NAVIGATION_PATH.RECURRING_RATE,
        title: "Manage Recurring Rates",
        activeOn: [
          ROUTE_NAVIGATION_PATH.RECURRING_RATE,
          ROUTE_NAVIGATION_PATH.EDIT_RECURRING_RATE,
        ]
      },
      {
        url: ROUTE_NAVIGATION_PATH.DOCUMENT_LIST,
        title: "Document Templates",
        activeOn: [
          ROUTE_NAVIGATION_PATH.DOCUMENT_LIST,
          ROUTE_NAVIGATION_PATH.DOCUMENT_VIEW,
        ]
      },
    ]
  },
  // ACCOUNTING: {
  //   url: ROUTE_NAVIGATION_PATH.ACCOUNTING_MANAGER,
  //   title: "Accounting Manager",
  //   icon: accountingIcon,
  //   deafultIcon: dashboardDefault,
  //   activeOn: [ROUTE_NAVIGATION_PATH.ACCOUNTING_MANAGER],
  //   subMenu: [
  //     {
  //       url: ROUTE_NAVIGATION_PATH.ADMIN_OWNER_PROPERTY_LIST,
  //       title: "Actionable Leases",
  //       activeOn: [
  //         ROUTE_NAVIGATION_PATH.ADMIN_RENTER_INQUIRY_LIST,
  //       ]
  //     },
  //     {
  //       url: ROUTE_NAVIGATION_PATH.ADMIN_OWNER_PROPERTY_LIST,
  //       title: "Payments",
  //       activeOn: [
  //         ROUTE_NAVIGATION_PATH.ADMIN_RENTER_INQUIRY_LIST,
  //       ]
  //     },
  //     {
  //       url: ROUTE_NAVIGATION_PATH.ADMIN_OWNER_PROPERTY_LIST,
  //       title: "Syndication",
  //       activeOn: [
  //         ROUTE_NAVIGATION_PATH.ADMIN_RENTER_INQUIRY_LIST,
  //       ]
  //     }
  //   ]
  // },
  SITE: {
    url: ROUTE_NAVIGATION_PATH.FEATURETTE,
    title: "Site Manager",
    icon: siteIcon,
    deafultIcon: dashboardDefault,
    activeOn: [
      ROUTE_NAVIGATION_PATH.FEATURETTE,
      ROUTE_NAVIGATION_PATH.CREATE_FEATURETTE,
      ROUTE_NAVIGATION_PATH.EDIT_FEATURETTE,
      ROUTE_NAVIGATION_PATH.ADMIN_BLOG,
      ROUTE_NAVIGATION_PATH.CREATE_BLOG,
      ROUTE_NAVIGATION_PATH.EDIT_BLOG,
      ROUTE_NAVIGATION_PATH.ADMIN_PROMOTED_PROPERTY,
      ROUTE_NAVIGATION_PATH.CREATE_PROMOTED_PROPERTY,
      ROUTE_NAVIGATION_PATH.EDIT_PROMOTED_PROPERTY
    ],
    subMenu: [
      {
        url: ROUTE_NAVIGATION_PATH.FEATURETTE,
        title: "Featurettes",
        activeOn: [
          ROUTE_NAVIGATION_PATH.FEATURETTE,
          ROUTE_NAVIGATION_PATH.CREATE_FEATURETTE,
          ROUTE_NAVIGATION_PATH.EDIT_FEATURETTE
        ]
      },
      {
        url: ROUTE_NAVIGATION_PATH.ADMIN_BLOG,
        title: "Blogs",
        activeOn: [
          ROUTE_NAVIGATION_PATH.ADMIN_BLOG,
          ROUTE_NAVIGATION_PATH.CREATE_BLOG,
          ROUTE_NAVIGATION_PATH.EDIT_BLOG
        ]
      },
      {
        url: ROUTE_NAVIGATION_PATH.ADMIN_PROMOTED_PROPERTY,
        title: "Promoted Properties",
        activeOn: [
          ROUTE_NAVIGATION_PATH.ADMIN_PROMOTED_PROPERTY,
          ROUTE_NAVIGATION_PATH.CREATE_PROMOTED_PROPERTY,
          ROUTE_NAVIGATION_PATH.EDIT_PROMOTED_PROPERTY
        ]
      }
    ]
  }
  // CALCULATOR: {
  //   url: ROUTE_NAVIGATION_PATH.PRICE_CALCULATOR,
  //   title: "Price Calculator",
  //   icon: dashboardActive,
  //   deafultIcon: dashboardDefault,
  //   activeOn: [ROUTE_NAVIGATION_PATH.PRICE_CALCULATOR],
  //   subMenu: []
  // },
  // DYNAMIC_PRICING: {
  //   url: ROUTE_NAVIGATION_PATH.DYNAMIC_PRICING,
  //   title: "Dynamic Pricing",
  //   icon: compareActive,
  //   deafultIcon: compareDefault,
  //   activeOn: [ROUTE_NAVIGATION_PATH.DYNAMIC_PRICING],
  //   subMenu: []
  // },
  // PER_DIEM_LIST: {
  //   url: ROUTE_NAVIGATION_PATH.PER_DIEM_LISTING,
  //   title: "Per Diem",
  //   icon: compareActive,
  //   deafultIcon: compareDefault,
  //   activeOn: [ROUTE_NAVIGATION_PATH.PER_DIEM_LISTING],
  //   subMenu: []
  // },
  // FEATURETTE_LISTING: {
  //   url: ROUTE_NAVIGATION_PATH.FEATURETTE_LISTING,
  //   title: "Featurette Listing",
  //   icon: propertiesActive,
  //   deafultIcon: propertiesDefault,
  //   activeOn: [ROUTE_NAVIGATION_PATH.FEATURETTE_LISTING],
  //   subMenu: []
  // },
  // FEATURE_LISTING: {
  //   url: ROUTE_NAVIGATION_PATH.FEATURE_LISTING,
  //   title: "Feature Listing",
  //   icon: rentalActive,
  //   deafultIcon: rentalDefault,
  //   activeOn: [ROUTE_NAVIGATION_PATH.FEATURE_LISTING],
  //   subMenu: []
  // },
};

export const ADMIN_MENUS = [
  ADMIN_MENU.USER_MANAGEMENT,
  ADMIN_MENU.PROPERTIES,
  ADMIN_MENU.LEASE,
  ADMIN_MENU.OWNER_INQUIRY,
  ADMIN_MENU.OPERATIONS,
  //ADMIN_MENU.ACCOUNTING,
  ADMIN_MENU.SITE
  // ADMIN_MENU.CALCULATOR,
  //ADMIN_MENU.DYNAMIC_PRICING,
  // ADMIN_MENU.PER_DIEM_LIST,
  // ADMIN_MENU.FEATURETTE_LISTING,
  // ADMIN_MENU.FEATURE_LISTING
];

export const HOME_MENU = {
  BROWSE: {
    url: ROUTE_NAVIGATION_PATH.BROWSE,
    title: "Browse",
    icon: "",
    activeOn: [],
  },
  TEAM: {
    url: ROUTE_NAVIGATION_PATH.TEAM,
    title: "StayHuman (Your Team)",
    icon: "",
    activeOn: [],
  },
  NEWS: {
    url: ROUTE_NAVIGATION_PATH.BLOG,
    title: "StayCurrent (Our News)",
    icon: "",
    activeOn: [],
  },
  FAQ: {
    url: ROUTE_NAVIGATION_PATH.FAQ,
    title: "StayCurious (FAQs)",
    icon: "",
    activeOn: [],
  },
  CONTACT: {
    url: ROUTE_NAVIGATION_PATH.CONTACT_US,
    title: "Contact Us",
    icon: "",
    activeOn: [],
  },
};

export const HOME_MENUS = [
  HOME_MENU.BROWSE,
  HOME_MENU.TEAM,
  HOME_MENU.NEWS,
  HOME_MENU.FAQ,
  HOME_MENU.CONTACT,
];

export const FOOTER_FEATURE_MENU = {
  RENTAL_INQUIRY: {
    url: ROUTE_NAVIGATION_PATH.RENTAL_INQUIRY,
    title: "Submit Rental Inquiry",
    icon: "",
    activeOn: [],
  },
  FAQ: {
    url: ROUTE_NAVIGATION_PATH.FAQ,
    title: "Frequently Asked Questions",
    icon: "",
    activeOn: [],
  },
  TEAM_ATTACHE: {
    url: ROUTE_NAVIGATION_PATH.TEAM,
    title: "Team Attache",
    icon: "",
    activeOn: [],
  },
  COMPARE_PROPERTY: {
    url: ROUTE_NAVIGATION_PATH.PROPERTY_COMPARE,
    title: "Compare Properties",
    icon: "",
    activeOn: [],
  },
  BROWSE_MAP: {
    url: ROUTE_NAVIGATION_PATH.BROWSE_MAP_FULL,
    title: "Browse All Map",
    icon: "",
    activeOn: [],
  },
  CONTACT: {
    url: ROUTE_NAVIGATION_PATH.CONTACT_US,
    title: "Contact Us",
    icon: "",
    activeOn: [],
  },
};

export const FOOTER_FEATURE_MENUS = [
  FOOTER_FEATURE_MENU.RENTAL_INQUIRY,
  FOOTER_FEATURE_MENU.FAQ,
  FOOTER_FEATURE_MENU.TEAM_ATTACHE,
  FOOTER_FEATURE_MENU.COMPARE_PROPERTY,
  FOOTER_FEATURE_MENU.BROWSE_MAP,
  FOOTER_FEATURE_MENU.CONTACT,
];

export const SOCIAL_LINKS = {
  INSTAGRAM: {
    url: "https://www.instagram.com/stayattache/",
    title: "Instagram",
    icon: "",
    activeOn: [],
  },
  TWITTER: {
    url: "https://twitter.com/stayattache",
    title: "Twitter",
    icon: "",
    activeOn: [],
  },
  FACEBOOK: {
    url: "https://www.facebook.com/AttacheCorporateHousing",
    title: "Facebook",
    icon: "",
    activeOn: [],
  },
  LINKEDIN: {
    url: "http://www.linkedin.com/company/attache-property-management",
    title: "LinkedIn",
    icon: "",
    activeOn: [],
  },
};

export const SOCIAL_MENUS = [
  SOCIAL_LINKS.INSTAGRAM,
  SOCIAL_LINKS.TWITTER,
  SOCIAL_LINKS.FACEBOOK,
  SOCIAL_LINKS.LINKEDIN,
];

export const FOOTER_LINKS = {
  COPORATE_HOUSING_DC: {
    url: ROUTE_NAVIGATION_PATH.COPORATE_HOUSING_DC,
    title: "Corporate Housing Washington DC",
    icon: "",
    activeOn: [],
  },
  FURNISHED_APPARTMENT_DC: {
    url: ROUTE_NAVIGATION_PATH.FURNISHED_APPARTMENT_DC,
    title: "Furnished Apartments in Washington DC",
    icon: "",
    activeOn: [],
  },
  WASHINGTON_DC_COPORATE_HOUSING: {
    url: ROUTE_NAVIGATION_PATH.WASHINGTON_DC_COPORATE_HOUSING,
    title: "Washington DC Corporate Housing",
    icon: "",
    activeOn: [],
  },
  WASHINGTON_DC_TEMPORARY_HOUSING: {
    url: ROUTE_NAVIGATION_PATH.WASHINGTON_DC_TEMPORARY_HOUSING,
    title: "Washington DC Temporary Housing",
    icon: "",
    activeOn: [],
  },
  SHORT_TERM_RENTAL_DC: {
    url: ROUTE_NAVIGATION_PATH.SHORT_TERM_RENTAL_DC,
    title: "Short Term Furnished Rental Washington DC",
    icon: "",
    activeOn: [],
  },
  SHORT_TERM_HOUSING_DC: {
    url: ROUTE_NAVIGATION_PATH.SHORT_TERM_HOUSING_DC,
    title: "Short Term Housing Washington DC",
    icon: "",
    activeOn: [],
  },
  COPORATE_APPARTMENTS_DC: {
    url: ROUTE_NAVIGATION_PATH.COPORATE_APPARTMENTS_DC,
    title: "Corporate Apartments Washington DC",
    icon: "",
    activeOn: [],
  },
  FURNISHED_RENTALS: {
    url: ROUTE_NAVIGATION_PATH.FURNISHED_RENTALS,
    title: "Furnished Rentals Washington DC",
    icon: "",
    activeOn: [],
  },
  MILITARY_HOUSING_DC: {
    url: ROUTE_NAVIGATION_PATH.MILITARY_HOUSING_DC,
    title: "Military Housing Washington DC",
    icon: "",
    activeOn: [],
  },
};

export const FOOTER_LINK_MENUS = [
  FOOTER_LINKS.COPORATE_HOUSING_DC,
  FOOTER_LINKS.FURNISHED_APPARTMENT_DC,
  FOOTER_LINKS.WASHINGTON_DC_COPORATE_HOUSING,
  FOOTER_LINKS.WASHINGTON_DC_TEMPORARY_HOUSING,
  FOOTER_LINKS.SHORT_TERM_RENTAL_DC,
  FOOTER_LINKS.SHORT_TERM_HOUSING_DC,
  FOOTER_LINKS.COPORATE_APPARTMENTS_DC,
  FOOTER_LINKS.FURNISHED_RENTALS,
  FOOTER_LINKS.MILITARY_HOUSING_DC,
];
