export class EventHelper {
  static getTarget<T>(target: EventTarget | null, type: new () => T): T {
    if (target instanceof HTMLElement) {
      return target as unknown as T;
    }
    return new type();
  }
}