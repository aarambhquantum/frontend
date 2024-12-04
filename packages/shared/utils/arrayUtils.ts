export const isNonEmptyArray = <T>(arr: T[]): boolean => {
  if (arr && arr?.length > 0) return true;
  return false;
}