import {AbstractControl, FormArray, FormControl, FormGroup} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import {ExtraToastrService} from '../extra-toastr/extra-toastr.service';
import {formatDate} from '@angular/common';

export function fc(parent: AbstractControl, name: string): FormControl {
  return getControl<FormControl>(name, () => new FormControl(), parent);
}

export function fg(parent: AbstractControl, name: string): FormGroup {
  return getControl<FormGroup>(name, () => new FormGroup({}), parent);
}

export function fa(parent: AbstractControl, name: string): FormArray {
  return getControl<FormArray>(name, () => new FormArray<any>([]), parent);
}

export function fcFromFaByFilter(formArray: FormArray, filter: (control: any) => boolean): FormGroup | undefined {
  return formArray.controls.find(filter) as FormGroup | undefined;
}


export function validateFormGroup(formGroup: FormGroup, extraToastr: ExtraToastrService, translateService: TranslateService, translateKeyPrefix: string) {
  updateValueAndValidityRecursively(formGroup);
  if (formGroup.invalid) {
    logFormErrors(formGroup, extraToastr, translateService, translateKeyPrefix);
    return false;
  }
  return true;
}

export function updateValueAndValidityRecursively(formGroup: FormGroup) {
  formGroup.markAllAsTouched();
  formGroup.updateValueAndValidity();
  const updateValueAndValidity = (control: AbstractControl) => {
    if (control instanceof FormGroup || control instanceof FormArray) {
      for (const key in control.controls) {
        const subControl = control.get(key);
        if (subControl) {
          updateValueAndValidity(subControl);
        }
      }
    }
    control.updateValueAndValidity();
  }
  updateValueAndValidity(formGroup);
}

export function logFormErrors(formGroup: FormGroup, extraToastr: ExtraToastrService, translateService: TranslateService, translateKeyPrefix: string) {
  console.log('Form is invalid', formGroup);
  console.log('Form errors', formGroup.errors);
  const allFormErrors = getAllFormErrors(formGroup);
  console.log(allFormErrors);
  if (allFormErrors) {
    const lastEntries = getLastEntries(allFormErrors, [], translateService, translateKeyPrefix);
    if (lastEntries.length > 0) {
      const joinedErrorKeys = lastEntries.join(', ');
      extraToastr.error('FORM_INVALID_ARGS', joinedErrorKeys);
      return;
    }
  }
  extraToastr.error('FORM_INVALID');
}

function getAllFormErrors(formGroup: FormGroup | FormArray): { [key: string]: any } {
  const errors: { [key: string]: any } = {};
  // Iterate over each control in the form group
  Object.keys(formGroup.controls).forEach(key => {
    const control = formGroup.get(key);
    // If the control is a nested form group, recursively get its errors
    if (control instanceof FormGroup || control instanceof FormArray) {
      const nestedErrors = getAllFormErrors(control);
      if (Object.keys(nestedErrors).length > 0) {
        errors[key] = nestedErrors;
      }
    } else if (control?.errors) {
      errors[key] = control.errors;
    }
  });
  return errors;
}

function getLastEntries(errors: any, path: string[] = [], translateService: TranslateService, translateKeyPrefix: string): string[] {
  const entries: string[] = [];
  Object.keys(errors).forEach(key => {
    const newPath = [...path, key];
    if (typeof errors[key] === 'object' && errors[key] !== null) {
      // If the current property is an object, recursively get its last entries
      const nestedEntries = getLastEntries(errors[key], newPath, translateService, translateKeyPrefix);
      entries.push(...nestedEntries);
    } else {
      // If the current property is not an object, it is a last entry
      // Only push the second last part of the path
      const string = newPath[newPath.length - 2];
      let translatedKey: string;
      translatedKey = translateService.instant(translateKeyPrefix, { value: string.toUpperCase()});
      if (translatedKey.startsWith(translateKeyPrefix)) {
        const regex = /([a-z])([A-Z])/g;
        const replacement = '$1_$2';
        const keyWithUnderscore = string.replace(regex, replacement).toUpperCase();
        translatedKey = translateService.instant(translateKeyPrefix + keyWithUnderscore);
      }
      entries.push(translatedKey);
    }
  });
  return entries;
}

function getControl<T extends AbstractControl>(name: string, controlFactory: () => T, parent: AbstractControl): T {
  try {
    if (parent) {
      const control = (parent).get(name) as T;
      console.debug('Control for name:', name, 'is:', control);
      if (!control) {
        console.warn('Warning: control not found for name:', name);
      }
      return control;
    }
    console.warn('Warning: control not found for name:', name);
    return controlFactory();
  } catch (e) {
    console.error('Error: control not found for name:', name);
    throw e;
  }
}

export function formatDateTime(date: Date | undefined, format: string = 'yyyy-MM-ddTHH:mm'): string | undefined {
  return formatDateValue(date, format);
}

export function formatDateValue(date: Date | undefined, format: string = 'yyyy-MM-dd', locale: string = 'de-CH'): string | undefined {
  if (date) {
    return formatDate(date, format, locale);
  }
  return undefined;
}
