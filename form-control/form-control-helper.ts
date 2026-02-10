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

/**
 * Builds a form control ID by joining the provided arguments with slashes. This is just an internal ID to
 * identify or map form controls and has no other meaning, so it doesn't need to be stored in the backend in most cases.
 */
export function buildFcId(...args: string[]): string {
  const preparedArgs = args.map(arg => arg.trim().toLowerCase().replace(/\s+/g, '-'));
  return preparedArgs.join('.');
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
      translatedKey = translateService.instant(translateKeyPrefix, {value: string.toUpperCase()});
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

export function formatDateTime(date: Date | undefined, format: string = 'yyyy-MM-ddTHH:mm:ss', locale: string = 'de-CH'): string | undefined {
  return formatDateValue(date, format);
}

export function formatDateValue(date: Date | undefined, format: string = 'yyyy-MM-dd', locale: string = 'de-CH'): string | undefined {
  if (date) {
    return formatDate(date, format, locale);
  }
  return undefined;
}

/**
 * Returns an ISO 8601 string including the local timezone offset, e.g. 2026-02-09T10:05:49+01:00
 * Use this when sending datetimes to the backend so the server receives an absolute instant with the client's offset.
 */
export function formatDateToIsoWithOffset(date: Date | undefined): string | undefined {
  if (!date) return undefined;

  const pad = (n: number) => n < 10 ? '0' + n : String(n);

  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());

  // getTimezoneOffset returns minutes to add to local time to get UTC, so invert sign to get offset from UTC
  const offsetMinutes = -date.getTimezoneOffset();
  const sign = offsetMinutes >= 0 ? '+' : '-';
  const absOffsetMinutes = Math.abs(offsetMinutes);
  const offsetHours = pad(Math.floor(absOffsetMinutes / 60));
  const offsetMins = pad(absOffsetMinutes % 60);

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}${sign}${offsetHours}:${offsetMins}`;
}

/**
 * If you have an HTML <input type="datetime-local"> value (which is timezone-less, e.g. "2026-02-09T10:30"),
 * use this to convert it to an ISO string with the user's timezone offset for backend storage.
 * Example: toBackendIsoFromLocalString('2026-02-09T10:30') -> '2026-02-09T10:30:00+01:00' (when user's offset is +01:00)
 */
export function toBackendIsoFromLocalString(localDateTime: string | undefined): string | undefined {
  if (!localDateTime) return undefined;
  // Create a Date by splitting the local string and using Date constructor with local parts
  // Avoids ambiguity across environments -- construct with Date(year, monthIndex, day, hour, minute, second)
  const match = localDateTime.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?$/);
  if (!match) return undefined;
  const [, y, m, d, hh, mm, ss] = match;
  const date = new Date(Number(y), Number(m) - 1, Number(d), Number(hh), Number(mm), ss ? Number(ss) : 0);
  return formatDateToIsoWithOffset(date);
}
