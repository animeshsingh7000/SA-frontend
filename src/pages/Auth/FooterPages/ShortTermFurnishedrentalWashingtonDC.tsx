import { Footer, Header } from "../..";
import InquirySection from "../../../components/Home/InquirySection";
import Mainsection from "../../../components/Home/MainSection";

export default function ShortTermFurnishedrentalWashingtonDC() {
  return (
    <>
      <Header 
        mainClass="home-header"
        isCallShow={true}
      />
      <main className="home-content">
        
        <Mainsection />

        <InquirySection />

        <div className="seo-pages-content">
            <h2>Furnished Corporate Residences</h2>

            <p>Are you looking for Short Term Furnished Rental in Washington DC? Look no further. Attache Property Management is the unique provider for Washington DC Corporate Apartments and on the internet.</p>
            <p>When it comes to Short Term Furnished Rental in Washington DC, we have years of proven experience in offering help to clients just like you. Stop looking and start relying on a company that knows Short Term Furnished Rental in Washington DC inside and out. Learn more about our Short Term Furnished Rental in Washington DC</p>
        </div>
      </main>
      <Footer footerLinks={true} isCopyRight={false}/>
    </>
  );
}
