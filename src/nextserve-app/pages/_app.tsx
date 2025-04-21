import '../styles/globals.css';
import type { AppProps } from 'next/app';
import dynamic from 'next/dynamic';
import { AuthProvider } from '@/context/AuthContext'; // ✅ make sure this path is correct

import 'leaflet/dist/leaflet.css';

const Navbar = dynamic(() => import('../components/Navbar'), { ssr: false });

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <Navbar />
      <Component {...pageProps} />
    </AuthProvider>
  );
}
