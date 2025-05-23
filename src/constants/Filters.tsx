export const RENTER_TABLE_COLUMNS = [
    { id: 'fullName', label: 'Name', visible: true, sortBy:true,  isBoolean: false, formateDate: false },
    { id: 'email', label: 'Email', visible: true, sortBy:true,  isBoolean: false, formateDate: false },
    { id: 'lengthOfStay', label: 'Length Of Stay', visible: true, sortBy:true,  isBoolean: false, formateDate: false },
    { id: 'matchingPropertyUrl', label: 'Matching Property URL', visible: false, sortBy:false,  isBoolean: false, formateDate: false },
    { id: 'createdAt', label: 'Submitted On', visible: true, sortBy:true,  isBoolean: false, formateDate: true },
    { id: 'estimatedArrivalEstimatedDeparture', label: 'Estimated Arrival - Estimated Departure', visible: true, sortBy:false,  isBoolean: false, formateDate: true },
    { id: 'estimatedArrivalDate', label: 'Estimated Arrival', visible: true, sortBy:true,  isBoolean: false, formateDate: true },
    { id: 'isArrivalDateFlexible', label: 'Is your arrival date flexible?', visible: false, sortBy:true,  isBoolean: true, formateDate: false },
    { id: 'estimatedDepartureDate', label: 'Estimated Departure', visible: true, sortBy:true,  isBoolean: false, formateDate: true },
    { id: 'isDepartureDateFlexible', label: 'Is your departure date flexible?', visible: false, sortBy:true,  isBoolean: true, formateDate: false },
    { id: 'maxBudget', label: 'Budget', visible: true, sortBy:true,  isBoolean: false, formateDate: false },
    { id: 'firstPriority', label: 'First Priority', visible: true, sortBy:true,  isBoolean: false, formateDate: false },
    { id: 'secondPriority', label: 'Second Priority', visible: true, sortBy:true,  isBoolean: false, formateDate: false },
    { id: 'thirdPriority', label: 'Third Priority', visible: true, sortBy:true,  isBoolean: false, formateDate: false },
    { id: 'lastDecisionDate', label: 'Latest Decision Date', visible: false, sortBy:true,  isBoolean: false, formateDate: true },
    { id: 'isASAP', label: 'Decision ASAP', visible: false, sortBy:true,  isBoolean: true, formateDate: false },
    { id: 'isCallMe', label: 'Requests Call Back', visible: true, sortBy:true,  isBoolean: true, formateDate: false },
    { id: 'minimumNumberOfBeds', label: 'Number of Bedrooms', visible: false, sortBy:true,  isBoolean: false, formateDate: false },
    { id: 'minimumNumberOfBathrooms', label: 'Number of Bathrooms', visible: false, sortBy:true,  isBoolean: false, formateDate: false },
    { id: 'occupantCount', label: 'Number of Occupants', visible: false, sortBy:true,  isBoolean: false, formateDate: false },
    { id: 'isParking', label: 'Need Parking', visible: false, sortBy:true,  isBoolean: true, formateDate: false },
    { id: 'isPetAllowed', label: 'Pet Friendly ?', visible: false, sortBy:true,  isBoolean: true, formateDate: false },
    { id: 'organization', label: 'Organization', visible: true, sortBy:true,  isBoolean: false, formateDate: false },
    { id: 'rentalInquiryUpdateStatus', label: 'Status', visible: true, sortBy:true,  isBoolean: false, formateDate: false },
];

export const SUGGESTED_TABLE_COLUMNS = [
    { id: 'availableFrom', label: 'Available', visible: true, sortBy:true,  isBoolean: false, formateDate: true },
    { id: 'propertyUrl', label: 'Property URL', visible: true, sortBy:true,  isBoolean: false, formateDate: false },
    { id: 'unitBedrooms', label: 'Bedroom', visible: true, sortBy:true,  isBoolean: false, formateDate: false },
    { id: 'unitBathrooms', label: 'Full Baths', visible: true, sortBy:true,  isBoolean: false, formateDate: false },
    
    { id: 'halfBathroomCount', label: 'Half Baths', visible: true, sortBy:true,  isBoolean: false, formateDate: false },
    { id: 'unitSquareFoot', label: 'Square Footage', visible: true, sortBy:false,  isBoolean: false, formateDate: false },
    { id: 'neighborhood', label: 'Neighborhood', visible: true, sortBy:true,  isBoolean: false, formateDate: false },
    { id: 'petsAllowed', label: 'Pets Allowed', visible: true, sortBy:true,  isBoolean: true, formateDate: false },
    
    { id: 'parkingAllowed', label: 'Has Parking', visible: true, sortBy:true,  isBoolean: true, formateDate: false },
    { id: 'minimumStayRequired', label: 'Minimum Reservation Term', visible: false, sortBy:true,  isBoolean: false, formateDate: false },
    { id: 'availableTill', label: 'Available Until', visible: true, sortBy:true,  isBoolean: false, formateDate: true },
    { id: 'dailyRate', label: 'Daily Rate', visible: true, sortBy:true,  isBoolean: false, formateDate: false },
    
    { id: 'totalRent', label: 'Total Rent', visible: true, sortBy:true,  isBoolean: false, formateDate: false },
    { id: 'preference', label: 'Preference', visible: true, sortBy:true,  isBoolean: false, formateDate: false },
];

export const BLOCK_DATES_TABLE_COLUMNS = [
    { id: 'propertyName', label: 'Property', visible: true, sortBy:true,  isBoolean: false, formateDate: false },
    { id: 'primaryGuestName', label: 'Primary Guest', visible: true, sortBy:true,  isBoolean: false, formateDate: false },
    { id: 'ownerEmail', label: 'Owner Email', visible: false, sortBy:true,  isBoolean: false, formateDate: false },
    { id: 'startDate', label: 'Arrival', visible: true, sortBy:true,  isBoolean: false, formateDate: true },
    { id: 'endDate', label: 'Departure', visible: true, sortBy:true,  isBoolean: false, formateDate: true },
    { id: 'createdAt', label: 'Created', visible: true, sortBy:true,  isBoolean: false, formateDate: true },
    { id: 'leaseType', label: 'Lease Type', visible: false, sortBy:true,  isBoolean: false, formateDate: false },
    { id: 'blockDateStatus', label: 'Status', visible: true, sortBy:true,  isBoolean: false, formateDate: false },
    { id: 'action', label: 'Action', visible: true, sortBy:false,  isBoolean: false, formateDate: false },

]


export const ALL_PROPERTY_TABLE_COLUMNS = [
    { id: 'propertyName', label: 'Property Editor Link', visible: true, sortBy:true,  isBoolean: false, formateDate: false },
    // { id: 'propertyName', label: 'Property', visible: false, sortBy:true,  isBoolean: false, formateDate: false },
    { id: 'lastDeparture', label: 'Last Departure', visible: true, sortBy:true,  isBoolean: false, formateDate: true },
    { id: 'earliestAvailable', label: 'Earliest Departure', visible: true, sortBy:true,  isBoolean: false, formateDate: true },
    // { id: 'birdwatch', label: 'BirdWatch', visible: false, sortBy:true,  isBoolean: true, formateDate: false },
    { id: 'availableDate', label: 'Available', visible: true, sortBy:true,  isBoolean: false, formateDate: true },
    { id: 'bedrooms', label: 'Bedrooms', visible: false, sortBy:true,  isBoolean: false, formateDate: false },
    { id: 'neighborhood', label: 'Neighborhood', visible: false, sortBy:true,  isBoolean: false, formateDate: false },
    { id: 'monthlyRate', label: 'Monthly Rent', visible: false, sortBy:true,  isBoolean: false, formateDate: false },
    { id: 'websiteUrl', label: 'Property Url', visible: false, sortBy:true,  isBoolean: false, formateDate: false },
    { id: 'petAllowed', label: 'Pets Allowed', visible: false, sortBy:true,  isBoolean: true, formateDate: false },
    { id: 'parkingAllowed', label: 'Has Parking', visible: false, sortBy:true,  isBoolean: true, formateDate: false },
    { id: 'ops', label: 'Ops', visible: true, sortBy:true,  isBoolean: false, formateDate: false },
    { id: 'fullBathrooms', label: 'Full Bath', visible: false, sortBy:true,  isBoolean: false, formateDate: false },
    { id: 'halfBathrooms', label: 'Half Bath', visible: false, sortBy:true,  isBoolean: false, formateDate: false },
    { id: 'ownerNamesString', label: 'Onwer Name', visible: false, sortBy:true,  isBoolean: false, formateDate: false},
    { id: 'lastCleaning', label: 'Last Cleaning', visible: true, sortBy:true,  isBoolean: false, formateDate: true },
    { id: 'lastQcDate', label: 'Last QC', visible: true, sortBy:true,  isBoolean: false, formateDate: true },
]

export const ACTIVE_PROPERTY_TABLE_COLUMNS = [
    // { id: 'propertyName', label: 'Property Editor Link', visible: true, sortBy:true,  isBoolean: false, formateDate: false },
    { id: 'propertyName', label: 'Property', visible: true, sortBy:true,  isBoolean: false, formateDate: false },
    { id: 'lastDeparture', label: 'Last Departure', visible: false, sortBy:true,  isBoolean: false, formateDate: true },
    { id: 'earliestAvailable', label: 'Earliest Departure', visible: false, sortBy:true,  isBoolean: false, formateDate: true },
    // { id: 'birdwatch', label: 'BirdWatch', visible: true, sortBy:true,  isBoolean: true, formateDate: false },
    { id: 'availableDate', label: 'Available', visible: true, sortBy:true,  isBoolean: false, formateDate: true },
    { id: 'bedrooms', label: 'Bedrooms', visible: true, sortBy:true,  isBoolean: false, formateDate: false },
    { id: 'neighborhood', label: 'Neighborhood', visible: true, sortBy:true,  isBoolean: false, formateDate: false },
    { id: 'monthlyRate', label: 'Monthly Rent', visible: false, sortBy:true,  isBoolean: false, formateDate: false },
    { id: 'websiteUrl', label: 'Property Url', visible: true, sortBy:true,  isBoolean: false, formateDate: false },
    { id: 'petAllowed', label: 'Pets Allowed', visible: true, sortBy:true,  isBoolean: true, formateDate: false },
    { id: 'parkingAllowed', label: 'Has Parking', visible: true, sortBy:true,  isBoolean: true, formateDate: false },
    { id: 'ops', label: 'Ops', visible: false, sortBy:true,  isBoolean: false, formateDate: false },
    { id: 'fullBathrooms', label: 'Full Bath', visible: false, sortBy:true,  isBoolean: false, formateDate: false },
    { id: 'halfBathrooms', label: 'Half Bath', visible: false, sortBy:true,  isBoolean: false, formateDate: false },
    { id: 'ownerNamesString', label: 'Onwer Name', visible: false, sortBy:true,  isBoolean: false, formateDate: false},
    // { id: 'lastCleaning', label: 'Last Cleaning', visible: true, sortBy:true,  isBoolean: false, formateDate: true },
    // { id: 'lastQcDate', label: 'Last QC', visible: true, sortBy:true,  isBoolean: false, formateDate: true },
]

export const CURRENT_LEASE_TABLE_COLUMNS = [
    { id: 'propertyName', label: 'Property', visible: true, sortBy:true,  isBoolean: false, formateDate: false, isDollar:false },
    // { id: 'propertyName', label: 'Id', visible: false, sortBy:true,  isBoolean: false, formateDate: false },
    { id: 'primaryGuest', label: 'Primary Guest', visible: true, sortBy:true,  isBoolean: false, formateDate: false, isDollar:false  },
    { id: 'guestFirstName', label: 'Guest First Name', visible: false, sortBy:true,  isBoolean: false, formateDate: false, isDollar:false  },
    { id: 'guestLastName', label: 'Guest Last Name', visible: false, sortBy:true,  isBoolean: false, formateDate: false, isDollar:false  },
    { id: 'guestEmail', label: 'Guest Email', visible: false, sortBy:true,  isBoolean: false, formateDate: false, isDollar:false  },
    { id: 'alternativeName', label: 'Alternative Name', visible: false, sortBy:true,  isBoolean: false, formateDate: false, isDollar:false  },
    { id: 'ownerFirst', label: 'Owner First', visible: false, sortBy:true,  isBoolean: false, formateDate: false, isDollar:false  },
    { id: 'ownerLast', label: 'Owner Last', visible: false, sortBy:true,  isBoolean: false, formateDate: false, isDollar:false  },
    { id: 'ownerEmail', label: 'Owner Email', visible: false, sortBy:true,  isBoolean: false, formateDate: false, isDollar:false  },
    { id: 'leaseStartDate', label: 'Arrival', visible: true, sortBy:true,  isBoolean: false, formateDate: true, isDollar:false  },
    { id: 'leaseEndDate', label: 'Departure', visible: true, sortBy:true,  isBoolean: false, formateDate: true, isDollar:false  },
    { id: 'noticeToExtendDays', label: 'Notice to Extend', visible: true, sortBy:true,  isBoolean: false, formateDate: false, isDollar:false  },
    { id: 'ratePerDay', label: 'Daily/Nightly Rate', visible: true, sortBy:true,  isBoolean: false, formateDate: false, isDollar:true  },
    { id: 'createdAt', label: 'Created', visible: false, sortBy:true,  isBoolean: false, formateDate: true, isDollar:false  },
    { id: 'hasParking', label: 'Parking', visible: false, sortBy:true,  isBoolean: false, formateDate: false, isDollar:false  },
    { id: 'petsAllowed', label: 'Pets Allowed', visible: false, sortBy:true,  isBoolean: false, formateDate: false, isDollar:false  },
    { id: 'isPerDiem', label: 'Is Per Diem', visible: false, sortBy:true,  isBoolean: false, formateDate: false, isDollar:false  },
    { id: 'payment', label: 'Payments?', visible: false, sortBy:true,  isBoolean: true, formateDate: false, isDollar:false  },
    { id: 'extensionAllowed', label: 'Extension Allowed', visible: true, sortBy:true,  isBoolean: false, formateDate: false, isDollar:false  },
    { id: 'monthToMonth', label: 'Month to Month', visible: false, sortBy:true,  isBoolean: false, formateDate: false, isDollar:false  },
    { id: 'leaseType', label: 'Lease Type', visible: false, sortBy:true,  isBoolean: false, formateDate: true, isDollar:false  },
]


export const LEASE_TABLE_COLUMNS = [
    { id: 'propertyName', label: 'Property', visible: true, sortBy:true,  isBoolean: false, formateDate: false, isDollar:false  },
    // { id: 'propertyName', label: 'Id', visible: false, sortBy:true,  isBoolean: false, formateDate: false },
    { id: 'primaryGuest', label: 'Primary Guest', visible: true, sortBy:true,  isBoolean: false, formateDate: false },
    { id: 'guestFirstName', label: 'Guest First Name', visible: false, sortBy:true,  isBoolean: false, formateDate: false, isDollar:false  },
    { id: 'guestLastName', label: 'Guest Last Name', visible: false, sortBy:true,  isBoolean: false, formateDate: false, isDollar:false  },
    { id: 'guestEmail', label: 'Guest Email', visible: true, sortBy:true,  isBoolean: false, formateDate: false, isDollar:false  },
    { id: 'alternativeName', label: 'Alternative Name', visible: true, sortBy:true,  isBoolean: false, formateDate: false, isDollar:false  },
    { id: 'ownerFirst', label: 'Owner First', visible: true, sortBy:true,  isBoolean: false, formateDate: false, isDollar:false  },
    { id: 'ownerLast', label: 'Owner Last', visible: false, sortBy:true,  isBoolean: false, formateDate: false, isDollar:false  },
    { id: 'ownerEmail', label: 'Owner Email', visible: false, sortBy:true,  isBoolean: false, formateDate: false, isDollar:false  },
    { id: 'leaseStartDate', label: 'Arrival', visible: true, sortBy:true,  isBoolean: false, formateDate: true, isDollar:false  },
    { id: 'leaseEndDate', label: 'Departure', visible: true, sortBy:true,  isBoolean: false, formateDate: true, isDollar:false  },
    { id: 'noticeToExtendDays', label: 'Notice to Extend', visible: false, sortBy:true,  isBoolean: false, formateDate: false, isDollar:false  },
    { id: 'ratePerDay', label: 'Daily/Nightly Rate', visible: true, sortBy:true,  isBoolean: false, formateDate: false, isDollar:true  },
    { id: 'createdAt', label: 'Created', visible: true, sortBy:true,  isBoolean: false, formateDate: true, isDollar:false  },
    { id: 'hasParking', label: 'Parking', visible: true, sortBy:true,  isBoolean: false, formateDate: false, isDollar:false  },
    { id: 'petsAllowed', label: 'Pets Allowed', visible: true, sortBy:true,  isBoolean: false, formateDate: false , isDollar:false },
    { id: 'isPerDiem', label: 'Is Per Diem', visible: true, sortBy:true,  isBoolean: false, formateDate: false, isDollar:false  },
    { id: 'payment', label: 'Payments?', visible: true, sortBy:true,  isBoolean: true, formateDate: false, isDollar:false  },
    { id: 'extensionAllowed', label: 'Extension Allowed', visible: true, sortBy:true,  isBoolean: false, formateDate: false, isDollar:false  },
    { id: 'monthToMonth', label: 'Month to Month', visible: true, sortBy:true,  isBoolean: false, formateDate: false, isDollar:false  },
    { id: 'leaseType', label: 'Lease Type', visible: false, sortBy:true,  isBoolean: false, formateDate: false, isDollar:false  },
]

export const RECURRING_CLEANING_SCHEDULE = [
    { id: 'periodStart', label: 'Cleaning Date', visible: true, sortBy:true,  isBoolean: false, formateDate: true },
    { id: 'name', label: 'Property', visible: true, sortBy:true,  isBoolean: false, formateDate: false },
    { id: 'bedrooms', label: 'Bedrooms', visible: true, sortBy:true,  isBoolean: false, formateDate: false },
    { id: 'bathrooms', label: 'Full Bath*', visible: true, sortBy:true,  isBoolean: false, formateDate: false },
    { id: 'neighborhood', label: 'Neighborhood*', visible: true, sortBy:true,  isBoolean: false, formateDate: false },
    { id: 'operationsManagerName', label: 'Ops', visible: true, sortBy:true,  isBoolean: false, formateDate: false },
]