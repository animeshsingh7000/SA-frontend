import { Link, useParams } from "react-router-dom";
import { Footer, Header } from "../../..";
import { ROUTE_NAVIGATION_PATH } from "../../../../routes/routes";
import createDOMPurify from 'dompurify'
import { useEffect, useState } from "react";
import {
    formatDate,
    containsIframe
} from "../../../../utils/common";

export default function NewsDetail() {
    const [detail, setDetail] = useState<any>({});
    const DOMPurify = createDOMPurify(window);
    const [beforeFrame, setBeforeFrame] = useState('');
    const [afterFrame, setAfterFrame] = useState('');
    const params = useParams();

    useEffect(() => {
        const data = JSON.parse(localStorage.getItem("blogDetail") as string);
       
        if(containsIframe(data.content)) {
            const [beforeIframe, afterIframe] = data.content.split('</iframe>');
            setBeforeFrame(beforeIframe);    
            setAfterFrame(afterIframe)
        }
        setDetail(data);
        return () => {
            if(window.location.pathname != ROUTE_NAVIGATION_PATH.BLOG_DETAIL+'/'+params.slug) {
                localStorage.removeItem("blogDetail");
            }
        }   
    }, [])

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
                                <Link to={ROUTE_NAVIGATION_PATH.BLOG}><span>StayCurrent</span></Link>
                            </li>
                            <li>
                                {detail?.title}
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="breadcrumb-module">
                    <div className="container">
                        <div className="breacumb-blog-content">
                            <div className="blog-date">{formatDate(detail.createdAt)}</div>
                            <h4>{detail.title}</h4>
                            <p>Posted by {detail.createdBy ? detail.createdBy : 'NA'}</p>
                        </div>
                    </div>
                </div>
                <div className="blog-detail-module">
                    <div className="container">
                        <div className="blog-detail-para">

                            {
                                beforeFrame && afterFrame 
                                ?
                                <>
                                    <p dangerouslySetInnerHTML={{ __html: detail?.content }}></p>
     
                                    <p dangerouslySetInnerHTML={{ __html: afterFrame }}></p>
                                </>
                                :
                                <p dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(detail?.content) }}></p>

                            } 
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
