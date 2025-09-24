import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Address} from './address';

export enum AddressFormKeyEnum {
  ORGANIZATION = 'organization',
  SALUTATION = 'salutation',
  FULL_NAME = 'fullName',
  FIRST_NAME = 'firstName',
  LAST_NAME = 'lastName',
  ADDRESS = 'address',
  ADDRESS_2 = 'address2',
  STREET = 'street',
  HOUSE_NUMBER = 'houseNumber',
  FLOOR = 'floor',
  POSTAL_CODE = 'postalCode',
  CITY = 'city',
  COUNTRY = 'country',
  PHONE_NUMBER = 'phoneNumber',
  PASSWORD = 'password',
  EMAIL = 'email',
  STATE = 'state',
  IS_BILLING_EQUAL = 'isBillingEqual',
}

export function label(key: AddressFormKeyEnum): string {
  return 'ADDRESS.' + getEnumKeyByValue(AddressFormKeyEnum, key);
}

function getEnumKeyByValue<T extends object>(enumObj: T, value: string): keyof T | null {
  return (Object.keys(enumObj) as Array<keyof T>).find(key => enumObj[key] === value) || null;
}

export function createAddressFormGroup(formBuilder: FormBuilder, address: Address): FormGroup {
  return formBuilder.group({
    [AddressFormKeyEnum.EMAIL]: [address.email, Validators.required],
    [AddressFormKeyEnum.ORGANIZATION]: [address.organization],
    [AddressFormKeyEnum.SALUTATION]: [address.salutation],
    [AddressFormKeyEnum.FIRST_NAME]: [address.firstName, Validators.required],
    [AddressFormKeyEnum.LAST_NAME]: [address.lastName, Validators.required],
    [AddressFormKeyEnum.STREET]: [address.street, Validators.required],
    [AddressFormKeyEnum.HOUSE_NUMBER]: [address.houseNumber, Validators.required],
    [AddressFormKeyEnum.CITY]: [address.city, Validators.required],
    [AddressFormKeyEnum.POSTAL_CODE]: [address.postalCode, Validators.required],
    [AddressFormKeyEnum.COUNTRY]: [address.country, Validators.required],
  });
}
