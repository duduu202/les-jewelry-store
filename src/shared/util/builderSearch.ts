export function buildSearchFilter<T>(search: Partial<T> | undefined): any {
  const searchProperties = Object.keys(search).map(key => ({
    [key]: { contains: search[key], mode: 'insensitive' },
  }));
  const result = searchProperties.reduce((acc, item) => {
    const key = Object.keys(item)[0];
    acc[key] = item[key];
    return acc;
  }, {});

  return result;
}
