import {Component, ContentChildren, Input, OnDestroy, QueryList} from '@angular/core';
import {AfterContentInit} from '@angular/core';
import {ExtraToastrService} from '../extra-toastr/extra-toastr.service';
import {TabItemComponent} from './tab-item/tab-item.component';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-tab',
  templateUrl: './tab.component.html',
  styleUrls: ['./tab.component.scss'],
  standalone: false,
})
export class TabComponent implements AfterContentInit, OnDestroy {

  @Input()
  public uppercase: boolean = false;
  @Input()
  public activeTab: number = 0;
  @Input()
  public minTabs: number = 2;
  @Input()
  public maxTabs: number = 10;
  @Input()
  public class: string = '';

  @ContentChildren(TabItemComponent) tabItems: QueryList<TabItemComponent>;

  private tabItemsSub: Subscription | null = null;

  constructor(private extraToastr: ExtraToastrService) {
  }

  ngAfterContentInit(): void {
    this.tabItemsSub = this.tabItems.changes.subscribe(() => {
      this.validateAndActivate();
    });
    this.setActiveTab(0);
  }

  // ngAfterViewInit(): void {
  //   // initial validation + set active
  //   this.validateAndActivate();
  //
  //   // handle dynamic changes to the content children (add/remove tabs at runtime)
  // }

  ngOnDestroy(): void {
    if (this.tabItemsSub) {
      this.tabItemsSub.unsubscribe();
      this.tabItemsSub = null;
    }
  }

  private validateAndActivate() {
    const length = this.tabItems ? this.tabItems.length : 0;
    if (length < this.minTabs || length > this.maxTabs) {
      console.error('Tab items length must be between ' + this.minTabs + ' and ' + this.maxTabs);
      return this.extraToastr.error();
    }

    // clamp activeTab into range
    const active = Math.max(0, Math.min(this.activeTab || 0, length - 1));
    this.setActiveTab(active);
  }

  setActiveTab(targetTabIndex: number) {
    if (targetTabIndex < 0 || targetTabIndex >= this.tabItems.length) {
      console.error('Invalid tab index');
      return this.extraToastr.error();
    }
    this.activeTab = targetTabIndex;
    this.tabItems.toArray().forEach((tabItem, i) => {
      tabItem.isActive = i === targetTabIndex;
      console.log(`TabComponent: set tab index ${i} active=${tabItem.isActive}`);
    });
  }
}
