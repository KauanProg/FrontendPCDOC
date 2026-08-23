import { CommonModule } from '@angular/common';
import { Component, Input, TemplateRef } from '@angular/core';

export type TablePaginatedColumn<T = any> = {
  key: string;
  label: string;
  formatter?: (row: T) => string | number;
  minWidth?: string;
  width?: string;
  visible?: boolean;
};

export type TablePaginatedCellContext<T = any> = {
  $implicit: T;
  row: T;
  value: string | number;
  column: TablePaginatedColumn<T>;
};

export type TablePaginationMeta = {
  page: number;
  lastPage: number;
  limit: number;
  total: number;
};

@Component({
  selector: 'app-paginated-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './table-paginated.html',
  styleUrls: ['./table-paginated.scss'],
})
export class TablePaginatedComponent<T = any> {
  private readonly emptyValuePlaceholder = '-';
  private _data: readonly T[] = [];

  @Input() columns: readonly TablePaginatedColumn<T>[] = [];

  @Input() set data(value: readonly T[]) {
    this._data = [...(value || [])];
  }

  @Input() cellTemplates: Partial<
    Record<string, TemplateRef<TablePaginatedCellContext<T>>>
  > = {};

  get visibleColumns(): TablePaginatedColumn<T>[] {
    return this.columns.filter((col) => col.visible !== false);
  }

  get displayedColumns(): string[] {
    return this.visibleColumns.map((col) => col.key);
  }

  get paginatedData(): readonly T[] {
    return this._data;
  }

  getColumnStyles(column: TablePaginatedColumn<T>): Record<string, string> {
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

  getCellValue(row: T, column: TablePaginatedColumn<T>): string | number {
    const value = column.formatter ? column.formatter(row) : (row as any)[column.key];
    return this.normalizeCellValue(value);
  }

  hasCustomTemplate(column: TablePaginatedColumn<T>): boolean {
    return !!this.cellTemplates[column.key];
  }

  getCustomTemplate(
    column: TablePaginatedColumn<T>
  ): TemplateRef<TablePaginatedCellContext<T>> {
    return this.cellTemplates[column.key] as TemplateRef<TablePaginatedCellContext<T>>;
  }

  createCellContext(row: T, column: TablePaginatedColumn<T>): TablePaginatedCellContext<T> {
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
