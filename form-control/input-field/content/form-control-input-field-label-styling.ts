import {FormControlInputFieldStyling} from 'src/app/shared/form-control/input-field/form-control-input-field-styling';

export interface FormControlInputFieldContentStyling extends FormControlInputFieldStyling {
}

export class StandardFormControlInputFieldContentStyling implements FormControlInputFieldContentStyling {
  cssClass: string = 'form-control form-control-solid';
}

export class StandardFormControlInputFieldDropdownStyling implements FormControlInputFieldContentStyling {
  cssClass: string = 'form-select form-select-solid h-50px';
}

/**
 * Standard styling for date input field
 */
export class StandardFormControlInputFieldContentDateStyling extends StandardFormControlInputFieldContentStyling {
  cssClass: string = 'form-control form-control-solid ';
}

/**
 * Standard styling for switch input field
 */
export class StandardFormControlInputFieldContentSwitchStyling extends StandardFormControlInputFieldContentStyling {
  cssClass: string = 'form-check form-switch form-check-custom form-check-solid me-3';
}