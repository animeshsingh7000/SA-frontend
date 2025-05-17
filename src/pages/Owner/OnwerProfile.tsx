import profileImg from "../../assets/images/profile.svg";
import profileThumb from "../../assets/images/profile-thumbnail-placeholder.png";
import {
  composeValidators,
  confirmPasswordMatchValidation,
  minValue,
  required,
} from "../../validations";
import { Form } from "react-final-form";
import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { ROUTE_NAVIGATION_PATH } from "../../routes/routes";
import { Link, useNavigate } from "react-router-dom";
import PasswordField from "../../components/FormElements/PasswordField";
import { useCustomMutation } from "../../hooks/useApi";
import { authetication } from "../../api";
import { useAuth } from "../../hooks/useAuth";
import { VALIDATIONS } from "../../constants";
import { encryptPassword } from "../../utils";


export default function OwnerProfile() {
  const isProfile = new URLSearchParams(document.location.search).get('isProfile');
  const navigate = useNavigate();
  const [showProfile, setShowProfile] = useState((isProfile && isProfile == '1') ? true : false);
  const auth = useAuth();

  const changeTab = () => {
    setShowProfile(!showProfile);
  }

  useEffect(() => {
    if(isProfile && isProfile == '1') {
      setShowProfile(true)
    } else {
      setShowProfile(false);
    }
    
  }, [isProfile]);

  const mutation = useCustomMutation({
    mutationFn: authetication.changePassword,
    onSuccess: () => {
      navigate(localStorage.getItem("isDashboard")== '1' ? ROUTE_NAVIGATION_PATH.RENTER_DASHBOARD : ROUTE_NAVIGATION_PATH.OWNER_DASHBOARD);
    },
  });

  const onSubmit = (values: any) => {
    const data = {
      currentPassword: encryptPassword(values.currentPassword),
      password: encryptPassword(values.password),
      confirmPassword: encryptPassword(values.confirmPassword),
    }
    mutation.mutate(data);
  };

  return (
    <>
      <div className="right-container">
        <div className="breadcrumb-module">
          <div className="container">
            <div className="breadcrumb-row breadcrumb-profile-row">
              <div className="breadcrumb-icon mt-2">
                <img src={profileImg} alt="profile" />
              </div>
              <div className="breadcrumb-content">
                <h4>Profile</h4>
                <p className="mt-1">You can manage your profile here.</p>
              </div>
            </div>
          </div>
        </div>
        <div className="container user-profile-page">
          <ul className="rental-portal-tabs profile-tabs">
            <li>
              <span className={`${showProfile ? "active" : ""}`} onClick={changeTab}>
                Profile
              </span>
            </li>
            <li>
              <span className={`${!showProfile ? "active" : ""}`} onClick={changeTab}>Change Password</span>
            </li>
          </ul>

          <div className="rental-portal-content">
            {
              showProfile ?
                <div className="rental-portal-form edit-profile-form">
                  <div className="edit-user-group divider">
                    <div className="edit-user-title">Personal Information</div>
                    <div className="edit-user-items mt-3 mt-md-4">
                      <div className="edit-user-img border-0">
                        <img src={profileThumb} />
                      </div>
                      <div className="edit-user-content">
                        <div className="edit-file-info">
                          <p className="profile-name"> {auth?.user.firstName} {auth?.user.lastName}</p>
                          <p className="profile-email">
                            {auth?.user.email}
                          </p>
                          <p className="profile-mobile numbersOnly phone-mask">
                            {auth?.user.mobile}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row mr-md-0 ml-md-0 mb-1"></div>
                </div>
              :
              <div className="rental-portal-form edit-profile-form">
                <div className="form-error"></div>
                <div className="change-password-title">Change Password</div>

                <div className="row">
                  <Form
                    onSubmit={onSubmit}
                    render={({ handleSubmit, values  }) => (
                      <form onSubmit={handleSubmit}>
                        <div className="row">
                          <div className="col-12 col-md-6 relative">
                            <PasswordField 
                              placeholder="Enter your password"
                              name="currentPassword"
                              label="Current Password"
                              validations={required} />
                          </div>

                          <div className="col-12 col-md-6"></div>

                          <div className="col-12 col-md-6 relative">
                            <PasswordField
                              placeholder="Enter your password"
                              label="New Password"
                              maxlength={16}
                              validations={composeValidators(
                                required,
                                minValue(VALIDATIONS.MIN_PASSWORD)
                              )} 
                            />
                          </div>

                          <div className="col-12 col-md-6 relative">
                            <PasswordField
                              placeholder="Enter your password"
                              name="confirmPassword"
                              label="Confirm Password"
                              maxlength={16}
                              validations={composeValidators(
                                required,
                                confirmPasswordMatchValidation(values.password)
                              )}
                            /> 
                          </div>
                        </div>
                        <div className="form-group input-button mt-1 mt-lg-3">
                            <Link to={localStorage.getItem("isDashboard")== '1' ? ROUTE_NAVIGATION_PATH.RENTER_DASHBOARD : ROUTE_NAVIGATION_PATH.OWNER_DASHBOARD}>
                              <Button type="button" className="btn secondary text-uppercase">
                                Cancel
                              </Button>
                            </Link>

                            <Button type="submit" className="btn primary">
                              UPDATE Password
                            </Button>
                        </div>
                      </form>
                    )}
                  />
                </div>
              </div>
            }
          </div>
        </div>
      </div>
    </>
  );
}
