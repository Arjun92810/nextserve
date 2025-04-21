import '../styles/globals.css';
import type { AppProps } from 'next/app';
import dynamic from 'next/dynamic';
import { AuthProvider } from '../../contexts/AuthContext'; // Using relative path

import 'leaflet/dist/leaflet.css';

const Navbar = dynamic(() => import('../../components/Navbar'), { ssr: false }); // Using relative path

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <Navbar />
      <Component {...pageProps} />
    </AuthProvider>
  );
}
