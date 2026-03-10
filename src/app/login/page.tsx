'use client';

import { useState } from 'react';
import { useSupabase } from '@/context/SupabaseProvider';
import { useRouter } from 'next/navigation';
import { Lock, Mail, Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const { supabase } = useSupabase();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    
    if (error) {
      alert("Acceso denegado: Credenciales de administrador incorrectas.");
      setLoading(false);
    } else {
      router.push('/admin'); // Solo el admin va aquí
    }
  };

  return (
    <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#020617' }}>
      <div style={{ width: '100%', maxWidth: '400px', padding: '2rem' }}>
        <Link href="/client" style={{ color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem', textDecoration: 'none' }}>
          <ArrowLeft size={16} /> Volver al sitio público
        </Link>
        
        <div className="glass-panel" style={{ padding: '2.5rem' }}>
          <h2 style={{ marginBottom: '2rem', textAlign: 'center' }}>Admin Access</h2>
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            <input 
              type="email" 
              placeholder="Admin Email" 
              onChange={(e) => setEmail(e.target.value)}
              style={{ padding: '0.8rem', borderRadius: '6px', background: '#1e293b', border: '1px solid #334155', color: 'white' }}
            />
            <input 
              type="password" 
              placeholder="Password" 
              onChange={(e) => setPassword(e.target.value)}
              style={{ padding: '0.8rem', borderRadius: '6px', background: '#1e293b', border: '1px solid #334155', color: 'white' }}
            />
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? <Loader2 className="spin" /> : 'Entrar al Sistema'}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}