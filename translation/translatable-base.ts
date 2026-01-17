import {currentLang} from 'src/app/shared/localstorage/localstorage-helper';
import {Language} from 'src/app/shared/language/language';

export abstract class TranslatableBase {
  language: Language;
}

export function getTranslatable<T extends TranslatableBase>(translatables: Array<T>): T | null {
  const currentLanguage = currentLang();
  const translation = translatables.find(t => t.language === currentLanguage);
  return translation || null;
}