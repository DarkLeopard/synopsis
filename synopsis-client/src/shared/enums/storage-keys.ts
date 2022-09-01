export enum StorageKeys {
  Pages = 'pages'
}

export type StorageKeysType<T> = {
  [key in StorageKeys]: T;
}

export enum LocalStorageKeys {
  Language = 'language',
}
