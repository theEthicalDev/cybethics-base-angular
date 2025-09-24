import {Component, Input} from '@angular/core';
import {FormControlInputFieldContentParams, FormControlNumberParams} from '../../../form-control-input-field-content-params';

@Component({
  selector: 'app-form-control-input-field-content-number',
  templateUrl: './form-control-input-field-content-number.component.html',
  styleUrls: ['./form-control-input-field-content-number.component.scss'],
  standalone: false,
})
export class FormControlInputFieldContentNumberComponent {

  @Input({
    transform: (value: FormControlInputFieldContentParams): FormControlNumberParams => value as FormControlNumberParams,
    required: true
  })
  set formControlInputFieldContentParams(value: FormControlNumberParams) {
    this._formControlInputFieldContentParams = value;
  }
  _formControlInputFieldContentParams: FormControlNumberParams;

}
