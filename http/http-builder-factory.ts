import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import {ExtraToastrService} from 'src/app/shared/extra-toastr/extra-toastr.service';
import {firstValueFrom, Observable, Subject, Subscription, tap, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {BusinessException, ExceptionCode} from 'src/app/shared/exception/business.exception';
import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {PageableFilter} from 'src/app/shared/pagination/pageable-filter';
import {ServiceState} from 'src/app/shared/base-service/service-state';
import {menuReinitialization} from 'src/app/_metronic/kt/kt-helpers';

@Injectable({providedIn: 'root'})
export class HttpBuilderFactory {
    constructor(private http: HttpClient, private toastr: ExtraToastrService, private router: Router) {}

    public create(baseUrl: string): HttpBuilder {
        return new HttpBuilder(this.http, this.toastr, this.router, baseUrl);
    }
}

class HttpBuilder {

  private baseUrl: string;
  private data: any = null;
  private method: 'GET' | 'POST' | 'DELETE' | 'OPTIONS' | 'PUT' | 'PATCH' | 'HEAD';
  private httpHeaders: HttpHeaders = new HttpHeaders();
  private httpOptions: any = null;
  private queryParams: string = '';
  private url: string = '';
  private finalObservable: Observable<any> | null = null;
  private dataSubject: Subject<any> = new Subject<any>();
  private loadingSubject: Subject<boolean> = new Subject<boolean>();
  private routeToCallback: ((result: any) => string) | null = null;
  private routeToNewWindowCallback: ((result: any) => string) | null = null;
  public onSuccessCallback: ((data: any) => void) | null = null;
  public onErrorCallback: ((error: any) => void) | null = null;
  public onCompleteCallback: (() => void) | null = null;
  public successMessage: string = '';
  public warnMessageOnSuccess: string = '';
  public errorMessage: string = '';
  private errorMessageFromServer: boolean = true;
  private warnMessageExceptionCodes: ExceptionCode[] = [];
  private exceptionCodesIgnorableToToastrError: ExceptionCode[] = [
    ExceptionCode.INVALID_CSRF_TOKEN,
  ];
  private message: string | null = null;
  private subscriptions: Subscription[] = [];

  constructor(private http: HttpClient, private extraToastr: ExtraToastrService, private router: Router, baseUrl?: string) {
    this.baseUrl = baseUrl || '';
  }

  /**
   * Provide the method URL suffix that should be called.
   * The URL will be constructed as baseUrl + serviceSuffix
   *
   * Example:
   * baseUrl = 'http://localhost:8080/api/v1/some/service'
   * serviceSuffix = 'list'
   *
   * The URL will be 'http://localhost:8080/api/v1/some/service/list'
   *
   * Make sure the baseUrl is provided correctly.
   */
  toMethodUrl(serviceSuffix: string = ''): this {
    return this.toUrl(this.baseUrl, serviceSuffix);
  }

  toUrl(baseUrl: string, serviceSuffix: string = ''): this {
    this.url = serviceSuffix.length == 0 ? baseUrl : baseUrl.endsWith('/') ? baseUrl + serviceSuffix : baseUrl + '/' + serviceSuffix;
    return this;
  }

  withHeaders(key: string, value: string) {
    this.httpOptions = this.httpOptions || {};
    this.httpOptions.headers = this.httpOptions.headers || new HttpHeaders();
    this.httpOptions.headers = this.httpOptions.headers.set(key, value);
    return this;
  }

  withContentTypeJson() {
    this.withHeaders('Content-Type', 'application/json');
    return this;
  }

  withDataSubject(subject: Subject<any>): this {
    this.dataSubject = subject;
    return this;
  }

  withLoadingSubject(subject: Subject<boolean>): this {
    this.loadingSubject = subject;
    return this;
  }

  withServiceState<T>(state: ServiceState<T>): this {
    this.dataSubject = state.getDataSubject();
    this.loadingSubject = state.getLoadingSubject();
    return this;
  }

  withSuccessMessage(message: string = 'TOASTR.SUCCESS', id?: any): this {
    this.successMessage = this.formatMessage(message, id);
    return this;
  }

  withWarningMessageOnSuccess(message: string = 'TOASTR.WARNING', id?: any): this {
    this.warnMessageOnSuccess = this.formatMessage(message, id);
    return this;
  }

  withErrorMessage(): this {
    this.errorMessageFromServer = true;
    return this;
  }

  withoutErrorMessageFromServer(): this {
    this.errorMessageFromServer = false;
    return this;
  }

  withWarnMessageForExceptionCode(...warnMessages: ExceptionCode[]): this {
    this.warnMessageExceptionCodes = warnMessages;
    return this;
  }

  withMessage(message: string, id?: any): this {
    this.message = this.formatMessage(message, id);
    return this;
  }

  withRouteTo(callback: (result: any) => string): this {
    this.routeToCallback = callback;
    return this;
  }

  withRouteToNewWindow(callback: (result: any) => string): this {
    this.routeToNewWindowCallback = callback;
    return this;
  }

  withResponseType(responseType: 'json' | 'blob' | 'text'): this {
    this.httpOptions = this.httpOptions || {};
    this.httpOptions.responseType = responseType;
    return this;
  }

  withPageableFilter(pageableFilter: PageableFilter): this {
    if (pageableFilter) {
      this.withPaginationParams(pageableFilter.pageNumber, pageableFilter.pageSize);
    }
    return this;
  }

  withQueryParamsIfNotNull(filterObject: any): this {
    const keys = Object.keys(filterObject);
    keys.forEach(key => {
      this.withQueryParamIfNotNull(key, filterObject[key]);
    });
    return this;
  }

  withPaginationParams(pageNumber: number, pageSize: number): this {
    this.withQueryParam('pageNumber', pageNumber.toString());
    this.withQueryParam('pageSize', pageSize.toString());
    return this;
  }

  withQueryParamIfNotNull(key: string, value?: string): this {
    if (value && value !== 'null') {
      this.withQueryParam(key, value);
    }
    return this;
  }

  withQueryParam(key: string, value: string): this {
    if (value === null || value === undefined || value.length === 0 || key === null || key === undefined || key.length === 0) {
      return this;
    }
    this.queryParams = this.queryParams + (this.queryParams.length === 0 ? '?' : '&') + key + '=' + value;
    return this;
  }
  
  withDownloadOnSuccess(): this {
    this.httpOptions = this.httpOptions || {};
    this.httpOptions.responseType = 'blob';
    this.httpOptions.observe = 'response';
    this.onSuccessCallback = (response: HttpResponse<Blob | null>) => {
      this.downloadAllDocuments(response);
    }
    return this;
  }

  downloadAllDocuments(response: HttpResponse<Blob | null>): void {
    const blob = response.body;
    if (blob) {
      const fileName = this.getFileNameFromResponse(response);
      this.downloadFile(blob, fileName);
    }
  }

  private downloadFile(blob: Blob, fileName: string): void {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    document.body.appendChild(a);
    a.style.display = 'none';
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }

  private getFileNameFromResponse(response: HttpResponse<Blob | null>): string {
    const contentDispositionHeader = response.headers.get('Content-Disposition');
    if (contentDispositionHeader) {
      const matches = contentDispositionHeader.match(/filename="(.+)"/);
      return matches ? matches[1] : 'unknown';
    } else {
      return 'no-header';
    }
  }

  withOnSuccess(callback: (data: any) => void): this {
    this.onSuccessCallback = callback;
    return this;
  }

  withOnError(callback: (error: any) => void): this {
    this.onErrorCallback = callback;
    return this;
  }

  withOnComplete(callback: () => void): this {
    this.onCompleteCallback = callback;
    return this;
  }

  get(data?: any): this {
    return this.withMethod('GET', data);
  }

  delete(data?: any): this {
    return this.withMethod('DELETE', data);
  }

  options(data?: any): this {
    return this.withMethod('OPTIONS', data);
  }

  patch(data?: any): this {
    return this.withMethod('PATCH', data);
  }

  put(data?: any): this {
    return this.withMethod('PUT', data);
  }

  post(data?: any): this {
    return this.withMethod('POST', data);
  }

  postJson(data: any): this {
    this.withContentTypeJson();
    return this.withMethod('POST', data);
  }

  build<T>(): this {
    this.loadingSubject?.next(true);
    this.handleMessage();
    let observable: Observable<unknown>;
    const url = this.url + this.queryParams;
    if (!this.method) throw new Error('Method not set');
    observable = this.http.request<T>(this.method, url, this.httpOptions);
    this.finalObservable = observable.pipe(
      tap((result: any) => {
        this.handleDataSubject(this.dataSubject, result);
        this.loadingSubject?.next(false);
        this.handleSuccessMessage(result);
        this.handleOnSuccess(result);
        this.handleWarningMessageOnSuccess();
        this.handleRouteTo(this.routeToCallback, result);
        this.handleRouteToNewWindow(this.routeToNewWindowCallback, result);
      }),
      catchError((error) => {
        console.log(error);
        let businessException = this.mapException(error);
        this.handleErrorMessageFromServer(businessException);
        this.handleErrorMessage();
        this.handleOnError(error);
        this.loadingSubject?.next(false);
        this.dataSubject?.error(businessException);
        return throwError(() => error);
      }),
      tap(() => {
        this.handleOnComplete();
        this.reloadKtComponents();
      })
    );
    return this;
  }

  private mapException(error: any) {
    let businessException: BusinessException = new BusinessException(ExceptionCode.BUSINESS_ERROR_0000, "Unknown error", []);
    if ((this.httpOptions?.responseType === 'text' || this.httpOptions?.responseType === 'application/json') && error.error) {
      const errorJson = JSON.parse(error.error);
      businessException = new BusinessException(errorJson.exceptionCode, errorJson.message, errorJson.args);
    } else if (error?.error?.exceptionCode) {
      businessException = new BusinessException(error.error.exceptionCode, error.error.message, error.error.args);
    } else if (error?.error) {
      businessException = new BusinessException(error.error, error.message, error.args);
    }
    return businessException;
  }

  subscribe(): void {
    const finalObservable = this.subscribePreparation();
    this.subscriptions.push(finalObservable.subscribe());
  }

  observable() {
    return this.subscribePreparation();
  }

  promise(): () => Promise<any> {
    const finalObservable = this.subscribePreparation();
    return () => firstValueFrom(finalObservable);
  }

  private subscribePreparation() {
    // console.log('Calling url:', this.url);
    const finalObservable = this.finalObservable;
    if (!finalObservable) {
      throw new Error('You must call build() before subscribe()');
    }
    return finalObservable;
  }

  getSubscriptions(): Subscription[] {
    return this.subscriptions;
  }

  unsubscribe(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  private withMethod<T>(method: 'GET' | 'POST' | 'DELETE' | 'OPTIONS' | 'PUT' | 'PATCH' | 'HEAD', data?: any): this {
    this.method = method;
    this.httpOptions = this.httpOptions || {};
    this.httpOptions.body = data;
    return this;
  }

  private formatMessage(message: string, id?: any): string {
    return message;
    // return message + (id ? ` ${id}` : '');
  }

  private handleMessage(): void {
    if (this.message) {
      console.log('Message:', this.message);
    }
  }

  private handleDataSubject(dataSubject: Subject<any> | undefined, data: any): void {
    dataSubject?.next(data);
  }

  private handleSuccessMessage(result: any): void {
    if (this.successMessage) {
      this.extraToastr.success(this.successMessage);
    }
  }

  private handleWarningMessageOnSuccess(): void {
    if (this.warnMessageOnSuccess) {
      this.extraToastr.warning(this.warnMessageOnSuccess);
    }
  }

  private handleRouteTo(routeToCallback: ((result: any) => string) | null, result: any): void {
    if (routeToCallback) {
      const route = routeToCallback(result);
      // navigate to the route with reload
      this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
        this.router.navigateByUrl(route);
      });
    }
  }

  private handleRouteToNewWindow(routeToCallback: ((result: any) => string) | null, result: any): void {
    if (routeToCallback && result) {
      const route = routeToCallback(result);
      window.open(route, '_blank');
    }
  }

  private handleOnSuccess(result: any): void {
    if (this.onSuccessCallback) {
      this.onSuccessCallback(result);
    }
  }

  private handleErrorMessage(): void {
    if (this.errorMessage) {
      this.extraToastr.error(this.errorMessage);
    }
  }

  private handleOnError(error: any): void {
    if (this.onErrorCallback) {
      this.onErrorCallback(error);
    }
  }

  private handleErrorMessageFromServer(businessException: BusinessException) {
    if (this.errorMessageFromServer) {
      const warnMessageExceptionCodes = this.warnMessageExceptionCodes;
      if (warnMessageExceptionCodes.length > 0 && warnMessageExceptionCodes.find(warnMessage => warnMessage === businessException.exceptionCode)) {
        this.extraToastr.warning(businessException.exceptionCode, ...businessException.args ?? []);
      } else if (!this.exceptionCodesIgnorableToToastrError.find(exceptionCode => exceptionCode === businessException.exceptionCode)) {
        this.extraToastr.error(businessException.exceptionCode, ...businessException.args ?? []);
      }
    }
  }

  private handleOnComplete(): void {
    if (this.onCompleteCallback) {
      this.onCompleteCallback();
    }
  }

  /**
   * Reload KT components to reflect possible changes in the menu after certain operations. Otherwise, the KT items may be buggy,
   * e.g. the dropdown menu may not update correctly, which leads to a wrong page redirect when pressing the Metronic dropdown menu items.
   * By executing menu reinitialization here, we fix most of these issues.
   */
  private reloadKtComponents(): void {
    menuReinitialization()
  }
}