import { useEffect, useState } from "react";
import placeHolder from "../../assets/images/placeHolder.png";
import Spinner from "../../components/Spinner";
import PropertyListDropDown from "../../components/SearchSelect/PropertyListDropDown";
import { deleteFeature, getFeatureListing, updateFeatureList } from "../../api/admin/ownerInquiry";
import { Form } from "react-final-form";
import { toast } from "react-toastify";

export default function FeatureListing() {
    const [compareProperties, setCompareProperties] = useState<any>([]);
    const [loading, setLoader] = useState(true);


    useEffect(() => {
        getFeatureListing().then((res: any) => {
            setCompareProperties(res.data.data);
            setLoader(false);
          });
    }, [])

    const onSubmit = (values: any) => {
    };

   
    const handleInputChange = async (value:any, idex:any) => {
        let data:any = {
            unitId: value.value,
            id: compareProperties[idex]._id
        }

        updateFeatureList(data).then((res:any) => {
            toast.success(res.data.message);
            let newFiles:any= [
                {
                    Name: "33GardenRow2D.jpg",
                    Type: "Image",
                    Url: value.image,
                    _id: "65ffcc2e108eab2c0bda0808"
                }
            ]
    
            setCompareProperties((prevData:any) => {
                // Create a new copy of the data array
                const updatedData = [...prevData];
                
                // Update the Files of the Unit of the first item
                    updatedData[idex] = {
                        ...updatedData[idex],
                        Unit: {
                        ...updatedData[idex].Unit,
                        Files: newFiles
                        }
                    };
                
                return updatedData;
            });
          })
          .catch((error) => {
            toast.error(error.response?.data?.message || error.message);
        });
    }

    const removeFeature = (value:any, index:any) => {
        deleteFeature(value).then((res:any) => {
            toast.success(res.data.message);
            setCompareProperties((prevData:any) => {
                // Remove the object at the specified index
                const updatedData = prevData.filter((_:any, i: number) => i !== index);
                return updatedData;
              });
          })
          .catch((error) => {
            toast.error(error.response?.data?.message || error.message);
        });
    }
    return (
        <>
            <div >
                {
                    loading && !compareProperties.length ?
                        <Spinner />

                        :
                        <div className="compare-property-module">
                            <div className="container">
                                <div className="row compare-property-row with-card-view">
                                    <div className="col-12 col-md-3">
                                        <div className="add-compare">All details</div>
                                    </div>
                                    
                                        <div className="col-12 col-md-3">
                                            <div className="add-compare-image">
                                                <img src={compareProperties[0] && compareProperties[0]?.Unit.Files[0]?.Url ? compareProperties[0]?.Unit.Files[0]?.Url : placeHolder}
                                                    onError={(e: any) => {
                                                        e.target.src = placeHolder;
                                                    }}
                                                    alt="property"
                                                />

                                                {
                                                    compareProperties[0] ?
                                                    <div className="card-close">
                                                        <a title="Remove from comparison." onClick={() => removeFeature(compareProperties[0]?._id, 0)}>
                                                            <em className="icon-close"></em>
                                                        </a>
                                                    </div>
                                                    :
                                                    null
                                                }

                                            </div>
                                        </div>
                                    
                                        <div className="col-12 col-md-3">
                                            <div className="add-compare-image">
                                                <img src={compareProperties[1] && compareProperties[1]?.Unit.Files[0]?.Url ? compareProperties[1]?.Unit.Files[0]?.Url : placeHolder}
                                                    onError={(e: any) => {
                                                        e.target.src = placeHolder;
                                                    }}
                                                    alt="property"
                                                />

                                                {
                                                    compareProperties[1] ?
                                                    <div className="card-close">
                                                        <a title="Remove from comparison." onClick={() => removeFeature(compareProperties[1]?._id, 1)}>
                                                            <em className="icon-close"></em>
                                                        </a>
                                                    </div>
                                                    :
                                                    null
                                                }
                                            </div>
                                        </div>
                                        <div className="col-12 col-md-3">
                                            <div className="add-compare-image">
                                                <img src={compareProperties[2] && compareProperties[2]?.Unit.Files[0]?.Url ? compareProperties[2]?.Unit.Files[0]?.Url : placeHolder}
                                                    onError={(e: any) => {
                                                        e.target.src = placeHolder;
                                                    }}
                                                    alt="property"
                                                />
                                                {
                                                    compareProperties[2] ?
                                                    <div className="card-close">
                                                        <a title="Remove from comparison." onClick={() => removeFeature(compareProperties[2]?._id, 2)}>
                                                            <em className="icon-close"></em>
                                                        </a>
                                                    </div>
                                                    :
                                                    null
                                                }
                                            </div>
                                        </div>
                                            
                                </div>
                            </div>
                            <div className="compare-property-data">
                                <div className="container">
                                    <div className="row compare-property-row left-right">
                                        <div className="col-12 col-md-3 pts">
                                            <div className="add-compare-content">
                                                <h4>Property</h4>
                                            </div>
                                        </div>
                                        <Form
                                            onSubmit={onSubmit}
                                            render={({ handleSubmit }) => (
                                                <form onSubmit={handleSubmit} className="form-featurelising col-12 col-md-9">
                                                    <div className="col-12 col-md-4">
                                                    
                                                        <PropertyListDropDown
                                                            name={`unitId_${compareProperties[0]?.Unit.Id}`}
                                                            initialValue={compareProperties[0]?.Unit.Id}
                                                            onChange={(event:any) => handleInputChange(event, 0)}
                                                        />
                                                    </div>

                                                    <div className="col-12 col-md-4">
                                                        <PropertyListDropDown
                                                            name={`unitId_${compareProperties[1]?.Unit.Id}`}
                                                            initialValue={compareProperties[1]?.Unit.Id}
                                                            onChange={(event:any) => handleInputChange(event.target.value, 1)}

                                                        />
                                                    </div>

                                                    <div className="col-12 col-md-4">
                                                        <PropertyListDropDown
                                                            name={`unitId_${compareProperties[2]?.Unit.Id}`}
                                                            initialValue={compareProperties[2]?.Unit.Id}
                                                            onChange={(event:any) => handleInputChange(event.target.value, 2)}

                                                        />
                                                    </div>
                                            </form>
                                        )}
                                        />
                                     
                                    </div>
                                </div>
                            </div>
                        </div>
                }

            </div>
        </>
    );
}