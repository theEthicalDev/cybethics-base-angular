import {Observable} from 'rxjs';

export class FormControlInputFieldContentParamIcon {
  public type: 'keenIcon' | 'bootstrap';
  public icon: string;
  public color: string;
  public cssClass: string;
  public model: string;
  private subscription: Observable<any> | null = null;

  public static fromKeenIcon(subscription: Observable<any> | null,
                             icon: string,
                             cssClass: string | null = null,
                             color: string | null = null,
                             model: string | null = null
  ):
    FormControlInputFieldContentParamIcon {
    const keenIcon = new FormControlInputFieldContentParamIcon();
    keenIcon.type = 'keenIcon';
    keenIcon.icon = icon;
    keenIcon.cssClass = cssClass ?? 'fs-2 ' + (subscription ? ' clickable ' : '');
    keenIcon.color = color ?? 'text-gray-900';
    keenIcon.model = model ?? 'duotone';
    keenIcon.subscription = subscription;
    return keenIcon;
  }

  public clicked(event: any) {
    if (this.subscription) {
      this.subscription.subscribe();
    }
  }

}