import {Injectable} from '@angular/core';
import {Injector} from '@angular/core';
import {validateFormGroup} from 'src/app/shared/form-control/form-control-helper';
import {fc} from 'src/app/shared/form-control/form-control-helper';
import {fa} from 'src/app/shared/form-control/form-control-helper';
import {fg} from 'src/app/shared/form-control/form-control-helper';
import {fcFromFaByFilter} from 'src/app/shared/form-control/form-control-helper';
import {FormGroup} from '@angular/forms';
import {ExtraToastrService} from 'src/app/shared/extra-toastr/extra-toastr.service';
import {TranslateService} from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export abstract class AbstractFormGroupManagerService {

  private formGroup: FormGroup;
  private extraToastr: ExtraToastrService;
  private translateService: TranslateService;
  private translateKeyPrefix: string;

  constructor(injector: Injector, translateKeyPrefix: string) {
    this.extraToastr = injector.get(ExtraToastrService);
    this.translateService = injector.get(TranslateService);
    this.translateKeyPrefix = translateKeyPrefix;
  }

  abstract setFormGroup(formGroup: FormGroup): void;

  public get() {
    return this.formGroup;
  }

  public group(key: string) {
    return fg(this.formGroup, key);
  }

  public control(key: string) {
    return fc(this.formGroup, key);
  }

  public array(key: string) {
    fa(this.formGroup, key);
  }

  public arrayControl(arrayKey: string, filter: (control: any) => boolean) {
    return fcFromFaByFilter(fa(this.formGroup, arrayKey), filter);
  }

  public validateFormGroup() {
    validateFormGroup(this.formGroup, this.extraToastr, this.translateService, this.translateKeyPrefix);
  }

}
