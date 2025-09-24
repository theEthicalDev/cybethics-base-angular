export abstract class Selectable {
  isSelected: boolean = false;

  public checkSelectable() {
    this.isSelected = !this.isSelected;
  }
}