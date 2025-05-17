
import bannerImage from "../../assets/images/home-banner.jpg";

export default function Mainsection() {

    return (
        <>
            <section className="home-banner">
                <div className="home-banner-image">
                    <img src={bannerImage} alt="home banner" />
                </div>
                <div className="home-banner-content">
                    <h1>Unique Furnished Housing in DC</h1>
                    <p>
                    Just bring your luggage and a laptop. All properties are
                    fully-furnished and include all utilities, internet and cable.
                    </p>
                </div>
            </section>
        </>
    )

}