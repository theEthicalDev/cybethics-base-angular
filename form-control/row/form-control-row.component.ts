import {Component, HostBinding} from '@angular/core';

@Component({
  selector: 'app-form-control-row',
  templateUrl: './form-control-row.component.html',
  styleUrls: ['./form-control-row.component.scss'],
  standalone: false,
})
export class FormControlRowComponent {

  @HostBinding('class')
  public class = 'mt-4';

}
