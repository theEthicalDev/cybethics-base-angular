import {Component, Input} from '@angular/core';
import {FormControlDropdownParams, FormControlInputFieldContentParams} from '../../../form-control-input-field-content-params';

@Component({
  selector: 'app-form-control-input-field-content-dropdown',
  templateUrl: './form-control-input-field-content-dropdown.component.html',
  styleUrls: ['./form-control-input-field-content-dropdown.component.scss'],
  standalone: false,
})
export class FormControlInputFieldContentDropdownComponent {

  @Input({
    transform: (value: FormControlInputFieldContentParams): FormControlDropdownParams => value as FormControlDropdownParams,
    required: true
  })
  set formControlInputFieldContentParams(value: FormControlDropdownParams) {
    this._formControlInputFieldContentParams = value;
  }
  _formControlInputFieldContentParams: FormControlDropdownParams;

  defaultCompareWithFn = (o1: any, o2: any) => o1 === o2;

}
