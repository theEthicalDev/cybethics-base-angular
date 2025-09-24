import {Component, HostBinding, Input} from '@angular/core';

@Component({
  selector: 'app-form-control-column',
  templateUrl: './form-control-column.component.html',
  styleUrls: ['./form-control-column.component.scss'],
  standalone: false,
})
export class FormControlColumnComponent {

  _columnWidth: number | ColumnWidth = ColumnWidth.HALF;

  @Input()
  set columnWidth(number: number | ColumnWidth) {
    if (typeof number === 'number' && number >= 1 && number <= 12) {
      this._columnWidth = number;
    } else {
      this._columnWidth = number as ColumnWidth;
    }
  }

  get columnWidth(): number | ColumnWidth {
    return this._columnWidth;
  }

  @HostBinding('class')
  get hostClasses(): string {
    return `py-1 col-md-${this.columnWidth} fv-row fv-plugins-icon-container fv-plugins-bootstrap5-row-invalid`;
  }
}

export enum ColumnWidth {
  HALF = 6,
  FULL = 12,
  THIRD = 4,
  QUARTER = 3,
}