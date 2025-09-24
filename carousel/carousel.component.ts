import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {fadeInRightAnimation} from 'angular-animations';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrl: './carousel.component.scss',
  standalone: false,
  animations: [
    fadeInRightAnimation({ duration: 350 }),
  ]
})
export class CarouselComponent implements OnInit {

  @Input()
  slides: CarouselSlide[] = [];
  @Input()
  imgWidth: string = '100%';
  @Input()
  imgHeight: string = 'auto';
  @Input()
  showArrows: boolean = true;
  @Input()
  showDots: boolean = true;
  @Input()
  aspectRatio: string = '3 / 2'; // Change the aspect ratio to make the carousel smaller or larger
  @Input()
  autoPlay: boolean = false;
  @Input()
  autoPlaySpeed: number = 5000; // Speed in milliseconds
  slideIndex = 0;

  constructor(private cdr: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.showSlides(this.slideIndex);
    if (this.autoPlay) {
      setInterval(() => {
        this.nextSlide();
      }, this.autoPlaySpeed);
    }
  }

  nextSlide() {
    this.showSlides(this.slideIndex + 1);
  }

  previousSlide() {
    this.showSlides(this.slideIndex - 1);
  }

  showSlides(n: number) {
    if (n < 0) this.slideIndex = this.slides.length - 1;
    else if (n >= this.slides.length) this.slideIndex = 0;
    else this.slideIndex = n;
    this.cdr.detectChanges(); // Ensure the view updates with the new slide index
  }
}

export class CarouselSlide {
  constructor(
    public image: string,
    public title: string,
    public caption?: string | null,
  ) {}

  public static from(image: string, title: string, caption?: string | null): CarouselSlide {
    return new CarouselSlide(image, title, caption);
  }
}
