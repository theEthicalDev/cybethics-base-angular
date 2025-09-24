/**
 * Represents the translation codes defined in en.json and de.json, e.g. 'GENERAL.FIRST_NAME'
 */
export class Translation {

  private readonly translationCode: string;

  constructor(translationCode: string) {
    this.translationCode = translationCode;
  }

  public get(): string {
    return this.translationCode;
  }

  public lastPart(): string {
    return this.translationCode?.split('.')?.pop() || '';
  }

  public static from(translationCode: string): Translation {
    return new Translation(translationCode);
  }
}

export class MandatoryDefaultTranslation extends Translation {

  defaultValue: string;

  constructor(translationCode: string, defaultValue: string) {
    if (!translationCode || translationCode === '') {
      throw new Error('translationCode must contain a value');
    }
    if (!defaultValue || defaultValue === '') {
      throw new Error('defaultValue must contain a value');
    }
    super(translationCode);
    this.defaultValue = defaultValue;
  }

  public getDefault(): string {
    return this.defaultValue;
  }
}

export class PlaceholderDefaultTranslation extends Translation {
  constructor() {
    super('GENERAL.PLACEHOLDER');
  }
}

export class NoTranslation extends Translation {
  constructor(value: string) {
    super(value);
  }
}