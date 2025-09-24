import {Component, Input} from '@angular/core';
import {FormControlDateParams, FormControlInputFieldContentParams} from '../../../form-control-input-field-content-params';

@Component({
  selector: 'app-form-control-input-field-content-date',
  templateUrl: './form-control-input-field-content-date.component.html',
  styleUrls: ['./form-control-input-field-content-date.component.scss'],
  standalone: false,
})
export class FormControlInputFieldContentDateComponent {
  @Input({
    transform: (value: FormControlInputFieldContentParams): FormControlDateParams => value as FormControlDateParams,
    required: true
  })
  set formControlInputFieldContentParams(value: FormControlDateParams) {
    this._formControlInputFieldContentParams = value;
  }
  _formControlInputFieldContentParams: FormControlDateParams;

}
