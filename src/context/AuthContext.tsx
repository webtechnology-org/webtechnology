'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useSupabase } from './SupabaseProvider'; // Importamos tu motor de datos
import type { User } from '@supabase/supabase-js';
import type { Profile } from './SupabaseProvider'; // Importamos el tipo que definimos antes

// --- 1. DEFINICIÓN DEL TIPO DE CONTEXTO ---
type AuthContextType = {
  user: User | null;           // Datos de autenticación básica (email, id)
  profile: Profile | null;     // Datos de tu tabla 'profiles' (rol, nombre, etc.)
  loading: boolean;            // Para evitar que la app parpadee mientras carga
  signOut: () => Promise<void>; // Función para cerrar sesión desde cualquier lado
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// --- 2. EL PROVEEDOR DE AUTENTICACIÓN ---
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { supabase } = useSupabase(); // Usamos la conexión global
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  // Función para cerrar la sesión
  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  };

  useEffect(() => {
    // A. Función para obtener el perfil de la base de datos
    const fetchProfile = async (userId: string) => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (!error && data) {
        setProfile(data as Profile);
      }
    };

    // B. Sincronización Inicial
    const initializeAuth = async () => {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        setUser(session.user);
        await fetchProfile(session.user.id);
      }
      setLoading(false);
    };

    initializeAuth();

    // C. Escuchar cambios de estado (Login / Logout)
    // Esto es vital: si te deslogueas en una pestaña, se cierra en todas.
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUser(session.user);
        await fetchProfile(session.user.id);
      } else {
        setUser(null);
        setProfile(null);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  return (
    <AuthContext.Provider value={{ user, profile, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

// --- 3. EL HOOK PARA USARLO EN LAS PÁGINAS ---
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};