import { Link, useNavigate } from "react-router-dom";
import { AuthLayout } from "../../../components";
import { useAuth } from "../../../hooks/useAuth";
import { AuthType } from "../../../types/User";
import { encryptPassword } from "../../../utils";
import { Form } from "react-final-form";
import { composeValidators, required, validEmail } from "../../../validations";
import { FormControl } from "../../../components/FormElements/FormControl";
import PasswordField from "../../../components/FormElements/PasswordField";
import { ROUTE_NAVIGATION_PATH } from "../../../routes/routes";
import { Button } from "react-bootstrap";
import { CheckboxControl } from "../../../components/FormElements/CheckboxControl";
import { ROLE } from "../../../constants";
import { useState } from "react";
import { getNeighbourhood, getQuadrants } from "../../../api/admin/neighborhood";

const ROLE_NAVIGATION = {
  [ROLE.ADMIN]: ROUTE_NAVIGATION_PATH.USER_MANAGEMENT,
  [ROLE.OWNER]: ROUTE_NAVIGATION_PATH.OWNER_DASHBOARD,
  [ROLE.RENTER]: ROUTE_NAVIGATION_PATH.RENTER_DASHBOARD,
};

function SignInForm() {
  const [neighbourhood, setNeighbourhood] = useState((localStorage.getItem("neighbourhood")
  ? JSON.parse(localStorage.getItem("neighbourhood") as string)
  : []));
  const [quadrants, setQuadrants] = useState((localStorage.getItem("quadrants")
        ? JSON.parse(localStorage.getItem("quadrants") as string)
  : []));
  const { signin } = useAuth();
  const navigate = useNavigate();

  const onSubmit = (values: AuthType) => {
    delete values?.isRemember;
    const data = { ...values };
    data.password = encryptPassword(data.password);
    signin(data, (res) => {
      if(neighbourhood.length == 0) {
        getNeighbourhoods();
      }
      if(quadrants.length == 0) {
        getQuadrant();
      }
      localStorage.setItem("isDashboard", res.data.isAttache ? '2' : res.data.isGuest ? '1' : '0');
      navigate(ROLE_NAVIGATION[res.data.isAttache ? 2 : res.data.isGuest ? 1 : 0], { replace: true });
    });
  };

  const getNeighbourhoods = () => {
    try {
        getNeighbourhood().then((res: any) => {         
          localStorage.setItem("neighbourhood", JSON.stringify(res.data.neighbourhoods));
        });
    } catch (error) {
        console.error("Error fetching data:", error);
    }
  }

  const getQuadrant = () => {
    try {
      getQuadrants().then((res: any) => {
        // let data = [{_id: 'Select Directional', name: ''}].concat(res.data.quadrants);
        localStorage.setItem("quadrants", JSON.stringify(res.data.quadrants));
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  return (
    <>
      <div className="form-wrapper">
        <Form
          onSubmit={onSubmit}
          render={({ handleSubmit, values }) => (
            <form onSubmit={handleSubmit}>
              <h2>Welcome Back</h2>
              <span className="d-block caption">
                Please login to Stay Attache with your original account details.
              </span>
              <FormControl
                label="Email:"
                name="email"
                type="email"
                placeholder="Enter your Email Address"
                validate={composeValidators(required, validEmail)}
              />
              <PasswordField
                placeholder="Enter your password"
                label="Password"
                validations={required}
              />

              <div className="term-info">
                <div className="termstext">
                  <CheckboxControl name="isRemember" label="Remember Me" />
                </div>
                <Link to={ROUTE_NAVIGATION_PATH.FORGOT_PASSWORD}>
                  <Button variant="link forgot">Forgot Password?</Button>
                </Link>
              </div>

              <div className="action-btn text-right">
                <Button variant="primary btn" type="submit">
                  Log In
                </Button>
              </div>
            </form>
          )}
        />
      </div>
    </>
  );
}
export default function SignIn() {
  return (
    <AuthLayout
      leftContent={
        <>
          <div className="login-banner">
            <div className="login-banner-welcome-card">
              <h1>
                Welcome to <span>Stay Attache</span>
              </h1>
              <p className="welcome-caption">
                Just bring your luggage and a laptop. All properties are
                fully-furnished and include all utilities, internet and cable.
              </p>
            </div>
          </div>
        </>
      }
      rightContent={<SignInForm />}
    />
  );
}
