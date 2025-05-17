import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { NoData } from "..";
import { attacheProperty } from "../../api";
import stayHereImage from "../../assets/images/stay-here-stay-stay.png";
import { ROUTE_NAVIGATION_PATH } from "../../routes/routes";
import Loading from "../Loader";
import placeHolder from "../../assets/images/placeHolder.png";

export default function FeaturedProperties() {
    const [loader, setLoader] = useState(true);
    const [items, setItems] = useState([]);
    const effectRan = useRef(false);

    useEffect(() => {
        if (!effectRan.current) {
            attacheProperty
                .getFeaturette()
                .then((res: any) => {
                    setItems(res.data);
                    setLoader(false);
            });
        }
        return () => {
            effectRan.current = true;
        };
    }, []);

    const stripTags = (str: any) => {
        return str.replace(/<[^>]*>/g, '');
    }

    return (
        <>
            {
                loader ?
                    <Loading />
                    :
                    <>
                        {!items.length ? <NoData /> : null}
                        {(items).map((data: any, key) => (
                            <>
                                {
                                    data.position == 1 ?
                                    <section className="home-stayStylish" key={data?._id}>
                                        <div className="container">
                                            <h3>
                                                {data?.heading} <span>{data?.subheading} </span>
                                            </h3>
                                            <p>
                                                <div dangerouslySetInnerHTML={{ __html: data.unitDescription }} />
                                            </p>
                                        </div>
                                        <div className="home-stayStylish-text">
                                            <img src={stayHereImage} alt="Stay Here" />
                                            <div className="stay-stylishBtn">
                                                <Link 
                                                to={'/' + (data.address.State).toString().toLowerCase() + '/' + data.neighborhoodSlug + '/' + (data.isFurnished ? 'furnished' : 'unfurnished') +'/' + data?.unitId}
                                                title={data?.address?.AddressLine1+(data?.address?.AddressLine2 || data?.address?.AddressLine3 ? " " : ", ")+(data?.address?.AddressLine2 ? data?.address?.AddressLine2+(data?.address?.AddressLine3 ? " " : ", "): "")+(data?.address?.AddressLine3 ? data?.address?.AddressLine3+", ": "")+data.address.City+ ", " + data.address.State+" "+data.address.PostalCode } className="btn primary">
                                                    Get More Details
                                                </Link>
                                            </div>
                                        </div>
                                        <div className="container">
                                            <div className="home-stayStylish-image">
                                                <img src={data?.unitImages[0]?.Url ? data?.unitImages[0]?.Url : placeHolder} alt="stay banner" className="first-featurette-img" />
                                            </div>
                                        </div>
                                    </section>
                                    : (
                                        data.position == 2 ?
                                        <section className="home-stayLocal" key={key}>
                                            <div className="container d-flex pr-0">
                                                <div className="home-stayLocal-content col-12 col-md-6 px-3 pl-md-0">
                                                    <h3>{data?.heading}  <span>{data?.subheading}</span></h3>
                                                    <p>
                                                        <div dangerouslySetInnerHTML={{ __html: data.unitDescription }} />
                                                    </p>
                                                    <div className="container-btn">
                                                        <Link 
                                                            to={'/' + (data.address.State).toString().toLowerCase() + '/' + data.neighborhoodSlug + '/' + (data.isFurnished ? 'furnished' : 'unfurnished') +'/' + data?.unitId}
                                                            title={data?.address?.AddressLine1+", "+(data?.address?.AddressLine2 ? data?.address?.AddressLine2+", ": "")+(data?.address?.AddressLine3 ? data?.address?.AddressLine3+", ": "")+data.address.City+ ", " + data.address.State+" "+data.address.PostalCode } className="btn primary">
                                                            Get More Details
                                                        </Link>
                                                    </div>
                                                </div>
                                                <div className="home-stayLocal-image col-12 col-md-6 px-0 text-right">
                                                    <img src={data?.unitImages[0]?.Url ? data?.unitImages[0]?.Url : placeHolder} alt="way local banner" className="w-100" />
                                                </div>
                                            </div>
                                        </section>
                                        :
                                        <section className="home-stayLocal" key={data?._id}>
                                            <div className="container d-flex pl-0">
                                                <div className="home-stayLocal-image col-12 col-md-6 px-0">
                                                    <img src={data?.unitImages[0]?.Url ? data?.unitImages[0]?.Url : placeHolder} alt="way local banner" className="w-100" />
                                                </div>
                                                <div className="home-stayLocal-content col-12 col-md-6">
                                                    <h3>{data?.heading}  <span>{data?.subheading}</span></h3>
                                                    <p>
                                                        <div dangerouslySetInnerHTML={{ __html: data.unitDescription }} />
                                                    </p>
                                                    <div className="container-btn">
                                                        <Link
                                                            to={'/' + (data.address.State).toString().toLowerCase() + '/' + data.neighborhoodSlug + '/' + (data.isFurnished ? 'furnished' : 'unfurnished') +'/' + data?.unitId} 
                                                            title={data?.address?.AddressLine1+", "+(data?.address?.AddressLine2 ? data?.address?.AddressLine2+", ": "")+(data?.address?.AddressLine3 ? data?.address?.AddressLine3+", ": "")+data.address.City+ ", " + data.address.State+" "+data.address.PostalCode } className="btn primary">
                                                            Get More Details
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                        </section>
                                    )
                                }
                            </>
                        ))}
                    </>
            }
        </>
    );
}
