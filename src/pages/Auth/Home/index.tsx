import rentalBanner from "../../../assets/images/rental-banner.png";
import { Footer, Header } from "../..";
import { Link } from "react-router-dom";
import PropertySection from "../../../components/Home/PropertySection";
import InquirySection from "../../../components/Home/InquirySection";
import FeaturedProperties from "../../../components/Home/FeaturedProperties";
import Mainsection from "../../../components/Home/MainSection";
import { useEffect, useRef, useState } from "react";
import MapView from "../../../components/GoogleMap/MapView";
import { attacheProperty } from "../../../api";
import Loading from "../../../components/Loader";
import { getNeighbourhood, getQuadrants } from "../../../api/admin/neighborhood";
import { AnyRecord } from "dns";
import { ROUTE_NAVIGATION_PATH } from "../../../routes/routes";

export default function Home() {
  const effectRan = useRef(false);
  const [loader, setLoader] = useState(true);
  const [markers, setMarkers] = useState<any[]>([]);
  const neighbourhood = useState<any>(localStorage.getItem("neighbourhood")
  ? JSON.parse(localStorage.getItem("neighbourhood") as string)
  : null);
  const quadrants = useState<any>(localStorage.getItem("quadrants")
  ? JSON.parse(localStorage.getItem("neighbourhood") as string)
  : null);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!effectRan.current) {
        attacheProperty
            .mapView()
            .then((res: any) => {
                setMarkers(res.data);
                setLoader(false);
                
        });
        if(neighbourhood) {
          getNeighbourhoods();
        }

        if(quadrants) {
          getQuadrant();
        }
    }
    return () => {
        effectRan.current = true;
    };
  }, []);

  const getNeighbourhoods = () => {
    try {
        getNeighbourhood().then((res: any) => {         
          localStorage.setItem("neighbourhood", JSON.stringify(res.data.neighbourhoods));
        });
    } catch (error) {
        console.error("Error fetching data:", error);
    }
  }

  const getQuadrant = () => {
    try {
      getQuadrants().then((res: any) => {
        // let data = [{_id: 'Select Directional', name: ''}].concat(res.data.quadrants);
        localStorage.setItem("quadrants", JSON.stringify(res.data.quadrants));
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  return (
    <>
      <Header 
        mainClass="home-header"
        isCallShow={true}
      />
      <main className="home-content">
        
        <Mainsection />

        <InquirySection />

        <PropertySection />

        <FeaturedProperties />

        <section className="home-rentalInquire">
          <img src={rentalBanner} alt="rental banner" className="w-100" />
          <div className="container">
            <p>
              Stay Attache is excited to offer the finest furnished corporate
              housing and furnished apartments in Washington DC – Designed for
              those looking to stay for as little as a month or longer. Call us
              today and let us show you the best temporary furnished housing
              accommodations our city has to offer!
            </p>
            <Link to={ROUTE_NAVIGATION_PATH.RENTAL_INQUIRY} className="btn primary">
              SUBMIT RENTAL INQUIRY
            </Link>
          </div>
        </section>
      </main>
      {
        !loader ?
          <MapView markers={markers}/>
        :
        <>
          <Loading />
        </>
      }
     
      <Footer footerLinks={true} isCopyRight={false}/>
    </>
  );
}
