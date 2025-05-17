export const VALIDATIONS = {
  MAX_NAME: 50,
  MAX_TITLE: 150,
  MAX_DESCRIPTION: 500,
  MAX_PHONE: 15,
  MIN_PHONE: 10,
  MIN_PASSWORD: 8,
  MAX_DAYS: 2
};

export const ROLE = {
  RENTER: 1,
  OWNER: 0,
  ADMIN: 2,
};

export const DEFAULT_OFFSET = 12;

export const MAX_FILE_SIZE = 5120; // 5MB;

export const FILE_SIZE = 1024;


export const FILTER_TYPE = {
  ALL: 0,
  LEASE: 1,
  PENDING: 2,
};

export const BASE_URL = process.env.REACT_APP_API_URL; //dev

export const WEB_BASE_URL = process.env.REACT_APP_WEB_URL; //dev


export const MAP_API_KEY = process.env.REACT_APP_MAP_KEY || "";

export const HUB_ID = process.env.REACT_APP_HUB_ID || "";

export const HUBSPOT_URL= process.env.REACT_APP_HUBSPOT_URL || "";

export const MESSAGES = {
  FILE_SIZE_ERROR: "File size is greater than maximum limit i.e. 5MB.",
};

export const STUDIO = [
  {
    id: 0,
    title: "Studio",
    value: "Studio",
    selected: false,
    show: "Studio",
  },
  {
    id: 1,
    title: 1,
    value: "OneBed",
    selected: false,
    show: "One Bedroom",
  },
  {
    id: 2,
    title: 2,
    value: "TwoBed",
    selected: false,
    show: "Two Bedroom",
  },
  {
    id: 3,
    title: 3,
    value: "ThreeBed",
    selected: false,
    show: "Three Bedroom",
  },
  {
    id: 4,
    title: 4,
    value: "FourBed",
    selected: false,
    show: "Four Bedroom",
  },
  {
    id: 5,
    title: 5,
    value: "FiveBed",
    selected: false,
    show: "Five Bedroom",
  },
];

export const EDIT_PROPERTY_STEPS = [
  {
    title: 1,
    value: "PROPERTY DETAILS",
  },
  {
    title: 2,
    value: "OWNER GOALS",
  },
  {
    title: 3,
    value: "PROPERTY DETAILED INFORMATION",
  },
  {
    title: 4,
    value: "OUTSIDE SPACE, IF APPLICABLE",
  },
  {
    title: 5,
    value: "PROPERTY INTERIOR",
  },
  {
    title: 6,
    value: "BEDS",
  },
  {
    title: 7,
    value: "APPLIANCES AND kITCHEN EQUIPMENT",
  },
  {
    title: 8,
    value: "MARKETING AND ADMINISTRATION",
  },
  {
    title: 9,
    value: "MAINTENANCE AND OPERATIONS",
  },
  {
    title: 10,
    value: "KEYS",
  },
  {
    title: 11,
    value: "UTILITIES",
  },
  {
    title: 12,
    value: "INSURANCE",
  },
];

export const PROPERTY_TYPE = [
  {
    title: "Please select",
    value: "",
  },
  {
    title: "Stand-alone home",
    value: "Stand-alone home",
  },
  {
    title: "Row house",
    value: "Row house",
  },
  {
    title: "Condo",
    value: "Condo",
  },
  {
    title: "Apartment",
    value: "Apartment",
  },
  {
    title: "Other",
    value: "Other",
  },
];

export const NEIGHBORHOOD = [
  {
    title: "Select a neighborhood",
    value: "",
  },
  {
    title: "Dupont Circle",
    value: "Dupont Circle",
  },
  {
    title: "Penn Quarter",
    value: "Penn Quarter",
  },
  {
    title: "Capitol Hill",
    value: "Capitol Hill",
  },
  {
    title: "Foggy Bottom",
    value: "Foggy Bottom",
  },
  {
    title: "Adams Morgan",
    value: "Adams Morgan",
  },
  {
    title: "Cleveland Park",
    value: "Cleveland Park",
  },
  {
    title: "Georgetown",
    value: "Georgetown",
  },
  {
    title: "Arlington",
    value: "Arlington",
  },
  {
    title: "Logan Circle",
    value: "Logan Circle",
  },
  {
    title: "Alexandria",
    value: "Alexandria",
  },
  {
    title: "U Street Corridor",
    value: "U Street Corridor",
  },
  {
    title: "Columbia Heights",
    value: "Columbia Heights",
  },
  {
    title: "Glover Park",
    value: "Glover Park",
  },
  {
    title: "Dupont /WestEnd",
    value: "Dupont /WestEnd",
  },
  {
    title: "Mt Vernon Sq / Convention Center",
    value: "Mt Vernon Sq / Convention Center",
  },
  {
    title: "Palisades",
    value: "Palisades",
  },
  {
    title: "Waterfront",
    value: "Waterfront",
  },
  {
    title: "Wesley Heights",
    value: "Wesley Heights",
  },
  {
    title: "Woodley Park",
    value: "Woodley Park",
  },
  {
    title: "Kalorama",
    value: "Kalorama",
  },
  {
    title: "Bethesda",
    value: "Bethesda",
  },
  {
    title: "Friendship Heights",
    value: "Friendship Heights",
  },
  {
    title: "Navy Yard",
    value: "Navy Yard",
  },
  {
    title: "Bloomingdale",
    value: "Bloomingdale",
  },
  {
    title: "Colonial Village",
    value: "Colonial Village",
  },
  {
    title: "H Street Corridor",
    value: "H Street Corridor",
  },
  {
    title: "Brookland",
    value: "Brookland",
  },
  {
    title: "Cathedral Heights",
    value: "Cathedral Heights",
  },
  {
    title: "Potomac",
    value: "Potomac",
  },

  {
    title: "Southwest Waterfront",
    value: "Southwest Waterfront",
  },
  {
    title: "Chevy Chase",
    value: "Chevy Chase",
  },
  {
    title: "Shaw",
    value: "Shaw",
  },
  {
    title: "Downtown",
    value: "Downtown",
  },
  {
    title: "Truxton Circle",
    value: "Truxton Circle",
  },
  {
    title: "Mt Pleasant",
    value: "Mt Pleasant",
  },
  {
    title: "McLean/Tyson's Corner",
    value: "McLean/Tyson's Corner",
  },
  {
    title: "Falls Church City",
    value: "Falls Church City",
  },
  {
    title: "Shepherd Park",
    value: "Shepherd Park",
  },
  {
    title: "Eckington",
    value: "Eckington",
  },
];

export const FILTER_NEIGHBORHOOD = [
  {
    title: "Dupont Circle",
    value: "Dupont Circle",
  },
  {
    title: "Penn Quarter",
    value: "Penn Quarter",
  },
  {
    title: "Capitol Hill",
    value: "Capitol Hill",
  },
  {
    title: "Foggy Bottom",
    value: "Foggy Bottom",
  },
  {
    title: "Adams Morgan",
    value: "Adams Morgan",
  },
  {
    title: "Cleveland Park",
    value: "Cleveland Park",
  },
  {
    title: "Georgetown",
    value: "Georgetown",
  },
  {
    title: "Arlington",
    value: "Arlington",
  },
  {
    title: "Logan Circle",
    value: "Logan Circle",
  },
  {
    title: "Alexandria",
    value: "Alexandria",
  },
  {
    title: "U Street Corridor",
    value: "U Street Corridor",
  },
  {
    title: "Columbia Heights",
    value: "Columbia Heights",
  },
  {
    title: "Glover Park",
    value: "Glover Park",
  },
  {
    title: "Dupont /WestEnd",
    value: "Dupont /WestEnd",
  },
  {
    title: "Mt Vernon Sq / Convention Center",
    value: "Mt Vernon Sq / Convention Center",
  },
  {
    title: "Palisades",
    value: "Palisades",
  },
  {
    title: "Waterfront",
    value: "Waterfront",
  },
  {
    title: "Wesley Heights",
    value: "Wesley Heights",
  },
  {
    title: "Woodley Park",
    value: "Woodley Park",
  },
  {
    title: "Kalorama",
    value: "Kalorama",
  },
  {
    title: "Bethesda",
    value: "Bethesda",
  },
  {
    title: "Friendship Heights",
    value: "Friendship Heights",
  },
  {
    title: "Navy Yard",
    value: "Navy Yard",
  },
  {
    title: "Bloomingdale",
    value: "Bloomingdale",
  },
  {
    title: "Colonial Village",
    value: "Colonial Village",
  },
  {
    title: "H Street Corridor",
    value: "H Street Corridor",
  },
  {
    title: "Brookland",
    value: "Brookland",
  },
  {
    title: "Cathedral Heights",
    value: "Cathedral Heights",
  },
  {
    title: "Potomac",
    value: "Potomac",
  },

  {
    title: "Southwest Waterfront",
    value: "Southwest Waterfront",
  },
  {
    title: "Chevy Chase",
    value: "Chevy Chase",
  },
  {
    title: "Shaw",
    value: "Shaw",
  },
  {
    title: "Downtown",
    value: "Downtown",
  },
  {
    title: "Truxton Circle",
    value: "Truxton Circle",
  },
  {
    title: "Mt Pleasant",
    value: "Mt Pleasant",
  },
  {
    title: "McLean/Tyson's Corner",
    value: "McLean/Tyson's Corner",
  },
  {
    title: "Falls Church City",
    value: "Falls Church City",
  },
  {
    title: "Shepherd Park",
    value: "Shepherd Park",
  },
  {
    title: "Eckington",
    value: "Eckington",
  },
];

export const COUNRIES = ["United States"];

export const COUNTRIES = [
  { label: "Select", value: '' },
  { label: "United States", value: 'UnitedStates' }
];


export const OWNER_INQUIRY_TYPE = {
  ALL: -1,
  PENDING: 0,
  ACTIVE: 1,
  REJECTED: 2,
  DELETED: 3,
};

export const OWNER_INQUIRY_STATUS = {
  [OWNER_INQUIRY_TYPE.REJECTED]: "reject",
  [OWNER_INQUIRY_TYPE.ACTIVE]: "accept",
};

export const BUDGET = [
  { label: "Max Monthly Budget", value: "" },
  { label: "$2500", value: "$2500" },
  { label: "$2500 - $3000", value: "$2500 - $3000" },
  { label: "$3000 - $3500", value: "$3000 - $3500" },
  { label: "$3500 - $4000", value: "$3500 - $4000" },
  { label: "$4000 - $4500", value: "$4000 - $4500" },
  { label: "$4500 - $5000", value: "$4500 - $5000" },
  { label: "$5000 - $5500", value: "$5000 - $5500" },
  { label: "$5500 - $6000", value: "$5500 - $6000" },
  { label: "$6000 - $7000", value: "$6000 - $7000" },
  { label: "$7000 - $8000", value: "$7000 - $8000" },
  { label: "$8000 - $9000", value: "$8000 - $9000" },
  { label: "$9000 - $10000", value: "$9000 - $10000" },
  { label: "$10000 - $11000", value: "$10000 - $11000" },
  { label: "$11000 - $12000", value: "$11000 - $12000" },
  { label: "$12000 - $13000", value: "$12000 - $13000" },
  { label: "$13000 - $14000", value: "$13000 - $14000" },
  { label: "$14000 - $15000", value: "$14000 - $15000" },
  { label: "$15000 or more", value: "$15000 or more" },
];

export const BEDROOM_OPTIONS = [
  {
    label: "Number of Bedrooms",
    value: "",
  },
  {
    label: "Studio",
    value: "Studio",
  },
  {
    label: "1 Bedroom",
    value: "OneBed",
  },
  {
    label: "2 Bedroom",
    value: "TwoBed",
  },
  {
    label: "3 Bedroom",
    value: "ThreeBed",
  },
  {
    label: "4 Bedroom",
    value: "FourBed",
  },
  {
    label: "5 Bedroom",
    value: "FiveBed",
  },
  // {
  //   label: "6 Bedroom",
  //   value: "SixBed",
  // },
  // {
  //   label: "7 Bedroom",
  //   value: "SevenBed",
  // },
  // {
  //   label: "8 Bedroom",
  //   value: "EightBed",
  // },
  // {
  //   label: "9 Bedroom or more",
  //   value: "NineBedPlus",
  // },
];

export const BATHROOM_OPTIONS = [
  {
    label: "Minimum Number of Bathrooms",
    value: "",
  },
  {
    label: "One",
    value: "OneBath",
  },
  {
    label: "Two",
    value: "TwoBath",
  },
  {
    label: "Three",
    value: "ThreeBath",
  },
  {
    label: "Four",
    value: "FourBath",
  },
  {
    label: "Five",
    value: "FivePlusBath",
  },
];

export const HALF_BATHROOM_OPTIONS = [
  {
    label: "Minimum Number of Bathrooms",
    value: "",
  },
  {
    label: "Zero",
    value: "ZeroBath"
  },
  {
    label: "One",
    value: "OneBath",
  },
  {
    label: "Two",
    value: "TwoBath",
  },
  {
    label: "Three",
    value: "ThreeBath",
  },
  {
    label: "Four",
    value: "FourBath",
  },
  {
    label: "Five",
    value: "FivePlusBath",
  },
];

export const OCCUPANT_COUNT = [
  { value: "", label: "Select Occupant Count" },
  { value: "1", label: "One" },
  { value: "2", label: "Two" },
  { value: "3", label: "Three" },
  { value: "4", label: "Four" },
  { value: "5", label: "Five" },
  { value: "6", label: "Six" },
  { value: "7", label: "Seven" },
  { value: "8", label: "Eight" },
  { value: "9", label: "Nine" },
  { value: "10", label: "Ten" },
];

export const HOW_DID_YOU_FIND_US_OPTIONS = [
  { value: "", label: "Select One and Tell Us More" },
  { value: "I'm back - Repeat Guest", label: "I'm back - Repeat Guest" },
  { value: "Referral", label: "Referral" },
  { value: "Online Search", label: "Online Search" },
  { value: "Advertisement", label: "Advertisement" },
  { value: "I saw your Smart Car", label: "I saw your Smart Car" },
  { value: "Other", label: "Other" },
];

export const HOME_SEARCH_REASON = [
  { value: "", label: "Please Select" },
  { value: "Work Assignment", label: "Work Assignment" },
  { value: "Relocation", label: "Relocation" },
  { value: "Insurance Housing", label: "Insurance Housing" },
  { value: "Education", label: "Education" },
  { value: "Medical", label: "Medical" },
  { value: "Local/Renovating my House", label: "Local/Renovating my House" },
  { value: "Other", label: "Other" },
];

export const PRIORITY_OPTIONS = [
  { value: "", label: "Please Select" },
  { value: "None", label: "None", isDisabled: false },
  { value: "Budget", label: "Budget", isDisabled: false },
  { value: "Number of bedrooms", label: "Number of bedrooms", isDisabled: false },
  { value: "Number of bathrooms", label: "Number of bathrooms", isDisabled: false },
  { value: "Choice of Neighborhood", label: "Choice of Neighborhood", isDisabled: false },
  { value: "Pet Friendliness", label: "Pet Friendliness", isDisabled: false },
  { value: "Parking Availability", label: "Parking Availability", isDisabled: false },
];

export const NEIGHBORHOODS_OPTIONS = [
  { value: "Adams Morgan (NW)", label: "Adams Morgan (NW)" },
  { value: "Alexandria", label: "Alexandria" },
  { value: "Arlington", label: "Arlington" },
  { value: "Bethesda", label: "Bethesda" },
  { value: "Bloomingdale (NW)", label: "Bloomingdale (NW)" },
  { value: "Brookland (NE)", label: "Brookland (NE)" },
  { value: "Capitol Hill (NE,SE)", label: "Capitol Hill (NE,SE)" },
  { value: "Cathedral Heights (NW)", label: "Cathedral Heights (NW)" },
  { value: "Chevy Chase (NW)", label: "Chevy Chase (NW)" },
  { value: "Cleveland Park (NW)", label: "Cleveland Park (NW)" },
  { value: "Colonial Village (NW)", label: "Colonial Village (NW)" },
  { value: "Columbia Heights (NW)", label: "Columbia Heights (NW)" },
  { value: "Downtown (NW)", label: "Downtown (NW)" },
  { value: "Dupont /WestEnd (NW)", label: "Dupont /WestEnd (NW)" },
  { value: "Dupont Circle (NW)", label: "Dupont Circle (NW)" },
  { value: "Eckington (NE)", label: "Eckington (NE)" },
  { value: "Falls Church City", label: "Falls Church City" },
  { value: "Foggy Bottom (NW)", label: "Foggy Bottom (NW)" },
  { value: "Friendship Heights (NW)", label: "Friendship Heights (NW)" },
  { value: "Georgetown (NW)", label: "Georgetown (NW)" },
  { value: "Glover Park (NW)", label: "Glover Park (NW)" },
  { value: "H Street Corridor (NE)", label: "H Street Corridor (NE)" },
  { value: "Kalorama (NW)", label: "Kalorama (NW)" },
  { value: "Logan Circle (NW)", label: "Logan Circle (NW)" },
  { value: "McLean/Tyson's Corner", label: "McLean/Tyson's Corner" },
  { value: "Mt Pleasant (NW)", label: "Mt Pleasant (NW)" },
  {
    value: "Mt Vernon Sq / Convention Center (NW)",
    label: "Mt Vernon Sq / Convention Center (NW)",
  },
  { value: "Navy Yard (SE)", label: "Navy Yard (SE)" },
  { value: "Palisades (NW)", label: "Palisades (NW)" },
  { value: "Penn Quarter (NW)", label: "Penn Quarter (NW)" },
  { value: "Potomac", label: "Potomac" },
  { value: "Shaw (NW)", label: "Shaw (NW)" },
  { value: "Shepherd Park (NW)", label: "Shepherd Park (NW)" },
  { value: "Truxton Circle (NW,NE)", label: "Truxton Circle (NW,NE)" },
  { value: "U Street Corridor (NW)", label: "U Street Corridor (NW)" },
  { value: "Waterfront (SW)", label: "Waterfront (SW)" },
  { value: "Wesley Heights (NW)", label: "Wesley Heights (NW)" },
  { value: "Woodley Park (NW)", label: "Woodley Park (NW)" },
];

export const FLOOR_TYPE = [
  { value: 'Carpet in bedrooms', label: 'Carpet in bedrooms' },
  { value: 'Hardwood Floors', label: 'Hardwood Floors' },
  { value: 'Hardwood Floors - Brazilian Cherry', label: 'Hardwood Floors - Brazilian Cherry' },
  { value: 'Hardwood Floors - Wide Plank', label: 'Hardwood Floors - Wide Plank' },
  { value: 'Travertine Marble Floors', label: 'Travertine Marble Floors' },
  { value: 'Wood Floors', label: 'Wood Floors' },
]

export const MATTRESS_TYPE = [
  { value: 'Bed #2 - Queen', label: 'Bed #2 - Queen' },
  { value: 'Full Size Bed', label: 'Full Size Bed' },
  { value: 'King Bed', label: 'King Bed' },
  { value: 'Queen Bed', label: 'Queen Bed' },
  { value: 'Travertine Marble Floors', label: 'Travertine Marble Floors' },
  { value: 'Two Twin Bedroom', label: 'Two Twin Bedroom' },
]

export const KITCHEN_EQUIPMENTS = [
  { label: 'Dishwasher', value: 'Dishwasher' },
  { label: 'Microwave', value: 'Microwave' },
  { label: 'Stove and oven', value: 'OvenOrRange' },
]

export const SHARED_AMENITIES = [
  { value: 'Bike Storage', label: 'Bike Storage' },
  { value: 'Club Room / Party Room', label: 'Club Room / Party Room' },
  { value: 'Desk/Office', label: 'Desk/Office' },
  { value: 'Elevator', label: 'Elevator' },
  { value: 'Fitness Center in Building', label: 'Fitness Center in Building' },
  { value: 'Front Desk', label: 'Front Desk' },
  { value: 'Pool', label: 'Pool' }
]
export const TIME_ZONE_OPTIONS = [
  { value: "", label: "Please select your current time zone" },
  { value: "US/Eastern", label: "(GMT-05:00) Eastern Time (US & Canada)" },
  { value: "US/Central", label: "(GMT-06:00) Central Time (US & Canada)" },
  { value: "US/Mountain", label: "(GMT-07:00) Mountain Time (US & Canada)" },
  { value: "US/Pacific", label: "(GMT-08:00) Pacific Time (US & Canada)" },
  { value: "--------------------", label: "-------------------" },
  { value: "Pacific/Midway", label: "(GMT-11:00) Midway Island" },
  { value: "US/Samoa", label: "(GMT-11:00) Samoa" },
  { value: "US/Hawaii", label: "(GMT-10:00) Hawaii" },
  { value: "US/Alaska", label: "(GMT-09:00) Alaska" },
  { value: "America/Tijuana", label: "(GMT-08:00) Tijuana" },
  { value: "US/Arizona", label: "(GMT-07:00) Arizona" },
  { value: "America/Chihuahua", label: "(GMT-07:00) Chihuahua" },
  { value: "America/Mazatlan", label: "(GMT-07:00) Mazatlan" },
  { value: "America/Mexico_City", label: "(GMT-06:00) Mexico City" },
  { value: "America/Monterrey", label: "(GMT-06:00) Monterrey" },
  { value: "Canada/Saskatchewan", label: "(GMT-06:00) Saskatchewan" },
  { value: "US/East-Indiana", label: "(GMT-05:00) Indiana (East)" },
  { value: "America/Bogota", label: "(GMT-05:00) Bogota" },
  { value: "America/Lima", label: "(GMT-05:00) Lima" },
  { value: "America/Caracas", label: "(GMT-04:30) Caracas" },
  { value: "Canada/Atlantic", label: "(GMT-04:00) Atlantic Time (Canada)" },
  { value: "America/La_Paz", label: "(GMT-04:00) La Paz" },
  { value: "America/Santiago", label: "(GMT-04:00) Santiago" },
  { value: "Canada/Newfoundland", label: "(GMT-03:30) Newfoundland" },
  { value: "America/Buenos_Aires", label: "(GMT-03:00) Buenos Aires" },
  { value: "Greenland", label: "(GMT-03:00) Greenland" },
  { value: "Atlantic/Stanley", label: "(GMT-02:00) Stanley" },
  { value: "Atlantic/Azores", label: "(GMT-01:00) Azores" },
  { value: "Atlantic/Cape_Verde", label: "(GMT-01:00) Cape Verde Is." },
  { value: "Africa/Casablanca", label: "(GMT) Casablanca" },
  { value: "Europe/Dublin", label: "(GMT) Dublin" },
  { value: "Europe/Lisbon", label: "(GMT) Lisbon" },
  { value: "Europe/London", label: "(GMT) London" },
  { value: "Africa/Monrovia", label: "(GMT) Monrovia" },
  { value: "Europe/Amsterdam", label: "(GMT+01:00) Amsterdam" },
  { value: "Europe/Belgrade", label: "(GMT+01:00) Belgrade" },
  { value: "Europe/Berlin", label: "(GMT+01:00) Berlin" },
  { value: "Europe/Bratislava", label: "(GMT+01:00) Bratislava" },
  { value: "Europe/Brussels", label: "(GMT+01:00) Brussels" },
  { value: "Europe/Budapest", label: "(GMT+01:00) Budapest" },
  { value: "Europe/Copenhagen", label: "(GMT+01:00) Copenhagen" },
  { value: "Europe/Ljubljana", label: "(GMT+01:00) Ljubljana" },
  { value: "Europe/Madrid", label: "(GMT+01:00) Madrid" },
  { value: "Europe/Paris", label: "(GMT+01:00) Paris" },
  { value: "Europe/Prague", label: "(GMT+01:00) Prague" },
  { value: "Europe/Rome", label: "(GMT+01:00) Rome" },
  { value: "Europe/Sarajevo", label: "(GMT+01:00) Sarajevo" },
  { value: "Europe/Skopje", label: "(GMT+01:00) Skopje" },
  { value: "Europe/Stockholm", label: "(GMT+01:00) Stockholm" },
  { value: "Europe/Vienna", label: "(GMT+01:00) Vienna" },
  { value: "Europe/Warsaw", label: "(GMT+01:00) Warsaw" },
  { value: "Europe/Zagreb", label: "(GMT+01:00) Zagreb" },
  { value: "Europe/Athens", label: "(GMT+02:00) Athens" },
  { value: "Europe/Bucharest", label: "(GMT+02:00) Bucharest" },
  { value: "Africa/Cairo", label: "(GMT+02:00) Cairo" },
  { value: "Africa/Harare", label: "(GMT+02:00) Harare" },
  { value: "Europe/Helsinki", label: "(GMT+02:00) Helsinki" },
  { value: "Europe/Istanbul", label: "(GMT+02:00) Istanbul" },
  { value: "Asia/Jerusalem", label: "(GMT+02:00) Jerusalem" },
  { value: "Europe/Kiev", label: "(GMT+02:00) Kyiv" },
  { value: "Europe/Minsk", label: "(GMT+02:00) Minsk" },
  { value: "Europe/Riga", label: "(GMT+02:00) Riga" },
  { value: "Europe/Sofia", label: "(GMT+02:00) Sofia" },
  { value: "Europe/Tallinn", label: "(GMT+02:00) Tallinn" },
  { value: "Europe/Vilnius", label: "(GMT+02:00) Vilnius" },
  { value: "Asia/Baghdad", label: "(GMT+03:00) Baghdad" },
  { value: "Asia/Kuwait", label: "(GMT+03:00) Kuwait" },
  { value: "Africa/Nairobi", label: "(GMT+03:00) Nairobi" },
  { value: "Asia/Riyadh", label: "(GMT+03:00) Riyadh" },
  { value: "Europe/Moscow", label: "(GMT+03:00) Moscow" }
];

export const CALLBACK_OPTIONS = [
  { label: "Please Select", value: "" },
  { label: "Right Away (within the next 30-minutes)", value: "Right Away (within the next 30-minutes)" },
  { label: "Within the next 1-8 hours", value: "Within the next 1-8 hours" },
  { label: "Within 9-24 hours", value: "Within 9-24 hours" },
  { label: "By the next business day", value: "By the next business day" },
  { label: "Anytime, but please include a joke or riddle, when you call me", value: "Anytime, but please include a joke or riddle, when you call me" }
];

export const VEHICLE_TYPE = [
  { label: "Please Select", value: "" },
  { label: "Small (compact car)", value: "Small (compact car)" },
  { label: "Medium (sedan)", value: "Medium (sedan)" },
  { label: "Large (SUV or truck)", value: "Large (SUV or truck)" }
];

export const PET_NUMBER = [
  { label: "Please include all pets", value: "" },
  { label: "One", value: "one" },
  { label: "Two", value: "two" },
  { label: "Three", value: "three" },
  { label: "Four", value: "four" },
  { label: "More", value: "more" }
];

export const RENTAL_STATUS = [
  { label: "Select Status", value: "" },
  { label: "New", value: "New" },
  { label: "Options Sent", value: "Options Sent" },
  { label: "Nothing Yet", value: "Nothing Yet" },
  { label: "Application Sent", value: "Application Sent" },
  { label: "Not Qualified", value: "Not Qualified" },
  { label: "Cancelled Request", value: "Cancelled Request" },
  { label: "Never Replied", value: "Never Replied" }
];

export const EDIT_PROPERTY_INITDATA = {
  propertyDetails: {
    propertyRegion: null,
    neighborhood: null,
    propertyType: null,
    streetAddress: null,
    unitNumber: null,
    directionality: null,
    city: null,
    postalCode: null,
    state: null,
    country: null,
    Features: [],
    IncludedInRent: []
  },
  ownerGoals: {
    expectedAnnualRentalIncome: null,
    propertyUsageOrSchedule: null,
    leadTimeRequireToListProperty: null,
    propertyBtwNowAndAvailabilityDate: null,
    lockedClosetPropertyBelongings: "No",
  },
  propertyDetailInfo: {
    propertyBuiltYear: null,
    propertyLastRenovated: null,
    isBedroomsWithoutBed: "No",
    isPropertyDenOrStudy: "No",
    fullBathroomCount: null,
    halfBathroomCount: null,
    isBathroomsHaveBathtub: "No",
    showerDescription: null,
    bathroomDescription: null,
    propertyApproxArea: null,
    isParking: "No",
    floorsListingCount: null,
    isStairCaseAvailable: "No",
    propertyMoreThanOneFloorDescription: null,
    buildingFloorsCount: null,
    propertyFloorLocatedAt: null,
    isPetsAllowed: "No",
  },
  outsideSpace: {
    isYardOrOutsideAreaAvailable: "No"
  },
  propertyInterior: {
    isPropertyFurnished: "No",
    furnitureLastReplaced: null,
    isPlanningToRefreshFurnishing: "No",
    floorType: [],
    isMasterBedroomEnSuiteBathroom: "No",
    isMoreThanOneEnSuite: "No",
    closetsDescription: null,
    isDaybedPullOutBedOrSofaSpace: "No",
    isPropertyWithBlinds: "No",
    isPropertyWithFireplace: "No",
  },
  beds: {
    bedroomCount: null,
    bedAndMattressType: [],
    isBedFramesHeadboards: "No",
    bedroomConfigurationDesc: null,
    eachMattressSizeDesc: null,
    eachMattressAgeDesc: null,
    eachMattressMaterialDesc: null,
  },
  appliancesAndKitchenEquipment: {
    kitchenEquipmentDesc: [],
    dishwasherMakeAndModelDesc: null,
    ovenMakeModelDesc: null,
    stoveDesc: null,
    washerAndDryerShared: null,
    washerDryerAccessDesc: null,
    isPropertyWithHDTVs: "No",
    eachTelevisionDesc: null,
    specialtyAppliancesDesc: null,
  },
  marketingAndAdministration: {
    isBusinessLicense: "No",
    isAssistanceRequiredForBusinessLicense: "No",
    isStrictMinimumLeaseTerm: false,
    minimumReservationTerm: null,
    propertyAvailableFrom: null,
    propertyAvailableUntil: null,
    closestMetroStopsDesc: null,
    sharedAmenitiesDesc: [],
    isSecurePackageAcceptance: "No",
    isFloorPlanAvailable: "No",
    isFloorAssistanceRequired: "No",
    highlightFeaturesDesc: [],
  },
  maintenanceAndOperation: {
    acSystemDesc: null,
    acFilterSize: null,
    hvacServiceProvider: null,
    heatingSystemDesc: null,
    thermostatLocation: null,
    trashLocation: null,
    isKeyRequiredToAccessTrash: "No",
    breakerFuseLocation: null,
    waterShutOffValveLocation: null,
    hotWaterServiceDesc: null,
    importantMailSentDesc: null,
    buildingOrPropertyAccessInfoDesc: null,
    propertyLastPainted: null,
    isContractorInspected: "No",
    repairsNotAllowedDesc: null,
    repairItemsDesc: null,
  },
  keys: {
    keyDetail: null,
    setOfKeys: null,
    isKeyRequiredToAccessBuilding: "No",
    isGarageDoorOpener: "No",
    isKeyRequiredToAccessMailBox: "No",
  },
  utilities: {
    electricityProviderDesc: null,
    waterProviderDesc: null,
    cableProviderDesc: null,
    wirelessNetworkName: null,
    wirelessNetworkPassword: null,
    routerLocationDesc: null,
    premiumServiceDesc: null,
  },
  insurance: {
    isHomeOrBuildingInsurance: "No",
    isContentInsuranceAvailable: "No",
    isInsuranceContentRequiredBeforeAnyRepair: "No"
  },
  location: {
    latitude: null,
    longitude: null
  }
}

export const TABS_KEYS = {
  'allResults': '',
  'favorites': 'favorites',
  'dislike': 'dislike'
}


export const PRICE_CALCULATOR = {
  propertyId: null,
  startDate: null,
  endDate: null,
  isPerDiem: false,
  petsChargesType: null,
  parkingChargesType: null,
  petsCharges: null,
  parkingCharges: null,
  taxAmount: null,
  isPropertyInMarylandOrVA: false,
  departureCleaningFee: null
}

export const USER_DETAILS = {
  firstName: null,
  lastName: null,
  email: null,
  password: null,
  linkedIn: null,
  teamSort: "0",
  tagline: null,
  status: true,
  alternatePhoneNo: null,
  alternateEmailId: null,
  mobile: null,
  showOnTeam: false,
  createdAt: null
}

export const Pet_And_Parking_Charges_Type = [
  { label: 'Select', value: '' },
  { label: 'One Time', value: 'OneTime' },
  { label: 'Monthly', value: 'Monthly' },
]

export const FEATURETTE_REQUEST = {
  unitId: null,
  heading: null,
  subheading: null,
  lead: null,
  enabled: false,
  link: null,
  position: null
}


export const OWNER_INQUIRY_EDIT = {
  unitNumber: "",
  address: {
    addressLine1: "",
    state: "",
    city: "",
    counrty: "",
    postalCode: "",
  },
  neighborhood: "",
  unitSize: 0,
  unitBathrooms: "",
  halfBathroomCount: "",
  unitBedrooms: "",
  propertyAvailableFrom: "",
  minimumReservationTerm: 0,
  inquiryNote: "",
  internalNote: "",
  directionality: ""
}


export const BUILDING_AMMENITIES = [
  {
    label: "Deck", value: "Deck"
  },
  {
    label: "Skylight", value: "Skylight"
  },
  {
    label: "View", value: "View"
  },
  {
    label: "Sofa Bed", value: "Sofa Bed"
  },
  {
    label: "Oven", value: "Oven"
  },
  {
    label: "Microwave", value: "Microwave"
  },
  {
    label: "Dishwasher", value: "Dishwasher"
  },
  {
    label: "Fenced Yard", value: "Fenced Yard"
  },
  {
    label: "Fitness Center in Building", value: "Fitness Center in Building"
  },
  {
    label: "Pool", value: "Pool"
  },
  {
    label: "Wireless Internet Included", value: "Wireless Internet Included"
  },
  {
    label: "Hardwood Floors", value: "Hardwood Floors"
  },
  {
    label: "King Bed", value: "King Bed"
  },
  {
    label: "Bed #2 - Queen", value: "Bed #2 - Queen"
  },
  {
    label: "A/C - Central", value: "A/C - Central"
  },
  {
    label: "Hardwood Floors - Wide Plank", value: "Hardwood Floors - Wide Plank"
  },
  {
    label: "Security System", value: "Security System"
  },
  {
    label: "Hardwood Floors - Brazilian Cherry", value: "Hardwood Floors - Brazilian Cherry"
  },
  {
    label: "Two Twin Bedroom", value: "Two Twin Bedroom"
  },
  {
    label: "Bidet Toilet Combo", value: "Bidet Toilet Combo"
  },
  {
    label: "Washer/Dryer in Unit", value: "Washer/Dryer in Unit"
  },
  {
    label: "Elevator", value: "Elevator"
  },
  {
    label: "Travertine Marble Floors", value: "Travertine Marble Floors"
  },
  {
    label: "Wood Floors", value: "Wood Floors"
  },
  {
    label: "Carpet in bedrooms", value: "Carpet in bedrooms"
  },
  {
    label: "High Ceilings", value: "High Ceilings"
  },
  {
    label: "Washer/dryer in building - card-op", value: "Washer/dryer in building - card-op"
  },
  {
    label: "Den", value: "Den"
  },
  {
    label: "Bathtub", value: "Bathtub"
  },
  {
    label: "A/C- Air Conditioning", value: "A/C- Air Conditioning"
  },
  {
    label: "Front Desk", value: "Front Desk"
  },
  {
    label: "Private Outdoor Space", value: "Private Outdoor Space"
  },
  {
    label: "Shared Outdoor Spaces", value: "Shared Outdoor Spaces"
  },
  {
    label: "Desk/Office", value: "Desk/Office"
  },
  {
    label: "Working Fireplace", value: "Working Fireplace"
  },
  {
    label: "Bike Storage", value: "Bike Storage"
  },
  {
    label: "King Bed", value: "King Bed"
  },
  {
    label: "Queen Bed", value: "Queen Bed"
  },
  {
    label: "Upgraded Kitchen Appliances", value: "Upgraded Kitchen Appliances"
  },
  {
    label: "Private Balcony", value: "Private Balcony"
  },
  {
    label: "Private Rooftop", value: "Private Rooftop"
  },
  {
    label: "Walk In Closet", value: "Walk In Closet"
  },
  {
    label: "Club Room / Party Room", value: "Club Room / Party Room"
  },
  {
    label: "Shared Rooftop", value: "Shared Rooftop"
  },
  {
    label: "Washer/Dryer- in building - Shared", value: "Washer/Dryer- in building - Shared"
  },
  {
    label: "Full Size Bed", value: "Full Size Bed"
  },
  {
    label: "Parking", value: "Parking"
  },
]

export const STATE_CODE = [
  {
    label: "Select", value:""
  },
  {
    label: "District of Columbia", value: "District of Columbia"
  },
  {
    label: "Virginia", value: "Virginia"
  },
  {
    label: "Maryland", value: "Maryland"
  }
]

export const ASSET_TIER = [
  {
    label: "Select Asset Tier", value:""
  },
  {
    label: "Studio Basic", value: "Studio Basic"
  },
  {
    label: "1 Bedroom Standard Plus", value: "1 Bedroom Standard Plus"
  },
  {
    label: "Studio Standard", value: "Studio Standard"
  },
  {
    label: "Studio Premier", value:"Studio Premier"
  },
  {
    label: "Studio Elite", value: "Studio Elite"
  },
  {
    label: "1 Bedroom Basic", value: "1 Bedroom Basic"
  },
  {
    label: "1 Bedroom Standard", value: "1 Bedroom Standard"
  },
  {
    label: "1 Bedroom Premier", value:"1 Bedroom Premier"
  },
  {
    label: "1 Bedroom Elite", value: "1 Bedroom Elite"
  },
  {
    label: "2 Bedroom Basic", value: "2 Bedroom Basic"
  },
  {
    label: "2 Bedroom Standard", value: "2 Bedroom Standard"
  },
  {
    label: "2 Bedroom Premier", value:"2 Bedroom Premier"
  },
  {
    label: "2 Bedroom Elite", value: "2 Bedroom Elite"
  },
  {
    label: "3 Bedroom Basic", value: "3 Bedroom Basic"
  },
  {
    label: "3 Bedroom Standard", value: "3 Bedroom Standard"
  },
  {
    label: "3 Bedroom Premier", value:"3 Bedroom Premier"
  },
  {
    label: "3 Bedroom Elite", value: "3 Bedroom Elite"
  },
  {
    label: "4 Bedroom Basic", value: "4 Bedroom Basic"
  },
  {
    label: "4 Bedroom Standard", value: "4 Bedroom Standard"
  },
  {
    label: "4 Bedroom Premier", value: "4 Bedroom Premier"
  },
  {
    label: "4 Bedroom Elite", value: "4 Bedroom Elite"
  },
]

export const BLOCK_DATE_STATUS = [
  {label: "Select", value:""},
  {label: "Approved", value:"Approved"},
  {label: "Pending", value:"Pending"},
]

export const REGIONS = [
  {label: "Select a Region", value:""},
  {label: "District of Columbia, Virginia and Maryland", value:"District of Columbia, Virginia and Maryland"},
]

export const MANAGED_STATUS_TYPE =[  {
    label: 'Managed - Active', value:  1
  },
  {
    label: 'Managed - Inactive', value: 2
  },
  {
    label: 'Not Managed - Active', value: 3
  },
  {
    label: 'Not Managed - Inactive', value: 4
  },
  {
    label: 'Not Applicable', value: 5
  },
  {
    label: 'Rejected', value: 6
  }
];

export const ADMIN_PROPERTY_DATA = {
  generalInfo: {
    name: null,
    description: null,
    isUnderNegotiation: false,
    isPromoted: false,
    videoUrl: null,
    airbnbFeedUrl: null,
    availableFrom: null,
    availableUntil: null,
    minimumStayRequired: 30,
    isMinimumStayStrict: false,
    annualRevenueGoal: null
  },
  propertyStatus: {
    ownerId: null,
    multipleOwnersId: [],
    leasingManagerId: null,
    managedStatus: 2,
    bookingWindowGap: 0,
    managedNote: null,
    leasingNote: null,
    welcomeLetter: null,
    unfurnished: false,
    dailyRate: null,
    assetTier: null,
    annualDailyRate: null,
    isOverrideDailyRateAllowed: false,
    isDynamicPricingAllowed: true,
    floorRate: null,
    monthlyRate: null,
    managementFees: '20.00',
    isPropertyAvailableOnDiscount: false,
    birthday: null,
    lastCleaning: null,
    lastQC: null,
    lastQCBy: null,
    orbirentalPropertyId: null,
    approvalForZillow: false
  },
  propertyAddress: {
    region: null,
    neighborhoodId: null,
    buildingId: null,
    unitNumber: null,
    streetAddress: null,
    directionality: null,
    city: null,
    stateCode: null,
    zipCode: null,
    county: null,
    country: null,
    directions: null,
    longitude: null,
    latitude: null,
    elevation: null
  },
  propertyDetails: {
    fullBedrooms: null,
    fullBathrooms: null,
    halfBathrooms: null,
    isPetsAllowed: false,
    oneTimePetFees: null,
    petRegulations: null,
    hasParking: false,
    parkingIncludeInRent: false,
    dailyParkingFees: null,
    parkingDescription: null,
    internalParkingDescription: null,
    livingAreaSquareFoot: null,
    levelsInUnit: null
  },
  accessibility: {
    isAccessDisabled: false,
    disabledNote: null
  },
  features: {
    amenities: []
  },
  taxInfo: {
    parcelId: null,
    square: null,
    suffix: null,
    lot: null
  },
  operations: {
    guestServicesId: null,
    opsManagerId: null,
    ownerContractorDetails: null,
    isOwnerContractor: false,
    birdwatch: false,
    hostfullyUrl: null,
    propertyPhone: null,
    lbCode: null,
    lbInfo: null,
    networkName: null,
    networkPass: null,
    internetAccountInfo: null,
    ipAddress: null,
    isAutomateInstructions: false,
    videoUrl: null,
    arrivalInfo: null,
    departureInfo: null,
    hvacInfo: null,
    acFilterSize: null,
    isSnowRemovalRequired: false,
    isLeafyDrain: false,
    isBuildingControlsHvac: false,
    isHvacMaintenanceProgram: false,
    buildingHvacNote: null,
    isWindowAcUnitsAvailable: false,
    fobNumbers: null,
    maintenanceInfo: null,
    maintenancePhone: null,
    maintenanceNote: null
  }
}

export const ADMIN_EDIT_PROPERTY_DATA = {
  generalInfo: {
    isOwnerContractor: false,
    ownerContractorDetails: null,
    birdwatch: false,
    available: null,
    listingTitle: null,
    isExtensionPossible: false, 
    name: null,
    description: null,
    isUnderNegotiation: false,
    isPromoted: false,
    videoUrl: null,
    airbnbFeedUrl: null,
    availableFrom: null,
    availableUntil: null,
    minimumStayRequired: null,
    isMinimumStayStrict: false,
    //annualRevenueGoal: null
  },
  propertyStatus: {
    ownerId: null,
    multipleOwnersId: [],
    leasingManagerId: null,
    managedStatus: 2,
    bookingWindowGap: 0,
    managedNote: null,
    leasingNote: null,
    welcomeLetter: null,
    unfurnished: false,
    dailyRate: null,
    annualDailyRate: null,
    isOverrideDailyRateAllowed: false,
    isDynamicPricingAllowed: false,
    floorRate: null,
    monthlyRate: null,
    managementFees: null,
    birthday: null,
    isPropertyAvailableOnDiscount: false,
    approvalForZillow: false
  },
  propertyAddress: {
    region: null,
    neighborhoodId: null,
    buildingId: null,
    unitNumber: null,
    streetAddress: null,
    directionality: null,
    city: null,
    stateCode: null,
    zipCode: null,
    county: null,
    country: null,
    directions: null,
    longitude: null,
    latitude: null,
    elevation: null
  },
  propertyDetails: {
    fullBedrooms: null,
    fullBathrooms: null,
    halfBathrooms: null,
    isPetsAllowed: false,
    oneTimePetFees: null,
    petRegulations: null,
    hasParking: false,
    parkingIncludeInRent: false,
    dailyParkingFees: null,
    parkingDescription: null,
    internalParkingDescription: null,
    livingAreaSquareFoot: null,
    levelsInUnit: null,
    propertyType: null,
    propertyBuiltYear: null,
    propertyLastRenovated: null,
    isBedroomsWithoutBed: "No",
    isPropertyDenOrStudy: "No",
    isBathroomsHaveBathtub: "No",
    showerDescription: null,
    bathroomDescription: null,
    isStairCaseAvailable: "No",
    propertyMoreThanOneFloorDescription: null,
    buildingFloorsCount: null,
    propertyFloorLocatedAt: null,
    petRestrictions: "No",
    propertyApproxArea: null
  },
  accessibility: {
    isAccessDisabled: false,
    disabledNote: null
  },
  features: {
    amenities: []
  },
  taxInfo: {
    parcelId: null,
    square: null,
    suffix: null,
    lot: null
  },
  operations: {
    guestServicesId: null,
    opsManagerId: null,
    hostfullyUrl: null,
    propertyPhone: null,
    lbCode: null,
    lbInfo: null,
    networkName: null,
    networkPass: null,
    internetAccountInfo: null,
    ipAddress: null,
    isAutomateInstructions: false,
    videoUrls: null,
    arrivalInfo: null,
    departureInfo: null,
    hvacInfo: null,
    acFilterSize: null,
    isSnowRemovalRequired: false,
    isLeafyDrain: false,
    isBuildingControlsHvac: false,
    isHvacMaintenanceProgram: false,
    buildingHvacNote: null,
    isWindowAcUnitsAvailable: false,
    fobNumbers: null,
    maintenanceInfo: null,
    maintenancePhone: null,
    maintenanceNote: null
  },
  ownerGoalsInfo: {
    expectedAnnualRentalIncome: null,
    flexibilityInTermsOfReturningProp: null,
    propertyUsageOrSchedule: null,
    leadTimeRequireToListProperty: null,
    propertyBtwNowAndAvailabilityDate: null,
    lockedClosetPropertyBelongings: "No",
    restrictionsOnLengthOfListing: null
  },
  outsideInfo: {
    isYardOrOutsideAreaAvailable: "No",
    outsideAreaSquareFeet: null,
    isOutsideAreaMaintainedByGardener: "No",
    isPropertyHavingBalcony: "No",
    isPropertyHavingOutdoorFurniture: "No",
    isOutdoorFurnitureWinterize: "No",
    isOutdoorAreaShared: null,
    perimeterProperty: null,
    deckOrShelteredAreaDesc: null,
    isHomeNeededToWinterize: "No",
    isLockedStorageOutsideUnit: "No",
    anyOtherOutsideSpaceDesc: null
  },
  roofAreaInfo: {
    isRoofManaged: "No",
    isGreenSpaceAreaAvailable: "No",
    isRoofShared: "No"
  },
  propertyInterior: {
    furnitureLastReplaced: null,
    isPlanningToRefreshFurnishing: "No",
    isMasterBedroomEnSuiteBathroom: "No",
    isMoreThanOneEnSuite: "No",
    closetsDescription: null,
    isDaybedPullOutBedOrSofaSpace: "No",
    isPropertyWithBlinds: "No",
    isPropertyWithFireplace: "No",
    fireplaceFuelType: null,
    fireplaceLastServiced: null,
    fireplaceCurrentlyMaintenanceNote: null
  },
  bedsInfo: {
    isBedFramesHeadboards: "No",
    bedroomConfigurationDesc: null,
    eachMattressSizeDesc: null,
    eachMattressAgeDesc: null,
    eachMattressMaterialDesc: null
  },
  applianceInfo: {
    dishwasherMakeAndModelDesc: null,
    ovenMakeModelDesc: null,
    stoveDesc: null,
    washerAndDryerShared: null,
    washerDryerAccessDesc: null,
    isPropertyWithHDTVs: "No",
    eachTelevisionDesc: null,
    specialtyAppliancesDesc: null
  },
  marketingInfo: {
    isBusinessLicense: "No",
    isAssistanceRequiredForBusinessLicense: "No",
    closestMetroStopsDesc: null,
    isSecurePackageAcceptance: "No",
    isFloorPlanAvailable: "No",
    isFloorAssistanceRequired: "No"
  },
  maintenanceInfo: {
    acSystemDesc: null,
    heatingSystemDesc: null,
    thermostatLocation: null,
    trashLocation: null,
    isKeyRequiredToAccessTrash: "No",
    breakerFuseLocation: null,
    waterShutOffValveLocation: null,
    hotWaterServiceDesc: null,
    importantMailSentDesc: null,
    buildingOrPropertyAccessInfoDesc: null,
    propertyLastPainted: null,
    hvacServiceProvider: null,
    isContractorInspected: "No",
    repairsNotAllowedDesc: null,
    repairItemsDesc: null
  },
  keysInfo: {
    keyDetail: null,
    setOfKeys: null,
    isKeyRequiredToAccessBuilding: "No",
    isGarageDoorOpener: "No",
    isKeyRequiredToAccessMailBox: "No"
  },
  utilityInfo: {
    electricityProviderDesc: null,
    gasProviderDesc: null,
    waterProviderDesc: null,
    cableProviderDesc: null,
    routerLocationDesc: null,
    premiumServiceDesc: null
  },
  insuranceInfo: {
    isHomeOrBuildingInsurance: "No",
    buildingInsuranceProviderDetail: null,
    buildingPolicyDetails: null,
    isContentInsuranceAvailable: "No",
    contentInsuranceProviderDetail: null,
    isInsuranceContentRequiredBeforeAnyRepair: "No",
    isContentRequireByAttachToInsurer: "No",
    contentPolicyDetails: null
  }
}

export const IDENTIFY_PROPERTY_TYPE = [
  {
    label: 'Please Select', value: ''
  },
  {
    label: 'Stand-alone home', value: 'Stand-alone home'
  },
  {
    label: 'Row house', value: 'Row house'
  },
  {
    label: 'Condo', value: 'Condo'
  },
  {
    label: 'Apartment', value: 'Apartment'
  },
  {
    label: 'Other', value: 'Other'
  },
]

export const YES_NO = [
  {
    label: 'No', value: 'No'
  },
  {
    label: 'Yes', value: 'Yes'
  },
]

export const FIRE_PLACE_TYPE = [
  {
    label: 'Please Select', value: ''
  },
  {
    label: 'Wood', value: 'Wood'
  },
  {
    label: 'Gas', value: 'Gas'
  },
  {
    label: 'Elecric', value: 'Elecric'
  },
]

export const SHARED_OUTSIDE = [
  {
    label: 'Please Select', value: ''
  },
  {
    label: 'Shared as a common area', value: 'Shared as a common area'
  },
  {
    label: 'Shared with a small number of other people', value: 'Shared with a small number of other people'
  },
  {
    label: 'Private / exclusive to this listing', value: 'Private / exclusive to this listing'
  },
]

export const WASHER_DRYER_SHARED = [
  {
    label: 'Please Select', value: ''
  },
  {
    label: 'Private use', value: 'Private use'
  },
  {
    label: 'Shared - pay for use', value: 'Shared - pay for use'
  },
  {
    label: 'Shared - free for use', value: 'Shared - free for use'
  },
]

export const BlogStatus = [
  {
    label: 'Draft', value: 'draft'
  },
  {
    label: 'Published', value: 'published'
  },
]

export const BlogCommentStatus = [
  {
    label: 'Open', value: 'open'
  },
  {
    label: 'Closed', value: 'closed'
  },
]

export const SuggestionPropertyFilters = [
  {
    label: 'Bedroom', value: 'bedroomTitle'
  },
  {
    label: 'Minimum lease term', value: 'minimumLeaseTerm'
  },
  {
    label: 'Neighborhood', value: 'neighbourhoodsNames'
  },
  {
    label: 'Arrival Start', value: 'arrivalStart'
  },
  {
    label: 'Arrival End', value: 'arrivalEnd'
  },
  {
    label: 'Arrival Until', value: 'arrivalUntil'
  },
  {
    label: 'Daily Rate', value: 'budgetMin'
  },
  {
    label: 'Pet Friendly', value: 'pets'
  },
  {
    label: 'Parking', value: 'parking'
  },
]

export const MINIMUM_LEASE = [
  {
    title: '30 Days',
    value: '30 Days'
  },
  {
    title: '60 Days',
    value: '60 Days'
  },
  {
    title: '90 Days',
    value: '90 Days'
  },
  {
    title: '120 Days',
    value: '120 Days'
  },
  {
    title: '180 Days',
    value: '180 Days'
  },
  {
    title: '180+ Days',
    value: '180+ Days'
  },
]

export const CLEANING_FREQUENCY = [
  {
    label: 'Select',
    value: 0
  },
  {
    label: 'Weekly',
    value: 1,
    days: 7
  },
  {
    label: 'Two Weeks',
    value: 2,
    days: 14
  },
  {
    label: 'Three Weeks',
    value: 3,
    days: 21
  },
  {
    label: 'Four Weeks',
    value: 4,
    days: 28
  }
]


export const LEASE_TYPE_FILTER = {
  ALL: "all",
  CURRENT: "current",
  FUTURE: "future",
  PAST: "past",
  CURRENT_AND_PAST: "currentAndPast",
  CURRENT_AND_FUTURE: "currentAndFuture",
  INPREPARATION: "inpreparation"
}

export const ADD_EDIT_LEASE = {
  propertyId: null,
  guests: [],
  guarantorId: null,
  billingContactId: null,
  alternativeNameOnLease: null,
  renterType: 0,
  leasingAgentId: null,
  status: 5,
  numberOfPersons: 1,
  leaseStartDate: null,
  leaseEndDate: null,
  ratePerDay: null,
  extensionAllowed: false,
  noticeToExtendDays: 45,
  isNightlyRate: false,
  monthToMonth: false,
  billingMonthly: false,
  billingMonthlyDaily: true,
  hasParking: false,
  parkingFee: null,
  parkingDescription: null,
  petsAllowed: false,
  petFee: null,
  petDescription: null,
  departureCleaningFee: null,
  serviceFee: 2.5,
  recurringCleaning: false,
  recurringCleaningFrequency: null,
  recurringCleaningStartDate: null,
  recurringCleaningNote: null,
  recurringCleaningRate: null,
  generateRecurringCleaningSchedule: false,
  taxExempt: false,
  taxExemptReason: null,
  isPerDiem: false,
  perDiemType: 0,
  isDualPerDiem: false,
  perDiemStartDate: null,
  perDiemPercentage: 0.00,
  generateBillingSchedule: false,
  template_id: null,
  includedLineItems: true,
  note: null,
  ownerNote: null,
  sendLeaseFinalizeEmail: false
}

export const RENT_PAYMENT_TYPE = [
  {
    label : 'Select Type',
    value: 0
  },
  {
    label : 'Standard Rent',
    value: 10
  },
  {
    label : 'Per Diem Rent',
    value: 20
  },
  {
    label : 'Parking',
    value: 30
  },
  {
    label : 'Pet Fee',
    value: 40
  },
  {
    label : 'Service Fee',
    value: 50
  },
  {
    label : 'Departure Cleaning',
    value: 60
  },
  {
    label : 'Recurring Cleaning',
    value: 70
  },
  {
    label : 'One Time Cleaning',
    value: 80
  },
  {
    label : 'Tax',
    value: 90
  },
  {
    label : 'Monthly Rent',
    value: 100
  },
  {
    label : 'Security Deposit',
    value: 120
  },
  {
    label : 'Gym Membership',
    value: 130
  },
  {
    label : 'Operational Charge',
    value: 140
  },
  {
    label : 'Lockout',
    value: 150
  },
  {
    label : 'Other',
    value: 160
  },
  {
    label : 'Late Fee',
    value: 170
  },
  {
    label : 'Credit',
    value: 180
  }
]

export const INVOICE_TRANSACTION_STATUS = [
  {
    label : 'Success',
    value: '1'
  },
  {
    label : 'Declined',
    value: '2'
  },
  {
    label : 'Processing',
    value: '3'
  },
  {
    label : 'Paid Out',
    value: '4'
  },
  {
    label : 'Returned',
    value: '5'
  },
  {
    label : 'Returned NSF',
    value: '6'
  },
  {
    label : 'NSF',
    value: '7'
  },
  {
    label : 'Reversed',
    value: '8'
  },
  {
    label : 'Declined Credit Card',
    value: '9'
  },
  {
    label: 'Void',
    value: '10'
  }
]



