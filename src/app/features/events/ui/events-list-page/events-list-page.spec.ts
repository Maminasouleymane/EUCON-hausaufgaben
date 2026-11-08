import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Signal, WritableSignal } from '@angular/core';

import { EventsListPage } from './events-list-page';
import { NewEventFormData } from '../../models/event.model';

interface EventsListPageInternals {
  activeFilter: () => unknown[] | null;
  searchTerm: () => string;
  isAddPopupOpen: WritableSignal<boolean>;
  dataSource: { insert: (values: unknown) => Promise<unknown> };
  grid: Signal<{ refresh: () => void } | undefined>;
  addPopup: Signal<{ resetForm: () => void } | undefined>;
  onStatusChange: (event: { value?: string | null }) => void;
  onLocationChange: (event: { value?: string | null }) => void;
  onSearchChange: (event: { value?: string | null }) => void;
  onResetFilters: () => void;
  onAddEventSave: (data: NewEventFormData) => Promise<void>;
}

describe('EventsListPage', () => {
  let component: EventsListPage;
  let fixture: ComponentFixture<EventsListPage>;

  function internals(): EventsListPageInternals {
    return component as unknown as EventsListPageInternals;
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventsListPage],
    }).compileComponents();

    fixture = TestBed.createComponent(EventsListPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('applyFilters', () => {
    it('has no active filter by default', () => {
      expect(internals().activeFilter()).toBeNull();
    });

    it('builds a single-condition filter when one field is selected', () => {
      internals().onStatusChange({ value: 'planned' });

      expect(internals().activeFilter()).toEqual(['status', '=', 'planned']);
    });

    it('combines multiple active conditions with "and"', () => {
      internals().onStatusChange({ value: 'planned' });
      internals().onLocationChange({ value: 'Tokyo' });

      expect(internals().activeFilter()).toEqual([
        ['status', '=', 'planned'],
        'and',
        ['location', '=', 'Tokyo'],
      ]);
    });

    it('drops a condition once its field is reset back to "All"', () => {
      internals().onStatusChange({ value: 'planned' });
      internals().onLocationChange({ value: 'Tokyo' });
      internals().onStatusChange({ value: 'All' });

      expect(internals().activeFilter()).toEqual(['location', '=', 'Tokyo']);
    });
  });

  describe('search term reset', () => {
    it('clears the search term signal on reset, keeping the search box in sync with the grid', () => {
      internals().onSearchChange({ value: 'Toronto' });
      expect(internals().searchTerm()).toBe('Toronto');

      internals().onResetFilters();

      expect(internals().searchTerm()).toBe('');
    });
  });

  describe('onAddEventSave', () => {
    const formData: NewEventFormData = {
      name: 'Test Event',
      location: 'Tokyo',
      status: 'planned',
      date: new Date('2099-01-01'),
      participantCount: 5,
    };

    it('closes the popup, resets the form, and refreshes the grid on success', async () => {
      const { isAddPopupOpen, dataSource, grid, addPopup } = internals();
      isAddPopupOpen.set(true);
      vi.spyOn(dataSource, 'insert').mockResolvedValue({});
      const refreshSpy = vi.spyOn(grid()!, 'refresh');
      const resetFormSpy = vi.spyOn(addPopup()!, 'resetForm');

      await internals().onAddEventSave(formData);

      expect(isAddPopupOpen()).toBe(false);
      expect(resetFormSpy).toHaveBeenCalled();
      expect(refreshSpy).toHaveBeenCalled();
    });

    it('keeps the popup open and leaves the form untouched when the insert fails', async () => {
      const { isAddPopupOpen, dataSource, grid, addPopup } = internals();
      isAddPopupOpen.set(true);
      vi.spyOn(dataSource, 'insert').mockRejectedValue(new Error('insert failed'));
      const refreshSpy = vi.spyOn(grid()!, 'refresh');
      const resetFormSpy = vi.spyOn(addPopup()!, 'resetForm');

      await internals().onAddEventSave(formData);

      expect(isAddPopupOpen()).toBe(true);
      expect(resetFormSpy).not.toHaveBeenCalled();
      expect(refreshSpy).not.toHaveBeenCalled();
    });
  });
});
