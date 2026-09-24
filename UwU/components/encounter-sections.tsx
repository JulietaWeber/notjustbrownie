'use client';

import { useState, type ComponentType } from 'react';
import { Coffee, Cake, Heart, HandHeart, Smile } from 'lucide-react';
import { Button } from '@/components/ui/button';

type IconType = ComponentType<{ strokeWidth?: number; className?: string }>;
function Whisk({ strokeWidth = 1.5 }: { strokeWidth?: number }) {
  return <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth={strokeWidth * 1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><ellipse cx="41" cy="22" rx="13" ry="19" transform="rotate(42 41 22)"/><ellipse cx="41" cy="22" rx="6" ry="19" transform="rotate(42 41 22)"/><path d="m29 36-5 6m2 4L13 60a4 4 0 0 1-6-6l13-14Z"/></svg>;
}
const moments = [
  { tile: 3, title: 'Una tarde con amigas', text: 'Un brownie, + compañía, no solo da charla si no recuerdos.', Icon: Coffee },
  { tile: 4, title: 'Un momento especial', text: 'Porque celebrando también importan los pequeños detalles.', Icon: Cake },
  { tile: 5, title: 'Una tarde para vos', text: 'A veces hay que aprender a disfrutarse a uno mismo.', Icon: Heart },
];
const values = [
  { title: 'Hecho para compartir', text: 'Buscamos más en nuestro producto, buscamos recuerdos.', Icon: HandHeart },
  { title: 'Hecho con cariño', text: 'Nuestros ingredientes son de calidad y nos caracteriza nuestra dedicación.', Icon: Whisk },
  { title: 'Hecho para recordar', text: 'Porque algunos sabores nos acompañan para siempre.', Icon: Smile },
];

function MomentSwitch({ tile, title, text, Icon }: { tile: number; title: string; text: string; Icon: IconType }) {
  const [open, setOpen] = useState(false);
  return <article className="moment encounter-card">
    <Button variant="ghost" className="encounter-switch moment-switch" aria-label={`${title}: ${open ? 'volver al ícono' : 'ver foto y detalle'}`} aria-pressed={open} onClick={() => setOpen(value => !value)}>
      <span className="encounter-face encounter-front" aria-hidden={open}>
        <span className="encounter-disc"><Icon strokeWidth={1.35}/></span>
        <span className="encounter-label">{title}</span>
      </span>
      <span className="encounter-face encounter-back" aria-hidden={!open}>
        <span className="encounter-photo-wrap"><span className="photo tile-photo" role="img" aria-label={title} style={{ backgroundPosition: `${(tile % 3) * 50}% ${Math.floor(tile / 3) * 50}%` }}/><span className="moment-icon"><Icon strokeWidth={1.5}/></span></span>
        <span className="encounter-label">{title}</span>
        <span className="encounter-description">{text}</span>
      </span>
    </Button>
  </article>;
}
function ValueSwitch({ title, text, Icon }: { title: string; text: string; Icon: IconType }) {
  const [open, setOpen] = useState(true);
  return <div className="encounter-card">
    <Button variant="ghost" className="encounter-switch value-switch" aria-label={`${title}: ${open ? 'ver descripción' : 'ver ícono destacado'}`} aria-pressed={open} onClick={() => setOpen(value => !value)}>
      <span className="encounter-face encounter-front" aria-hidden={open}>
        <span className="encounter-disc"><Icon strokeWidth={1.5}/></span>
        <span className="value-copy"><span className="encounter-label">{title}</span><span className="encounter-description">{text}</span></span>
      </span>
      <span className="encounter-face encounter-back" aria-hidden={!open}>
        <span className="encounter-disc"><Icon strokeWidth={1.5}/></span>
        <span className="encounter-label">{title}</span>
      </span>
    </Button>
  </div>;
}
export function EncounterSections() {
  return <>
    <section className="moments section-shell interactive-moments" aria-labelledby="moments-title">
      <div className="section-heading"><p className="eyebrow">Momentos que importan</p><h2 id="moments-title">¿Con quién lo compartirías?</h2></div>
      <div className="encounters-grid">{moments.map(moment => <MomentSwitch key={moment.title} {...moment}/>)}</div>
    </section>
    <section className="values interactive-values" aria-labelledby="values-title"><div className="section-shell">
      <h2 id="values-title">¿Por qué elegir not just brownie?</h2>
      <div className="encounters-grid">{values.map(value => <ValueSwitch key={value.title} {...value}/>)}</div>
    </div></section>
  </>;
}
