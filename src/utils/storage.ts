import { Property, Owner, Language } from '../types';
import { INITIAL_PROPERTIES, INITIAL_OWNERS } from '../data/mockData';

const PROPERTIES_KEY = 'ghor_bisari_properties_v1';
const OWNERS_KEY = 'ghor_bisari_owners_v1';
const CURRENT_OWNER_KEY = 'ghor_bisari_current_owner_v1';
const LANGUAGE_KEY = 'ghor_bisari_lang_v1';
const FAVORITES_KEY = 'ghor_bisari_favorites_v1';

export function getStoredProperties(): Property[] {
  try {
    const data = localStorage.getItem(PROPERTIES_KEY);
    if (!data) {
      localStorage.setItem(PROPERTIES_KEY, JSON.stringify(INITIAL_PROPERTIES));
      return INITIAL_PROPERTIES;
    }
    return JSON.parse(data);
  } catch {
    return INITIAL_PROPERTIES;
  }
}

export function saveProperties(props: Property[]): void {
  localStorage.setItem(PROPERTIES_KEY, JSON.stringify(props));
}

export function getStoredOwners(): Owner[] {
  try {
    const data = localStorage.getItem(OWNERS_KEY);
    if (!data) {
      localStorage.setItem(OWNERS_KEY, JSON.stringify(INITIAL_OWNERS));
      return INITIAL_OWNERS;
    }
    return JSON.parse(data);
  } catch {
    return INITIAL_OWNERS;
  }
}

export function saveOwners(owners: Owner[]): void {
  localStorage.setItem(OWNERS_KEY, JSON.stringify(owners));
}

export function getStoredCurrentOwner(): Owner | null {
  try {
    const data = localStorage.getItem(CURRENT_OWNER_KEY);
    if (!data) return null;
    return JSON.parse(data);
  } catch {
    return null;
  }
}

export function saveCurrentOwner(owner: Owner | null): void {
  if (!owner) {
    localStorage.removeItem(CURRENT_OWNER_KEY);
  } else {
    localStorage.setItem(CURRENT_OWNER_KEY, JSON.stringify(owner));
  }
}

export function getStoredLanguage(): Language {
  try {
    const lang = localStorage.getItem(LANGUAGE_KEY) as Language;
    if (lang === 'en' || lang === 'as') return lang;
    return 'as'; // default to Assamese as requested by regional priority!
  } catch {
    return 'as';
  }
}

export function saveStoredLanguage(lang: Language): void {
  localStorage.setItem(LANGUAGE_KEY, lang);
}

export function getStoredFavorites(): string[] {
  try {
    const data = localStorage.getItem(FAVORITES_KEY);
    if (!data) return [];
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export function saveStoredFavorites(favs: string[]): void {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favs));
}
