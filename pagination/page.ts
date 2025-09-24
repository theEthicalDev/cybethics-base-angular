export class Page<T> {
  content: T[] = [];
  totalPages: number;
  totalElements: number;
  number: number;
  size: number;

  constructor(content: T[], totalPages: number, totalElements: number, number: number, size: number) {
    this.content = content;
    this.totalPages = totalPages;
    this.totalElements = totalElements;
    this.number = number;
    this.size = size;
  }

  static empty<T>(): Page<T> {
    return new Page<T>([] as T[], 0, 0, 0, 0);
  }
}

export function isEmpty(page: Page<any> | null): boolean {
  return !page || page.totalElements === 0;
}