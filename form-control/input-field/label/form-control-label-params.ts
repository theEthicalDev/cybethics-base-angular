import {FormControlInputFieldLabelStyling, StandardFormControlInputFieldLabelStyling} from 'src/app/shared/form-control/input-field/label/form-control-input-field-label-styling';
import {MandatoryDefaultTranslation, Translation} from '../../../translation/translation';

export class FormControlLabelParams {

  label: Translation;
  styling: FormControlInputFieldLabelStyling = new StandardFormControlInputFieldLabelStyling();

  constructor(label: Translation, styling: FormControlInputFieldLabelStyling = new StandardFormControlInputFieldLabelStyling()) {
    this.label = label;
    this.styling = styling;
  }

  public static from(label: string): FormControlLabelParams;
  public static from(label: string, defaultText: string): FormControlLabelParams;
  public static from(label: string, defaultText?: string): FormControlLabelParams {
    if (!defaultText) {
      return new FormControlLabelParams(new Translation(label));
    }
    return new FormControlLabelParams(new MandatoryDefaultTranslation(label, defaultText));
  }
}