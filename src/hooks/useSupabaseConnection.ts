import { useEffect, useState } from 'react';
import { testDatabaseConnection } from '@/lib/supabase';

interface ConnectionStatus {
  connected: boolean;
  error?: string;
  loading: boolean;
}

export function useSupabaseConnection() {
  const [status, setStatus] = useState<ConnectionStatus>({
    connected: false,
    loading: true,
  });

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const result = await testDatabaseConnection();
        setStatus({
          connected: result.success,
          error: result.error,
          loading: false,
        });

        if (!result.success) {
          console.error('❌ Supabase connection failed:', result.error);
        }
      } catch (err) {
        setStatus({
          connected: false,
          error: String(err),
          loading: false,
        });
      }
    };

    checkConnection();
  }, []);

  return status;
}
