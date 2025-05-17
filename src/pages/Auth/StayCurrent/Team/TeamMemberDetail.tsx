import { Link, useParams } from "react-router-dom";
import { Footer, Header } from "../../..";
import placeHolder from "../../../../assets/images/placeHolder.png";
import linkdln from "../../../../assets/images/icon-linkedin.svg";
import { ROUTE_NAVIGATION_PATH } from "../../../../routes/routes";
import { useEffect, useState } from "react";
import createDOMPurify from 'dompurify'

export default function TeamMemberDetail() {
    const [detail, setDetail] = useState<any>({});
    const DOMPurify = createDOMPurify(window);
    const params = useParams();

    useEffect(() => {
        setDetail(JSON.parse(localStorage.getItem("teamMemberDetail") as string));
        return () => {
            if(window.location.pathname != ROUTE_NAVIGATION_PATH.TEAM_DETAIL+'/'+params.id) {
                localStorage.removeItem("teamMemberDetail");
            }
        } 
    }, [])

    function getImage(data:any) {
        let url = placeHolder;
        if(data.length > 0) {
            let image = data.slice(-1)[0];
            url = "https://stayattache-production.s3.amazonaws.com/cache/team_image/user_avatar/" + image.uuid  + '.'+image.extension;        
        }
        return url;
    }
    
    return (
        <>
            <Header mainClass="with-btn" isNavButton={true} />
            <main className="main-content">
                <div className="container">
                    <div className="breadcrumb-links">
                        <ul>
                            <li>
                                <Link to={ROUTE_NAVIGATION_PATH.HOME}><span>Home</span></Link>
                            </li>
                            <li>
                                <Link to={ROUTE_NAVIGATION_PATH.TEAM}><span>StayHuman</span></Link>
                            </li>
                            <li>
                                {detail.firstName}
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="breadcrumb-module breadcrumb-team-module">
                    <div className="container">
                        <div className="breadcrumb-row">
                            <div className="breadcrumb-team-pic">
                                {
                                    Object.keys(detail).length > 0 ? 
                                        <img src={detail?.images && detail?.images[0]? detail.images[0].imageUrl : placeHolder}
                                            onError={(e: any) => {
                                                e.target.src = placeHolder;
                                            }}
                                            alt="team pic"
                                        />
                                    :
                                    null
                                }
                                
                            </div>
                            <div className="breadcrumb-team-content">
                                <h3>{detail?.firstName}</h3>
                                <h5>
                                    {detail?.tagline}
                                </h5>
                            </div>
                            {
                                detail.linkedIn ?
                                    <div className="breadcrumb-team-social">
                                        <Link to="https://www.linkedin.com/in/kevin-horrocks-b9146756/" target="_blank">
                                            <img src={linkdln} alt="linkedin" />
                                                <span>{detail?.linkedIn}</span>
                                        </Link>
                                    </div>
                                :
                                null
                            }
                        </div>
                    </div>
                </div>
                <div className="container">
                    <div className="team-detail-module">
                        <h4>About</h4>
                        <p dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(detail.about) }}></p>
                        <p dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(detail.aboutSecondary) }}></p>

                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
