import React from "react";
import MuiTextField from "@material-ui/core/TextField";
import styled from "styled-components";

const BaseTextField = (props) => (
  <MuiTextField fullWidth {...props} variant="outlined" />
);

const FOCUS_COLOUR = "#99d6ff";
const ADORNMENT_COLOUR = "#c4c4c7";
const DARK_GREY = "#414D55";
const MID_GREY = "#6F7B82";
const LIGHT_GREY = "#9AA8B0";
const GREY_DE = "#DEDEE0";
const LIGHT_RED = "#FEE2E2";

export const TextField = styled(BaseTextField)`
  margin-bottom: 1.2rem;
  .MuiInputBase-root {
    background: "white";
  }
  // The actual input field
  .MuiInputBase-input {
    color: ${DARK_GREY};
    font-weight: 400;
    font-size: 1rem;
    line-height: 1.2rem;
    padding: 1rem;
    border-radius: 3px;
  }
  .MuiSelect-root {
    color: ${LIGHT_GREY};
  }
  // Error state
  .MuiInputBase-root.Mui-error {
    background: ${LIGHT_RED};
  }
  // helper text
  .MuiFormHelperText-root {
    margin-left: 0;
  }
  // The border
  .MuiOutlinedInput-notchedOutline {
    border-color: ${GREY_DE};
    top: 0;
    legend {
      display: none;
    }
  }
  // Hover state
  .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline {
    border-color: ${GREY_DE};
  }
  // Focused state
  .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline {
    border-width: 1px;
    border-color: ${FOCUS_COLOUR};
    box-shadow: 0 0 5px rgba(0, 135, 216, 0.75);
  }
  .MuiFormLabel-root.Mui-focused {
    color: ${DARK_GREY};
  }
  // The label
  .MuiFormLabel-root {
    position: relative;
    margin-bottom: 3px;
    color: ${MID_GREY};
    font-size: 0.9375rem;
    line-height: 1.125rem;
    transform: none;
  }
  // Adornments
  .MuiInputAdornment-root {
    color: ${ADORNMENT_COLOUR};
  }
  .MuiInputAdornment-positionStart {
    margin-right: 0;
  }
  .MuiInputBase-inputAdornedStart,
  .MuiInputBase-adornedStart {
    padding-left: 5px;
  }
  /* Override MaterialUI which hides the placeholder due to conflict with its floating labels */
  &&&& {
    .MuiInputBase-input::placeholder {
      opacity: 1 !important;
      color: ${LIGHT_GREY};
    }
  }
  // disable MaterialUI underline
  .MuiInput-underline:before,
  .MuiInput-underline:after {
    display: none;
  }
  //Textarea
  .MuiOutlinedInput-multiline {
    padding: 0;
  }
  // Small size
  .MuiInputBase-inputMarginDense {
    padding: 10px;
  }
`;
