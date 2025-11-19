import {
  Component,
  Input,
  Output,
  EventEmitter,
  AfterViewInit,
  ElementRef,
  ViewChildren,
  QueryList,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';

export interface Tab {
  id: string;
  label: string;
  icon?: string;
  disabled?: boolean;
}

@Component({
  selector: 'ui-tabs',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss'],
})
export class TabsComponent implements AfterViewInit {
  @Input() tabs: Tab[] = [];
  @Input() activeTabId: string | null = null;
  @Output() tabChange = new EventEmitter<string>();

  @ViewChildren('tabItem') tabElements!: QueryList<ElementRef>;

  indicatorStyle = { left: '0px', width: '0px' };

  constructor(private cd: ChangeDetectorRef) {}

  ngAfterViewInit() {
    if (!this.activeTabId && this.tabs.length > 0) {
      this.selectTab(this.tabs[0].id);
    } else {
      this.updateIndicator();
    }
  }

  selectTab(id: string) {
    const tab = this.tabs.find((t) => t.id === id);
    if (tab && !tab.disabled) {
      this.activeTabId = id;
      this.tabChange.emit(id);
      this.updateIndicator();
    }
  }

  private updateIndicator() {
    setTimeout(() => {
      const buttons = document.querySelectorAll('.ui-tab-item');
      const index = this.tabs.findIndex((t) => t.id === this.activeTabId);
      if (index >= 0 && buttons[index]) {
        const el = buttons[index] as HTMLElement;
        this.indicatorStyle = {
          left: el.offsetLeft + 'px',
          width: el.offsetWidth + 'px',
        };
        this.cd.markForCheck();
      }
    }, 50); // Small delay to allow render
  }
}
