import {Component, Input, OnInit} from '@angular/core';
import {ImageService} from './image.service';

@Component({
  selector: 'app-image-viewer',
  templateUrl: './image-viewer.component.html',
  styleUrls: ['./image-viewer.component.scss'],
  standalone: false,
})
export class ImageViewerComponent implements OnInit {

  @Input()
  public classes: string;
  @Input({required: false})
  public imgStyle: string;

  constructor(public imageService: ImageService) {
  }

  ngOnInit() {
    this.imageService.getLogoAsync();
  }
}
