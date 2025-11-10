import {Injectable, Injector} from '@angular/core';
import {BaseService} from '../../base-service/base-service';

@Injectable({
  providedIn: 'root'
})
export abstract class ElectronHttpFileCacheService extends BaseService {

  protected constructor(injector: Injector, apiUrl: string) {
    super(injector, apiUrl);
  }


}
