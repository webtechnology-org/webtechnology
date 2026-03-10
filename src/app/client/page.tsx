'use client';

import { useSupabase } from '@/context/SupabaseProvider';
import { Globe, Code2, Rocket, ExternalLink } from 'lucide-react';

export default function PublicPage() {
  const { profiles } = useSupabase(); // Usamos los perfiles que ya cargamos globalmente

  return (
    <main style={{ background: '#0f172a', color: '#f8fafc', minHeight: '100vh' }}>
      {/* Hero Section */}
      <section style={{ padding: '5rem 2rem', textAlign: 'center', background: 'linear-gradient(to bottom, #1e293b, #0f172a)' }}>
        <h1 style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>
          Web<span style={{ color: '#3b82f6' }}>Technology</span>
        </h1>
        <p style={{ fontSize: '1.2rem', color: '#94a3b8', maxWidth: '700px', margin: '0 auto' }}>
          Soluciones tecnológicas de alto impacto para pequeñas empresas. Construimos el futuro, un repositorio a la vez.
        </p>
        <p style={{ fontSize: '1.2rem', color: '#94a3b8', maxWidth: '700px', margin: '0 auto' }}>
          Hola chiquitos, estoy haciendo mi primera pagina web donde voy a hablar de hacer consultorias y creaciones de paginas web junto con precios y asi...
        </p>
      </section>

      {/* Grid de Servicios / Perfiles Públicos */}
      <section style={{ padding: '4rem 2rem', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          {profiles.map((profile) => (
            <div key={profile.id} className="glass-panel" style={{ padding: '2rem', border: '1px solid #334155' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{ width: '50px', height: '50px', background: '#3b82f6', borderRadius: '50%' }}></div>
                <div>
                  <h3 style={{ margin: 0 }}>{profile.full_name || 'Especialista'}</h3>
                  <small style={{ color: '#3b82f6' }}>{profile.role?.toUpperCase()}</small>
                </div>
              </div>
              <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
                Expertos en desarrollo web escalable y automatización de procesos.
              </p>
              <button className="btn-primary" style={{ marginTop: '1rem', width: '100%' }}>
                Ver Portafolio
              </button>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}