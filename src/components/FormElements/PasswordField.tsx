import { FormControl } from "./FormControl";
import IconEyes from "../../assets/images/eye-show.svg";
import IconEyesHide from "../../assets/images/eye-hide.svg";
import Iconlock from "../../assets/images/lock.svg";

import { useState } from "react";

export default function PasswordField({
  validations,
  name = "password",
  label = "Password",
  maxlength = 16,
  placeholder= "Password",
}: {
  validations: any;
  name?: string;
  label?: string;
  maxlength?: number;
  placeholder?: string;
}) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const showPassword = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <div className="password-field">
      {/* {label ? <label className="form-label">{(label as string)}</label>: null} */}

      <FormControl
        name={name}
        label={label}
        type={isPasswordVisible ? "text" : "password"}
        placeholder={placeholder}
        validate={validations}
        // icon={Iconlock}
        //maxlength={maxlength}
      />
      
      <img
        src={isPasswordVisible ? IconEyesHide : IconEyes}
        alt="password"
        className={`iconEyes ${isPasswordVisible ? "visible" : ""}`}
        onClick={showPassword}
      />
      {/* <img
        src={IconEyesHide}
        alt="password"
        className="iconEyes2"
        onClick={showPassword}
      /> */}
    </div>
  );
}
