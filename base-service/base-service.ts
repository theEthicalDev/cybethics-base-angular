import {Observable, Subject, Subscription} from 'rxjs';
import {Injectable, Injector} from '@angular/core';
import {environment} from 'src/environments/environment';
import {HttpClient} from '@angular/common/http';
import {ExtraToastrService} from '../extra-toastr/extra-toastr.service';
import {BusinessException} from '../exception/business.exception';
import {Router} from '@angular/router';
import {HttpBuilderFactory} from '../http/http-builder-factory';

@Injectable({
  providedIn: 'root'
})
export abstract class BaseService {

  /**
   * NEW PART ENDS HERE
   * ****************************************************************************************************************
   */
  protected unsubscribe: Subscription[] = [];
  protected apiUrl: string;
  protected httpBuilderFactory: HttpBuilderFactory;

  protected http: HttpClient;
  protected extraToastr: ExtraToastrService;
  private baseRouter: any;

  protected constructor(injector: Injector, apiUrl: string) {
    this.http = injector.get(HttpClient);
    this.extraToastr = injector.get(ExtraToastrService);
    this.baseRouter = injector.get(Router);
    this.httpBuilderFactory = injector.get(HttpBuilderFactory);
    this.apiUrl = `${environment.apiUrl}/${apiUrl}`;
  }

  protected classicHttpResponse<T>(observable: Observable<T>,
                                   toastSuccessMessage: boolean = false,
                                   dataSubject: Subject<T> = new Subject<T>(),
                                   isLoadingSubject: Subject<boolean> = new Subject<boolean>(),
                                   routeTo: string | null = null): Observable<T> {
    isLoadingSubject.next(true);
    // dataSubject.next();
    this.pushUnsubscribe(observable.subscribe({
      next: (data) => this.handleSuccess(dataSubject, data, isLoadingSubject, toastSuccessMessage, routeTo),
      error: (err) => this.handleError(err, isLoadingSubject),
    }));
    return dataSubject.asObservable();
  }

  protected httpBuilder() {
    const httpBuilder = this.httpBuilderFactory.create(this.apiUrl);
    // this.pushUnsubscribe(...httpBuilder.getSubscriptions());
    return httpBuilder;
  }

  private handleSuccess(dataSubject: Subject<any>, data: any, isLoading: Subject<boolean>, toastSuccessMessage: boolean = false, routeTo: string | null) {
    console.log('SUCCESS');
    dataSubject.next(data);
    isLoading.next(false);
    if (toastSuccessMessage) {
      this.extraToastr.success();
    }
    if (routeTo) {
      this.navigateTo(routeTo);
    }
  }

  private handleError(err: any, isLoading: Subject<boolean>): any {
    console.log('ERROR');
    if (err?.status === 403) {
      this.extraToastr.error('UNAUTHORIZED');
    } else if (err?.error && err?.error?.exceptionCode) {
      const businessException: BusinessException = err.error;
      this.extraToastr.error(businessException.exceptionCode, ...businessException.args);
      isLoading.next(false);
      console.error('BusinessException: ' + businessException.exceptionCode + ' - ' + businessException.message + ' - ' + businessException.args);
      throw businessException;
    } else {
      console.error(err);
      this.extraToastr.error();
    }
    isLoading.next(false);
    throw err;
  }

  private pushUnsubscribe(...subscription: Subscription[]): void {
    this.unsubscribe.push(...subscription);
  }

  protected getApiUrl(service: string, ...args: string[]): string {
    if (args.length > 0) {
      args.forEach(arg => service += '/' + arg);
    }
    return `${this.apiUrl}/${service}`;
  }

  protected setParam(paramName: string, paramValue: string | undefined, params: string) {
    if (paramValue) {
      params += params.toString().length > 0 ? '&' : '?';
      params += paramName + '=' + paramValue;
    }
    return params;
  }

  protected navigateTo(path: string) {
    console.log('navigateTo: ' + path);
    this.baseRouter.navigate([path]);
  }

  public ngOnDestroy(): void {
    console.log('BaseService destroyed');
    this.unsubscribe.forEach(sb => sb.unsubscribe());
  }
}
