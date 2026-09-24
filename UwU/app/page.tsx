'use client';

import { useEffect, useState } from 'react';
import { Heart, ShoppingBag, Plus, Minus, ArrowRight, Check, Menu, X, Pause, Play } from 'lucide-react';
import { useBrandMotion, celebrateAdd } from '@/hooks/use-brand-motion';
import { EncounterSections } from '@/components/encounter-sections';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';

type Product = { id: string; name: string; description: string; price: number; tile?: number; image?: string };
const products: Product[] = [
  { id: 'classic', name: 'Classic', description: 'El brownie de siempre, pero nunca aburrido.', price: 5500, tile: 0 },
  { id: 'chocolate', name: 'Chocolate', description: 'Más intenso, más chocolatoso, más para compartir.', price: 6000, image: '/images/hero.png' },
  { id: 'cookies', name: 'Cookies & Cream', description: 'Para quienes quieran algo diferente.', price: 6700, tile: 1 },
  { id: 'box', name: 'Box para compartir', description: 'A veces es mejor elegir más que un brownie para una juntada.', price: 16000, tile: 2 },
];
const money = (value: number) => '$' + value.toLocaleString('es-AR');

function Instagram({ strokeWidth = 1.6 }: { strokeWidth?: number }) {
  return <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>;
}
function Brand() {
  return <span className="brand"><svg viewBox="0 0 90 45" fill="none" aria-hidden="true"><path d="M42 12 29 3 7 10 5 26 21 36 38 31M48 12 61 3 83 11 84 28 67 36 51 30"/><path d="M44 32c-2-7-13-10-10-17 3-6 9-3 11 1 2-5 9-7 12-2 5 7-7 12-9 19"/></svg><span><b>not</b><span>justbrownie</span></span></span>;
}
function Photo({ tile, image, alt, className = '' }: { tile?: number; image?: string; alt: string; className?: string }) {
  return image ? <img className={'photo ' + className} src={image} alt={alt} loading="lazy" /> : <div role="img" aria-label={alt} className={'photo tile-photo ' + className} style={{ backgroundPosition: `${((tile ?? 0) % 3) * 50}% ${Math.floor((tile ?? 0) / 3) * 50}%` }} />;
}
function Hearts({ className = '' }: { className?: string }) { return <span className={'hearts ' + className} aria-hidden="true"><Heart/><Heart/></span>; }

function ProductCard({ p, onAdd }: { p: Product; onAdd: (p: Product) => void }) { return <article className="product-card"><Photo tile={p.tile} image={p.image} alt={p.name + ' de notjustbrownie'}/><div className="product-info"><h3>{p.name}</h3><p>{p.description}</p><div className="product-bottom"><strong>{money(p.price)}</strong><Button className="pill buy" onClick={event => { onAdd(p); celebrateAdd(event.currentTarget); }}>Comprar</Button></div></div></article>; }

export default function Home() {
  const [motionPaused, setMotionPaused] = useState(false);
  const { enabled: motionEnabled, reduced: reducedMotion } = useBrandMotion(motionPaused);
  const [cart, setCart] = useState<Record<string, number>>({});
  const [ready, setReady] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [catalogOpen, setCatalogOpen] = useState(false);
  const [storyOpen, setStoryOpen] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [active, setActive] = useState('inicio');
  const [notice, setNotice] = useState('');
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    try { const saved = JSON.parse(localStorage.getItem('njb-cart') || '{}'); const valid: Record<string, number> = {}; for (const p of products) if (Number.isInteger(saved[p.id]) && saved[p.id] > 0) valid[p.id] = Math.min(saved[p.id], 99); setCart(valid); } catch { /* Empty cart if stored data is unavailable. */ }
    setReady(true);
    const observer = new IntersectionObserver(entries => { for (const entry of entries) if (entry.isIntersecting) setActive(entry.target.id); }, { rootMargin: '-15% 0px -55% 0px' });
    ['inicio', 'nosotras', 'productos'].forEach(id => { const section = document.getElementById(id); if (section) observer.observe(section); });
    return () => observer.disconnect();
  }, []);
  useEffect(() => { if (ready) { try { localStorage.setItem('njb-cart', JSON.stringify(cart)); } catch { /* The cart still works for this visit. */ } } }, [cart, ready]);
  useEffect(() => { if (!notice) return; const timer = setTimeout(() => setNotice(''), 3000); return () => clearTimeout(timer); }, [notice]);
  const count = Object.values(cart).reduce((sum, n) => sum + n, 0);
  const total = products.reduce((sum, p) => sum + p.price * (cart[p.id] || 0), 0);
  function add(p: Product) { setCart(old => ({ ...old, [p.id]: Math.min((old[p.id] || 0) + 1, 99) })); setCopied(false); setNotice(`${p.name} se sumó a tu carrito`); }
  function change(id: string, delta: number) { setCart(old => { const next = { ...old, [id]: Math.min(99, Math.max(0, (old[id] || 0) + delta)) }; if (!next[id]) delete next[id]; return next; }); setCopied(false); }
  const orderText = '¡Hola! Quiero compartir estos brownies:\n' + products.filter(p => cart[p.id]).map(p => `${cart[p.id]} × ${p.name}: ${money(cart[p.id] * p.price)}`).join('\n') + '\nTotal: ' + money(total);
  async function copyOrder() { try { await navigator.clipboard.writeText(orderText); setCopied(true); } catch { setNotice('No se pudo copiar. Podés seleccionar el resumen de tu pedido.'); } }


  return <div className="site-motion" data-motion={motionEnabled ? 'on' : 'off'}>
    <a className="skip-link" href="#productos">Ir a los brownies</a>
    <header className="header"><div className="header-inner"><a href="#inicio" aria-label="notjustbrownie, inicio"><Brand/></a><nav className={mobileMenu ? 'navigation is-open' : 'navigation'} aria-label="Navegación principal">{[['inicio', 'Inicio'], ['nosotras', 'Nosotras'], ['productos', 'Productos']].map(([id, label]) => <a key={id} href={'#' + id} className={active === id ? 'active' : ''} onClick={() => setMobileMenu(false)}>{label}</a>)}</nav><div className="header-actions">{!reducedMotion && <Button variant="ghost" className="motion-toggle" aria-label={motionPaused ? 'Activar animaciones' : 'Pausar animaciones'} title={motionPaused ? 'Activar animaciones' : 'Pausar animaciones'} aria-pressed={motionPaused} onClick={() => setMotionPaused(!motionPaused)}>{motionPaused ? <Play/> : <Pause/>}</Button>}<Button variant="ghost" className="bag-button" aria-label={`Abrir carrito, ${count} productos`} onClick={() => setCartOpen(true)}><ShoppingBag strokeWidth={1.35}/>{count > 0 && <span key={count} className="cart-count">{count}</span>}</Button><Button variant="ghost" className="menu-button" aria-label={mobileMenu ? 'Cerrar menú' : 'Abrir menú'} aria-expanded={mobileMenu} onClick={() => setMobileMenu(!mobileMenu)}>{mobileMenu ? <X/> : <Menu/>}</Button></div></div></header>
    <main>
      <section id="inicio" className="hero"><div className="hero-inner"><div className="hero-copy"><Hearts className="hero-hearts"/><h1 aria-label="Sabores que marcan emociones en encuentros."><span className="hero-line" aria-hidden="true">{'Sabores que marcan'.split(' ').map(word => <span className="hero-word" key={word}>{word}{' '}</span>)}</span><br/><span className="hero-line" aria-hidden="true">{'emociones en encuentros.'.split(' ').map(word => <span className="hero-word" key={word}>{word}{' '}</span>)}</span></h1><p>No es solo un <strong>brownie.</strong><br/>Es compartir, crear recuerdos y disfrutar juntos.<br/>Buscamos que puedas compartir con quien más quieras.</p><div className="hero-buttons"><a className="pill" href="#productos">Conocé nuestros brownies</a><a className="pill outline" href="#nosotras">Nuestra historia</a></div></div><div className="hero-visual"><div className="hero-shape"/><img src="/images/hero.png" alt="Tres brownies de chocolate apilados con chocolate derretido sobre un plato" className="hero-image" fetchPriority="high"/><div className="love-stamp"><span>hechos con<br/>mucho<br/>cariño<Heart fill="currentColor"/></span></div></div></div></section>
      <section id="nosotras" className="story section-shell"><img src="/images/sharing.png" className="story-photo" alt="Amigas compartiendo brownies, café y una caja rosa en una mesa" loading="lazy"/><div className="story-copy"><p className="eyebrow">Somos not justbrownie</p><h2>Nunca es solo un brownie.</h2><div className="story-body"><p>Un buen brownie lo hacen los momentos compartidos con quienes lo preparan y disfrutan.</p><p>Buscamos ofrecer mucho más que una receta: crear experiencias, encuentros y recuerdos.</p><p className="pink"><strong>Porque nunca es solo un brownie.</strong></p></div><Button className="pill story-button" onClick={() => setStoryOpen(true)}>Conocé nuestra historia</Button><Hearts className="story-hearts"/></div></section>
      <section id="productos" className="products-section"><div className="section-shell"><div className="section-heading"><p className="eyebrow">Nuestros brownies</p><h2>Elegí el sabor de tu encuentro.</h2></div><div className="product-grid">{products.map(p => <ProductCard key={p.id} p={p} onAdd={add}/>)}</div><Button className="pill outline all-products" onClick={() => setCatalogOpen(true)}>Ver todos los productos</Button></div></section>
      <EncounterSections/>
      <section className="social section-shell"><h2 className="eyebrow">Momentos que queremos compartir</h2><div className="social-grid"><Photo tile={2} alt="Caja de brownies para compartir"/><Photo image="/images/hero.png" alt="Brownies bañados en chocolate"/><Photo tile={6} alt="Café y brownies para dos"/><Photo tile={7} alt="Brownie con una bocha de helado"/><Photo tile={8} alt="Delantal rosa de nuestra cocina"/><a className="instagram-card" href="https://www.instagram.com/notjustbrownie/" target="_blank" rel="noreferrer"><Instagram strokeWidth={1.6}/><strong>Seguinos en<br/>Instagram</strong><span>@notjustbrownie</span></a></div></section>
      <section className="final-cta"><div className="cta-inner"><div><h2>¿Listos para compartir un<br/>momento?</h2><p>Elegí tu brownie y hacé que el próximo<br/>momento sea un poquito más dulce.</p></div><div className="cta-action"><svg className="dotted-line" viewBox="0 0 330 70" fill="none" aria-hidden="true"><path d="M5 52C110 51 42-6 39 30S160 71 318 27" stroke="currentColor" strokeWidth="2" strokeDasharray="3 4"/></svg><a href="#productos" className="pill light">Quiero mi brownie</a><Heart className="cta-heart"/></div></div></section>
    </main>
    <footer className="footer section-shell"><a href="#inicio" aria-label="Volver al inicio"><Brand/></a><p>Nunca es solo un brownie.</p></footer>
    <div className={'toast ' + (notice ? 'visible' : '')} role="status" aria-live="polite"><Check/>{notice}<button onClick={() => { setCartOpen(true); setNotice(''); }}>Ver carrito <ArrowRight/></button></div>
    <Sheet open={cartOpen} onOpenChange={setCartOpen}><SheetContent className="cart-panel"><SheetHeader><SheetTitle>Tu próximo encuentro</SheetTitle><SheetDescription>{count ? `${count} ${count === 1 ? 'brownie elegido' : 'brownies elegidos'} con mucho cariño.` : 'Algo rico está por empezar.'}</SheetDescription></SheetHeader>{count === 0 ? <div className="empty-cart"><ShoppingBag/><h3>Tu carrito está esperando algo dulce.</h3><p>Elegí tus favoritos y armá tu próximo encuentro.</p><Button className="pill" onClick={() => { setCartOpen(false); document.getElementById('productos')?.scrollIntoView({ behavior: motionEnabled ? 'smooth' : 'instant' }); }}>Elegir mis brownies</Button></div> : <><div className="cart-items">{products.filter(p => cart[p.id]).map(p => <article className="cart-item" key={p.id}><Photo image={p.image} tile={p.tile} alt={p.name}/><div><h3>{p.name}</h3><p>{money(p.price)}</p><div className="quantity"><Button variant="ghost" aria-label={`Quitar un ${p.name}`} onClick={() => change(p.id, -1)}><Minus/></Button><span>{cart[p.id]}</span><Button variant="ghost" disabled={cart[p.id] >= 99} aria-label={`Sumar un ${p.name}`} onClick={() => change(p.id, 1)}><Plus/></Button></div></div><strong>{money(p.price * cart[p.id])}</strong></article>)}</div><div className="cart-summary"><div><span>Total</span><strong>{money(total)}</strong></div><p>Copiá tu selección y consultanos por Instagram para coordinar tu pedido y la entrega.</p><Button className="pill" onClick={copyOrder}>{copied ? <><Check/> Pedido copiado</> : 'Copiar mi pedido'}</Button><a className="pill outline" href="https://www.instagram.com/notjustbrownie/" target="_blank" rel="noreferrer">Consultar por Instagram <Instagram/></a></div></>}</SheetContent></Sheet>
    <Sheet open={catalogOpen} onOpenChange={setCatalogOpen}><SheetContent className="catalog-panel"><SheetHeader><SheetTitle>Un sabor para cada encuentro.</SheetTitle><SheetDescription>Conocé todos nuestros brownies y elegí tus favoritos.</SheetDescription></SheetHeader><div className="catalog-grid">{products.map(p => <ProductCard key={p.id} p={p} onAdd={add}/>)}</div><Button className="pill" onClick={() => { setCatalogOpen(false); setCartOpen(true); }}>Ver mi carrito {count > 0 && `(${count})`}</Button></SheetContent></Sheet>
    <Sheet open={storyOpen} onOpenChange={setStoryOpen}><SheetContent className="story-panel"><SheetHeader><p className="eyebrow">Somos not justbrownie</p><SheetTitle>Nunca es solo un brownie.</SheetTitle><SheetDescription>Sabores que marcan emociones en encuentros.</SheetDescription></SheetHeader><img src="/images/sharing.png" alt="Compartir un brownie es compartir un momento"/><div className="expanded-story"><p>Un buen brownie lo hacen los momentos compartidos con quienes lo preparan y disfrutan.</p><p>Buscamos ofrecer mucho más que una receta: crear experiencias, encuentros y recuerdos.</p><p>Una tarde con amigas, un momento especial o una tarde para vos. Queremos que puedas compartir con quien más quieras.</p><strong>Porque nunca es solo un brownie.</strong><Button className="pill" onClick={() => { setStoryOpen(false); document.getElementById('productos')?.scrollIntoView({ behavior: motionEnabled ? 'smooth' : 'instant' }); }}>Encontrá tu brownie</Button></div></SheetContent></Sheet>
  </div>;
}
