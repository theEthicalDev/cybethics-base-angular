import {Injectable} from '@angular/core';
import {ToastrService} from 'ngx-toastr';
import {TranslateService} from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class ExtraToastrService {

  constructor(private toastr: ToastrService, private translator: TranslateService) {
  }

  info(code?: string): void {
    this.toast(code, 'INFO', (message: string) => {
      this.toastr.info(message);
    });
  }

  success(code?: string): void {
    this.toast(code, 'SUCCESS', (message: string) => {
      this.toastr.success(message);
    });
  }

  warning(code?: string, ...args: string[]): void {
    this.toast(code, 'WARNING', (message: string) => {
      this.toastr.warning(message);
    }, args);
  }

  error(code?: string, ...args: string[]): void {
    this.toast(code, 'ERROR', (message: string) => {
      this.toastr.error(message);
    }, args);
  }

  private toast(code: string | undefined, defaultCode: string, method: (message: string) => void, args?: Array<string>): void {
    if (code) {
      this.translator.get(this.translationKey(code), args).subscribe((res: string) => {
        if (res !== this.translationKey(code)) {
          method(res);
        } else {
          this.toastWithDefault(defaultCode, method);
        }
      });
    } else {
      this.toastWithDefault(defaultCode, method);
    }
  }

  private toastWithDefault(defaultCode: string, method: (message: string) => void) {
    this.translator.get(this.translationKey(defaultCode)).subscribe((res: string) => {
      method(res);
    });
  }

  private translationKey(code: string): string {
    return 'TOASTR.' + code;
  }
}