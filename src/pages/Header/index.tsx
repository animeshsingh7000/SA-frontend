import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AttacheLogo from "../../assets/images/attache-logo-white.svg";
import attacheLogo from "../../assets/images/attache-logo.svg";
import RightSideMenu from "../../components/RightSideMenu";
import { HUBSPOT_URL, ROLE } from "../../constants";
import { useAuth } from "../../hooks/useAuth";
import useSideBar from "../../hooks/useSideBar";
import { ROUTE_NAVIGATION_PATH } from "../../routes/routes";
import Chat from "./Chat";

export default function Header({
    mainClass = 'fixed-header',
    navClass = 'navbar',
    isNavButton = false,
    isCallShow = false
}: {
    mainClass: any;
    navClass?: any;
    isNavButton?: boolean;
    isCallShow?: boolean;
}) {
    const { expendMenu, toggleMenuExpend } = useSideBar();
    const [pageOffset, setpageOffset] = useState(false);
    const auth = useAuth();
    const { signout } = useAuth();
    const navigate = useNavigate();

    const sign = () => {
        if(!auth.user?._id) {
            navigate(ROUTE_NAVIGATION_PATH.SIGN_IN);
        }
    };
    const signOut = () => {
        signout();
    };

    useEffect(() => {
        const handleScroll = (event: any) => {
            if (window.pageYOffset >= 20) {
                setpageOffset(true);
            } else {
                setpageOffset(false);
            }
        };
        window.addEventListener('scroll', handleScroll);
    }, []);

    const navigateToDashboard = (type:any) => {
        localStorage.setItem('isDashboard', type);
        navigate(type === 0 ? ROUTE_NAVIGATION_PATH.OWNER_DASHBOARD : (type === 1 ? ROUTE_NAVIGATION_PATH.RENTER_DASHBOARD : ROUTE_NAVIGATION_PATH.USER_MANAGEMENT))
    }

    return (
        <>
            <header className={` ${mainClass} ${pageOffset ? "fixed-header" : ""}`}>
                <div className={` container-fluid ${mainClass === 'home-header' ? "container-fluid-home" : ""}`}>
                    <a className="logo" href="/">
                        {
                            mainClass === 'home-header' ?
                                <img alt="stayattache" className="home-logo-img" src={AttacheLogo} />
                                :
                                null
                        }

                        <img alt="stayattache" className="logo-img" src={attacheLogo} />

                    </a>

                    <div className="navbar">
                        {isNavButton ? (
                            <Link
                                to={
                                    auth.user
                                        ? ROUTE_NAVIGATION_PATH.RENTAL_INQUIRY_NEW
                                        : ROUTE_NAVIGATION_PATH.RENTAL_INQUIRY
                                }
                                title="Submit a rental inquiry."
                                className="btn primary rental_request_header"
                            >
                                Rental Inquiry
                            </Link>
                        ) : null}
                        <div className="navbar-control">
                            <div className="_userhover">
                                <a onClick={sign} className="nav-item">
                                    <em className="icon-user"></em>
                                </a>
                                {auth.user ? (
                                    <div className="dropdown-menu-top _right">
                                        {
                                            auth.user.isAttache && (
                                                <a
                                                onClick={() => navigateToDashboard(2)}
                                                    className="dropdown-item"
                                                >
                                                    Admin Portal
                                                </a>
                                            )
                                        }
                                        {
                                            auth.user.isOwner && (
                                                <a
                                                    onClick={() => navigateToDashboard(0)}
                                                    className="dropdown-item"
                                                >
                                                    Owner Portal
                                                </a>
                                            )
                                        }
                                        {
                                            auth.user.isGuest && (
                                                <a
                                                    onClick={() => navigateToDashboard(1)}
                                                    className="dropdown-item"
                                                >
                                                    Rental Portal
                                                </a>
                                            )
                                        }
                                    </div>
                                ) : null}
                            </div>

                            <a className="nav-item" onClick={toggleMenuExpend}>
                                <em className="icon-menu"></em>
                            </a>
                        </div>
                    </div>

                    {
                        isCallShow ?
                            <span className="call-us-text">Call Us : <a href="tel:800-916-4903" className="call-us">800-916-4903</a></span>
                            :
                            null
                    }

                </div>
            </header>
            {/* <Chat /> */}
            <RightSideMenu
                navClass={navClass}
                isNavButton={isNavButton}
                toggleMenuExpend={toggleMenuExpend}
                expendMenu={expendMenu}
            />
        </>
    );
}