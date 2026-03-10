import { supabase } from '@/lib/supabaseClient';

export default async function HomePage() {
  // Consultamos la tabla profiles
  const { data: perfiles, error } = await supabase
    .from('profiles')
    .select('*')
    .order('updated_at', { ascending: false });

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Navbar Simple */}
      <nav className="bg-white border-b px-8 py-4 flex justify-between items-center shadow-sm">
        <h1 className="text-xl font-bold tracking-tight text-blue-600">
          Web<span className="text-gray-800">Technology</span>
        </h1>
        <div className="text-sm font-medium text-gray-500">Panel Administrativo</div>
      </nav>

      <main className="max-w-5xl mx-auto p-8">
        <header className="mb-10">
          <h2 className="text-3xl font-extrabold text-gray-900">Perfiles de Usuario</h2>
          <p className="text-gray-500 mt-2">Gestiona y visualiza los miembros registrados en el sistema.</p>
        </header>

        {error ? (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 text-red-700">
            Error al conectar con Supabase: {error.message}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {perfiles && perfiles.length > 0 ? (
              perfiles.map((perfil) => (
                <div key={perfil.id} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center space-x-4">
                    <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                      {perfil.full_name?.charAt(0) || 'U'}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{perfil.full_name || 'Usuario Sin Nombre'}</h3>
                      <p className="text-sm text-gray-500">{perfil.email || 'Sin correo'}</p>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                    <span className="text-xs font-mono text-gray-400">ID: {perfil.id.slice(0, 8)}...</span>
                    <button className="text-xs font-semibold text-blue-600 hover:underline">Ver detalles</button>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full py-20 text-center bg-white rounded-xl border-2 border-dashed border-gray-200">
                <p className="text-gray-400">No hay perfiles registrados todavía.</p>
                <p className="text-sm text-gray-400">Agrega una fila manualmente en Supabase para ver el cambio.</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}