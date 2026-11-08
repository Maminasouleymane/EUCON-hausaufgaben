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
});
