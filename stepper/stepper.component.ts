import {AfterViewInit, Component, ContentChildren, Input, QueryList} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Translation} from '../translation/translation';
import {StepperItemComponent} from './stepper-item/stepper-item.component';
import {ExtraToastrService} from '../extra-toastr/extra-toastr.service';

@Component({
  selector: 'app-stepper',
  templateUrl: './stepper.component.html',
  styleUrls: ['./stepper.component.scss'],
  standalone: false,
})
export class StepperComponent implements AfterViewInit {

  @Input()
  public steps: Translation[];
  @Input()
  public descriptionSuffix: string = '.DESC';
  @Input()
  submitLabel: Translation = Translation.from('GENERAL.SUBMIT');
  @Input()
  withConfirmation: boolean = false;
  @Input()
  showButtonLoading: boolean | null = false;
  @Input()
  executeOnSubmit: () => void = () => {};

  public currentStep: number = 0;

  @ContentChildren(StepperItemComponent) stepItems: QueryList<StepperItemComponent>;
  protected readonly Translation = Translation;

  constructor(private extraToastr: ExtraToastrService, private router: Router, private route: ActivatedRoute) {
  }

  public descriptionKey(Translation: Translation): string {
    return Translation.get() + this.descriptionSuffix;
  }

  ngAfterViewInit() {
    const urlStep = this.route.snapshot.queryParams['step'];
    if (urlStep !== undefined) {
      this.currentStep = parseInt(urlStep, 10);
    }
    this.changeStepTo(this.currentStep);
  }

  changeStepTo(nextStep: number) {
    this.validateChangeStep();
    const stepItemsArray = this.stepItems.toArray();
    const currentStepItem = stepItemsArray[this.currentStep];
    const isNotGoingBackwards = nextStep >= this.currentStep;
    if (isNotGoingBackwards) currentStepItem.executeOnContinueBeforeNextStep();
    this.setNextStepAsCurrent(nextStep);
    const nextStepItem = stepItemsArray[nextStep];
    if (!nextStepItem) {
      this.executeOnSubmit();
    }
    const shouldSkipNextItem = nextStepItem.shouldBeSkipped();
    if (shouldSkipNextItem && isNotGoingBackwards) {
      nextStepItem.executeBeforeSkipped();
      this.changeStepTo(nextStep + 1);
    } else {
      this.updateStepItemsUponStepChange(stepItemsArray, nextStep, isNotGoingBackwards);
    }
  }

  private setNextStepAsCurrent(nextStep: number) {
    this.currentStep = nextStep;
    this.router.navigate([], {queryParams: {step: nextStep}, queryParamsHandling: 'merge'});
  }

  private validateChangeStep() {
    if (this.isCompleted()) {
      throw new Error('Stepper already completed');
    }
    if (this.steps.length !== this.stepItems.length) {
      this.extraToastr.error();
      throw new Error('Step length must be equal to the number of step items');
    }
  }

  private updateStepItemsUponStepChange(stepItemsArray: StepperItemComponent[], nextStep: number, isNotGoingBackwards: boolean) {
    stepItemsArray.forEach((stepItem, i) => {
      const isActive = i === nextStep;
      stepItem.isActive = isActive;
      if (isActive && isNotGoingBackwards) {
        stepItem.executeOnCurrentStepActivation();
      }
    });
  }

  isFirstStep(): boolean {
    return this.currentStep === 0;
  }

  isLastStep(): boolean {
    return this.currentStep === this.steps.length - 1;
  }

  isCompleted(): boolean {
    return this.currentStep === this.steps.length;
  }

  hasError(): boolean {
    return this.stepItems.toArray()[this.currentStep].hasError.value;
  }

  validateAndContinue() {
    const currentStep = this.stepItems.toArray()[this.currentStep];
    if (currentStep.shouldContinue()) {
      const valid = currentStep.validate();
      if (valid) {
        this.changeStepTo(this.currentStep + 1);
      }
    }
  }
}