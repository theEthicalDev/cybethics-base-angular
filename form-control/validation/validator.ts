import {AbstractControl, FormGroup, ValidationErrors, ValidatorFn, Validators} from '@angular/forms';

export const futureDateValidator = (from?: Date | null): ValidatorFn => (control: AbstractControl): ValidationErrors | null => {
  if (control.value) {
    const date: Date = new Date(control.value);
    from = from ? from : new Date();
    if (date && date.getTime() < from.getTime()) {
      return {customError: 'VALIDATION.FUTURE_DATE'};
    }
  }
  return null;
};

export const pastDateValidator = (): ValidatorFn => (control: AbstractControl): ValidationErrors | null => {
  if (control.value) {
    const date: Date = new Date(control.value);
    const now: Date = new Date();
    if (date && date.getTime() > now.getTime()) {
      return {customError: 'VALIDATION.PAST_DATE'};
    }
  }
  return null;
}

export const numberOfYearsAgoValidator = (years: number): ValidatorFn => (control: AbstractControl): ValidationErrors | null => {
  if (control.value) {
    const date: Date = new Date(control.value);
    const now: Date = new Date();
    now.setFullYear(now.getFullYear() - years);
    if (date && date.getTime() > now.getTime()) {
      return customError('VALIDATION.PAST_DATE_YEARS', years);
    }
  }
  return null;
}

export const invalidOnValueMatch = (string: string): ValidatorFn => (control: AbstractControl): ValidationErrors | null => {
  const value: string = control.value;
  if (value && value === string) {
    return customError('VALIDATION.MATCH', string);
  }
  return null;
}

/**
 * Number must be within the range of min and max. If min or max is not defined, only the other value is checked.
 */
export const rangeValidator = (min?: number, max?: number): ValidatorFn => (control: AbstractControl): ValidationErrors | null => {
  const value: number = control.value;
  if (value === null || value === undefined) {
    return null;
  }
  if (min && max && (value < min || value > max)) {
    return customError('VALIDATION.RANGE', min, max);
  }
  if (min && value < min) {
    return {customError: 'VALIDATION.RANGE_MIN', args: {'0': min.toString()}};
  }
  if (max && value > max) {
    return {customError: 'VALIDATION.RANGE_MAX', args: {'0': max.toString()}};
  }
  return null;
}

/**
 * Number of characters must be within the range of min and max. If min or max is not defined, only the other value is checked.
 */
export const lengthValidator = (min?: number, max?: number): ValidatorFn => (control: AbstractControl): ValidationErrors | null => {
  const value: any = control.value;
  if (value === null || value === undefined) {
    return null;
  }
  if (min && max && min === max && value.length !== min) {
    return {customError: 'VALIDATION.LENGTH_EXACT', args: {'length': min.toString()}};
  }
  if (min && max && (value.length < min || value.length > max)) {
    return {customError: 'VALIDATION.LENGTH', args: {'min': min.toString(), 'max': max.toString()}};
  }
  if (min && value.length < min) {
    return {customError: 'VALIDATION.LENGTH_MIN', args: {'min': min.toString()}};
  }
  if (max && value.length > max) {
    return {customError: 'VALIDATION.LENGTH_MAX', args: {'max': max.toString()}};
  }
  return null;
}

/**
 * Array must contain at least min and at most max elements.
 */
// export const lengthValidator = (min: number = 1, max: number = Number.MAX_SAFE_INTEGER): ValidatorFn => (control: AbstractControl): ValidationErrors | null => {
//   const value: any[] = control.value;
//   if (value === null || value === undefined) {
//     return customError('VALIDATION.ARRAY_LENGTH_MIN', min);
//   }
//   if (value.length < min) {
//     return customError('VALIDATION.ARRAY_LENGTH_MIN', min);
//   }
//   if (value.length > max) {
//     return customError('VALIDATION.ARRAY_LENGTH_MAX', max);
//   }
//   return null;
// }

/**
 * Must be a valid email address.
 */
export const emailValidator = (): ValidatorFn => (control: AbstractControl): ValidationErrors | null => {
  return errorWhenRegexDoesNotMatch(control, /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'VALIDATION.EMAIL');
}

/**
 * Must be a valid phone number.
 */
export const phoneValidator = (): ValidatorFn => (control: AbstractControl): ValidationErrors | null => {
  return errorWhenRegexDoesNotMatch(control, /^(\+)?(\d{1,4}[-.\s])?((\(\d{1,3}\))\d{1,3}[-.\s]\d{1,4}[-.\s]\d{1,9}|\d{10,14})$/, 'VALIDATION.PHONE');
}

/**
 * Must be a valid numeric value.
 */
export const numericValidator = (): ValidatorFn => (control: AbstractControl): ValidationErrors | null => {
  return errorWhenRegexDoesNotMatch(control, /^[0-9]+$/, 'VALIDATION.NUMERIC');
}

/**
 * Dynamic validation. If the condition function returns true, the slave control is required.
 */
export function applyDynamicValidation(masterControlName: string, slaveControlName: string, conditionFn: (value: any) => boolean, formGroup: FormGroup, validators: ValidatorFn[] = [Validators.required]) {
  const masterControl = formGroup.get(masterControlName);
  const slaveControl = formGroup.get(slaveControlName);
  if (!masterControl || !slaveControl) {
    return;
  }
  masterControl.valueChanges.subscribe((value: any) => {
    if (conditionFn(value)) {
      slaveControl.addValidators(validators);
    } else {
      console.log('Clearing validator for', masterControlName);
      slaveControl.removeValidators(validators);
      slaveControl.reset();
    }
    slaveControl.updateValueAndValidity();
  });
  masterControl.updateValueAndValidity();
}

/**
 * *********************************************************************************************************************
 * Helper functions
 * *********************************************************************************************************************
 */
export function customError(code: string, ...args: any[]) {
  const argsObject = args.reduce((obj, arg, index) => {
    obj[index.toString()] = arg.toString();
    return obj;
  }, {});
  return {customError: code, args: argsObject};
}

function errorWhenRegexDoesNotMatch(control: AbstractControl<any, any>, regex: RegExp, code: string, ...args: any): ValidationErrors | null {
  const value: string = control.value;
  if (value && !regex.test(value)) {
    return customError(code, args);
  }
  return null;
}

export const yesterday = new Date(new Date().setDate(new Date().getDate() - 1));
export const today = new Date(new Date().setHours(0, 0, 0, 0));
export const tomorrow = new Date(new Date().setDate(new Date().getDate() + 1));
