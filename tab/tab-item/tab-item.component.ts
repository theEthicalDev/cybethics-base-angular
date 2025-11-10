import {Component, Input} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {Translation} from 'src/app/shared/translation/translation';

@Component({
  selector: 'app-tab-item',
  templateUrl: './tab-item.component.html',
  styleUrls: ['./tab-item.component.scss'],
  standalone: false,
})
export class TabItemComponent {
  @Input() title: Translation;
  @Input()
  set hasError(value: boolean) {
    this.hasErrorSubject.next(value);
  }
  isActive: boolean = false;

  constructor() {}

  hasErrorSubject = new BehaviorSubject<boolean>(false);
  hasError$ = this.hasErrorSubject.asObservable();
}
