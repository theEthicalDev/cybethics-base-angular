// frontend/src/app/shared/state/service-state.ts
import {BehaviorSubject, Observable} from 'rxjs';

export class ServiceState<T> {

  private loadingSubject = new BehaviorSubject<boolean>(false);
  private loadingObservable = this.loadingSubject.asObservable();
  private dataSubject;
  private dataObservable;

  constructor(initialData: T) {
    this.dataSubject = new BehaviorSubject<T>(initialData);
    this.dataObservable = this.dataSubject.asObservable();
    this.dataSubject.next(initialData);
  }

  get loading$(): Observable<boolean> {
    return this.loadingObservable;
  }

  get data$(): Observable<T> {
    return this.dataObservable;
  }

  getLoadingSubject(): BehaviorSubject<boolean> {
    return this.loadingSubject;
  }

  getDataSubject(): BehaviorSubject<T> {
    return this.dataSubject;
  }

  setLoading(isLoading: boolean): void {
    this.loadingSubject.next(isLoading);
  }

  setData(data: T): void {
    this.dataSubject.next(data);
  }
}