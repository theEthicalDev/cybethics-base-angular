import {Component, EventEmitter, Input, Output} from '@angular/core';
import {fa} from '../form-control/form-control-helper';
import {Translation} from '../translation/translation';
import {ExtraToastrService} from '../extra-toastr/extra-toastr.service';

/**
 * This component can be used to create a dropzone for files. It can be used to drag and drop files or to select files from the file input dialog.
 * Keep in mind that the component does not handle the file upload itself, it only provides the dropzone and triggers the events when a file is dropped or selected.
 * Provide the ng-content to display the content inside the dropzone.
 */
@Component({
  selector: 'app-dropzone',
  templateUrl: './dropzone.component.html',
  styleUrls: ['./dropzone.component.scss'],
  standalone: false,
})
export class DropzoneComponent {

  @Input()
  cssOnValidDragOver = 'bg-success-subtle';
  @Input()
  cssOnInvalidDragOver = 'bg-danger-subtle';
  @Input()
  maxFileSizePerFile: string;
  @Input()
  maxFileSizeTotal: string;
  @Input()
  maxFileNumber: number;
  @Input()
  subTitleLabel: Translation;
  @Input()
  descriptionLabel: Translation;
  @Input()
  acceptedFileTypes: string;

  @Output()
  onDrop = new EventEmitter<Event>(); // when drag and drop is done
  @Output()
  onFileSelected = new EventEmitter<Event>(); // when file is selected from file input dialog

  statusBasedCss: string = '';

  protected readonly fa = fa;

  constructor(private extraToastr: ExtraToastrService) {
  }

  highlight(event: DragEvent) {
    this.preventDefaultAndStopPropagation(event);
    this.statusBasedCss = this.isDragValid(event) ? this.cssOnValidDragOver : this.cssOnInvalidDragOver;
  }

  unhighlight(event: DragEvent) {
    this.preventDefaultAndStopPropagation(event);
    this.statusBasedCss = '';
  }

  handleDrop($event: DragEvent) {
    this.unhighlight($event);
    if (this.isDragValid($event)) {
      this.onDrop.emit($event);
    }
  }

  handleFileSelected($event: Event) {
    this.onFileSelected.emit($event);
  }

  isDragValid(dragEvent: DragEvent): boolean {
    const items = dragEvent.dataTransfer?.items;
    if (this.acceptedFileTypes) {
      if (items) {
        for (let i = 0; i < items.length; i++) {
          const item = items[i];
          if (item.kind === 'file') {
            const fileType = item.type;
            if (!fileType.match(this.acceptedFileTypes)) {
              this.extraToastr.error('FORBIDDEN_FILE_TYPES', this.acceptedFileTypes);
              return false;
            }
          }
        }
      }
    }
    if (this.maxFileNumber) {
      if (items != null && items.length > this.maxFileNumber) {
        this.extraToastr.error('MAX_FILE_NUMBER_EXCEEDED', this.maxFileNumber.toString());
        return false;
      }
    }
    return true;
  }

  private preventDefaultAndStopPropagation(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
  }
}
