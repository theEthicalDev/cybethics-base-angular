import {Component, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {Translation} from '../translation/translation';
import {KeeniconInputParams} from '../../_metronic/shared/keenicon/keenicon-input-params';

@Component({
  selector: 'app-reactive-button',
  templateUrl: './reactive-button.component.html',
  styleUrls: ['./reactive-button.component.scss'],
  // animations: [
  //   trigger('fadeIn', [
  //     state('void', style({opacity: 0, transform: 'translateY(100%)'})),
  //     state('*', style({transform: 'rotate(' + 10 + 'deg)'})),
  //     transition(':enter', [
  //       animate('3.25s ease-in', style({opacity: 1, transform: 'translateY(0)'})),
  //     ])
  //   ]),
  // ]
  standalone: false,
})
export class ReactiveButtonComponent {

  /**
   * If true, a confirmation modal will be shown after the button is clicked and before the action is executed.
   */
  @Input()
  withConfirmation: boolean = false;

  _isLoading: boolean;
  _disabled: boolean;

  @Input()
  iconParams: KeeniconInputParams | null = null;

  @Input()
  set isLoading(value: boolean | null) {
    value = this.valueOrDefault(value, false);
    this._isLoading = value;
  }

  @Input()
  set disabled(value: boolean | null) {
    value = this.valueOrDefault(value, true);
    this._disabled = value;
  }

  @Input()
  translation: Translation = new Translation('GENERAL.SUBMIT');

  @Input()
  styleClass: string = 'btn-primary';

  @Output()
  clicked: EventEmitter<any> = new EventEmitter<any>();

  // Preparation for confirmation animation - see html for deeper understanding

  // @Input()
  // set animateConfirmation(value: boolean) {
  //   this.animateConfirmationObservable.next(value);
  //   console.log(value);
  // }
  //
  // private animateConfirmationObservable: Subject<boolean> = new BehaviorSubject(false);
  // animateConfirmation$: Observable<boolean> = this.animateConfirmationObservable.asObservable();

  @ViewChild('confirmModal')
  private confirmModal: any;

  click() {
    if (this._disabled) {
      return;
    }
    if (this.withConfirmation) {
      this.confirmModal.open();
    } else {
      this.clicked.emit();
    }
  }

  private valueOrDefault(value: boolean | null, defaultV: boolean) {
    if (value === null) {
      value = defaultV;
    }
    return value;
  }

  protected readonly KeeniconInputParams = KeeniconInputParams;
}
