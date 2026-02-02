import {Component, Input, OnInit} from '@angular/core';
import {AbstractControl, FormArray, FormGroup} from '@angular/forms';
import {ImageLoadService} from 'src/app/shared/image/load/image-load.service';
import {Translation} from 'src/app/shared/translation/translation';

@Component({
  selector: 'app-calculable-option-groups',
  templateUrl: './calculable-option-groups.component.html',
  styleUrls: ['./calculable-option-groups.component.scss'],
  standalone: false,
})
export class CalculableOptionGroupsComponent implements OnInit {
  @Input() groupsFormArray!: FormArray;
  @Input() languages: any[] = [];
  @Input() entityLinkedId: any = null; // e.g. linked event id
  @Input() categoryControl: AbstractControl | null = null;

  // translation keys (configurable so component is generic)
  @Input() titleKey = 'PRODUCT.OPTION.TITLE';
  @Input() addGroupKey = 'PRODUCT.OPTION_GROUP.ADD_OPTION_GROUP';
  @Input() syncWarningKey = 'PRODUCT.OPTION_SYNC_WARNING';
  @Input() optionAddKey = 'PRODUCT.OPTION.ADD_OPTION';
  @Input() noOptionGroupsKey = 'PRODUCT.NO_OPTION_GROUPS';
  @Input() optionNameKey = 'PRODUCT.OPTION.NAME';
  @Input() optionFixedPriceKey = 'PRODUCT.OPTION.FIXED_PRICE';
  @Input() optionMultiplierKey = 'PRODUCT.OPTION.MULTIPLIER';
  @Input() optionDeltaKey = 'PRODUCT.OPTION.DELTA_ABSOLUTE';
  @Input() optionPriceKey = 'PRODUCT.OPTION.PRICE';
  @Input() optionStockKey = 'PRODUCT.OPTION.STOCK';
  @Input() optionGroupNameKey = 'PRODUCT.OPTION_GROUP.NAME';
  @Input() optionGroupUseStockKey = 'PRODUCT.OPTION_GROUP.USE_STOCK';

  // factory functions provided by parent to create new group/option form groups
  @Input() createGroup!: () => FormGroup;
  @Input() createOption!: () => FormGroup;

  // optional base unit price control (e.g. product.unitPrice) used for previews
  @Input() baseUnitPriceControl: AbstractControl | null = null;
  @Input() helpers: any = {};

  // drag state
  private dragSrcGroupIndex: number | null = null;
  private dragSrcOptionIndex: number | null = null;

  constructor(private imageLoadService: ImageLoadService) {}

  ngOnInit(): void {}

  // Helpers
  getOptionGroupsControls() {
    return this.groupsFormArray ? this.groupsFormArray.controls : [];
  }

  getGroup(groupIndex: number) {
    return this.groupsFormArray.at(groupIndex) as FormGroup;
  }

  getOptionsControls(groupIndex: number) {
    const group = this.getGroup(groupIndex);
    const options = group.get('options') as FormArray | null;
    return options ? options.controls : [];
  }

  addGroup() {
    if (!this.createGroup) return;
    const fg = this.createGroup();
    this.groupsFormArray.push(fg);
    this.updatePositionFields(this.groupsFormArray);
  }

  removeGroup(index: number) {
    this.groupsFormArray.removeAt(index);
    this.updatePositionFields(this.groupsFormArray);
  }

  moveGroupUp(index: number) {
    if (index <= 0) return;
    const ctrl = this.groupsFormArray.at(index);
    this.groupsFormArray.removeAt(index);
    this.groupsFormArray.insert(index - 1, ctrl);
    this.updatePositionFields(this.groupsFormArray);
  }

  moveGroupDown(index: number) {
    if (index >= this.groupsFormArray.length - 1) return;
    const ctrl = this.groupsFormArray.at(index);
    this.groupsFormArray.removeAt(index);
    this.groupsFormArray.insert(index + 1, ctrl);
    this.updatePositionFields(this.groupsFormArray);
  }

  addOption(groupIndex: number) {
    const group = this.getGroup(groupIndex);
    const options = group.get('options') as FormArray;
    if (this.createOption) {
      options.push(this.createOption());
      this.updatePositionFields(options);
    }
  }

  removeOption(groupIndex: number, optionIndex: number) {
    const group = this.getGroup(groupIndex);
    const options = group.get('options') as FormArray;
    options.removeAt(optionIndex);
    this.updatePositionFields(options);
  }

  moveOptionUp(groupIndex: number, optionIndex: number) {
    if (optionIndex <= 0) return;
    const options = (this.getGroup(groupIndex).get('options') as FormArray);
    const ctrl = options.at(optionIndex);
    options.removeAt(optionIndex);
    options.insert(optionIndex - 1, ctrl);
    this.updatePositionFields(options);
  }

  moveOptionDown(groupIndex: number, optionIndex: number) {
    const options = (this.getGroup(groupIndex).get('options') as FormArray);
    if (optionIndex >= options.length - 1) return;
    const ctrl = options.at(optionIndex);
    options.removeAt(optionIndex);
    options.insert(optionIndex + 1, ctrl);
    this.updatePositionFields(options);
  }

  updatePositionFields(arr: FormArray) {
    for (let i = 0; i < arr.length; i++) {
      const g = arr.at(i);
      const pos = g.get('position');
      if (pos) pos.setValue(i + 1);
    }
  }

  // Thumbnail handling using injected imageLoadService
  addOptionThumbnail(event: Event, groupIndex: number, optionIndex: number) {
    this.imageLoadService.loadBase64Images(event, (base64) => {
      const options = (this.getGroup(groupIndex).get('options') as FormArray);
      const option = options.at(optionIndex);
      option.get('thumbnail')?.setValue(base64.result);
    });
  }

  addGroupThumbnail(event: Event, groupIndex: number) {
    this.imageLoadService.loadBase64Images(event, (base64) => {
      const group = this.getGroup(groupIndex);
      group.get('thumbnail')?.setValue(base64.result);
    });
  }

  // Drag & drop
  onOptionDragStart(event: DragEvent, groupIndex: number, optionIndex: number) {
    this.dragSrcGroupIndex = groupIndex;
    this.dragSrcOptionIndex = optionIndex;
    try {
      if (event.dataTransfer) {
        event.dataTransfer.setData('text/plain', JSON.stringify({groupIndex, optionIndex}));
        event.dataTransfer.effectAllowed = 'move';
      }
    } catch (e) {}
  }

  onOptionDragOver(event: DragEvent) {
    if (event) {
      event.preventDefault();
      if (event.dataTransfer) event.dataTransfer.dropEffect = 'move';
    }
  }

  onOptionDrop(event: DragEvent, targetGroupIndex: number, targetOptionIndex: number) {
    event.preventDefault();
    try {
      if (this.dragSrcGroupIndex == null || this.dragSrcOptionIndex == null) {
        if (event.dataTransfer) {
          const raw = event.dataTransfer.getData('text/plain');
          if (raw) {
            const parsed = JSON.parse(raw);
            this.dragSrcGroupIndex = parsed.groupIndex;
            this.dragSrcOptionIndex = parsed.optionIndex;
          }
        }
      }
      if (this.dragSrcGroupIndex == null || this.dragSrcOptionIndex == null) return;
      if (this.dragSrcGroupIndex !== targetGroupIndex) return;
      const group = this.getGroup(targetGroupIndex);
      const options = group.get('options') as FormArray;
      const srcIndex = this.dragSrcOptionIndex;
      let destIndex = targetOptionIndex;
      if (srcIndex < destIndex) destIndex = destIndex - 1;
      if (!options || srcIndex === destIndex) return;
      const ctrl = options.at(srcIndex);
      const copy = JSON.parse(JSON.stringify(ctrl.value));
      options.removeAt(srcIndex);
      options.insert(destIndex, this.createOption());
      options.at(destIndex).setValue(copy);
      this.dragSrcGroupIndex = null;
      this.dragSrcOptionIndex = null;
    } catch (e) {
      console.error('Error while reordering option', e);
    }
  }

  onOptionDropToGroup(event: DragEvent, targetGroupIndex: number) {
    event.preventDefault();
    try {
      if (this.dragSrcGroupIndex == null || this.dragSrcOptionIndex == null) {
        if (event.dataTransfer) {
          const raw = event.dataTransfer.getData('text/plain');
          if (raw) {
            const parsed = JSON.parse(raw);
            this.dragSrcGroupIndex = parsed.groupIndex;
            this.dragSrcOptionIndex = parsed.optionIndex;
          }
        }
      }
      if (this.dragSrcGroupIndex == null || this.dragSrcOptionIndex == null) return;
      if (this.dragSrcGroupIndex !== targetGroupIndex) return;
      const group = this.getGroup(targetGroupIndex);
      const options = group.get('options') as FormArray;
      const srcIndex = this.dragSrcOptionIndex;
      const ctrl = options.at(srcIndex);
      const copy = JSON.parse(JSON.stringify(ctrl.value));
      options.removeAt(srcIndex);
      options.push(this.createOption());
      options.at(options.length - 1).setValue(copy);
      this.dragSrcGroupIndex = null;
      this.dragSrcOptionIndex = null;
    } catch (e) {
      console.error('Error while dropping to group', e);
    }
  }

  // Pricing strategy setter
  setGroupPricingStrategy(index: number, strategy: string) {
    const fg = this.getGroup(index);
    const ctrl = fg.get('pricingStrategy');
    if (ctrl) ctrl.setValue(strategy);
  }

  // Translation helpers for option/group name
  findOptionTranslationFormGroup(optCtrl: AbstractControl, language: string): FormGroup {
    const translationsFormArray = optCtrl.get('translations') as FormArray;
    const found = translationsFormArray.controls.find((c: any) => c.value.language === language) as FormGroup;
    return found ?? (translationsFormArray.controls[0] as FormGroup);
  }

  findGroupTranslationFormGroup(groupCtrl: AbstractControl, language: string = 'de'): FormGroup {
    const translationsFormArray = groupCtrl.get('translations') as FormArray;
    const found = translationsFormArray.controls.find((c: any) => c.value.language === language) as FormGroup;
    return found ?? (translationsFormArray.controls[0] as FormGroup);
  }

  // Basic preview computation - mirrors parent but uses provided baseUnitPriceControl if set
  computeOptionUnitContributionForUi(optCtrl: AbstractControl, parentBase: number): number {
    const pricingStrategy = optCtrl.get('pricingStrategy')?.value || 'INHERIT';
    if (pricingStrategy === 'FIXED') {
      return Number(optCtrl.get('fixedPrice')?.value) || 0;
    } else if (pricingStrategy === 'DELTA_ABSOLUTE') {
      return Number(optCtrl.get('deltaValue')?.value) || 0;
    } else if (pricingStrategy === 'DELTA_PERCENT') {
      const dv = Number(optCtrl.get('deltaValue')?.value) || 0;
      return dv * parentBase / 100.0;
    } else if (pricingStrategy === 'MULTIPLIER') {
      const base = Number(optCtrl.get('unitPrice')?.value) || 0;
      const mult = Number(optCtrl.get('multiplier')?.value) || 1;
      const qty = Number(optCtrl.get('quantity')?.value) || 1;
      return base * (mult - 1.0) * qty;
    } else {
      const base = Number(optCtrl.get('unitPrice')?.value) || 0;
      const mult = Number(optCtrl.get('multiplier')?.value) || 1;
      const qty = Number(optCtrl.get('quantity')?.value) || 1;
      return base * mult * qty;
    }
  }

  computeGroupPreview(groupIndex: number): string {
    try {
      const productPrice = this.baseUnitPriceControl?.value || 0;
      const group = this.getGroup(groupIndex);
      const groupBase = group.get('unitPrice')?.value ?? productPrice;
      const options = group.get('options') as FormArray | null;
      let total = 0;
      if (options) {
        for (let i = 0; i < options.length; i++) {
          total += this.computeOptionUnitContributionForUi(options.at(i), groupBase);
        }
      }
      const pstrat = group.get('pricingStrategy')?.value || 'INHERIT';
      if (pstrat === 'FIXED') {
        total = Number(group.get('fixedPrice')?.value) || 0;
      } else if (pstrat === 'DELTA_ABSOLUTE') {
        total = Number(group.get('deltaValue')?.value) || 0;
      } else if (pstrat === 'DELTA_PERCENT') {
        const dv = Number(group.get('deltaValue')?.value) || 0;
        total = dv * groupBase / 100.0;
      } else if (pstrat === 'MULTIPLIER') {
        const mult = Number(group.get('multiplier')?.value) || 1;
        const inner = (group.get('unitPrice')?.value ?? groupBase) + total;
        total = inner * (mult - 1.0);
      }
      return total.toFixed(2);
    } catch (e) {
      return '0.00';
    }
  }

  protected readonly Translation = Translation;
}
