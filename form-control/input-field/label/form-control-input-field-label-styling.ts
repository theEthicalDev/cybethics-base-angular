import {FormControlInputFieldStyling} from '../form-control-input-field-styling';
import {FormControl} from '@angular/forms';

export interface FormControlInputFieldLabelStyling extends FormControlInputFieldStyling {
}

export class StandardFormControlInputFieldLabelStyling implements FormControlInputFieldLabelStyling {
  cssClass: string = 'form-label fw-semibold fs-6 mb-2';
}

export class RequiredContentFormControlInputFieldLabelStyling implements FormControlInputFieldLabelStyling {

  cssClass: string = 'form-label fw-semibold fs-6 mb-2 required';

  public static from(formControl: FormControl): FormControlInputFieldLabelStyling {
    if (formControl?.validator) {
      const validator = formControl.validator({} as FormControl);
      if (validator && validator.required) {
        return new RequiredContentFormControlInputFieldLabelStyling();
      }
    }
    return new StandardFormControlInputFieldLabelStyling();
  }
}
