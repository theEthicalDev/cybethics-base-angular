import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TranslateModule} from '@ngx-translate/core';
import {CalculableOptionGroupsComponent} from 'src/app/shared/components/calculable-option-groups/calculable-option-groups.component';
import {CybethicsFormControlModule} from 'src/app/shared/form-control/cybethics-form-control.module';
import {CustomSharedModule} from 'src/app/shared/custom-shared.module';
import {SharedModule} from 'src/app/_metronic/shared/shared.module';

@NgModule({
  declarations: [
    CalculableOptionGroupsComponent
  ],
  imports: [
    CommonModule,
    TranslateModule,
    CybethicsFormControlModule,
    CustomSharedModule,
    SharedModule,
  ],
  exports: [
    CalculableOptionGroupsComponent
  ]
})
export class CalculableModule { }
