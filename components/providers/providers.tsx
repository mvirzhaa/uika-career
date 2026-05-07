// src/components/providers/Providers.tsx
"use client";

import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export default function Providers({ children }: { children: React.ReactNode }) {
  // Menggunakan useState agar QueryClient tidak dibuat ulang setiap kali halaman re-render
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // Data dianggap fresh selama 1 menit
            refetchOnWindowFocus: false, // Jangan fetch ulang otomatis saat pindah tab
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}