'use client';
import { useCallback, useEffect, useState } from 'react';
import { supabase } from './supabase';

export function useOrder(token) {
  const [order, setOrder] = useState(undefined);
  const load = useCallback(async () => {
    const { data } = await supabase.rpc('get_order', { t: token });
    setOrder(data || null);
  }, [token]);
  useEffect(() => { load(); }, [load]);
  return [order, load];
}
