import { Link, useNavigate } from "react-router-dom";
import { ROLE } from "../../constants";
import { HOME_MENUS } from "../../constants/menu";
import { useAuth } from "../../hooks/useAuth";
import { ROUTE_NAVIGATION_PATH } from "../../routes/routes";

function RightMenu({
  icon,
  title,
  url,
  profileImg,
  callback,
  activeOn,
}: {
  icon: string;
  title: string;
  url: string;
  callback: (e: any) => void;
  profileImg: boolean;
  activeOn: string[];
}) {
  let redirectionUrl = url;

  return (
    <li>
      <Link to={redirectionUrl} title="Browse our properties.">
        {title}
      </Link>
    </li>
  );
}

export default function ({
  navClass,
  isNavButton,
  toggleMenuExpend,
  expendMenu = true,
}: {
  navClass?: any;
  isNavButton: boolean;
  toggleMenuExpend: () => void;
  expendMenu: boolean;
}) {
  const navigate = useNavigate();
  const auth = useAuth();
  const { signout } = useAuth();
  const sign = () => {
    navigate(ROUTE_NAVIGATION_PATH.SIGN_IN);
  };
  const signOut = () => {
    signout();
  };

  return (
    <>
      

      <div className="menu-plugin-container">
        <div className={`menu-sidebar ${expendMenu ? "active" : ""}`}>
          <div className="menu-control">
            <div className="d-flex">
              {auth.user ? (
                <>
                  <div className="_userhover">
                    <a className="nav-item">
                      <em className="icon-user"></em>
                    </a>
                  </div>
                  <a onClick={signOut} className="nav-item">
                    <span className="text-underline">Log Out</span>
                  </a>
                </>
              ) : (
                <>
                  <a onClick={sign} className="nav-item">
                    <em className="icon-user"></em>
                  </a>
                  <a onClick={sign} className="nav-item">
                    <span className="text-underline">Log In</span>
                  </a>
                </>
              )}
            </div>
            <a className="nav-item" id="dismiss" onClick={toggleMenuExpend}>
              <em className="icon-close"></em>
            </a>
          </div>
          <div className="menu-bottom">
            <Link
              to={ROUTE_NAVIGATION_PATH.RENTAL_INQUIRY}
              title="Submit a rental inquiry."
            >
              Rental Inquiry
              <em className="icon-right-arrow"></em>
            </Link>
            <Link
              to={ROUTE_NAVIGATION_PATH.OWNER_SERVICES}
              title="See owner services."
            >
              Owner Inquiry
              <em className="icon-right-arrow"></em>
            </Link>
          </div>
          <ul className="menu-list">
            {HOME_MENUS.map((menu) => (
              <RightMenu
                key={menu.title}
                url={menu.url}
                title={menu.title}
                icon={menu.icon}
                profileImg={false}
                callback={(e) => {}}
                activeOn={menu.activeOn}
              />
            ))}
          </ul>
        </div>
        <div className={`menu-overlay ${expendMenu ? "active" : ""}`}></div>
      </div>
    </>
  );
}
