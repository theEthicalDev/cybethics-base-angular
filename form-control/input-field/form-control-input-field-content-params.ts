import {AbstractControl, FormControl} from '@angular/forms';
import {FormControlInputFieldContentType} from 'src/app/shared/form-control/input-field/content/type/form-control-input-field-content-type';
import {
  FormControlInputFieldContentStyling,
  StandardFormControlInputFieldContentStyling,
  StandardFormControlInputFieldContentSwitchStyling,
  StandardFormControlInputFieldDropdownStyling
} from 'src/app/shared/form-control/input-field/content/form-control-input-field-label-styling';
import {FormControlInputFieldStyling} from 'src/app/shared/form-control/input-field/form-control-input-field-styling';
import {FormControlInputFieldContentParamIcon} from 'src/app/shared/form-control/input-field/form-control-input-field-content-param-icon';
import {CountryCode, DachRegionCountryCode} from './utils/constants/country-code';
import {MaritalStatus} from 'src/app/shared/form-control/input-field/utils/constants/marital-status';
import {SwissVisa} from 'src/app/shared/form-control/input-field/utils/constants/swiss-visa';
import {NoTranslation, PlaceholderDefaultTranslation, Translation} from '../../translation/translation';

export abstract class FormControlInputFieldContentParams {

  public formControl: FormControl<any>;
  public type: FormControlInputFieldContentType;
  public styling: FormControlInputFieldContentStyling;
  public icon: FormControlInputFieldContentParamIcon | null;

  protected constructor(formControl: FormControl<any>,
                        type: FormControlInputFieldContentType,
                        styling: FormControlInputFieldContentStyling = new StandardFormControlInputFieldContentStyling(),
                        icon: FormControlInputFieldContentParamIcon | null = null) {
    this.formControl = formControl;
    this.type = type;
    this.styling = styling;
    this.icon = icon;
  }
}

/**
 * content params for text input field
 */
export class FormControlTextParams extends FormControlInputFieldContentParams {

  placeholder: Translation;

  constructor(formControl: FormControl<any>, placeHolder: Translation, styling: FormControlInputFieldStyling | null, icon: FormControlInputFieldContentParamIcon | null = null) {
    super(formControl, FormControlInputFieldContentType.TEXT, styling ?? new StandardFormControlInputFieldContentStyling(), icon);
    this.placeholder = placeHolder;
  }

  public static from(abstractControl: AbstractControl): FormControlTextParams;
  public static from(abstractControl: AbstractControl, placeHolder: string): FormControlTextParams;
  public static from(abstractControl: AbstractControl, placeHolder: string, icon: FormControlInputFieldContentParamIcon): FormControlTextParams;
  public static from(abstractControl: AbstractControl, placeHolder: string): FormControlTextParams;
  public static from(abstractControl: AbstractControl, placeHolder?: string, icon?: FormControlInputFieldContentParamIcon): FormControlTextParams {
    const formControl: FormControl<any> = abstractControl as FormControl<any>;
    const placeHolderInstance = placeHolder ? new Translation(placeHolder) : new PlaceholderDefaultTranslation();
    return new FormControlTextParams(formControl, placeHolderInstance, null, icon);
  }
}

export class FormControlPasswordParams extends FormControlInputFieldContentParams {

  placeholder: Translation;

  constructor(formControl: FormControl<any>, placeHolder: Translation, styling: FormControlInputFieldStyling | null, icon: FormControlInputFieldContentParamIcon | null = null) {
    super(formControl, FormControlInputFieldContentType.PASSWORD, styling ?? new StandardFormControlInputFieldContentStyling(), icon);
    this.placeholder = placeHolder;
  }

  public static from(abstractControl: AbstractControl): FormControlPasswordParams;
  public static from(abstractControl: AbstractControl, placeHolder: string): FormControlPasswordParams;
  public static from(abstractControl: AbstractControl, placeHolder: string, icon: FormControlInputFieldContentParamIcon): FormControlPasswordParams;
  public static from(abstractControl: AbstractControl, placeHolder: string): FormControlPasswordParams;
  public static from(abstractControl: AbstractControl, placeHolder?: string, icon?: FormControlInputFieldContentParamIcon): FormControlPasswordParams {
    const formControl: FormControl<any> = abstractControl as FormControl<any>;
    const placeHolderInstance = placeHolder ? new Translation(placeHolder) : new PlaceholderDefaultTranslation();
    return new FormControlPasswordParams(formControl, placeHolderInstance, null, icon);
  }
}

/**
 * content params for number input field
 */
export class FormControlNumberParams extends FormControlInputFieldContentParams {

  placeholder: Translation;

  constructor(formControl: FormControl<any>, placeHolder: Translation, styling: FormControlInputFieldStyling, icon: FormControlInputFieldContentParamIcon | null = null) {
    super(formControl, FormControlInputFieldContentType.NUMBER, styling ?? new StandardFormControlInputFieldContentStyling(), icon);
    this.placeholder = placeHolder;
  }

  public static from(abstractControl: AbstractControl): FormControlTextParams;
  public static from(abstractControl: AbstractControl, placeholder: string): FormControlTextParams;
  public static from(abstractControl: AbstractControl, placeholder?: string): FormControlTextParams
  public static from(abstractControl: AbstractControl, placeholder: string, icon: FormControlInputFieldContentParamIcon): FormControlTextParams;
  public static from(abstractControl: AbstractControl, placeholder?: string, icon?: FormControlInputFieldContentParamIcon): FormControlTextParams {
    const formControl: FormControl<any> = abstractControl as FormControl<any>;
    const placeholderInstance = placeholder ? new Translation(placeholder) : new PlaceholderDefaultTranslation();
    return new FormControlNumberParams(formControl, placeholderInstance, new StandardFormControlInputFieldContentStyling(), icon);
  }
}

/**
 * content params for number input field
 */
export class FormControlInputFieldContentTextAreaParams extends FormControlInputFieldContentParams {

  placeholder: Translation;

  constructor(formControl: FormControl<any>, placeHolder: Translation, styling?: FormControlInputFieldStyling) {
    super(formControl, FormControlInputFieldContentType.TEXTAREA, styling ?? new StandardFormControlInputFieldContentStyling());
    this.placeholder = placeHolder;
  }

  public static from(abstractControl: AbstractControl): FormControlTextParams;
  public static from(abstractControl: AbstractControl, placeHolder: string): FormControlTextParams;
  public static from(abstractControl: AbstractControl, placeHolder?: string): FormControlTextParams {
    const formControl: FormControl<any> = abstractControl as FormControl<any>;
    if (placeHolder) {
      return new FormControlInputFieldContentTextAreaParams(formControl, new Translation(placeHolder));
    } else {
      return new FormControlInputFieldContentTextAreaParams(formControl, new PlaceholderDefaultTranslation());
    }
  }
}

/**
 * content params for dropdown input field
 */
export class FormControlDropdownParams extends FormControlInputFieldContentParams {

  optionsMap: Map<string, Translation>;
  emptyOption: Translation;
  compareWithFn: (o1: any, o2: any) => boolean = (o1: any, o2: any) => o1 === o2;

  constructor(formControl: FormControl<any>,
              optionsMap: Map<string, Translation>,
              emptyOption: PlaceholderDefaultTranslation = new Translation('GENERAL.SELECT_OPTION'),
              styling: FormControlInputFieldStyling | null = null,
              compareWithFn: (o1: any, o2: any) => boolean = (o1: any, o2: any) => o1 === o2,
  ) {
    super(formControl, FormControlInputFieldContentType.DROPDOWN, styling ?? new StandardFormControlInputFieldDropdownStyling());
    this.optionsMap = optionsMap;
    this.emptyOption = emptyOption;
    this.compareWithFn = compareWithFn;
  }

  public static fromNonEnumData<T>(
    formControl: FormControl<any>,
    optionsArray: T[] | null,
    compareWithFn: (o1: any, o2: any) => boolean = (o1: any, o2: any) => o1 === o2,
    getValueFn: (option: T) => string = (option: T) => (option as string).toString(),
    getKeyFn: (option: T) => any = (option: T) => option,
  ): FormControlDropdownParams {
    if (!optionsArray) {
      return new FormControlDropdownParams(formControl, new Map<string, Translation>());
    }
    const optionsMap = new Map<string, Translation>();
    optionsArray.forEach((option) => {
      const key = getKeyFn(option);
      const value = getValueFn(option);
      optionsMap.set(key, new NoTranslation(value));
    });
    return new FormControlDropdownParams(formControl, optionsMap, new Translation('GENERAL.SELECT_OPTION'), null, compareWithFn);
  }

  public static from(formControl: FormControl<any>, enumType: any, translationPrefix?: string): FormControlDropdownParams {
    const enumTypeValues = Object.values(enumType);
    const optionsMap = new Map<string, Translation>();
    enumTypeValues.forEach((value) => {
      optionsMap.set(<string>value, translationPrefix ? new Translation(`${translationPrefix}.${value}`) : new NoTranslation(<string>value));
    });
    return new FormControlDropdownParams(formControl, optionsMap);
  }

  public static fromCountryCode(formControl: FormControl<any>): FormControlDropdownParams {
    return this.from(formControl, CountryCode, 'COUNTRY');
  }

  public static fromDachCountryCode(formControl: FormControl<any>): FormControlDropdownParams {
    return this.from(formControl, DachRegionCountryCode, 'COUNTRY');
  }

  public static fromSwissVisa(formControl: FormControl<any>): FormControlDropdownParams {
    return this.from(formControl, SwissVisa, 'SWISS_VISA');
  }

  public static fromMaritalStatus(formControl: FormControl<any>): FormControlDropdownParams {
    return this.from(formControl, MaritalStatus, 'MARITAL_STATUS');
  }
}

/**
 * content params for date input field
 */
export class FormControlDateParams extends FormControlInputFieldContentParams {

  placeholder: string;

  constructor(formControl: FormControl<any>, placeHolder: string, styling?: FormControlInputFieldStyling) {
    super(formControl, FormControlInputFieldContentType.DATE, styling ?? new StandardFormControlInputFieldContentStyling());
    this.placeholder = placeHolder;
  }

  public static from(abstractControl: AbstractControl, placeHolder?: string): FormControlDateParams {
    const formControl: FormControl<any> = abstractControl as FormControl<any>;
    return new FormControlDateParams(formControl, placeHolder ?? '');
  }
}

/**
 * content params for date input field
 */
export class FormControlDateTimeParams extends FormControlInputFieldContentParams {

  format: string;

  constructor(formControl: FormControl<any>, format: string, styling?: FormControlInputFieldStyling) {
    super(formControl, FormControlInputFieldContentType.DATETIME_LOCAL, styling ?? new StandardFormControlInputFieldContentStyling());
    this.format = format;
  }

  public static from(abstractControl: AbstractControl, format: string = 'DD.MM.YYYY HH:mm'): FormControlDateTimeParams {
    const formControl: FormControl<any> = abstractControl as FormControl<any>;
    return new FormControlDateTimeParams(formControl, format);
  }
}

/**
 * content params for switch input field
 */
export class FormControlSwitchParams extends FormControlInputFieldContentParams {

  constructor(formControl: FormControl<any>, styling?: FormControlInputFieldStyling) {
    super(formControl, FormControlInputFieldContentType.SWITCH, styling ?? new StandardFormControlInputFieldContentSwitchStyling());
  }

  public static from(abstractControl: AbstractControl): FormControlSwitchParams {
    const formControl: FormControl<any> = abstractControl as FormControl<any>;
    return new FormControlSwitchParams(formControl);
  }
}