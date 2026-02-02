import {Component, Input} from '@angular/core';
import {FormControlInputFieldContentParams, FormControlTextAreaParams} from '../../../form-control-input-field-content-params';

@Component({
  selector: 'app-form-control-input-field-content-text-area',
  templateUrl: './form-control-input-field-content-text-area.component.html',
  styleUrls: ['./form-control-input-field-content-text-area.component.scss'],
  standalone: false,
})
export class FormControlInputFieldContentTextAreaComponent {

  @Input({
    transform: (value: FormControlInputFieldContentParams): FormControlTextAreaParams => value as FormControlTextAreaParams,
    required: true
  })
  set formControlInputFieldContentParams(value: FormControlTextAreaParams) {
    this._formControlInputFieldContentParams = value;
  }
  _formControlInputFieldContentParams: FormControlTextAreaParams;

}
