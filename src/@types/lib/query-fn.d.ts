interface IQueryFn {
   client: QueryClient;
   queryKey: readonly unknown[];
   signal: AbortSignal;
   meta: QueryMeta | undefined;
   pageParam?: unknown;
   direction?: unknown;
}
