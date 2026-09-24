import type { Metadata } from 'next';
import { Roboto } from 'next/font/google';
import './globals.css';
const roboto = Roboto({ variable: '--font-brand', subsets: ['latin'], display: 'swap' });
export const metadata: Metadata = {
  title: 'notjustbrownie | Nunca es solo un brownie',
  description: 'Brownies hechos con mucho cariño. Elegí el sabor de tu encuentro: Classic, Chocolate, Cookies & Cream y Box para compartir.',
  icons: { icon: '/favicon.svg' },
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="es-AR"><body className={roboto.variable}>{children}</body></html>;
}
