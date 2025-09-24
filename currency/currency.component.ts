import {Component, HostBinding, Input} from '@angular/core';

@Component({
  selector: 'app-currency',
  templateUrl: './currency.component.html',
  styleUrls: ['./currency.component.scss'],
  standalone: false,
})
export class CurrencyComponent {

  @Input()
  public currency: string;

  @HostBinding('class')
  public hostClass = 'd-flex';

}
