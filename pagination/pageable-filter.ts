export class PageableFilter {
  pageNumber: number = 1;
  pageSize: number = 10;
}

export class PageableFilterFormKeyEnum {
  pageNumber = 'pageNumber';
  pageSize = 'pageSize';
}

export function emptyPageableFilter(): PageableFilter {
  return new PageableFilter();
}