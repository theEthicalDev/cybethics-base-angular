import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'numberSplit',
  standalone: false,
})
export class NumberSplitPipe implements PipeTransform {

  private locale: string = navigator.language;

  constructor() {}

  /**
   * Adds an apostrophe to a number to make it more readable, based on the locale.
   */
  transform(value: unknown, ...args: unknown[]): unknown {
    if (value === null || value === undefined) {
      return '';
    }
    let stringValue = value.toString();
    const strings = stringValue.split('.');
    const afterComma = strings[1] ?? '';
    stringValue = strings[0];
    const length = stringValue.length;
    const stringArray = [];
    // Split the string into groups of three.
    for (let i = length; i > 0; i -= 3) {
      stringArray.push(stringValue.substring(i, i - 3));
    }
    stringArray.reverse();
    // Add an apostrophe between each array element.
    stringArray.forEach((element, index) => {
      if (index !== stringArray.length - 1) {
        let symbol = this.getSymbolByLocale();
        stringArray[index] = element + symbol;
      }
    });
    if (afterComma.length > 0) {
      stringArray.push('.');
      stringArray.push(afterComma);
    }
    return stringArray.join('');
  }

  private getSymbolByLocale() {
    let symbol = "'";
    switch (this.locale) {
      case 'de-DE':
      case 'de-AT':
      case 'de-CH':
        symbol = "'";
        break;
      case 'en-US':
      case 'en-GB':
      case 'en-AU':
      case 'en-CA':
        symbol = ",";
        break;
    }
    return symbol;
  }
}
