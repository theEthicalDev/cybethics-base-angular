import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AddressFormComponent} from './address-form.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';
import {CustomSharedModule} from '../custom-shared.module';
import {CybethicsFormControlModule} from '../form-control/cybethics-form-control.module';

@NgModule({
  declarations: [
    AddressFormComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    CustomSharedModule,
    CybethicsFormControlModule,
  ],
  exports: [
    AddressFormComponent
  ]
})
export class AddressFormModule { }
