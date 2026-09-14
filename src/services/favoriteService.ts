import type { FavoriteCandidate } from "../types/favorite";
import { delay } from "../utils/delay";
import { mockDb } from "../utils/mockDb";

/**
 * Endpoints futuros (sugestão):
 *   GET    /api/curriculos/favoritos
 *   POST   /api/curriculos/:id/favorito
 *   DELETE /api/curriculos/:id/favorito
 */
export const favoriteService = {
  async getFavoriteIds(): Promise<string[]> {
    await delay(150);
    return mockDb.getFavorites().map((f) => f.candidateId);
  },

  getFavoriteIdsSync(): string[] {
    return mockDb.getFavorites().map((f) => f.candidateId);
  },

  async isFavorite(candidateId: string): Promise<boolean> {
    await delay(80);
    return mockDb.getFavorites().some((f) => f.candidateId === candidateId);
  },

  async toggleFavorite(candidateId: string): Promise<boolean> {
    await delay(150);
    const favorites = mockDb.getFavorites();
    const existing = favorites.find((f) => f.candidateId === candidateId);

    if (existing) {
      mockDb.saveFavorites(favorites.filter((f) => f.candidateId !== candidateId));
      return false;
    }

    const favorite: FavoriteCandidate = {
      id: `fav-${Date.now()}`,
      candidateId,
      createdAt: new Date().toISOString(),
    };
    mockDb.saveFavorites([favorite, ...favorites]);
    return true;
  },
};
