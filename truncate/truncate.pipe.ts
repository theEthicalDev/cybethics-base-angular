import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'truncate',
  standalone: false,
})
export class TruncatePipe implements PipeTransform {
  transform(value: string, maxLength: number = 50): string {
    if (value === null || value === undefined || value === '') {
      return '';
    }
    if (value.length <= maxLength) {
      return value;
    } else {
      // Truncate the string and add ellipses
      return value.substring(0, maxLength) + '...';
    }
  }
}
