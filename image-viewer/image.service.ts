import {Injectable, Injector} from '@angular/core';
import {BaseService} from '../base-service/base-service';
import {environment} from 'src/environments/environment';
import {BehaviorSubject} from 'rxjs';

const API_USERS_URL: string = `${environment.apiUrl}/application/settings`;

@Injectable({
  providedIn: 'root'
})
export class ImageService extends BaseService {

  private isLoading = false;
  private currentImage: string | null = null;
  private imageSubject = new BehaviorSubject<string | null>(null);
  image$ = this.imageSubject.asObservable();

  constructor(injector: Injector) {
    super(injector, 'application/settings');
  }

  getLogoAsync() {
    if (this.currentImage || this.isLoading) {
      this.imageSubject.next(this.currentImage);
    } else {
      this.isLoading = true;
      if (environment.logoFromServer) {
        this.http.get(`${API_USERS_URL}/logo`, {responseType: 'blob'})
          .subscribe(blob => {
            const reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onloadend = () => {
              const result = reader.result as string;
              console.log(result);
              this.currentImage = result;
              this.imageSubject.next(this.currentImage); // Cast to string
              this.isLoading = false;
            };
          });
      } else if (environment.logoAssetDestination) {
        this.currentImage = environment.logoAssetDestination;
        this.imageSubject.next(this.currentImage);
        this.isLoading = false;
      } else {
        this.isLoading = false;
        throw new Error('No logo source defined');
      }
    }
  }
}
