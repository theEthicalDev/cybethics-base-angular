import {Component, Input} from '@angular/core';
import {ControlContainer, FormGroupDirective} from '@angular/forms';
import {FormControlLabelParams} from './label/form-control-label-params';
import {FormControlInputFieldContentParams} from './form-control-input-field-content-params';
import {RequiredContentFormControlInputFieldLabelStyling} from './label/form-control-input-field-label-styling';
import {FormControlInputFieldContentType} from './content/type/form-control-input-field-content-type';

@Component({
  selector: 'app-form-control',
  templateUrl: './form-control-input-field.component.html',
  styleUrls: ['./form-control-input-field.component.scss'],
  standalone: false,
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }]
})
export class FormControlInputFieldComponent {

  @Input({required: true})
  set labelParams(value: FormControlLabelParams) {
    value.styling = RequiredContentFormControlInputFieldLabelStyling.from(this._contentParams?.formControl);
    this._labelParams = value;
  }

  _labelParams: FormControlLabelParams;

  @Input({required: true})
  set contentParams(value: FormControlInputFieldContentParams) {
    console.debug('inputFieldContentParams', value);
    this._contentParams = value;
  }

  _contentParams: FormControlInputFieldContentParams;

  @Input()
  withSkeletonFn: boolean = false;

  typeWithLabelRight(): boolean {
    return this._contentParams?.type === FormControlInputFieldContentType.CHECKBOX
        || this._contentParams?.type === FormControlInputFieldContentType.SWITCH;
  }
}
