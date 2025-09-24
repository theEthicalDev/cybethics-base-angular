import {Component, Input} from '@angular/core';
import {FormControlInputFieldContentParams, FormControlTextParams} from '../../../form-control-input-field-content-params';
import {fc} from '../../../../form-control-helper';

@Component({
  selector: 'app-form-control-input-field-content-text',
  templateUrl: './form-control-input-field-content-text.component.html',
  styleUrls: ['./form-control-input-field-content-text.component.scss'],
  standalone: false,
})
export class FormControlInputFieldContentTextComponent {
  @Input({
    transform: (value: FormControlInputFieldContentParams): FormControlTextParams => value as FormControlTextParams,
    required: true
  })
  set formControlInputFieldContentParams(value: FormControlTextParams) {
    this._formControlInputFieldContentParams = value;
  }

  _formControlInputFieldContentParams: FormControlTextParams;
  protected readonly fc = fc;
}
