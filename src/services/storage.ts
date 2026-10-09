'use client';

import { WebsiteDraft, Shop } from '@/types';
import { DEMO_SHOPS } from '@/data/shops';

const STORAGE_KEY = 'netrawebai_drafts_v1';
const ACTIVE_DRAFT_KEY = 'netrawebai_active_draft_id';

export function getSavedDrafts(): WebsiteDraft[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // Seed default draft from Mahadev Mobile so user starts with a realistic demo
      const initial: WebsiteDraft[] = [
        {
          id: 'draft-seed-mahadev',
          slug: 'mahadev-mobile',
          shopData: DEMO_SHOPS[0],
          lastUpdated: new Date().toISOString(),
          step: 5,
          status: 'ready',
          subdomain: 'mahadev-mobile.netrawebai.in',
        },
      ];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(raw) as WebsiteDraft[];
  } catch (e) {
    console.error('Failed to read drafts from localStorage', e);
    return [];
  }
}

export function saveDraft(draft: WebsiteDraft): void {
  if (typeof window === 'undefined') return;
  try {
    const drafts = getSavedDrafts();
    const index = drafts.findIndex((d) => d.id === draft.id);
    if (index >= 0) {
      drafts[index] = { ...draft, lastUpdated: new Date().toISOString() };
    } else {
      drafts.unshift({ ...draft, lastUpdated: new Date().toISOString() });
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(drafts));
    setActiveDraftId(draft.id);
  } catch (e) {
    console.error('Failed to save draft to localStorage', e);
  }
}

export function getDraftById(id: string): WebsiteDraft | undefined {
  const drafts = getSavedDrafts();
  return drafts.find((d) => d.id === id);
}

export function deleteDraft(id: string): void {
  if (typeof window === 'undefined') return;
  try {
    const drafts = getSavedDrafts().filter((d) => d.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(drafts));
    if (getActiveDraftId() === id) {
      localStorage.removeItem(ACTIVE_DRAFT_KEY);
    }
  } catch (e) {
    console.error('Failed to delete draft', e);
  }
}

export function setActiveDraftId(id: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(ACTIVE_DRAFT_KEY, id);
}

export function getActiveDraftId(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(ACTIVE_DRAFT_KEY);
}

export function createNewDraftFromShop(baseShop: Shop): WebsiteDraft {
  const draftId = `draft-${Date.now()}`;
  const slug = baseShop.slug || `dukkaan-${Date.now().toString().slice(-4)}`;
  const draft: WebsiteDraft = {
    id: draftId,
    slug,
    shopData: {
      ...baseShop,
      id: `shop-${draftId}`,
      isDemo: true,
    },
    lastUpdated: new Date().toISOString(),
    step: 1,
    status: 'draft',
    subdomain: `${slug}.netrawebai.in`,
  };
  saveDraft(draft);
  return draft;
}
