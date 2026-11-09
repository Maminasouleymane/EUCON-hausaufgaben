import { NgTemplateOutlet } from '@angular/common';
import {
  Component,
  contentChild,
  input,
  output,
  signal,
  TemplateRef,
  viewChild,
} from '@angular/core';
import { DD_MM_YYYY } from '@shared/models/date.model';
import { SingleMultipleOrNone } from 'devextreme/common';
import { GridsEditMode, PagerPageSize } from 'devextreme/common/grids';
import CustomStore from 'devextreme/data/custom_store';
import { DxDataGridComponent } from 'devextreme-angular';
import { exportDataGrid } from 'devextreme-angular/common/export/excel';
import { DxTemplateDirective } from 'devextreme-angular/core';
import { DxDataGridTypes } from 'devextreme-angular/ui/data-grid';
import { Workbook } from 'devextreme-exceljs-fork';
import { saveAs } from 'file-saver';

import { ErrorState } from '../error-state/error-state';

@Component({
  selector: 'app-data-grid',
  imports: [DxDataGridComponent, DxTemplateDirective, NgTemplateOutlet, ErrorState],
  templateUrl: './data-grid.html',
  styleUrl: './data-grid.scss',
  host: {
    '[class.data-grid--auto-height]': '!fillHeight()',
  },
})
export class DataGrid<T, TKey = unknown> {
  columnsDefinition = input.required<DxDataGridTypes.Column<T>[]>();
  dataSource = input.required<CustomStore<T, TKey>>();
  masterDetailEnabled = input(false);
  cellPrepared = input<((e: DxDataGridTypes.CellPreparedEvent<T, TKey>) => void) | null>(null);

  storageKey = input.required<string>();

  remoteOperations = input(true);
  showBorders = input(false);
  fillHeight = input(true);
  pagingEnabled = input(true);
  pageSize = input(20);
  allowedPageSizes = input<(number | PagerPageSize)[]>([20, 50, 100]);
  pagerInfoText = input('Page {0} of {1} ({2} items)');
  selectionMode = input<SingleMultipleOrNone>('single');
  allowUpdating = input(true);
  allowAdding = input(false);
  allowDeleting = input(false);
  editingMode = input<GridsEditMode>('row');

  protected readonly masterDetailTemplate = contentChild(
    TemplateRef<DxDataGridTypes.MasterDetailTemplateData<T, TKey>>,
  );

  private readonly grid = viewChild(DxDataGridComponent);

  protected readonly hasError = signal(false);

  activeFilter = signal<unknown>(null);

  /** Emits once, after the grid has rendered for the first time. */
  readonly ready = output<void>();
  private readyEmitted = false;

  protected onContentReady(): void {
    if (!this.readyEmitted) {
      this.readyEmitted = true;
      this.ready.emit();
    }
  }

  search(term: string): void {
    this.grid()?.instance.searchByText(term);
  }

  onOptionChanged({ fullName, name, component }: DxDataGridTypes.OptionChangedEvent) {
    if (fullName === 'filterValue' || fullName === 'searchPanel.text' || name === 'columns') {
      const filter = component.getCombinedFilter(true);
      // undefined => no filter or disposed instance; keep last known value
      if (filter !== undefined) {
        this.activeFilter.set(filter);
      }
    }
  }

  filterBy(filterExpr: unknown): void {
    this.grid()?.instance.option('filterValue', (filterExpr as unknown[] | null) || null);
  }

  reset(): void {
    this.grid()?.instance.clearFilter();
    this.grid()?.instance.searchByText('');
    this.activeFilter.set(null);
  }

  refresh(): void {
    this.grid()?.instance.refresh();
  }

  async exportToExcel(filename: string): Promise<void> {
    const grid = this.grid();
    if (!grid) {
      return;
    }

    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Sheet1');

    await exportDataGrid({
      component: grid.instance,
      worksheet,
      customizeCell: ({ gridCell, excelCell }) => {
        if (gridCell?.rowType === 'data' && gridCell.column?.dataType === 'date') {
          excelCell.numFmt = DD_MM_YYYY;
        }
      },
    });

    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer], { type: 'application/octet-stream' }), filename);
  }

  protected onDataErrorOccurred(): void {
    const grid = this.grid();
    if (grid && grid.instance.totalCount() <= 0) {
      this.hasError.set(true);
    }
  }

  protected retry(): void {
    this.hasError.set(false);
  }
}
