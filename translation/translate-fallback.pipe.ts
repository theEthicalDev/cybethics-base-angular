import {Pipe, PipeTransform} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {MandatoryDefaultTranslation, NoTranslation, Translation} from './translation';

@Pipe({
  name: 'translateFallback',
  standalone: false,
})
export class TranslateFallbackPipe implements PipeTransform {

  constructor(private translateService: TranslateService) {}

  transform(value: Translation, ...args: unknown[]): unknown {
    if (value instanceof NoTranslation) {
      return value.get();
    }
    const code = value.get();
    let instant = this.translateService.instant(code, args);
    this.logWhenMoreThanOneResultIsDetected(code, instant);
    if (instant === code && value instanceof MandatoryDefaultTranslation) {
      return value.getDefault();
    }
    return instant;
  }

  private logWhenMoreThanOneResultIsDetected(key: string, instant: string) {
    const multipleValuesPattern = /"(\w+)":"[^"]*"(,?"\w+":"[^"]*")+/;
    if (multipleValuesPattern.test(JSON.stringify(instant))) {
      console.log(`Translation fallback detected multiple values for key ${key}: ${JSON.stringify(instant)}`);
    }
  }
}
