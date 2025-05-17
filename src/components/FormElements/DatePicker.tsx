import { Field, FieldProps } from "react-final-form";
import DatePicker from "react-datepicker";
import { useRef } from "react";
import Datetime from 'react-datetime';
import moment from "moment";

interface FormControlProps extends FieldProps<any, any, any, any> {
  label?: string;
  type?: string;
  placeholder?: string;
  minDate?: Date;
  disabled?: boolean;
  //   icon?: string;
}

export function DatePickerControl({
  label,
  type = "datepicker",
  placeholder,
  minDate = new Date(),
  disabled = false,
  ...rest
}: FormControlProps) {
  const datePickerRef = useRef<DatePicker>(null);
  const datetimeRef = useRef<Datetime>(null); // Declare ref with Datetime type

  const openDatePicker = () => {
    if (datePickerRef.current) {
      datePickerRef.current.setOpen(true);
    }
  };



  return (
    <Field
      {...rest}
      render={({ input, meta }) => {
        return (
          <div className="text-start form-field">
            <label className="form-label">{label}</label>

            {type === 'datepicker' ? (
              <>
                <DatePicker
                  selected={
                    input.value && moment.utc(input.value).isValid()
                      ? moment.utc(input.value).local().startOf('day').toDate()
                      : null
                  }
                  onChange={(date) => {
                    console.log(date);
                    input.onChange(moment.utc(date).local().startOf('day').toDate());
                    rest?.onChange && rest?.onChange(moment.utc(date).local().startOf('day').toDate());
                  }}
                  minDate={minDate}
                  dateFormat="MM/dd/yyyy"
                  className={"form-control spacing-equal"}
                  onKeyDown={(e) => e.preventDefault()}
                  placeholderText={placeholder}
                  ref={datePickerRef}
                  disabled={disabled}
                />
                <em className="icon-calender" onClick={openDatePicker}></em>
              </>
            ) : (
              <>
                <Datetime
                  initialValue={input.value ? moment(new Date(input.value)).format('YYYY-MM-DD hh:mm A') : 'MM-DD-YY'}
                  onChange={(date) => {
                    input.onChange(date);
                    rest?.onChange && rest?.onChange(date);
                  }}
                  value={input.value ? moment(new Date(input.value)).format('YYYY-MM-DD hh:mm A') : 'MM-DD-YY'}
                  dateFormat="YYYY-MM-DD"
                  timeFormat="hh:mm A"
                  ref={datetimeRef}
                  isValidDate={(currentDate) => currentDate.isSameOrAfter(minDate, 'day')}
                  renderDay={(props, currentDate) => {
                    if (currentDate.isSame(minDate, 'day')) {
                      props.className += ' today';
                    }
                    return <td {...props}>{currentDate.date()}</td>;
                  }}
                  inputProps={{ disabled: disabled }}
                />
                <em className="icon-calender"></em>
              </>
            )}

            {meta.touched && meta.error && (
              <span className="error">{meta.error}</span>
            )}
          </div>
        );
      }}
    />
  );
}
