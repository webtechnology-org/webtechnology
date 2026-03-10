'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';

// --- 1. DEFINICIÓN DE TIPOS ---
export type Profile = {
  id: string;
  full_name: string | null;
  username: string | null;
  avatar_url: string | null;
  role: 'admin' | 'user' | 'mesero' | 'cajero'; 
  updated_at: string;
};

// Agregamos las funciones de consulta al tipo del Contexto
type SupabaseContextType = {
  supabase: SupabaseClient;
  profiles: Profile[];
  loading: boolean;
  fetchProfiles: () => Promise<void>;
  updateProfile: (id: string, updates: Partial<Profile>) => Promise<void>;
  // --- NUEVAS FUNCIONES DE CONSULTA ---
  getProfileById: (id: string) => Promise<Profile | null>;
  getProfileRole: (id: string) => Promise<string>;
};

const Context = createContext<SupabaseContextType | undefined>(undefined);

// --- 2. EL PROVEEDOR ---
export default function SupabaseProvider({ children }: { children: React.ReactNode }) {
  const [supabase] = useState(() => 
    createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  );

  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  // --- 3. SECCIÓN: LÓGICA DE LECTURA (FETCH) ---
  const fetchProfiles = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) throw error;
      if (data) setProfiles(data as Profile[]);
    } catch (error) {
      console.error('Error al cargar perfiles:', error);
    }
  }, [supabase]);

  // --- 4. SECCIÓN: CONSULTAS ESPECÍFICAS (VARIABLES GLOBALES) ---
  // Estas funciones reemplazan el tener que escribir el "await supabase.from..." en cada página.

  // Consulta 1: Obtener un perfil completo por ID
  const getProfileById = useCallback(async (id: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error(`Error buscando perfil ${id}:`, error.message);
      return null;
    }
    return data as Profile;
  }, [supabase]);

  // Consulta 2: Obtener solo el rol de un usuario (Útil para seguridad)
  const getProfileRole = useCallback(async (id: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', id)
      .single();

    if (error) return 'user'; // Rol por defecto si hay error
    return data?.role || 'user';
  }, [supabase]);

  // --- 5. SECCIÓN: ESCRITURA ---
  const updateProfile = async (id: string, updates: Partial<Profile>) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
      throw error;
    }
  };

  // --- 6. SECCIÓN: CICLO DE VIDA Y REALTIME ---
  useEffect(() => {
    let isMounted = true;
    const init = async () => {
      if (isMounted) setLoading(true);
      await fetchProfiles();
      if (isMounted) setLoading(false);
    };
    init();

    const channel = supabase
      .channel('realtime-profiles')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, () => {
        fetchProfiles();
      })
      .subscribe();

    return () => {
      isMounted = false;
      supabase.removeChannel(channel);
    };
  }, [supabase, fetchProfiles]);

  // --- 7. EXPORTACIÓN DE DATOS ---
  return (
    <Context.Provider value={{ 
      supabase, 
      profiles, 
      loading, 
      fetchProfiles, 
      updateProfile,
      getProfileById,   // Ahora disponible en toda la app
      getProfileRole    // Ahora disponible en toda la app
    }}>
      {children}
    </Context.Provider>
  );
}

export const useSupabase = () => {
  const context = useContext(Context);
  if (context === undefined) {
    throw new Error('useSupabase debe ser usado dentro de SupabaseProvider');
  }
  return context;
};