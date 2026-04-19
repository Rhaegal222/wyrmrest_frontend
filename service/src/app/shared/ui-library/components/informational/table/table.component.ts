import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableColumn } from '../../../models/component-theme.model';

@Component({
  selector: 'ui-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent {
  @Input() columns: TableColumn[] = [];
  @Input() data: any[] = [];
  @Input() striped = false;
  @Input() hoverable = true;
  @Input() bordered = false;
  
  @Output() rowClick = new EventEmitter<any>();

  sortColumn = signal<string | null>(null);
  sortDirection = signal<'asc' | 'desc'>('asc');

  onSort(column: TableColumn): void {
    if (!column.sortable) return;

    if (this.sortColumn() === column.field) {
      this.sortDirection.update(dir => dir === 'asc' ? 'desc' : 'asc');
    } else {
      this.sortColumn.set(column.field);
      this.sortDirection.set('asc');
    }
  }

  getSortedData(): any[] {
    const col = this.sortColumn();
    if (!col) return this.data;

    return [...this.data].sort((a, b) => {
      const aVal = a[col];
      const bVal = b[col];
      const modifier = this.sortDirection() === 'asc' ? 1 : -1;

      if (aVal < bVal) return -1 * modifier;
      if (aVal > bVal) return 1 * modifier;
      return 0;
    });
  }

  onRowClick(row: any): void {
    this.rowClick.emit(row);
  }

  get tableClasses(): string[] {
    return [
      'ui-table',
      this.striped ? 'ui-table--striped' : '',
      this.hoverable ? 'ui-table--hoverable' : '',
      this.bordered ? 'ui-table--bordered' : ''
    ].filter(Boolean);
  }
}
