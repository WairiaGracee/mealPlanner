import { api } from "./api";

export interface CalendarStatus {
  connected: boolean;
  connected_at: string | null;
}

export interface CalendarSyncResult {
  created: number;
  links: string[];
  errors: string[];
}

export function getCalendarStatus() {
  return api.get<CalendarStatus>("/calendar/status/");
}

export async function connectGoogleCalendar() {
  const { auth_url } = await api.get<{ auth_url: string }>("/calendar/connect/");
  // Full-page redirect — this has to leave the SPA since it's Google's
  // own consent screen, not something we can render in an iframe/popup
  // without extra plumbing.
  window.location.href = auth_url;
}

export function disconnectGoogleCalendar() {
  return api.post<void>("/calendar/disconnect/");
}

export function syncActiveMealPlanToCalendar() {
  return api.post<CalendarSyncResult>("/calendar/sync/");
}