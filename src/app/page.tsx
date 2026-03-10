import { redirect } from 'next/navigation';

export default function RootPage() {
  // Como ingeniero, redirigimos la raíz a nuestra vista principal pública
  redirect('/client');
}