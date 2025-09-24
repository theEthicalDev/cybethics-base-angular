import {Component, Input} from '@angular/core';
import {FormControlDateTimeParams, FormControlInputFieldContentParams} from '../../../form-control-input-field-content-params';

@Component({
  selector: 'app-form-control-input-field-content-date-time',
  templateUrl: './form-control-input-field-content-date-time.component.html',
  styleUrls: ['./form-control-input-field-content-date-time.component.scss'],
  standalone: false,
})
export class FormControlInputFieldContentDateTimeComponent {
  @Input({
    transform: (value: FormControlInputFieldContentParams): FormControlDateTimeParams => value as FormControlDateTimeParams,
    required: true
  })
  set formControlInputFieldContentParams(value: FormControlDateTimeParams) {
    this._formControlInputFieldContentParams = value;
  }
  _formControlInputFieldContentParams: FormControlDateTimeParams;

}
