import { ReactNode } from "react";
import { Field, FieldProps } from "react-final-form";
import InfoTooltip from "../InfoTooltip";

interface FormControlProps extends FieldProps<any, any, any, any> {
  label?: string;
  icon?: string;
  maxlength?: number;
  minLength?: number;
  blur?:boolean;
  value?: any;
  fillValue?:any;
  autocomplete?: any;
  updateFilterCategoryId?: (query: object) => void;
}

export function FormControl({
  label,
  placeholder,
  type,
  icon,
  maxlength,
  minLength,
  disabled,
  blur,
  value,
  fillValue,
  autocomplete,
  updateFilterCategoryId,
  children,
  onChange,
  toolTipInfo,
  ...rest
}: FormControlProps) {

  return (
    <Field
      {...rest}
      onChange={onChange}
      type={type}
      render={({ input, meta }) =>
        (
          <div className="text-start form-field">
            {label ? 
              <label className="form-label">
                {(label as string)}
                {toolTipInfo ? <InfoTooltip text={toolTipInfo} /> : null}
              </label>
              : null
            }
           
            <div className="input-group2">
              {type === "textarea" ? (
                <textarea
                    {...input}
                    className={`form-control ${icon ? "" : "spacing-equal"}`}
                    placeholder={(placeholder as string)}
                    rows="8"
                    maxLength={maxlength}
                    disabled={disabled}
                    onChange={(e: any) => {input.onChange(e);onChange && onChange(e)}}
                  />

              ) : type === "textarea-number" ? (
                  <textarea
                    {...input}
                    className={`form-control ${icon ? "" : "spacing-equal"}`}
                    placeholder={(placeholder as string)}
                    onKeyPress={(event) => {
                      if (!/[0-9]/.test(event.key)) {
                        event.preventDefault();
                      }
                    }}
                    rows="3"
                    maxLength={maxlength}
                    disabled={disabled}
                    onChange={(e: any) => {input.onChange(e);onChange && onChange(e)}}
                  />

              )  : type === "mobile" ?

                <input
                    {...input}
                    disabled={disabled}
                    className={`form-control ${icon ? "" : "spacing-equal"}`}
                    placeholder={(placeholder)}
                    type={type}
                    onKeyPress={(event) => {
                      if (!/[0-9]/.test(event.key)) {
                        event.preventDefault();
                      }
                    }}
                    maxLength={maxlength}
                    minLength={minLength}
                    value={fillValue ? (value ? value: '') : input.value}
                    onChange={(e: any) => {input.onChange(e);onChange && onChange(e)}}
                />
                : type === "input-number" ?

                <input
                    {...input}
                    disabled={disabled}
                    className={`form-control ${icon ? "" : "spacing-equal"}`}
                    placeholder={(placeholder)}
                    type={type}
                    onKeyPress={(event) => {
                      if (!/[0-9]/.test(event.key)) {
                        event.preventDefault();
                      }
                    }}
                    value={fillValue ? (value ? value: '') : input.value}
                    onChange={(e: any) => {input.onChange(e);onChange && onChange(e)}}
                />
                : type === "input-decimal" ?

                <input
                    {...input}
                    disabled={disabled}
                    className={`form-control ${icon ? "" : "spacing-equal"}`}
                    placeholder={(placeholder)}
                    type={type}
                    onKeyPress={(event) => {
                      if (!/^\d*\.?\d*$/.test(event.key)) {
                        event.preventDefault();
                      }
                    }}
                    value={fillValue ? (value ? value: '') : input.value}
                    onChange={(e: any) => {input.onChange(e);onChange && onChange(e)}}
                />
              : type === "checkbox" ?
                <input
                  {...input}
                  disabled={disabled}
                  className={`form-control ${icon ? "" : "spacing-equal"}`}
                  placeholder={(placeholder)}
                  type={type}
                  onChange={(e: any) => {input.onChange(e);onChange && onChange(e)}}
                />
              :
                <input
                  {...input}
                  disabled={disabled}
                  className={`form-control ${icon ? "" : "spacing-equal"}`}
                  placeholder={placeholder}
                  type={type}
                  onChange={(e: any) => {input.onChange(e);onChange && onChange(e)}}
                  value={fillValue ? (value ? value: '') : input.value}
                  autoComplete={autocomplete ? autocomplete : 'on'}
                />
            }
            </div>
            {meta.touched && meta.error &&  (
              
              <span className="error">{(meta.error)}</span>
            )}
          </div>
        )
      }
    />
  );
}
