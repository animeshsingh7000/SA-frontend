import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import attacheLogo from "../../assets/images/attache-logo.svg";
import cbeLogo from "../../assets/images/cbe-logo.png"
import chipaLogo from "../../assets/images/chipa-logo.png";
import contactHolder from "../../assets/images/contract-holder.png";
import iconGreen from "../../assets/images/icon_green_mini.png";
import TermsModal from "../../components/Modal/TermsModal";
import { FOOTER_FEATURE_MENUS, FOOTER_LINK_MENUS, SOCIAL_MENUS } from "../../constants/menu";

export default function Footer({
    footerLinks = false,
    isCopyRight = true
}: {
    footerLinks?: boolean;
    isCopyRight?: boolean
}) {
    const [modalVisible, setModalVisible] = useState('');
    const styles = {
        border: 0,
    };
    const legalLinks = [
        {
          href: "https://www.iubenda.com/privacy-policy/24350646",
          title: "Privacy Policy",
        },
        {
          href: "https://www.iubenda.com/privacy-policy/24350646/cookie-policy",
          title: "Cookie Policy",
        },
        {
          href: "https://www.iubenda.com/terms-and-conditions/24350646",
          title: "Terms and Conditions",
        },
    ];

    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://cdn.iubenda.com/iubenda.js";
        script.async = true;
        document.body.appendChild(script);
    
        return () => {
          document.body.removeChild(script);
        };
    }, []);
    
    return (
        <>
            {
                footerLinks ?
                    <>
                        <footer className="home-footer">
                            <div className="container d-flex justify-content-between">
                                <div className="home-footer-content">
                                    <a className="logo" href="/">
                                        <img alt="stayattache" className="img-responsive" src={attacheLogo} />
                                    </a>
                                    <div className="home-footer-info">
                                        <div className="home-footer-info-title">
                                            Attache Corporate Housing
                                        </div>
                                        <p>1800 R Street Northwest C-1, Washington DC 20009</p>
                                        <p>Call Us : <a href="tel:800-916-4903">800-916-4903</a></p>
                                        <p>
                                            Email Us : <a href="mailto:reservations@stayattache.com">reservations@stayattache.com</a>
                                        </p>
                                        <p>
                                            © ATTACHE CORPORATE HOUSING 2001- {new Date().getFullYear()}
                                        </p>
                                    </div>
                                </div>
                                <div className="home-footer-item">
                                    <div className="home-footer-title">
                                        Features
                                    </div>
                                    <ul>
                                        {(FOOTER_FEATURE_MENUS).map((menu, key) => (
                                            <li key={key}>
                                                <Link  to={menu.url} title={menu.title}>{menu.title}</Link>
                                            </li>
                                        ))} 
                                    </ul>
                                </div>
                                <div className="home-footer-item">
                                    <div className="home-footer-title">
                                        Social
                                    </div>
                                    <ul>
                                        {(SOCIAL_MENUS).map((menu, key) => (
                                            <li key={key}>
                                                <a href={menu.url} target="_blank" rel="noreferrer">{menu.title}</a>
                                            </li>
                                        ))} 
                                    </ul>
                                </div>
                                <div className="home-footer-item _privacy-terms">
                                    <div className="home-footer-title ">
                                        Terms & Policies
                                    </div>
                                    <ul>
                                    {legalLinks.map((link, index) => (
                                        <li key={index}>
                                            <a
                                                href={link.href}
                                                className="iubenda-white iubenda-embed"
                                                title={link.title}
                                            >
                                                {link.title}
                                            </a>
                                        </li>
                                        ))}
                                    </ul>
                                    <div className="container-btn">
                                        <a href="https://www.google.com/search?rlz=1C1CHBD_enIN885IN885&ei=_jUYX_jyOdKvyAOmhYqwBg&q=attache+corporate+housing&oq=attache+corporate+housing&gs_lcp=CgZwc3ktYWIQAzILCC4QxwEQrwEQkwIyBggAEBYQHjIGCAAQFhAeMgYIABAWEB4yBggAEBYQHjoHCAAQRxCwAzoECAAQQzoLCAAQsQMQgwEQkQI6BQgAEJECOgIIADoOCC4QsQMQxwEQowIQgwE6CwguELEDEMcBEKMCOggILhCxAxCDAToLCC4QxwEQrwEQkQI6BwguELEDEEM6BQgAELEDOgUILhCxAzoKCC4QxwEQowIQQzoKCAAQsQMQgwEQQzoECC4QQzoHCAAQsQMQQzoICAAQsQMQgwE6BwgAELEDEAo6CAguEMcBEK8BOggIABAWEAoQHlCS0gFYovYBYJ_3AWgBcAB4AIAB6gGIAfYhkgEGMC4xNy43mAEAoAEBqgEHZ3dzLXdpesABAQ&sclient=psy-ab&ved=0ahUKEwj46aXv8uDqAhXSF3IKHaaCAmYQ4dUDCAw&uact=5#lrd=0x89b7b7c5d3366d51:0x8e3908fd288e9997,1,," target="_blank" className="btn primary" rel="noreferrer">
                                            what does this button do?
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </footer>
                        <div className="home-copyright">
                            <div className="container d-flex justify-content-between">
                                <div className="logo col-sm-4">
                                    <img src={cbeLogo} alt="cbe" className="cbe-logo" />
                                    <Link to="https://www.chpaonline.org/index.php?src=membership&srctype=detail&category=Member&refno=7533" target="_blank">
                                        <img src={chipaLogo} alt="chipa" className="chipa-logo" />
                                    </Link>
                                </div>
                                <div className="bbs-rating">
                                    <Link to="https://www.bbb.org/us/dc/washington/profile/property-management/attache-property-management-0241-7004350/#sealclick" target="_blank" rel="nofollow">
                                        <img src="https://seal-dc-easternpa.bbb.org/seals/blue-seal-250-52-bbb-7004350.png" style={styles} alt="Attache Property Management BBB Business Review" />
                                    </Link>
                                </div>
                                <div className="contact-holder-image-wrapper">
                                    <Link to="https://www.gsaelibrary.gsa.gov/ElibMain/contractorInfo.do;jsessionid=oQpnCscU8gbBVEHyc33ayOQP.prd1pweb64?contractNumber=47QMCB20D0006&contractorName=ATTACHE+PROPERTY+MANAGEMENT%2C+L.L.C.&executeQuery=YES" target="_blank">
                                        <img src={contactHolder} alt="img" />
                                    </Link>
                                </div>
                            </div>
                            <p className="text-center mt-3 footer-note">
                                Please note there is a 15.95% hotel tax on all stays less than 91 days for properties in Washington DC. Maximum rate will not exceed $2000 per day.
                            </p>
                        </div>
                        <div className="footer-links-container">
                            <div className="container">
                                <div className="footer-seo-links">
                                    {(FOOTER_LINK_MENUS).map((menu, k) => (   
                                        <a key={k} href={menu.url} title={menu.title}>{menu.title}</a>
                                    ))}
                                    <br />
                                </div>
                            </div>
                        </div>
                    </>

                    :
                    null
            }
            {
                isCopyRight ?
                    <footer className="main-footer">
                        <div className="container">
                            © {new Date().getFullYear()} Stay Attache. All rights reserved.
                        </div>
                    </footer>
                    :
                    null
            }

            <TermsModal
                url={modalVisible}
                handleClose={() => setModalVisible('')}
            />
        </>

    );
}