import {AfterViewInit, Component, Input} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {
  FormControlDropdownParams,
  FormControlNumberParams,
  FormControlPasswordParams,
  FormControlSwitchParams,
  FormControlTextParams,
} from '../form-control/input-field/form-control-input-field-content-params';
import {AddressFormKeyEnum, label} from './address-form-key-enum';
import {BehaviorSubject} from 'rxjs';
import {Translation} from '../translation/translation';
import {fc} from '../form-control/form-control-helper';
import {FormControlLabelParams} from '../form-control/input-field/label/form-control-label-params';
import {CountryCode} from '../form-control/input-field/utils/constants/country-code';

@Component({
  selector: 'app-address-form',
  templateUrl: './address-form.component.html',
  styleUrls: ['./address-form.component.scss'],
  standalone: false,
})
export class AddressFormComponent implements AfterViewInit {

  @Input()
  public title: Translation = Translation.from('ADDRESS.ADDRESS');
  @Input()
  public addressFormGroup: FormGroup;
  @Input()
  public isLoading$ = new BehaviorSubject(false).asObservable();
  @Input()
  public countryCodes: any = CountryCode;
  @Input()
  public withEmailSeparator = true;

  protected readonly FormControlTextParams = FormControlTextParams;
  protected readonly FormControlLabelParams = FormControlLabelParams;
  protected readonly AddressFormKeyEnum = AddressFormKeyEnum;
  protected readonly label = label;
  protected readonly FormControlNumberParams = FormControlNumberParams;
  protected readonly FormControlSwitchParams = FormControlSwitchParams;
  protected readonly FormControlDropdownParams = FormControlDropdownParams;
  protected readonly FormControlPasswordParams = FormControlPasswordParams;

  constructor() {
  }

  ngAfterViewInit(): void {
    this.validateFormControlKeysAreValid();
  }

  /**
   * Used especially in the HTML to check if a key exists in the form group. This is useful to show or hide form fields.
   */
  anyKeyExists(...key: AddressFormKeyEnum[]): boolean {
    return key.some(k => {
      return this.addressFormGroup?.controls[k] !== undefined;
    });
  }

  protected fc(key: AddressFormKeyEnum) {
    return fc(this.addressFormGroup, key.toString());
  }

  /**
   * Validates that all keys in the form control are valid. Valid means that the key is in the AddressFormKeyEnum.
   * If a key is not valid, an error is logged. This is important to ensure that the form control is correctly set up, as the HTML
   * expects keys to come from the AddressFormKeyEnum.
   */
  private validateFormControlKeysAreValid() {
    const controls = this.addressFormGroup?.controls;
    if (controls !== undefined) {
      Object.keys(controls).forEach(key => {
        if (!Object.values(AddressFormKeyEnum).includes(key as AddressFormKeyEnum)) {
          console.error(`Key ${key} is not in AddressFormKeyEnum`);
        }
      });
    }
  }
}
