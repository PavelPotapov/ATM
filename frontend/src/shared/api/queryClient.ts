/**
 * @file: queryClient.ts
 * @description: TanStack Query client
 * @dependencies: @tanstack/react-query
 * @created: 2025-01-XX
 */

import { QueryCache, MutationCache, QueryClient } from '@tanstack/react-query';

const queryCache = new QueryCache({
  onError: (error) => {
    console.error('Query Error:', error);
  },
});

const mutationCache = new MutationCache({
  onError: (error) => {
    console.error('Mutation Error:', error);
  },
});

export const queryClient = new QueryClient({
  queryCache,
  mutationCache,
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
    mutations: {
      retry: false,
    },
  },
});

