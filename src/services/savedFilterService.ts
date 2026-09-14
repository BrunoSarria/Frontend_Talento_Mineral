import type { SavedFilter } from "../types/savedFilter";
import type { CandidateFilters } from "../types/candidate";
import { delay } from "../utils/delay";
import { mockDb } from "../utils/mockDb";

/**
 * Endpoints futuros (sugestão):
 *   GET    /api/filtros-salvos
 *   POST   /api/filtros-salvos
 *   DELETE /api/filtros-salvos/:id
 */
export const savedFilterService = {
  async getSavedFilters(): Promise<SavedFilter[]> {
    await delay(150);
    return mockDb.getSavedFilters().sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  },

  async saveFilter(name: string, filters: CandidateFilters): Promise<SavedFilter> {
    await delay(250);
    const { page: _page, pageSize: _pageSize, ...cleanFilters } = filters;
    void _page;
    void _pageSize;
    const savedFilter: SavedFilter = {
      id: `filter-${Date.now()}`,
      name,
      filters: cleanFilters,
      createdAt: new Date().toISOString(),
    };
    mockDb.saveSavedFilters([savedFilter, ...mockDb.getSavedFilters()]);
    return savedFilter;
  },

  async deleteFilter(id: string): Promise<void> {
    await delay(150);
    mockDb.saveSavedFilters(mockDb.getSavedFilters().filter((f) => f.id !== id));
  },
};
