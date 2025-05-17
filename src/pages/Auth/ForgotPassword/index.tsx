import { Link } from "react-router-dom";
import logo from "../../../assets/images/svg/attache-logo.svg";
import { FormControl } from "../../../components/FormElements/FormControl";
import { Button } from "react-bootstrap";
import { Form } from "react-final-form";
import { composeValidators, required, validEmail } from "../../../validations";
import { ROUTE_NAVIGATION_PATH } from "../../../routes/routes";
import { useCustomMutation } from "../../../hooks/useApi";
import { authetication } from "../../../api";
import { useState } from "react";
import iconSuccess from "../../../assets/images/svg/icon-success.svg";


export default function ForgotPassword() {
  const [showAlert , setShowAlert] = useState(false);
  const { mutate } = useCustomMutation({
    mutationFn: authetication.doForgot,
    onSuccess: () => {
      setShowAlert(true)
    },
  });

  const onSubmit = (values: { email: string }) => {
    mutate(values);
  };

  return (
    <main className="main-content login-pages-container">
      <div className="login-pages-wrapper">
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

        <div className="login-page-form-wrapper forgot-password-wrapper justify-content-between">
          {/* {rightContent} */}
          <div className="form-wrapper">
            <div className="logo">
              <a href="/">
                <img alt="stayattache" className="img-responsive" src={logo} />
              </a>
            </div>
            {
              showAlert ? 
                <div className="password-successful-content">
                  <div className="successful-icon-wrapper">
                      <img src={iconSuccess} alt="Success Message Icon" />
                  </div>
                  <h2>Email Sent Successfully!</h2>
                  <span className="d-block caption">
                    To get back into your account, follow the instructions we’ve sent to your provided
                    <span className="d-block">Email ID.</span>
                  </span>
                </div>
              :
              <Form
                onSubmit={onSubmit}
                render={({ handleSubmit, values }) => (
                  <form onSubmit={handleSubmit}>
                    <h2>Forgot your password?</h2>
                    <span className="d-block caption">
                      Please enter your registered email address and we will send
                      you a link to reset it.
                    </span>
                    <FormControl
                      label="Email Address:"
                      name="email"
                      type="email"
                      placeholder="Enter your Email Address"
                      validate={composeValidators(required, validEmail)}
                    />
                    <div className="action-btn text-right">
                      <Button variant="primary btn" type="submit">
                        Submit
                      </Button>
                    </div>
                  </form>
                )}
              />
            }
            
          </div>
          <footer className="login-fooer with-back-to-login">
            <p>
              <Link to={ROUTE_NAVIGATION_PATH.SIGN_IN} className="back-to-login">
                Back to Login
              </Link>
            </p>
          </footer>
        </div>
      </div>
    </main>
  );
}
