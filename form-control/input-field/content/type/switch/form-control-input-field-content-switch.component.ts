import {Component, Input} from '@angular/core';
import {FormControlSwitchParams} from '../../../form-control-input-field-content-params';

@Component({
  selector: 'app-form-control-input-field-content-switch',
  templateUrl: './form-control-input-field-content-switch.component.html',
  styleUrls: ['./form-control-input-field-content-switch.component.scss'],
  standalone: false,
})
export class FormControlInputFieldContentSwitchComponent {

  @Input({
    transform: (value: FormControlSwitchParams): FormControlSwitchParams => value as FormControlSwitchParams,
    required: true
  })
  set formControlInputFieldContentParams(formControlSwitchParams: FormControlSwitchParams) {
    // if value is string true or false, convert it to boolean
    const targetValue = formControlSwitchParams?.formControl?.value;
    if (this.hasValue(targetValue) && typeof targetValue === 'string' && (targetValue === 'true' || targetValue === 'false')) {
      formControlSwitchParams.formControl.setValue(targetValue === 'true');
    }
    this._formControlInputFieldContentParams = formControlSwitchParams;
  }

  _formControlInputFieldContentParams: FormControlSwitchParams;

  toggle() {
    this._formControlInputFieldContentParams.formControl.setValue(!this._formControlInputFieldContentParams.formControl.value);
  }

  hasValue(value: any): boolean {
    return value != undefined && value != null;
  }
}
