import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormControlInputFieldLabelComponent} from './input-field/label/form-control-input-field-label.component';
import {ReactiveFormsModule} from '@angular/forms';
import {FormControlInputFieldContentTextComponent} from './input-field/content/type/text/form-control-input-field-content-text.component';
import {FormControlInputFieldContentComponent} from './input-field/content/form-control-input-field-content.component';
import {FormControlInputFieldComponent} from './input-field/form-control-input-field.component';
import {FormControlRowComponent} from './row/form-control-row.component';
import {FormControlColumnComponent} from './column/form-control-column.component';
import {
  FormControlInputFieldContentDropdownComponent
} from './input-field/content/type/dropdown/form-control-input-field-content-dropdown.component';
import {FormControlInputFieldContentDateComponent} from './input-field/content/type/date/form-control-input-field-content-date.component';
import {
  FormControlInputFieldContentSwitchComponent
} from './input-field/content/type/switch/form-control-input-field-content-switch.component';
import {
  FormControlInputFieldContentNumberComponent
} from './input-field/content/type/number/form-control-input-field-content-number.component';
import {
  FormControlInputFieldContentTextAreaComponent
} from './input-field/content/type/textarea/form-control-input-field-content-text-area.component';
import {TranslationModule} from '../../modules/i18n';
import {
  FormControlInputFieldContentDateTimeComponent
} from './input-field/content/type/date-time/form-control-input-field-content-date-time.component';
import {SharedModule} from '../../_metronic/shared/shared.module';
import {CustomSharedModule} from '../custom-shared.module';
import {
  FormControlInputFieldContentPasswordComponent
} from './input-field/content/type/password/form-control-input-field-content-password.component';

@NgModule({
  declarations: [
    FormControlInputFieldLabelComponent,
    FormControlInputFieldComponent,
    FormControlInputFieldContentTextComponent,
    FormControlInputFieldContentPasswordComponent,
    FormControlInputFieldContentDropdownComponent,
    FormControlInputFieldContentComponent,
    FormControlRowComponent,
    FormControlColumnComponent,
    FormControlInputFieldContentDateComponent,
    FormControlInputFieldContentDateTimeComponent,
    FormControlInputFieldContentSwitchComponent,
    FormControlInputFieldContentNumberComponent,
    FormControlInputFieldContentTextAreaComponent,
  ],
  imports: [
    CommonModule,
    TranslationModule,
    ReactiveFormsModule,
    SharedModule,
    CustomSharedModule,
  ],
  exports: [
    FormControlInputFieldLabelComponent,
    FormControlInputFieldComponent,
    FormControlInputFieldContentTextComponent,
    FormControlInputFieldContentPasswordComponent,
    FormControlInputFieldContentDropdownComponent,
    FormControlInputFieldContentComponent,
    FormControlRowComponent,
    FormControlColumnComponent,
    FormControlInputFieldContentNumberComponent,
  ]
})
export class CybethicsFormControlModule { }
