import {AfterContentInit, Component, ContentChildren, Input, QueryList} from '@angular/core';
import {ExtraToastrService} from '../extra-toastr/extra-toastr.service';
import {TabItemComponent} from './tab-item/tab-item.component';

@Component({
  selector: 'app-tab',
  templateUrl: './tab.component.html',
  styleUrls: ['./tab.component.scss'],
  standalone: false,
})
export class TabComponent implements AfterContentInit {

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

  constructor(private extraToastr: ExtraToastrService) {
  }

  ngAfterContentInit(): void {
    if (this.tabItems.length < this.minTabs || this.tabItems.length > this.maxTabs) {
      console.error('Tab items length must be between ' + this.minTabs + ' and ' + this.maxTabs);
      return this.extraToastr.error();
    }
    this.setActiveTab(this.activeTab);
  }

  setActiveTab(targetTabIndex: number) {
    if (targetTabIndex < 0 || targetTabIndex >= this.tabItems.length) {
      console.error('Invalid tab index');
      return this.extraToastr.error();
    }
    this.activeTab = targetTabIndex;
    this.tabItems.toArray().forEach((tabItem, i) => {
      tabItem.isActive = i === targetTabIndex;
    });
  }
}
