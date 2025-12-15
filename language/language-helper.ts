import {LanguageFlag, languages} from '../../_metronic/partials/layout/extras/dropdown-inner/user-inner/user-inner.component';
import {TranslationService} from '../../modules/i18n';

export function setCurrentLang(translationService: TranslationService, lang: string) {
  translationService.setLanguage(lang);
  languages.forEach((language: LanguageFlag) => {
    if (language.lang === lang) {
      language.active = true;
    } else {
      language.active = false;
    }
  });
}

export function isCurrentLang(translationService: TranslationService, lang: string | undefined): boolean {
  const defaultLang = translationService.getSelectedLanguage();
  const selectedLang = translationService.getSelectedLanguage();
  return !!lang ? lang === selectedLang : defaultLang === selectedLang;
}