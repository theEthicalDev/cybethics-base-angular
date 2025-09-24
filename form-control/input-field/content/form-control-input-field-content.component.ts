import {Component, Input} from '@angular/core';
import {FormControlInputFieldContentParams} from '../form-control-input-field-content-params';
import {FormControlInputFieldContentType} from './type/form-control-input-field-content-type';

@Component({
  selector: 'app-form-control-input-field-content',
  templateUrl: './form-control-input-field-content.component.html',
  styleUrls: ['./form-control-input-field-content.component.scss'],
  standalone: false,
})
export class FormControlInputFieldContentComponent {

  @Input({required: true})
  formControlInputFieldContentParams: FormControlInputFieldContentParams;

  protected readonly FormControlInputFieldContentType = FormControlInputFieldContentType;
}
