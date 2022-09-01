/** Try not to use this method. */
import {LocalStorageKeys} from "../enums/storage-keys";

export function getItemLS<T = string>(key: LocalStorageKeys): T | null {
  return localStorage.getItem(key) as unknown as T;
}

export function setItemLS(key: LocalStorageKeys, value: string): void {
  localStorage.setItem(key, value);
}
