import {Component, Input} from '@angular/core';
import {FormControlInputFieldContentParams, FormControlPasswordParams} from '../../../form-control-input-field-content-params';
import {fc} from '../../../../form-control-helper';

@Component({
  selector: 'app-form-control-input-field-content-password',
  templateUrl: './form-control-input-field-content-password.component.html',
  styleUrls: ['./form-control-input-field-content-password.component.scss'],
  standalone: false,
})
export class FormControlInputFieldContentPasswordComponent {
  @Input({
    transform: (value: FormControlInputFieldContentParams): FormControlPasswordParams => value as FormControlPasswordParams,
    required: true
  })
  set formControlInputFieldContentParams(value: FormControlPasswordParams) {
    this._formControlInputFieldContentParams = value;
  }

  _formControlInputFieldContentParams: FormControlPasswordParams;
  protected readonly fc = fc;
}
