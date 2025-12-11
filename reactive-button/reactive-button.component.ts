import {ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, Output, ViewChild} from '@angular/core';
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
export class ReactiveButtonComponent implements OnDestroy {

  constructor(private cd: ChangeDetectorRef) {}

  /**
   * If true, a confirmation modal will be shown after the button is clicked and before the action is executed.
   */
  @Input()
  withConfirmation: boolean = false;

  /**
   * If true, a "soft" confirmation will be used: the user must press the button twice.
   * The first press activates a 5s window where the button changes color and shows "Are you sure?".
   */
  @Input()
  withSoftConfirmation: boolean = false;

  // soft-confirm internal state
  softConfirmActive: boolean = false;
  private softConfirmTimer: any = null; // NodeJS.Timer or number
  private readonly SOFT_CONFIRM_TIMEOUT_MS = 5000;

  _isLoading: boolean;
  _disabled: boolean;

  @Input()
  iconParams: KeeniconInputParams | null = null;

  @Input()
  set isLoading(value: boolean | null) {
    value = this.valueOrDefault(value, false);
    this._isLoading = value;
    // if loading is set while soft-confirm active, reset soft state
    if (this._isLoading && this.softConfirmActive) this.resetSoftConfirm();
  }

  @Input()
  set disabled(value: boolean | null) {
    value = this.valueOrDefault(value, true);
    this._disabled = value;
    if (this._disabled && this.softConfirmActive) this.resetSoftConfirm();
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
    } else if (this.withSoftConfirmation) {
      // soft-confirm path
      if (this.softConfirmActive) {
        // second click within timeout => execute
        this.clicked.emit();
        this.resetSoftConfirm();
      } else {
        // first click: activate soft confirm state
        this.activateSoftConfirm();
      }
    } else {
      this.clicked.emit();
    }
  }

  activateSoftConfirm() {
    this.softConfirmActive = true;
    // start/reset timer
    if (this.softConfirmTimer) clearTimeout(this.softConfirmTimer);
    this.softConfirmTimer = setTimeout(() => {
      this.resetSoftConfirm();
    }, this.SOFT_CONFIRM_TIMEOUT_MS);
    // ensure view updates
    this.cd.detectChanges();
  }

  resetSoftConfirm() {
    this.softConfirmActive = false;
    if (this.softConfirmTimer) {
      clearTimeout(this.softConfirmTimer);
      this.softConfirmTimer = null;
    }
    // ensure view updates
    try { this.cd.detectChanges(); } catch (e) { /* noop */ }
  }

  private valueOrDefault(value: boolean | null, defaultV: boolean) {
    if (value === null) {
      value = defaultV;
    }
    return value;
  }

  ngOnDestroy(): void {
    if (this.softConfirmTimer) clearTimeout(this.softConfirmTimer);
  }

  protected readonly KeeniconInputParams = KeeniconInputParams;
}
