export function getPagenation(length: number): number[] {
  if (length <= 10)
    return [10];
  else if (length <= 25)
    return [10, 25];
  else if (length <= 50)
    return [10, 25, 50];
  else if (length <= 100)
    return [10, 25, 50, 100];
  else (length > 100)
  return [10, 25, 50, 100, length];
}