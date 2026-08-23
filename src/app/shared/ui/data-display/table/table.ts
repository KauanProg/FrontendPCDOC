import { CommonModule } from '@angular/common';
import { Component, Input, TemplateRef } from '@angular/core';

export type TableColumn<T = any> = {
  key: string;
  label: string;
  formatter?: (row: T) => string | number;
  minWidth?: string;
  width?: string;
  visible?: boolean;
};

export type TableCellContext<T = any> = {
  $implicit: T;
  row: T;
  value: string | number;
  column: TableColumn<T>;
};

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './table.html',
  styleUrls: ['./table.scss'],
})
export class TableComponent<T = any> {
  private readonly emptyValuePlaceholder = '-';

  @Input() columns: readonly TableColumn<T>[] = [];
  @Input() data: readonly T[] = [];
  @Input() cellTemplates: Partial<Record<string, TemplateRef<TableCellContext<T>>>> = {};

  get visibleColumns(): TableColumn<T>[] {
    return this.columns.filter((col) => col.visible !== false);
  }

  get displayedColumns(): string[] {
    return this.visibleColumns.map((col) => col.key as string);
  }

  getColumnStyles(column: TableColumn<T>): Record<string, string> {
    const styles: Record<string, string> = {};

    if (column.minWidth) {
      styles['min-width'] = column.minWidth;
      styles['width'] = column.width ?? column.minWidth;
    }

    if (column.width && !styles['width']) {
      styles['width'] = column.width;
    }

    return styles;
  }

  getCellValue(row: T, column: TableColumn<T>): string | number {
    const value = column.formatter ? column.formatter(row) : (row as any)[column.key];
    return this.normalizeCellValue(value);
  }

  hasCustomTemplate(column: TableColumn<T>): boolean {
    return !!this.cellTemplates[column.key];
  }

  getCustomTemplate(column: TableColumn<T>): TemplateRef<TableCellContext<T>> {
    return this.cellTemplates[column.key] as TemplateRef<TableCellContext<T>>;
  }

  createCellContext(row: T, column: TableColumn<T>): TableCellContext<T> {
    return {
      $implicit: row,
      row,
      value: this.getCellValue(row, column),
      column,
    };
  }

  private normalizeCellValue(value: unknown): string | number {
    if (value === null || value === undefined) {
      return this.emptyValuePlaceholder;
    }

    if (typeof value === 'string' && value.trim().length === 0) {
      return this.emptyValuePlaceholder;
    }

    return value as string | number;
  }
}
