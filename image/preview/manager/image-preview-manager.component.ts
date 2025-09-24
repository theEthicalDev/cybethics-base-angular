import {Component, EventEmitter, Input, Output} from '@angular/core';
import {fa} from '../../../form-control/form-control-helper';

@Component({
  selector: 'app-image-preview-manager',
  templateUrl: './image-preview-manager.component.html',
  styleUrls: ['./image-preview-manager.component.scss'],
  standalone: false,
})
export class ImagePreviewManagerComponent {

  @Input()
  image: string;
  @Input()
  hideEditButton: boolean = false;
  @Input()
  hideCancelButton: boolean = false;

  @Output()
  onEdit = new EventEmitter<void>();
  @Output()
  onCancel = new EventEmitter<void>();

  doNothing() {}

  protected readonly fa = fa;
}
