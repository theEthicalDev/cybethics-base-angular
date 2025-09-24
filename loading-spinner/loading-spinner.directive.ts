import {ComponentRef, Directive, ElementRef, Input, OnDestroy, Renderer2, TemplateRef, ViewContainerRef} from '@angular/core';
import {LoadingSpinnerComponent} from './loading-spinner.component';

@Directive({
  selector: '[appLoadingSpinner]',
  standalone: false,
})
export class LoadingSpinnerDirective implements OnDestroy {

  private spinnerComponentRef: ComponentRef<LoadingSpinnerComponent> | null;

  @Input() set appLoadingSpinner(loading: boolean | null) {
    if (loading) {
      this.viewContainerRef.clear();
      this.spinnerComponentRef = this.viewContainerRef.createComponent(LoadingSpinnerComponent);
      const element = this.spinnerComponentRef.location.nativeElement;
      // this.renderer.setStyle(element, 'position', 'absolute');
      let size: number;
      if (element.parentElement.tagName === 'TABLE') {
        size = 250;
        element.childNodes[0].style.height = '100px';
        element.childNodes[0].style.width = '100px';
        element.childNodes[0].style.position = 'relative';
        element.childNodes[0].style.left = '47%';
        element.childNodes[0].style.top = '25%';
        this.renderer.setStyle(element, 'display', 'table-caption');
        this.renderer.setStyle(element, 'height', `${size}px`);
      } else {
        const rect = element.getBoundingClientRect();
        size = Math.min(rect.width, rect.height);
        this.renderer.setStyle(element, 'transform', 'translate(-20%, 0%)');
        this.renderer.setStyle(element, 'width', `${size}px`);
        this.renderer.setStyle(element, 'height', `${size}px`);
      }
    } else {
      if (this.spinnerComponentRef) {
        const element = this.spinnerComponentRef.location.nativeElement;
        this.renderer.setStyle(element, 'display', 'none'); // Hide the spinner
      }
      this.viewContainerRef.createEmbeddedView(this.templateRef);
    }
  }

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private viewContainerRef: ViewContainerRef,
    private templateRef: TemplateRef<any>
  ) {}

  ngOnDestroy() {
    // Clean up
    if (this.spinnerComponentRef) {
      this.spinnerComponentRef.destroy();
    }
  }
}
