import { ComponentFixture, TestBed } from '@angular/core/testing';
import CustomStore from 'devextreme/data/custom_store';

import { DataGrid } from './data-grid';

describe('DataGrid', () => {
  let component: DataGrid<unknown>;
  let fixture: ComponentFixture<DataGrid<unknown>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataGrid],
    }).compileComponents();

    fixture = TestBed.createComponent(DataGrid);
    fixture.componentRef.setInput('columnsDefinition', []);
    fixture.componentRef.setInput(
      'dataSource',
      new CustomStore({ load: () => ({ data: [], totalCount: 0 }) }),
    );
    fixture.componentRef.setInput('storageKey', 'test-grid');
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('error state', () => {
    interface DataGridInternals {
      grid: () => { instance: { totalCount: () => number } } | undefined;
      hasError: () => boolean;
      onDataErrorOccurred: () => void;
      retry: () => void;
    }

    function internals(): DataGridInternals {
      return component as unknown as DataGridInternals;
    }

    function setTotalCount(count: number): void {
      const grid = internals().grid();
      if (grid) {
        grid.instance.totalCount = () => count;
      }
    }

    it('shows the error state when a load failure leaves no data on screen', () => {
      setTotalCount(0);

      internals().onDataErrorOccurred();

      expect(internals().hasError()).toBe(true);
    });

    it('does not show the error state when rows are still on screen (e.g. a failed edit)', () => {
      setTotalCount(5);

      internals().onDataErrorOccurred();

      expect(internals().hasError()).toBe(false);
    });

    it('retry() clears the error state so the grid re-mounts', () => {
      setTotalCount(0);
      internals().onDataErrorOccurred();
      expect(internals().hasError()).toBe(true);

      internals().retry();

      expect(internals().hasError()).toBe(false);
    });
  });
});
