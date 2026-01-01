import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ExamplePage } from '@/pages/example';
import { queryClient } from '@/shared/api/query-client';

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ExamplePage />
      {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
}

export default App;
