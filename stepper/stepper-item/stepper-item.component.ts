import {Component, Input} from '@angular/core';
import {Translation} from '../../translation/translation';
import {BehaviorSubject} from 'rxjs';

@Component({
  selector: 'app-stepper-item',
  templateUrl: './stepper-item.component.html',
  styleUrls: ['./stepper-item.component.scss'],
  standalone: false,
})
export class StepperItemComponent {
  @Input() isActive: boolean = false;
  @Input() title: string = '';
  @Input() isValidToContinue: () => boolean = () => { return true; };
  @Input() shouldContinue: () => boolean = () => { return true; };
  @Input() shouldBeSkipped: () => boolean = () => { return false; };
  @Input() executeOnContinueBeforeNextStep: () => void = () => {};
  @Input() executeOnCurrentStepActivation: () => void = () => {};
  @Input() executeBeforeSkipped: () => void = () => {};
  protected readonly Translation = Translation;
  public hasError: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  validate(): boolean {
    const validToContinue = this.isValidToContinue();
    this.hasError.next(!validToContinue);
    return validToContinue;
  }
}
