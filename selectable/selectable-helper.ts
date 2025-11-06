import {Selectable} from './selectable';

export class SelectableHelper {

  static findSelectedItem(selectables: Array<Selectable>): Selectable | undefined {
    return selectables.find(selectable => selectable.isSelected);
  }

  static isAnyButNotAllSelected(selectables: Array<Selectable>): boolean {
    return selectables.some(selectable => selectable.isSelected) && !this.isAllSelected(selectables);
  }

  static isAllSelected(selectables: Array<Selectable>): boolean {
    return selectables.every(selectable => selectable.isSelected);
  }

  static checkAll(selectables: Array<Selectable>, checked: boolean = true) {
    selectables.forEach(selectable => selectable.isSelected = checked);
  }

  static uncheckAll(selectables: Array<Selectable>) {
    this.checkAll(selectables, false);
  }
}