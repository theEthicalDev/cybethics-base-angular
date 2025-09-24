import {Injectable} from '@angular/core';
import {ExtraToastrService} from '../../extra-toastr/extra-toastr.service';

@Injectable({
  providedIn: 'root'
})
export class ImageLoadService {

  constructor(private extraToastr: ExtraToastrService) {
  }

  loadBase64Images(event: Event, addImageFunction: (base64: FileReader) => void) {
    let files = this.getFilesFromEvent(event);
    const maxFileSize = 50 * 1024 * 1024; // 50MB
    if (files && files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!file) {
          return this.extraToastr.error('DOCUMENT_REQUIRED');
        }
        if (file.size > maxFileSize) {
          return this.extraToastr.error('MAX_FILE_SIZE_EXCEEDED', '50MB');
        }
        this.loadBase64Image(file, addImageFunction);
      }
    }
  }

  private getFilesFromEvent(event: Event | DragEvent) {
    const eventTarget = event.target as HTMLInputElement;
    if (event instanceof DragEvent) {
      return event?.dataTransfer?.files;
    } else {
      return eventTarget?.files;
    }
  }

  private loadBase64Image(file: File, addImageFunction: (base64: FileReader) => void) {
    const base64: FileReader = new FileReader();
    base64.readAsDataURL(file);
    base64.onload = () => {
      addImageFunction(base64);
    };
  }
}
