import {Component, Input} from '@angular/core';
import {FormControlLabelParams} from './form-control-label-params';

@Component({
  selector: 'app-form-control-input-field-label',
  templateUrl: './form-control-input-field-label.component.html',
  styleUrls: ['./form-control-input-field-label.component.scss'],
  standalone: false,
})
export class FormControlInputFieldLabelComponent {

  @Input()
  formControlInputFieldLabelParams: FormControlLabelParams;

}
