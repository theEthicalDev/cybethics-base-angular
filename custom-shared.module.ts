import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TruncatePipe} from './truncate/truncate.pipe';
import {LoadingSpinnerComponent} from './loading-spinner/loading-spinner.component';
import {LoadingSpinnerDirective} from './loading-spinner/loading-spinner.directive';
import {ImageViewerComponent} from './image-viewer/image-viewer.component';
import {NumberSplitPipe} from './number-split/number-split.pipe';
import {ReactiveButtonComponent} from './reactive-button/reactive-button.component';
import {TranslateModule} from '@ngx-translate/core';
import {PaginationComponent} from './pagination/pagination.component';
import {TranslateFallbackPipe} from './translation/translate-fallback.pipe';
import {ConfirmModalComponent} from './confirm-modal/confirm-modal.component';
import {ModalsModule} from '../_metronic/partials';
import {SharedModule} from '../_metronic/shared/shared.module';
import {TabComponent} from './tab/tab.component';
import {TabItemComponent} from './tab/tab-item/tab-item.component';
import {ImagePreviewManagerComponent} from './image/preview/manager/image-preview-manager.component';
import {DropzoneComponent} from './dropzone/dropzone.component';
import {CurrencyComponent} from './currency/currency.component';
import {StepperComponent} from './stepper/stepper.component';
import {StepperItemComponent} from './stepper/stepper-item/stepper-item.component';
import {SkeletonDirective} from './skeleton/skeleton.directive';
import {CarouselComponent} from './carousel/carousel.component';
import {AccordionComponent} from './accordion/accordion.component';

@NgModule({
  declarations: [
    TruncatePipe,
    LoadingSpinnerComponent,
    LoadingSpinnerDirective,
    ImageViewerComponent,
    NumberSplitPipe,
    ReactiveButtonComponent,
    PaginationComponent,
    TranslateFallbackPipe,
    ConfirmModalComponent,
    TabComponent,
    TabItemComponent,
    ImagePreviewManagerComponent,
    DropzoneComponent,
    CurrencyComponent,
    StepperComponent,
    StepperItemComponent,
    SkeletonDirective,
    CarouselComponent,
    AccordionComponent,
  ],
  imports: [
    CommonModule,
    TranslateModule,
    ModalsModule,
    SharedModule,
  ],
  exports: [
    TruncatePipe,
    NumberSplitPipe,
    LoadingSpinnerDirective,
    ImageViewerComponent,
    ReactiveButtonComponent,
    TranslateFallbackPipe,
    PaginationComponent,
    ConfirmModalComponent,
    TabComponent,
    TabItemComponent,
    ImagePreviewManagerComponent,
    DropzoneComponent,
    CurrencyComponent,
    StepperComponent,
    StepperItemComponent,
    SkeletonDirective,
    CarouselComponent,
    AccordionComponent,
  ]
})
export class CustomSharedModule {
}
