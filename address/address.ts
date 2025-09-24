import {CountryCode} from '../form-control/input-field/utils/constants/country-code';

export class Address {
  email: string;
  organization: string;
  salutation: string;
  fullName: string;
  firstName: string;
  lastName: string;
  street: string;
  houseNumber: string;
  phoneNumber: string;
  floor: number;
  postalCode: string;
  city: string;
  state: string;
  country: CountryCode;
}