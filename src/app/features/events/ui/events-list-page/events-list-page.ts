import { Component, computed, effect, inject, resource, signal, viewChild } from '@angular/core';
import { ALL, EVENTS_TABS } from '@features/events/models/constant';
import { D_MMM_YYYY, DateRange } from '@features/events/models/date.model';
import { EventRecord, NewEventFormData } from '@features/events/models/event.model';
import { EventsService } from '@features/events/services/events.service';
import { LocationsService } from '@features/events/services/locations.service';
import { StatusesService } from '@features/events/services/statuses.service';
import { ListPageTab } from '@shared/directives/list-page-tab/list-page-tab';
import { ActionBarAction } from '@shared/models/action-bar.model';
import { DataGrid } from '@shared/ui/data-grid/data-grid';
import { FilterBar } from '@shared/ui/filter-bar/filter-bar';
import { FilterField } from '@shared/ui/filter-field/filter-field';
import { ListPage } from '@shared/ui/list-page/list-page';
import notify from 'devextreme/ui/notify';
import { DxDataGridTypes } from 'devextreme-angular/ui/data-grid';
import { DxDateRangeBoxComponent } from 'devextreme-angular/ui/date-range-box';
import { DxDateRangeBoxTypes } from 'devextreme-angular/ui/date-range-box';
import { DxSelectBoxComponent } from 'devextreme-angular/ui/select-box';
import { DxSelectBoxTypes } from 'devextreme-angular/ui/select-box';
import { DxTextBoxComponent, DxTextBoxTypes } from 'devextreme-angular/ui/text-box';

import { filterBuilder, loadFilterBar, saveFilterBar } from '../../utils/helpers';
import { AddEventPopup } from '../add-event-popup/add-event-popup';
import { EventParticipants } from '../event-participants/event-participants';
import { EventsStatistics } from '../events-statistics/events-statistics';

@Component({
  selector: 'app-events-list-page',
  imports: [
    ListPage,
    ListPageTab,
    DataGrid,
    FilterBar,
    FilterField,
    DxSelectBoxComponent,
    DxDateRangeBoxComponent,
    DxTextBoxComponent,
    AddEventPopup,
    EventParticipants,
    EventsStatistics,
  ],
  templateUrl: './events-list-page.html',
  styleUrl: './events-list-page.scss',
})
export class EventsListPage {
  private readonly eventsService = inject(EventsService);
  private readonly statusesService = inject(StatusesService);
  private readonly locationsService = inject(LocationsService);

  protected readonly tabs = EVENTS_TABS;
  protected readonly dataSource = this.eventsService.createDataSource();

  protected readonly statusesResource = resource({
    loader: () => this.statusesService.getStatuses(),
    defaultValue: [],
  });
  protected readonly locationsResource = resource({
    loader: () => this.locationsService.getLocations(),
    defaultValue: [],
  });

  protected readonly columns = computed<DxDataGridTypes.Column<EventRecord>[]>(() => [
    { dataField: 'name', caption: 'Event Name' },
    {
      dataField: 'location',
      caption: 'Location',
      lookup: { dataSource: this.locationsResource.value() },
    },
    {
      dataField: 'status',
      caption: 'Status',
      lookup: { dataSource: this.statusesResource.value() },
    },
    { dataField: 'participantCount', caption: 'Participants', dataType: 'number' },
    {
      dataField: 'date',
      caption: 'Date',
      dataType: 'date',
      format: D_MMM_YYYY,
      sortOrder: 'asc',
    },
  ]);

  protected readonly statusOptions = computed<string[]>(() => [
    ALL,
    ...this.statusesResource.value(),
  ]);
  protected readonly locationOptions = computed<string[]>(() => [
    ALL,
    ...this.locationsResource.value(),
  ]);

  private readonly saved = loadFilterBar();

  protected readonly selectedStatus = signal<string>(this.saved.status);
  protected readonly selectedLocation = signal<string>(this.saved.location);
  protected readonly dateRange = signal<DateRange>(this.saved.dateRange);
  protected readonly activeFilter = signal<unknown[] | null>(
    filterBuilder(this.saved.status, this.saved.location, this.saved.dateRange),
  );
  protected readonly searchTerm = signal(this.saved.search);

  private readonly grid = viewChild(DataGrid);
  private readonly addPopup = viewChild(AddEventPopup);
  protected readonly isAddPopupOpen = signal(false);

  protected readonly actions: ActionBarAction[] = [
    { label: 'Export', icon: 'download', stylingMode: 'outlined', onClick: () => this.onExport() },
    {
      label: 'Add Event',
      icon: 'plus',
      type: 'default',
      stylingMode: 'contained',
      onClick: () => this.onAdd(),
    },
  ];

  constructor() {
    // save the filter bar state to localStorage whenever it changes, so it can be restored on page reload.
    effect(() => {
      saveFilterBar({
        status: this.selectedStatus(),
        location: this.selectedLocation(),
        dateRange: this.dateRange(),
        search: this.searchTerm(),
      });
    });
  }

  protected onGridReady(): void {
    // Re-apply the restored filter bar state to the freshly created grid.
    const grid = this.grid();
    if (!grid) {
      return;
    }
    if (this.activeFilter()) {
      grid.filterBy(this.activeFilter());
    }
    if (this.searchTerm()) {
      grid.search(this.searchTerm());
    }
  }

  protected onSearchChange({ value }: DxTextBoxTypes.ValueChangedEvent): void {
    const searchTerm = value?.toString() ?? '';
    this.searchTerm.set(searchTerm);
    this.grid()?.search(searchTerm);
  }

  protected onStatusChange({ value }: DxSelectBoxTypes.ValueChangedEvent): void {
    this.selectedStatus.set(value ?? ALL);
    this.applyFilters();
  }

  protected onLocationChange({ value }: DxSelectBoxTypes.ValueChangedEvent): void {
    this.selectedLocation.set(value ?? ALL);
    this.applyFilters();
  }

  protected onDateRangeChange(event: DxDateRangeBoxTypes.ValueChangedEvent): void {
    const startDate = event.component.option('startDate');
    const endDate = event.component.option('endDate');
    this.dateRange.set({
      start: startDate ? new Date(startDate) : null,
      end: endDate ? new Date(endDate) : null,
    });
    this.applyFilters();
  }

  protected onResetFilters(): void {
    this.selectedStatus.set(ALL);
    this.selectedLocation.set(ALL);
    this.dateRange.set({ start: null, end: null });
    this.activeFilter.set(null);
    this.searchTerm.set('');
    this.grid()?.reset();
  }

  protected onAdd(): void {
    this.isAddPopupOpen.set(true);
  }

  protected onStatusCellPrepared(e: DxDataGridTypes.CellPreparedEvent<EventRecord, number>): void {
    if (e.rowType === 'data' && e.column.dataField === 'status') {
      e.cellElement.classList.add('status-cell', `status-cell--${e.value}`);
    }
  }

  protected onExport(): void {
    const date = new Date().toISOString().slice(0, 10);
    const exportedFileName = `Events_${date}.xlsx`;
    this.grid()?.exportToExcel(exportedFileName);
  }

  protected async onAddEventSave({
    name,
    location,
    status,
    date,
    participantCount,
  }: NewEventFormData): Promise<void> {
    try {
      await this.dataSource.insert({
        id: 0,
        name: name,
        location: location ?? '',
        status: status ?? 'planned',
        date: date ?? new Date(),
        participantCount: participantCount ?? 3,
      });
      notify('Event created successfully.', 'success', 2500);
      this.isAddPopupOpen.set(false);
      this.addPopup()?.resetForm();
      this.grid()?.refresh();
    } catch {
      notify('Failed to create event. Please try again.', 'error', 2500);
    }
  }

  private applyFilters(): void {
    const combinedFilters = filterBuilder(
      this.selectedStatus(),
      this.selectedLocation(),
      this.dateRange(),
    );
    this.activeFilter.set(combinedFilters);
    this.grid()?.filterBy(combinedFilters);
  }
}
