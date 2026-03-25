import type { AppDispatch } from "@/redux/store/store";
import { resetAuthState } from "@/redux/store/store";
import { stripPersonalizedJobData } from "@/redux/store/slices/jobsSlice";
import { stripPersonalizedCompanyData } from "@/redux/store/slices/companiesSlice";

const STORAGE_KEY_PATTERNS = [
  "__clerk",
  "clerk",
  "token",
  "auth",
  "session",
  "jwt",
];

function clearMatchingStorage(storage: Storage) {
  const keys = Object.keys(storage);

  for (const key of keys) {
    const normalized = key.toLowerCase();
    const shouldClear = STORAGE_KEY_PATTERNS.some((pattern) =>
      normalized.includes(pattern),
    );

    if (shouldClear) {
      storage.removeItem(key);
    }
  }
}

export function cleanupClientLogout(dispatch: AppDispatch) {
  // Reset only authenticated slices, keep public caches (jobs/companies/blogs).
  dispatch(resetAuthState());
  dispatch(stripPersonalizedJobData());
  dispatch(stripPersonalizedCompanyData());

  if (typeof window === "undefined") {
    return;
  }

  try {
    clearMatchingStorage(window.localStorage);
    clearMatchingStorage(window.sessionStorage);
  } catch (error) {
    console.error("Failed to clear browser storage during logout:", error);
  }
}
