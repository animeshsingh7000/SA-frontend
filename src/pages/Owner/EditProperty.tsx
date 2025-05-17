import logo from "../../assets/images/attache-logo.svg";
import homeIcon from "../../assets/images/1077035.svg";
import { Button } from "react-bootstrap";
import { EDIT_PROPERTY_INITDATA, EDIT_PROPERTY_STEPS, ROLE } from "../../constants";
import { Form } from "react-final-form";
import { useEffect, useState } from "react";
import EditFirstForm from "../../components/Property/EditProperty/EditFirstForm";
import { ROUTE_NAVIGATION_PATH } from "../../routes/routes";
import { Link, useNavigate, useParams } from "react-router-dom";
import EditSecondForm from "../../components/Property/EditProperty/EditSecondForm";
import EditThirdForm from "../../components/Property/EditProperty/EditThirdForm";
import EditFourthForm from "../../components/Property/EditProperty/EditFourthForm";
import EditFifthForm from "../../components/Property/EditProperty/EditFifthForm";
import EditSixthForm from "../../components/Property/EditProperty/EditSixthForm";
import EditSeventhForm from "../../components/Property/EditProperty/EditSeventhForm";
import EditEighthForm from "../../components/Property/EditProperty/EditEigthForm";
import EditNinethForm from "../../components/Property/EditProperty/EditNinethForm";
import EditTenthForm from "../../components/Property/EditProperty/EditTenthForm";
import EditEleventhForm from "../../components/Property/EditProperty/EditEleventhForm";
import EditTwelveForm from "../../components/Property/EditProperty/EditTwelveForm";
import { attacheProperty, property } from "../../api";
import { useCustomMutation } from "../../hooks/useApi";
import Spinner from "../../components/Spinner";
import { useAuth } from "../../hooks/useAuth";

export default function EditProperty() {
  const [lastStep, setLastStep] = useState<any>(0);
  const [page, setPage] = useState(lastStep);
  const params = useParams();
  const [initData, setInitData] = useState<any>(EDIT_PROPERTY_INITDATA);
  const [loader, setLoader] = useState(true);
  const auth = useAuth();
  const navigate = useNavigate();
  const nextPage = (values: any, type: any, latestPage: any, handleSubmit?: () => void) => {
    if (type === 'continue' && handleSubmit) {
      values.type = 'continue';
      handleSubmit();
    } else {
      values.type = "";
    }
    const currentPageRequiredFields = requiredFields[page];
    if (!currentPageRequiredFields) {
      setLastStep(page + 1);
      setPage(page + 1);
      return;
    }
    let pageValues = values[pageInfo[page]];
    const emptyArrays = checkEmptyArrayFields(pageValues);

    if (emptyArrays.length > 0) {
        const checkEqual = haveMatchingElements(emptyArrays, currentPageRequiredFields);
        if(checkEqual) {
           // Handle case where required fields are not filled
           return;
        } else {
          setLastStep(page + 1);
          setPage(page + 1);
        }
    }

    const areFieldsFilled = currentPageRequiredFields.every((fieldName: any) => !!pageValues[fieldName]);
    if (areFieldsFilled) {
      setLastStep(page + 1);
      setPage(page + 1);
    } else {
      // Handle case where required fields are not filled
    }
  };

  const checkEmptyArrayFields = (obj:any) => {
    const emptyArrayFields = [];
    
    for (const key in obj) {
        if (Array.isArray(obj[key]) && obj[key].length === 0) {
            emptyArrayFields.push(key);
        }
    }
    
    return emptyArrayFields;
  };

  const haveMatchingElements = (arr1:any, arr2:any) => {
    // Loop through the first array and check if any element exists in the second array
    for (let i = 0; i < arr1.length; i++) {
        if (arr2.includes(arr1[i])) {
            return true;  // Return true if any matching element is found
        }
    }
    return false;  // Return false if no matching elements are found
  };


  const previousPage = () => setPage(page - 1);

  const requiredFields: any = {
    1: ['propertyRegion', 'neighborhood', 'streetAddress', 'city', 'state', 'postalCode', 'unitNumber'],
    2: [],
    3: ['isBedroomsWithoutBed', 'isPropertyDenOrStudy', 'halfBathroomCount', 'propertyApproxArea', 'isParking'],
    4: [],
    5: [],
    6: ['bedroomCount'],
    7: ['kitchenEquipmentDesc', 'washerAndDryerShared', 'washerDryerAccessDesc'],
    8: ['isBusinessLicense', 'sharedAmenitiesDesc', 'isSecurePackageAcceptance', 'isFloorPlanAvailable'],
    9: [],
    10: ['keyDetail', 'setOfKeys', 'isKeyRequiredToAccessBuilding', 'isGarageDoorOpener', 'isKeyRequiredToAccessMailBox'],
    11: ['wirelessNetworkName', 'wirelessNetworkPassword', 'routerLocationDesc', 'premiumServiceDesc'],
    12: []
  };

  const pageInfo: any = {
    1: 'propertyDetails',
    2: 'ownerGoals',
    3: 'propertyDetailInfo',
    4: 'outsideSpace',
    5: 'propertyInterior',
    6: 'beds',
    7: 'appliancesAndKitchenEquipment',
    8: 'marketingAndAdministration',
    9: 'maintenanceAndOperation',
    10: 'keys',
    11: 'utilities',
    12: 'insurance'
  }

  const setStep = (value: any) => {
    if (value === page) {
      return;
    } else if (value > lastStep) {
      return;
    } else {
      setPage(value);
    }
  }

  useEffect(() => {
    setLoader(true);
    property.getPropertyById(params.propertyId).then((res: any) => {  
      setInitData((prevState: any) => ({
        ...prevState,
        propertyDetails: res.data.attacheRentalProperty.propertyDetails,
        ownerGoals: res.data.attacheRentalProperty.ownerGoals ? res.data.attacheRentalProperty.ownerGoals : initData.ownerGoals,
        propertyDetailInfo: res.data.attacheRentalProperty.propertyDetailInfo ? res.data.attacheRentalProperty.propertyDetailInfo : initData.propertyDetailInfo,
        outsideSpace: res.data.attacheRentalProperty.outsideSpace ? res.data.attacheRentalProperty.outsideSpace : initData.outsideSpace,
        propertyInterior: {
          ...prevState.propertyInterior, // Spread the existing propertyDetails
          ...(res.data.attacheRentalProperty.propertyInterior || initData.propertyInterior),
          isPropertyFurnished: res.data.attacheRentalProperty.propertyInterior.isPropertyFurnished ? "Yes" : "No",
        },
        beds: res.data.attacheRentalProperty.beds ? res.data.attacheRentalProperty.beds : initData.beds,
        appliancesAndKitchenEquipment: res.data.attacheRentalProperty.appliancesAndKitchenEquipment ? res.data.attacheRentalProperty.appliancesAndKitchenEquipment : initData.appliancesAndKitchenEquipment,
        marketingAndAdministration: res.data.attacheRentalProperty.marketingAndAdministration ? res.data.attacheRentalProperty.marketingAndAdministration : initData.marketingAndAdministration,
        maintenanceAndOperation: res.data.attacheRentalProperty.maintenanceAndOperation ? res.data.attacheRentalProperty.maintenanceAndOperation : initData.maintenanceAndOperation,
        keys: res.data.attacheRentalProperty.keys ? res.data.attacheRentalProperty.keys : initData.keys,
        utilities: res.data.attacheRentalProperty.utilities ? res.data.attacheRentalProperty.utilities : initData.utilities,
        insurance: res.data.attacheRentalProperty.insurance ? res.data.attacheRentalProperty.insurance : initData.insurance,
      }));
      setLastStep(res.data?.lastStep ? res.data.lastStep : 1);
      setPage(res.data?.lastStep ? res.data.lastStep : 1);
      setLoader(false);
    });
  }, [])

  const { mutate } = useCustomMutation({
    mutationFn: property.updateProperty,
    onSuccess: () => {
      navigate(ROUTE_NAVIGATION_PATH.OWNER_PROPERTY)
    },
  });

  const onSubmit = (values: any) => {
    if(values.type == 'continue') {
      values.type = "";
      return;
    }

    if(values.propertyInterior) {
      values.propertyInterior.isPropertyFurnished  = values.propertyInterior.isPropertyFurnished == 'No' ? false : true;
      if(values.propertyInterior.floorType && isArrayofObjects(values.propertyInterior.floorType)) {
        values.propertyInterior.floorType = values.propertyInterior?.floorType.map(
        (item: { label: string; value: string }) => item.value
        );
      }
    }

    if(values.beds) {
      if(values.beds.bedAndMattressType && isArrayofObjects(values.beds.bedAndMattressType)) {
        values.beds.bedAndMattressType = values.beds.bedAndMattressType.map(
        (item: { label: string; value: string }) => item.value
        );
      }
    }
    

    if(values.appliancesAndKitchenEquipment) {
      if(values.appliancesAndKitchenEquipment.kitchenEquipmentDesc && isArrayofObjects(values.appliancesAndKitchenEquipment.kitchenEquipmentDesc)) {
        values.appliancesAndKitchenEquipment.kitchenEquipmentDesc = values.appliancesAndKitchenEquipment.kitchenEquipmentDesc.map(
        (item: { label: string; value: string }) => item.value
        );
      }
    }
    

    if(values.marketingAndAdministration) {
      if(values.marketingAndAdministration.sharedAmenitiesDesc && isArrayofObjects(values.marketingAndAdministration.sharedAmenitiesDesc)) {
        values.marketingAndAdministration.sharedAmenitiesDesc = values.marketingAndAdministration.sharedAmenitiesDesc.map(
        (item: { label: string; value: string }) => item.value
        );
      }
    }
    let data = {
      attacheRentalProperty: values,
      propertyId: params.propertyId,
      lastStep: page,
      ownerId: [auth.user._id]

    }

    if(data.attacheRentalProperty.propertyDetailInfo.floorsListingCount) {
      data.attacheRentalProperty.propertyDetailInfo.floorsListingCount = parseInt(data.attacheRentalProperty.propertyDetailInfo.floorsListingCount);
    }

    delete data.attacheRentalProperty.type;
    if(auth.user.userRole == ROLE.OWNER) {
      delete data.attacheRentalProperty.location;
    }
    
    mutate(data);
  };

  function isArrayofObjects(arr:any) {
    // Check if arr is an array
    if (!Array.isArray(arr)) {
        return false;
    }

    // Check if every element in the array is an object
    return arr.every(item => typeof item === 'object' && item !== null);
}

  return (
    <>
      <header className="header">
        <div className="container-fluid">
          <Link className="logo" to={ROUTE_NAVIGATION_PATH.HOME}>
            <img alt="stayattache" className="logo-img" src={logo} />
          </Link>
        </div>
      </header>
      <main className="main">
        <div className="breadcrumb-module breadcrumb-compare-module">
          <div className="container">
            <div className="breadcrumb-row align-items-start">
              <div className="breadcrumb-icon">
                <img src={homeIcon} className="op-50" alt="icon team" />
              </div>
              <div className="breadcrumb-content">
                <h4>Edit Property</h4>
                <p className="mb-0">
                  You can start adding your property to our website using the
                  form below. Once we receive your property details, our team
                  will approve your property details where you can add and edit
                  additional information in your dashboard.
                </p>
              </div>
              <div className="breadcrumb-close">
                <Link to={ROUTE_NAVIGATION_PATH.OWNER_PROPERTY}>
                  <em className="icon-close"></em>
                </Link>
              </div>
            </div>
          </div>
        </div>
        {
          loader ?
            <Spinner />
            :
            <div className="rental-portal-container">
              <div className="container">
                <div className="rental-portal-content">
                  <div id="rental-inquiry-form">
                    <div className="steps-listing">
                      <ul>
                        {EDIT_PROPERTY_STEPS.map((data: any, key: any) => (
                          <li className={`${page === data.title ? "active" : data.title < page ? "faded" : ""}`} key={key} onClick={() => setStep(data.title)}>
                            {data.title}
                            <div className="custom-black-tooltip">
                              {data.value}
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="owner-inquery-wrapper _addproperty">
                      <Form
                        initialValues={initData}
                        onSubmit={onSubmit}
                        render={({ handleSubmit, values }) => (
                          <form
                            onSubmit={handleSubmit}
                            className="owner-inquery-form"
                          >
                            {
                              page === 1 ?
                                <EditFirstForm handleSubmit={handleSubmit} />
                                :
                                page === 2 ?
                                  <EditSecondForm handleSubmit={handleSubmit} />
                                  :
                                  page === 3 ?
                                    <EditThirdForm handleSubmit={handleSubmit} />
                                    :
                                    page === 4 ?
                                      <EditFourthForm handleSubmit={handleSubmit} />
                                      :
                                      page === 5 ?
                                        <EditFifthForm handleSubmit={handleSubmit} />
                                        :
                                        page === 6 ?
                                          <EditSixthForm handleSubmit={handleSubmit} />
                                          :
                                          page === 7 ?
                                            <EditSeventhForm handleSubmit={handleSubmit} />
                                            :
                                            page === 8 ?
                                              <EditEighthForm handleSubmit={handleSubmit} tags={initData.marketingAndAdministration.highlightFeaturesDesc}/>
                                              :
                                              page === 9 ?
                                                <EditNinethForm handleSubmit={handleSubmit} />
                                                :
                                                page === 10 ?
                                                  <EditTenthForm handleSubmit={handleSubmit} />
                                                  :
                                                  page === 11 ?
                                                    <EditEleventhForm handleSubmit={handleSubmit} />
                                                    :
                                                    <EditTwelveForm handleSubmit={handleSubmit} />
                            }

                            <div className="action-btn-wrapper fixed-bottom ">
                              <div className="action-btns oi-action-btn fixwidth">
                                {
                                  page !== 1 && page !== 12 ?
                                    <>
                                      <div>
                                        <Button type="button" className="btn primary _previous minwdth" onClick={previousPage}>
                                          PREVIOUS
                                        </Button>
                                      </div>
                                      <div>
                                        <Button type="submit" className="btn primary minwdth">
                                          save and exit
                                        </Button>
                                        <Button type="button" className="btn primary minwdth" onClick={() => nextPage(values, 'continue', page, handleSubmit)}>
                                          Continue
                                        </Button>
                                      </div>
                                    </>
                                    :
                                    page === 1 ?
                                      <div className="Continuewrapper">
                                        <Button type="button" className="btn primary minwdth" onClick={() => nextPage(values, 'continue', page, handleSubmit)}>
                                          Continue
                                        </Button>
                                      </div>
                                      :
                                      <>
                                        <div>
                                          <Button type="button" className="btn primary _previous minwdth" onClick={previousPage}>
                                            PREVIOUS
                                          </Button>
                                        </div>
                                        <div>

                                          <Button type="submit" className="btn primary minwdth">
                                            SUBMIT
                                          </Button>
                                        </div>
                                      </>
                                }
                              </div>
                            </div>
                          </form>
                        )}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
        }

      </main>
    </>
  );
}
