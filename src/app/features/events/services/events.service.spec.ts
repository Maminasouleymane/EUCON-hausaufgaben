import { LoadOptions } from 'devextreme/common/data';

import { EventRecord } from '../models/event.model';
import { EventsService } from './events.service';

describe('EventsService', () => {
  let service: EventsService;

  beforeEach(() => {
    service = new EventsService();
    // The 5000-event dataset above is generated with real randomness for
    // variety. From here on, pin Math.random so simulateNetwork's latency is
    // short and its ERROR_RATE-based random rejection never fires — without
    // that, this suite would be flaky (~5% chance of failure per load call).
    vi.spyOn(Math, 'random').mockReturnValue(0.5);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  async function load(options: LoadOptions<EventRecord>) {
    const result = await service.createDataSource().load(options);
    return result as { data: EventRecord[]; totalCount: number };
  }

  it('returns every record and the full count with no search or filter', async () => {
    const { data, totalCount } = await load({});

    expect(totalCount).toBe(5000);
    expect(data).toHaveLength(5000);
  });

  it('filters by a case-insensitive substring match across fields when searching', async () => {
    const { data, totalCount } = await load({ searchValue: 'tokyo' });

    expect(totalCount).toBeGreaterThan(0);
    expect(totalCount).toBeLessThan(5000);
    expect(data.every((event) => event.location.toLowerCase().includes('tokyo'))).toBe(true);
  });

  it('returns no results when the search term matches nothing', async () => {
    const { data, totalCount } = await load({ searchValue: 'zzz-no-such-event-zzz' });

    expect(totalCount).toBe(0);
    expect(data).toEqual([]);
  });

  it('combines search and an explicit filter with AND semantics', async () => {
    const { data, totalCount: combinedCount } = await load({
      searchValue: 'tokyo',
      filter: ['status', '=', 'planned'],
    });
    const { totalCount: searchOnlyCount } = await load({ searchValue: 'tokyo' });

    expect(combinedCount).toBeLessThanOrEqual(searchOnlyCount);
    expect(data.every((event) => event.status === 'planned')).toBe(true);
  });

  it('sorts the returned page without affecting totalCount', async () => {
    const { data, totalCount } = await load({
      sort: [{ selector: 'date', desc: false }],
      take: 50,
    });

    expect(totalCount).toBe(5000);
    expect(data).toHaveLength(50);
    for (let i = 1; i < data.length; i++) {
      expect(data[i].date.getTime()).toBeGreaterThanOrEqual(data[i - 1].date.getTime());
    }
  });

  it('paginates via skip/take while totalCount still reflects the full filtered size', async () => {
    const { data, totalCount } = await load({ skip: 10, take: 5 });

    expect(totalCount).toBe(5000);
    expect(data).toHaveLength(5);
  });
});
