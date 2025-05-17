import { DropDownOption, DropDownOptions } from "../types/rental.type";

export const required = (value: any) => {
  if (typeof value === "string") {
    return value.trim() ? undefined : "This field is required.";
  }

  if (typeof value === "number") {
    return isNaN(value) ? "This field is required." : undefined;
  }

  // For other types (null, undefined, boolean), return required error
  return value || value === 0 ? undefined : "This field is required.";
};

export const requiredNotZero = (value: any) => {

  if (typeof value === "number") {
    return isNaN(value) || value == 0 ? "This field is required" : undefined;
  }

  // For other types (null, undefined, boolean), return required error
  return value || value === 0 ? undefined : "This field is required.";
};

export const mustBeNumber = (value: number) =>
  isNaN(value) ? "Must be a number" : undefined;

export const minValue = (min: number) => (value: string) =>
  value && !isNaN(Number(value)) && Number(value) < min ? `Please enter at least ${min} characters` :
  undefined;

export const maxlength = (max: number) => (value: string) =>
  value?.length > max
    ? `The entered character count exceeds the allowable limit. Please enter a maximum of ${max} characters.`
    : undefined;

export const validEmail = (value?: string) =>
  value &&
  /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(value)
    ? null
    : `Please enter a valid email addresss.`;

export const validLatitude = (value?: string) =>
    value &&
    /^[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?)$/.test(value)
      ? null
      : value ? `Please enter a valid latitude.` : null;

export const validLongitude = (value?: string) =>
      value &&
      /^[-+]?([1-9]?\d(\.\d+)?|1[0-7]\d(\.\d+)?|180(\.0+)?)$/.test(value)
        ? null
        : value ? `Please enter a valid latitude.` : null;

export const validPassword = (value?: string) =>
  value &&
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$!%*?&])[A-Za-z\d@#$!%*?&]{6,}$/.test(
    value
  ) ? null : (
    <ul className="password-ul">
      <li>At least 6 characters in length</li>
      <li>Contain at least one uppercase character (A-Z)</li>
      <li>Contain at least one lowercase character (a-z)</li>
      <li>Contain at least one numeric character (0-9)</li>
      <li>Contain at least one special character</li>
    </ul>
  );


export const validPhoneNumber = (value?:any) => 
  value && !/^\d{10,11}$/.test(value)
    ? "Mobile number should consist of at least 10 and at most 11 digits"
    : null;

export const validTime = (value?: string) =>
  value && /^[0-5]?\d:[0-5]\d$/.test(value) ? null : `Time should be in mm:ss`;

export const confirmPasswordMatchValidation =
  (password: string) => (value?: string) =>
    value && password && password !== value
      ? `Password confirmation failed. The entered password does not match with the new password. Please check your password and try again.`
      : null;

export const minDateCompare = (minDate: string) => (value?: string) =>
  value && minDate && minDate <= value
    ? null
    : `End Date Can't be less than start Date`;

export const composeValidators =
  (...validators: any[]) =>
  (value: any) =>
    validators.reduce(
      (error, validator) => error || validator(value),
      undefined
    );

export const requiredWithMessage = (message: string) => (value: string) =>
  value ? undefined : message;

export const requiredSelect = (data: any): string | undefined => {
  if (data === null || data === undefined) return "This field is required.";

  if (typeof data === "string" && data.trim() === "") return "This field is required.";

  if (typeof data === "number" && isNaN(data)) return "This field is required.";

  if (Array.isArray(data) && data.length === 0) return "This field is required.";

  if (typeof data === "object" && "value" in data) {
    return requiredSelect(data.value); // Recursively validate the value
  }

  return undefined; // Valid case
};


export const validAmount = (value: string) =>
  value && /^\d+(\.\d{0,2})?$/.test(value)
    ? null
    : `Please enter a valid amount. The amount should be numeric and formatted to two decimal places.`;
