export function getEnumKeys<E>(enumObject: Object): E[] {
  return Object
    .values(enumObject)
    .filter(x => !(parseInt(x) >= 0));
}
