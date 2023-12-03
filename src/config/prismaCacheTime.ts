export const prisma_cache_time = {
  // ttl means time to live, the time that the cache will be alive, without being updated
  ttl: 0,
  // swr means stale while revalidate, a extra time that the cache will be alive, but will be updated in background
  swr: 60 * 5,
};
