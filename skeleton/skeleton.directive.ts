import {Directive, ElementRef, Input, OnChanges, OnInit, Renderer2, SimpleChanges} from '@angular/core';
import Typed from 'typed.js';


@Directive({
  selector: '[appSkeleton]',
  standalone: false,
})
export class SkeletonDirective implements OnInit, OnChanges {
  @Input() appSkeleton: boolean | null = true;

  constructor(private el: ElementRef, private renderer: Renderer2) {
  }

  ngOnInit() {
    this.applySkeletonStyles();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['appSkeleton']) {
      if (this.appSkeleton) {
        this.applySkeletonStyles();
      } else {
        this.removeSkeletonStyles();
        const useTyped = this.el.nativeElement.getAttribute('skeleton-typed');
        if (useTyped != null) {
          this.applyTypedText();
        }
      }
    }
  }

  private applySkeletonStyles() {
    if (this.appSkeleton) {
      this.renderer.addClass(this.el.nativeElement, 'skeleton-loading');
      this.el.nativeElement.style.width = this.valueFromAttributeOrDefault('skeleton-width', '100%');
      this.el.nativeElement.style.height = this.valueFromAttributeOrDefault('skeleton-height', '20px');
    }
  }

  private valueFromAttributeOrDefault(attributeKey: string, defaultValue: string = ''): string {
    const attribute = this.el.nativeElement.getAttribute(attributeKey);
    return attribute || defaultValue;
  }

  private removeSkeletonStyles() {
    this.renderer.removeClass(this.el.nativeElement, 'skeleton-loading');
    this.renderer.setStyle(this.el.nativeElement, 'transition', 'background 0.5s ease, color 0.5s ease');
    this.renderer.removeStyle(this.el.nativeElement, 'width');
    this.renderer.removeStyle(this.el.nativeElement, 'height');
  }

  private applyTypedText() {
    const typedText = this.el?.nativeElement?.innerText;
    if (typedText) {
      try {
        this.el.nativeElement.innerText = '';
        const randomSpeed = Math.floor(Math.random() * 25) + 50;
        new Typed(this.el.nativeElement, {
          strings: [typedText],
          typeSpeed: randomSpeed,
          backSpeed: randomSpeed / 2,
          showCursor: false,
          loop: false,
        });
      } catch (e) {
        console.error(e);
        this.el.nativeElement.innerText = typedText;
      }
    }
  }
}