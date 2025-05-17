import { Link, useParams } from "react-router-dom";
import { toast } from 'react-toastify';
import { encryptPassword } from "../../../utils";
import logo from "../../../assets/images/svg/attache-logo.svg";
import { Button } from "react-bootstrap";
import { Form } from "react-final-form";
import { composeValidators, confirmPasswordMatchValidation, required } from "../../../validations";
import PasswordField from "../../../components/FormElements/PasswordField";
import { ROUTE_NAVIGATION_PATH } from "../../../routes/routes";
import { useCustomMutation } from "../../../hooks/useApi";
import { authetication } from "../../../api";

export default function ResetPassword() {
  const params = useParams();

  const mutation = useCustomMutation({
    mutationFn: authetication.doRestPassword,
    onSuccess: () => {
      toast.success('Password Reset Successfully.')
    },
  });

  const onSubmit = (values: any) => {
    const data = {
      resetPasswordToken: params.token,
      password: encryptPassword(values.password),
    };
    mutation.mutate(data);
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
            <Form
              onSubmit={onSubmit}
              render={({ handleSubmit, values }) => (
                <form onSubmit={handleSubmit}>
                  <h2>Reset your password!</h2>
                  <span className="d-block caption">
                    Please enter your registered email address and we will send
                    you a link to reset it.
                  </span>
                  <PasswordField
                    label="New Password"
                    placeholder="Enter New password"
                    validations={composeValidators(required)}
                  />

                  <PasswordField
                    label="Confirm New Password"
                    placeholder="Confirm New Password"
                    name="confirmPassword"
                    validations={composeValidators(
                      required,
                      confirmPasswordMatchValidation(values.password)
                    )}
                  />
                  <div className="action-btn text-right">
                    <Button variant="primary btn" type="submit">
                      Change Password
                    </Button>
                  </div>
                </form>
              )}
            />
          </div>
          <footer className="login-fooer with-back-to-login">
            <p>
              <Link
                to={ROUTE_NAVIGATION_PATH.SIGN_IN}
                className="back-to-login"
              >
                Back to Login
              </Link>
            </p>
          </footer>
        </div>
      </div>
    </main>
  );
}
