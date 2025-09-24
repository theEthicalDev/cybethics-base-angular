import {Language} from '../language/language';

export function currentLang() {
  return localStorage.getItem('language') as Language || Language.DE; // CONSIDERATION_00 - Default language
}