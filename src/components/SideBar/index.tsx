import logoAttache from "../../assets/images/attache-logo.svg";
import logout from "../../assets/images/logout-icon.svg";
import logoutActive from "../../assets/images/logout-icon-active.svg";
import profileImg from "../../assets/images/profile-thumbnail-placeholder.png";
import downArrow from "../../assets/images/down-arrow.png";
import linkIcon from "../../assets/images/outerIcon.svg";
import signoutIcon from "../../assets/images/SignOut.svg";


import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { ADMIN_MENUS, OWNERS_MENUS, RENTER_MENUS } from "../../constants/menu";
import { ROUTE_NAVIGATION_PATH } from "../../routes/routes";
import { useEffect, useRef, useState } from "react";
import { ROLE } from '../../constants';
function Menu({
  icon,
  defaultIcon,
  subMenu,
  title,
  url,
  profileImg,
  callback,
  activeOn,
  isAdmin,
  index,
  openToggle,
  setOpenToggle,
}: {
  icon: string;
  defaultIcon: string;
  subMenu: any;
  title: string;
  url: string;
  callback: (e: any) => void;
  profileImg: boolean;
  activeOn: string[];
  isAdmin: boolean;
  index: any,
  openToggle: number | null; // Update type to number or null
  setOpenToggle: (index: number | null) => void;  // Function to set openToggle
}) {

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (activeOn.includes(location.pathname)) {
      setOpenToggle(index);
    }
  }, [location.pathname, activeOn, index, setOpenToggle]);

  const handleClick = (e: any) => {
    if (subMenu.length > 0) {
      e.preventDefault(); // Prevents default navigation

      // Toggle open state
      setOpenToggle(openToggle === index ? null : index);

      // Navigate after ensuring submenu is open
      navigate(url);
    } else {
      callback(e); // Normal navigation
    }
  };

  return (
    <>
      {
        !isAdmin ?
          <li>
            <Link
              to={url}
              className={`nav-link ${activeOn.includes(location.pathname.split("/").slice(0, 3).join("/"))
                ? "active"
                : ""
                }`}
              onClick={callback}
            >
              {profileImg ? (
                <span className="icon-nav">
                  <div className="_image">
                    <img className="_icons" src={icon} alt={title} />
                  </div>
                </span>
              ) : (
                <span className="sidebar-icon">
                  {activeOn.includes(
                    location.pathname.split("/").slice(0, 3).join("/")
                  ) ? (
                    <img className="_icons" src={icon} alt={title} />
                  ) : (
                    <img className="_icons" src={defaultIcon} alt={title} />
                  )}
                </span>
              )}

              {title}
            </Link>
          </li>
          :
          <>
            <li
              className={`${
                activeOn.includes(location.pathname.split("/").slice(0, 3).join("/"))
                ||activeOn.includes(location.pathname.split("/").slice(0, 4).join("/"))
                || activeOn.includes(location.pathname)
                
                ? "active"
                : ""
                }`}
            >
              <Link className="" to={url} onClick={handleClick}>
                <div className="nav-icon">
                  <img src={icon} alt="Icon" />
                </div>
                <div className="navtext">{title}</div>
                {
                  subMenu.length > 0 ?
                    <div className="arrow" onClick={(e) => {
                      e.preventDefault(); // Prevents full page reload
                      setOpenToggle(openToggle === index ? null : index);
                    }}>
                      <img src={downArrow} alt="Arrow" />
                    </div>
                    : null
                }

              </Link>
              {
                subMenu.length > 0 && openToggle === index  ?
                    <ul>
                      {subMenu.map((menu: any) => (
                           <li  className={`${
                            menu.activeOn.includes(location.pathname.split("/").slice(0, 3).join("/"))
                            || menu.activeOn.includes(location.pathname.split("/").slice(0, 4).join("/"))
                            || menu.activeOn.includes(location.pathname)
                            ? "active"
                            : ""
                            }`}>
                            <Link className="" to={menu.url}>
                              <div className="navtext">{menu.title}</div>
                            </Link>
                          </li>                       
                      ))}
                    </ul>
                    :
                  null
              }

            </li>
          </>
      }
    </>


  );
}
export default function SideBar({ isAdmin = false }: { isAdmin?: boolean }) {
  const auth = useAuth();
  const [expendMenu, setExpendMenu] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { signout } = useAuth();
  const navigate = useNavigate();
  const [openToggle, setOpenToggle] = useState<number | null>(null); // Track which toggle is open
  const divRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);
  const isDashBoard = localStorage.getItem('isDashboard') ? Number(localStorage.getItem('isDashboard')) : 0;

  function collapsableMenu() {
    setExpendMenu(!expendMenu);
    !expendMenu
      ? document
        .getElementsByClassName("left-sidebar")[0]
        ?.classList.add("active")
      : document
        .getElementsByClassName("left-sidebar")[0]
        ?.classList.remove("active");
  }

  const toggleProfileOpen = () => {
    setProfileOpen((prev) => !prev);
  };

  const signOut = () => {
    signout(() =>
      // toast.success("Logged out sucessfully")
      navigate(ROUTE_NAVIGATION_PATH.HOME)
    );
  };

  const navigateToProfile = (isProfile?: any) => {
    isProfile
      ? navigate(ROUTE_NAVIGATION_PATH.OWNER_PROFILE + "?isProfile=1")
      : navigate(ROUTE_NAVIGATION_PATH.OWNER_PROFILE);
    toggleProfileOpen();
  };

  function capitalizeFirstLetter(string: any) {
    return string.charAt(0).toUpperCase();
  }

  const handleClickOutside = (event: MouseEvent) => {
    if (
      divRef.current &&
      !divRef.current.contains(event.target as Node) &&
      buttonRef.current &&
      !buttonRef.current.contains(event.target as Node)
    ) {
      setProfileOpen(false);
    }
  };
  
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navigateToDashboard = (type:any) => {
    localStorage.setItem('isDashboard', type);
    navigate(type === 0 ? ROUTE_NAVIGATION_PATH.OWNER_DASHBOARD : (type === 1 ? ROUTE_NAVIGATION_PATH.RENTER_DASHBOARD : ROUTE_NAVIGATION_PATH.USER_MANAGEMENT))
  }

  return (
    <>
      <header className="rental-portal-header">
        <Link className="logo" to={ROUTE_NAVIGATION_PATH.HOME}>
          <img alt="stayattache" className="img-responsive" src={logoAttache} />
        </Link>
        <div className="navbar">
          <div className="navbar-control">
            <Link
              to={ROUTE_NAVIGATION_PATH.HOME}
              className="nav-item nav-user-item"
            >
              <img src={profileImg} />
            </Link>
            <a
              onClick={collapsableMenu}
              className="nav-item frontend-user-sidebar"
              id="menuCollapse"
            >
              <em className="icon-menu"></em>
            </a>
          </div>
        </div>
      </header>

      <div className="left-sidebar admin-sidebar-new" >
        <div className={isAdmin ? 'admin-left-sidbarmenu' : "leftmenu-content"}>
        <div className="close-btn">
          <a id="dismiss" onClick={collapsableMenu}>
            <em className="icon-close frontend-user-sidebar"></em>
          </a>
        </div>
          {
            isAdmin ?
              <>
                <div className="user-info-top" onClick={toggleProfileOpen}>
                  <div className="user-image">{auth?.user?.firstName ? capitalizeFirstLetter(auth?.user?.firstName) : '-'}{auth?.user?.lastName ? capitalizeFirstLetter(auth?.user?.lastName) : '-'}</div>
                  <div className="user-info">
                    <div className="name">{auth?.user?.firstName}</div>
                    <p>{auth?.user?.email}</p>
                    <div className="arrow" >
                      <img src={downArrow} alt="Arrow" />
                    </div>
                  </div>
                </div>
                {profileOpen ? (
                  <div ref={divRef} className="user-info-drodown">
                    <ul>
                      {/* <li>
                        <a className="" onClick={() => navigateToProfile("1")}>
                          View Profile
                        </a>
                      </li>
                      <li>
                        <a className="" onClick={() => navigateToProfile()}>
                          Change Password
                        </a>
                      </li> */}
                      {
                        auth.user.isGuest && (
                          <li>
                            <a className="" onClick={() => navigateToDashboard(1)}>
                              <img src={linkIcon} alt="" /> Guest Login
                            </a>
                          </li>
                          
                        )
                      }

                      {
                        auth.user.isOwner && (
                          <li>
                            <a className="" onClick={() => navigateToDashboard(0)}>
                              <img src={linkIcon} alt="" /> Owner Login
                            </a>
                          </li>
                          
                        )
                      }
                      <li className='signout'>
                        <a className="" onClick={signOut}>
                         <img src={signoutIcon} alt="icon" />  Logout
                        </a>
                      </li>
                    </ul>
                  </div>)
                  :
                  null
                }
              </>
              :
              <div className="left-sidebarLogo">
                <Link className="logo" to={ROUTE_NAVIGATION_PATH.HOME}>
                  <img
                    alt="stayattache"
                    className="img-responsive"
                    src={logoAttache}
                  />
                </Link>
              </div>
          }
          <div className={isAdmin ? "navigation" : "left-sidebarMenu"}>
            <ul>
              {(isDashBoard == ROLE.ADMIN
                ? ADMIN_MENUS
                : isDashBoard === ROLE.OWNER
                  ? OWNERS_MENUS
                  : RENTER_MENUS
              ).map((menu, key) => (
                <Menu
                  key={key}
                  url={menu.url}
                  title={menu.title}
                  defaultIcon={menu.deafultIcon}
                  subMenu={menu.subMenu}
                  icon={menu.icon}
                  profileImg={false}
                  callback={(e) => { }}
                  activeOn={menu.activeOn}
                  isAdmin={isAdmin}
                  index={key}
                  openToggle={openToggle} // Pass the current toggle state
                  setOpenToggle={setOpenToggle} // Pass the function to update state
                />
              ))}
            </ul>
            {
              !isAdmin ?
                <ul>
                  <li className="dropdown custom-dropdown-menu right-sidebar-dropdown">
                    {
                      ! localStorage.getItem("impersonateToken")
                      ?
                      <>
                        <div
                          ref={buttonRef} 
                          className="txt"
                          onClick={toggleProfileOpen}
                          id="dropdownMenu2"
                          data-toggle="dropdown"
                          aria-haspopup="true"
                          aria-expanded="false"
                        >
                          <span className="sidebar-pic">
                            <img src={profileImg} />
                          </span>
                          <span className="user-name-text">{auth?.user?.firstName}</span>
                          <span className="back-icon"></span>
                        </div>
                        {profileOpen ? (
                          <div ref={divRef} className="dropdown-menu" aria-labelledby="dropdownMenu2">
                            <a
                              onClick={() => navigateToProfile("1")}
                              className="dropdown-item"
                            >
                              View Profile
                            </a>
                            {
                              (isDashBoard !== ROLE.RENTER && auth.user.isGuest) && (
                              
                                  <a className="dropdown-item" onClick={() => navigateToDashboard(1)}>
                                    Guest Portal
                                  </a>
                                
                              )
                            }
                            {
                              (isDashBoard !== ROLE.OWNER && auth.user.isOwner) && (
                                  <a className="dropdown-item" onClick={() => navigateToDashboard(0)}>
                                    Owner Portal
                                  </a>
                              )
                            }
                            {
                              (isDashBoard !== ROLE.ADMIN && auth.user.isAttache) && (
                                  <a className="dropdown-item" onClick={() => navigateToDashboard(2)}>
                                    Admin Portal
                                  </a>
                              )
                            }
                            <a
                              onClick={() => navigateToProfile()}
                              className="dropdown-item"
                            >
                              Change Password
                            </a>
                          </div>
                        ) : null}
                      </>
                      :
                      <div className="txt">
                          <span className="sidebar-pic">
                            <img src={profileImg} />
                          </span>
                          <span className="user-name-text">{localStorage.getItem('paymentUser')}</span>
                      </div>
                    }
                    
                  </li>
                  <li>
                    <div className="txt" onClick={signOut}>
                      <span className="sidebar-icon">
                        <img src={logout} alt="active" />
                        <img src={logoutActive} alt="active" />
                      </span>
                      Logout
                    </div>
                  </li>
                </ul>
                :
                null
            }
          </div>
          {
            isAdmin ?
              <div className="logo-bottom">
                <Link className="logo" to={ROUTE_NAVIGATION_PATH.HOME}>
                  <img
                    alt="stayattache"
                    className="img-responsive"
                    src={logoAttache}
                  />
                </Link>
              </div>
              :
              null
          }
        </div>


      </div>
    </>
  );
}

