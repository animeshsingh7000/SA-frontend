import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { Footer, Header } from "../../..";
import placeHolder from "../../../../assets/images/placeHolder.png";
import iconTeam from "../../../../assets/images/icon-team.png";
import { ROUTE_NAVIGATION_PATH } from "../../../../routes/routes";
import { useEffect, useState } from "react";
import { stayCurrent } from "../../../../api";
import Spinner from "../../../../components/Spinner";
import { NoData } from "../../../../components";

export default function Team() {
    const { pathname } = useLocation();
    const [items, setItems] = useState([]);
    const [loader, setLoader] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    useEffect(() => {
        stayCurrent
            .getTeam()
            .then((res: any) => {
                setItems(res.data);
                setLoader(false);
            });
    }, []);

    function getImage(data:any) {
        let url = placeHolder;
        if(data.length > 0) {
            let image = data.slice(-1)[0];
            url = "https://stayattache-production.s3.amazonaws.com/cache/team_image/user_avatar/" + image.uuid  + '.'+image.extension;        
        }
        return url;
    }

    function routeToDetail(detail:any) {
        localStorage.setItem("teamMemberDetail",  JSON.stringify(detail));
        navigate(ROUTE_NAVIGATION_PATH.TEAM_DETAIL+'/'+detail._id)
    }

    return (
        <>
            <Header mainClass="with-btn" isNavButton={true}/>
            <main className="main-content">
            {
                loader ?
                <Spinner />
                :
                <>
                    <div className="breadcrumb-module">
                        <div className="container">
                            <div className="breadcrumb-row">
                                <div className="breadcrumb-icon">
                                    <img src={iconTeam} alt="icon team" />
                                </div>
                                <div className="breadcrumb-content">
                                    <h4>StayHuman (Your Team)</h4>
                                    <p>Meet our Attache dream team!</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="container">
                        {!items.length ? <NoData />
                            :
                                <div className="team-list-module row">
                                {(items).map((data: any, key) => (
                                
                                    <div className="col-12 col-md-3" key={key}>
                                        <div className="team-card" onClick={() => routeToDetail(data)}>
                                            <div className="team-card-image">
                                                <img  src={data.images && data.images[0] ? data.images[0].imageUrl: placeHolder}
                                                    onError={(e: any) => {
                                                        e.target.src = placeHolder;
                                                    }}
                                                    alt="team"
                                                />
                                            </div>
                                            <div className="team-card-content">
                                                <h5>{data.firstName}</h5>
                                                <p>
                                                    {data.tagline}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                
                            ))}
                            
                            </div>
                        }
                    </div>
                </>
            }
            </main>
            <Footer />
        </>
    );
}
