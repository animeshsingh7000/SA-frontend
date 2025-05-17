export interface IAttacheRentalProperty {
  propertyDetails?: IPropertyDetails;
  ownerGoals?: IOwnerGoals;
  propertyDetailInfo?: IPropertyDetailInfo;
  outsideSpace?: IOutsideSpace;
  propertyInterior?: IPropertyInterior;
  beds?: IBeds;
  appliancesAndKitchenEquipment?: IAppliancesAndKitchenEquipment;
  marketingAndAdministration?: IMarketingAndAdministration;
  maintenanceAndOperation?: IMaintenanceAndOperation;
  keys?: IKeys;
  utilities?: IUtilities;
  insurance?: IInsurance;
}

export interface IPropertyDetails {
  propertyRegion?: string;
  neighborhood?: string;
  propertyType?: string; // buildium (Rental Type)
  streetAddress?: string; // buildium (Property Name, AddressLine 1 - Property/Unit)
  unitNumber?: string; // buildium (UnitNumber)
  directionality?: string;
  city?: string; // buildium (Property/Unit)
  postalCode?: string; // buildium (Property/Unit)
  state?: string; // buildium (Property/Unit)
  country?: string; // buildium (Property/Unit)
  Features?: string[];
  IncludedInRent?: string[];
}

export interface IOwnerGoals {
  expectedAnnualRentalIncome?: string;
  propertyUsageOrSchedule?: string;
  leadTimeRequireToListProperty?: string;
  propertyBtwNowAndAvailabilityDate?: string;
  lockedClosetPropertyBelongings?: string;
}

export interface IPropertyDetailInfo {
  propertyBuiltYear?: number; // yearBuilt // buildium
  propertyLastRenovated?: string;
  isBedroomsWithoutBed?: string;
  isPropertyDenOrStudy?: string;
  fullBathroomCount?: string; // buildium
  halfBathroomCount?: string;
  isBathroomsHaveBathtub?: string;
  showerDescription?: string;
  bathroomDescription?: string;
  propertyApproxArea?: string; // (in square feet)
  isParking?: string; // buildium (Property -> Feature (Parking)) // Amenities
  floorsListingCount?: number;
  isStairCaseAvailable?: string;
  propertyMoreThanOneFloorDescription?: string;
  buildingFloorsCount?: number;
  propertyFloorLocatedAt?: number;
  isPetsAllowed?: string; // buildium (Unit -> Feature (PetsAllowed)) // Amenities
}

export interface IOutsideSpace {
  isYardOrOutsideAreaAvailable?: string;
}

export interface IPropertyInterior {
  isPropertyFurnished?: string;
  furnitureLastReplaced?: string;
  isPlanningToRefreshFurnishing?: string;
  floorType?: string[];
  isMasterBedroomEnSuiteBathroom?: string;
  isMoreThanOneEnSuite?: string;
  closetsDescription?: string;
  isDaybedPullOutBedOrSofaSpace?: string;
  isPropertyWithBlinds?: string;
  isPropertyWithFireplace?: string;
}

export interface IBeds {
  bedroomCount?: string; //buildium (Unit -> UnitBedrooms)
  bedAndMattressType?: string[];
  isBedFramesHeadboards?: string;
  bedroomConfigurationDesc?: string;
  eachMattressSizeDesc?: string;
  eachMattressAgeDesc?: string;
  eachMattressMaterialDesc?: string;
}

export interface IAppliancesAndKitchenEquipment {
  kitchenEquipmentDesc?: string[];
  dishwasherMakeAndModelDesc?: string;
  ovenMakeModelDesc?: string;
  stoveDesc?: string;
  washerAndDryerShared?: string;
  washerDryerAccessDesc?: string;
  isPropertyWithHDTVs?: string;
  eachTelevisionDesc?: string;
  specialtyAppliancesDesc?: string;
}


export interface IMarketingAndAdministration {
  isBusinessLicense?: string;
  isAssistanceRequiredForBusinessLicense?: string;
  isStrictMinimumLeaseTerm?: string;
  minimumReservationTerm?: number;
  propertyAvailableFrom?: Date;
  propertyAvailableUntil?: Date;
  closestMetroStopsDesc?: string;
  sharedAmenitiesDesc?: string[];
  isSecurePackageAcceptance?: string;
  isFloorPlanAvailable?: string;
  isFloorAssistanceRequired?: string;
  highlightFeaturesDesc?: string[] | string;
}

export interface IMaintenanceAndOperation {
  acSystemDesc?: string;
  acFilterSize?: number | string;
  hvacServiceProvider?: string;
  heatingSystemDesc?: string;
  thermostatLocation?: string;
  trashLocation?: string;
  isKeyRequiredToAccessTrash?: string;
  breakerFuseLocation?: string;
  waterShutOffValveLocation?: string;
  hotWaterServiceDesc?: string;
  importantMailSentDesc?: string;
  buildingOrPropertyAccessInfoDesc?: string;
  propertyLastPainted?: string;
  isContractorInspected?: string;
  repairsNotAllowedDesc?: string;
  repairItemsDesc?: string;
}

export interface IKeys {
  keyDetail?: string;
  setOfKeys?: number | string;
  isKeyRequiredToAccessBuilding?: string;
  isGarageDoorOpener?: string;
  isKeyRequiredToAccessMailBox?: string;
}

export interface IUtilities {
  electricityProviderDesc?: string;
  waterProviderDesc?: string;
  cableProviderDesc?: string;
  wirelessNetworkName?: string;
  wirelessNetworkPassword?: string;
  routerLocationDesc?: string;
  premiumServiceDesc?: string;
}

export interface IInsurance {
  isHomeOrBuildingInsurance?: string;
  isContentInsuranceAvailable?: string;
  isInsuranceContentRequiredBeforeAnyRepair?: string;
  isContentRequireByAttachToInsurer?: string;
}
