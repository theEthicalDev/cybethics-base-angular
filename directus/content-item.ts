export abstract class ContentItem {
  id: string;
  status: string;
  sort: string;
}

export function compareContentItems(a: ContentItem, b: ContentItem): number {
  // if a.sort and b.sort are numbers, compare them as numbers
  if (!isNaN(Number(a.sort)) && !isNaN(Number(b.sort))) {
    return Number(a.sort) - Number(b.sort);
  }
  a.sort = a.sort || '';
  b.sort = b.sort || '';
  return a.sort.localeCompare(b.sort);
}
