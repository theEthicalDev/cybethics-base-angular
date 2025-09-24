import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-accordion',
  templateUrl: './accordion.component.html',
  styleUrl: './accordion.component.scss',
  standalone: false,
})
export class AccordionComponent {

  @Input()
  items: AccordionItem[] = [];
  @Input()
  onlyOneOpen: boolean = false;
  @Input()
  styleType: 'free' | 'framed' = 'free';

  toggle(index: number) {
    this.items = this.items.map((item, i) => ({
      ...item,
      open: i === index ? !item.open : (this.onlyOneOpen ? false : item.open)
    }));
  }

  isFramedStyle() {
    return this.styleType === 'framed';
  }

  isFreeStyle() {
    return this.styleType === 'free';
  }
}

export interface AccordionItem {
  title: string;
  content: string;
  open?: boolean;
}
