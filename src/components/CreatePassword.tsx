import { VALIDATIONS } from "../constants";
import { composeValidators, minValue, required } from "../validations";
import PasswordField from "./FormElements/PasswordField";

export default function CreatePassword() {
  return (
    <>
      <div className="create-your-pass mt-1">
        <div className="captcha-field">
          <h5>Create Password</h5>
          <p>
            Create a password to be able to log into your account in the future.
          </p>
          <PasswordField
            label="Password"
            name="password"
            placeholder="Enter your password"
            validations={composeValidators(
              required,
              minValue(VALIDATIONS.MIN_PASSWORD)
            )}
          />
        </div>
        {/* <div className="captcha-field">
                      <PasswordField
                        label="Confirm Password"
                        name="confirmPassword"
                        placeholder="Enter Confirm password"
                        validations={required}
                      />
                    </div> */}
      </div>
    </>
  );
}
