import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import DateFnsUtils from "@date-io/date-fns";
import CalendarTodayIcon from "@material-ui/icons/CalendarToday";
import {
  KeyboardDatePicker as MuiDatePicker,
  KeyboardDateTimePicker as MuiDateTimePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import { TextField } from "./TextField";

const DAY_MONTH_YEAR_DATE_FORMAT = "dd/MM/yyyy";
const LIGHT_GREY = "#9AA8B0";

const StyledDatePicker = styled(MuiDatePicker)`
  .MuiInputBase-input {
    padding-left: 0;
    color: ${LIGHT_GREY};
  }
  .MuiButtonBase-root.MuiIconButton-root {
    top: -1px;
    color: ${LIGHT_GREY};
    padding: 0.5rem;
  }
`;

const DatePicker = ({ label, value, onChange, className, format }) => (
  <MuiPickersUtilsProvider utils={DateFnsUtils}>
    <StyledDatePicker
      label={label}
      value={value}
      format={format}
      keyboardIcon={<CalendarTodayIcon />}
      InputAdornmentProps={{ position: "start" }}
      onChange={onChange}
      animateYearScrolling
      TextFieldComponent={TextField}
      className={className}
    />
  </MuiPickersUtilsProvider>
);

DatePicker.propTypes = {
  label: PropTypes.string,
  className: PropTypes.string,
  value: PropTypes.instanceOf(Date),
  onChange: PropTypes.func,
  format: PropTypes.string,
};

DatePicker.defaultProps = {
  label: null,
  value: new Date(),
  className: null,
  format: DAY_MONTH_YEAR_DATE_FORMAT,
};

export default DatePicker;
