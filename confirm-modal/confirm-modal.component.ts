import {AfterViewInit, Component, EventEmitter, HostListener, Output, ViewChild} from '@angular/core';
import {Translation} from '../translation/translation';

/**
 * A component that will add a confirm modal to the element that uses the onModalConfirm directive.
 * The modal will be opened when the element is clicked and simply ask for confirmation.
 *
 * WARNING: There is a bug when the parent element (the one that uses the onModalConfirm directive) is a menu link item
 * and the translated text is not translated with the translate attribute. The bug will cause the menu item to not show the
 * text of the menu item.
 */
@Component({
  selector: 'app-confirm-modal, [onModalConfirm]',
  templateUrl: './confirm-modal.component.html',
  standalone: false,
})
export class ConfirmModalComponent implements AfterViewInit {

  protected readonly Translation = Translation;

  @Output()
  onModalConfirm: EventEmitter<void> = new EventEmitter<void>();

  @ViewChild('modalComponent')
  private modalContent: any;

  ngAfterViewInit() {
    this.modalContent.onClose.subscribe(() => {
      this.onModalConfirm.emit();
    });
  }

  @HostListener('click')
  open() {
    this.modalContent.open();
  }
}
