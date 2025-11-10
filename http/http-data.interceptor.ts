import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpResponse,
  HttpSentEvent,
  HttpHeaderResponse,
  HttpProgressEvent, HttpUserEvent
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable()
export class HttpDataInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      map((event: HttpEvent<any>) => {
        return this.extractDataFromResponse(event);
      }),
      catchError((error: any) => {
        return this.handleError(error);
      })
    );
  }

  private extractDataFromResponse(event: HttpSentEvent | HttpHeaderResponse | HttpResponse<any> | HttpProgressEvent | HttpUserEvent<any>) {
    if (event instanceof HttpResponse && event.body && event.body.data) {
      // Replace the body with the extracted `data` property
      return event.clone({body: event.body.data});
    }
    return event;
  }

  private handleError(error: any) {
    // Log the error or handle it as needed
    console.error('Error occurred during HTTP interception:', error);
    // Optionally, rethrow the error to propagate it
    return throwError(() => error);
  }
}