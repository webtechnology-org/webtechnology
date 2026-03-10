import './globals.css';
import SupabaseProvider from '@/context/SupabaseProvider';
import { AuthProvider } from '@/context/AuthContext';

export const metadata = {
  title: 'WebTechnology | Soluciones Digitales',
  description: 'Portafolio profesional de Michael Villarreal',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        {/* 1. Primero el de Supabase (es el motor de datos) */}
        <SupabaseProvider>
          {/* 2. Luego el de Auth (depende de Supabase para saber quién eres) */}
          <AuthProvider>
            
            {children} {/* Aquí es donde viven tus páginas /client, /login, etc. */}
            
          </AuthProvider>
        </SupabaseProvider>
      </body>
    </html>
  );
}