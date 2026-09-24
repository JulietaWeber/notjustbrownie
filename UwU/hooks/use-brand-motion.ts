'use client';

import { useEffect, useState } from 'react';

const ease = 'cubic-bezier(0.16, 1, 0.3, 1)';

/** Visible HTML is the fallback. Motion never gates access to content. */
export function useBrandMotion(paused: boolean) {
  const [reduced, setReduced] = useState(true);
  useEffect(() => {
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  const enabled = !paused && !reduced;
  useEffect(() => {
    if (!enabled) return;
    const animations = new Set<Animation>();
    const cleanups: (() => void)[] = [];
    const seen = new WeakSet<Element>();
    const animate = (element: Element, frames: Keyframe[], delay = 0, duration = 760) => {
      if (typeof element.animate !== 'function') return;
      const animation = element.animate(frames, { duration, delay, easing: ease, fill: 'backwards' });
      animations.add(animation);
      animation.finished.then(() => animations.delete(animation), () => animations.delete(animation));
    };
    const enter = (element: Element) => {
      if (seen.has(element)) return;
      seen.add(element);
      const index = Array.from(element.parentElement?.children || []).indexOf(element);
      const delay = Math.min(Math.max(index, 0) * 85, 340);
      if (element.matches('.story-photo')) {
        animate(element, [{ clipPath: 'inset(0 100% 0 0 round 36px)', transform: 'scale(1.05)' }, { clipPath: 'inset(0 0% 0 0 round 36px)', transform: 'scale(1)' }], 0, 950);
      } else if (element.matches('.value-icon')) {
        animate(element, [{ transform: 'scale(.65) rotate(-22deg)', opacity: .25 }, { transform: 'scale(1.06) rotate(3deg)', opacity: 1, offset: .7 }, { transform: 'scale(1) rotate(0deg)', opacity: 1 }], delay);
      } else if (element.matches('.social-grid > *')) {
        animate(element, [{ transform: `translateY(40px) rotate(${index % 2 ? 7 : -7}deg)`, opacity: .2 }, { transform: 'translateY(0) rotate(0deg)', opacity: 1 }], delay);
      } else if (element.matches('.product-card')) {
        animate(element, [{ transform: 'perspective(900px) translateY(55px) rotateX(12deg)', opacity: .15 }, { transform: 'perspective(900px) translateY(0) rotateX(0)', opacity: 1 }], delay);
      } else if (element.matches('.moment-image')) {
        animate(element, [{ clipPath: 'inset(0 0 100% 0 round 28px)' }, { clipPath: 'inset(0 0 0% 0 round 28px)' }], delay, 850);
      } else {
        animate(element, [{ opacity: .2, transform: 'translateY(26px)' }, { opacity: 1, transform: 'translateY(0)' }], 0, 650);
      }
    };
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        entry.target.toggleAttribute('data-in-view', entry.isIntersecting);
        if (entry.isIntersecting && entry.target.hasAttribute('data-reveal')) enter(entry.target);
      }
    }, { threshold: .12 });
    document.querySelectorAll('main section, .footer, .story-photo, .story-copy, .section-heading, .product-grid .product-card, .moment-image, .value-icon, .social-grid > *, .cta-inner').forEach(element => {
      if (!element.matches('section, .footer')) element.setAttribute('data-reveal', '');
      observer.observe(element);
    });
    // The brownie arrives on the table; the words and affection seal follow.
    const hero = document.querySelector('.hero');
    if (hero && hero.getBoundingClientRect().bottom > 0) {
      document.querySelectorAll('.hero-word').forEach((word, index) => animate(word, [{ transform: 'translateY(105%) rotate(4deg)', opacity: 0 }, { transform: 'translateY(0) rotate(0)', opacity: 1 }], 60 + index * 55, 740));
      const image = document.querySelector('.hero-image');
      if (image) animate(image, [{ transform: 'translate(55px, 65px) rotate(7deg) scale(.88)', opacity: 0 }, { transform: 'translate(0, 0) rotate(0) scale(1)', opacity: 1 }], 70, 1050);
      const seal = document.querySelector('.love-stamp');
      if (seal) animate(seal, [{ transform: 'rotate(-38deg) scale(.15)', opacity: 0 }, { transform: 'rotate(-8deg) scale(1.1)', opacity: 1, offset: .7 }, { transform: 'rotate(-12deg) scale(1)', opacity: 1 }], 600, 720);
      document.querySelectorAll('.hero-copy > p, .hero-buttons').forEach((el, index) => animate(el, [{ opacity: 0, transform: 'translateY(18px)' }, { opacity: 1, transform: 'translateY(0)' }], 420 + index * 110));
    }
    const visibility = () => {
      document.documentElement.toggleAttribute('data-motion-hidden', document.hidden);
      for (const animation of animations) document.hidden ? animation.pause() : animation.play();
    };
    visibility();
    document.addEventListener('visibilitychange', visibility);
    const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
    const main = document.querySelector('main');
    let frame = 0;
    let currentCard: HTMLElement | null = null;
    const resetCard = () => { currentCard?.style.removeProperty('--tilt-x'); currentCard?.style.removeProperty('--tilt-y'); currentCard = null; };
    const pointer = (event: PointerEvent) => {
      if (!finePointer.matches) return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const target = event.target instanceof Element ? event.target.closest<HTMLElement>('.product-card') : null;
        if (target !== currentCard) resetCard();
        if (target) {
          currentCard = target;
          const rect = target.getBoundingClientRect();
          target.style.setProperty('--tilt-x', `${((event.clientY - rect.top) / rect.height - .5) * -9}deg`);
          target.style.setProperty('--tilt-y', `${((event.clientX - rect.left) / rect.width - .5) * 9}deg`);
        }
      });
    };
    const leave = () => { cancelAnimationFrame(frame); resetCard(); };
    main?.addEventListener('pointermove', pointer);
    main?.addEventListener('pointerleave', leave);
    cleanups.push(() => { main?.removeEventListener('pointermove', pointer); main?.removeEventListener('pointerleave', leave); leave(); });
    return () => {
      observer.disconnect();
      animations.forEach(animation => animation.cancel());
      document.removeEventListener('visibilitychange', visibility);
      document.documentElement.removeAttribute('data-motion-hidden');
      document.querySelectorAll('[data-in-view], [data-reveal]').forEach(element => { element.removeAttribute('data-in-view'); element.removeAttribute('data-reveal'); });
      cleanups.forEach(cleanup => cleanup());
    };
  }, [enabled]);
  useEffect(() => {
    if (!enabled) {
      document.querySelectorAll('.motion-particle').forEach(particle => particle.remove());
      document.querySelectorAll('[data-cart-feedback]').forEach(element => element.getAnimations().forEach(animation => animation.cancel()));
    }
  }, [enabled]);
  return { enabled, reduced };
}

export function celebrateAdd(button: HTMLElement) {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches || !document.querySelector('[data-motion="on"]')) return;
  const bag = document.querySelector<HTMLElement>('.bag-button');
  if (!bag) return;
  const start = button.getBoundingClientRect();
  const end = bag.getBoundingClientRect();
  const x = start.left + start.width / 2;
  const y = start.top + start.height / 2;
  const dx = end.left + end.width / 2 - x;
  const dy = end.top + end.height / 2 - y;
  // Bound repeated taps; feedback never queues or delays a purchase.
  document.querySelectorAll('.motion-particle').forEach(particle => particle.remove());
  for (let i = 0; i < 7; i++) {
    const particle = document.createElement('span');
    particle.className = 'motion-particle';
    particle.setAttribute('aria-hidden', 'true');
    particle.style.left = `${x}px`;
    particle.style.top = `${y}px`;
    particle.innerHTML = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z"/></svg>';
    document.body.appendChild(particle);
    const angle = (i / 6) * Math.PI * 2;
    const travel = particle.animate(i === 0 ? [
      { transform: 'translate(-50%, -50%) scale(.4)', opacity: 1 },
      { transform: `translate(${dx * .4}px, ${Math.min(dy * .65, -90)}px) scale(1.15) rotate(-20deg)`, opacity: 1, offset: .45 },
      { transform: `translate(${dx}px, ${dy}px) scale(.3) rotate(10deg)`, opacity: 0 }
    ] : [
      { transform: 'translate(-50%, -50%) scale(.25)', opacity: 1 },
      { transform: `translate(${Math.cos(angle) * 60}px, ${Math.sin(angle) * 48 - 25}px) scale(${.5 + i * .06}) rotate(${i * 23}deg)`, opacity: 1, offset: .45 },
      { transform: `translate(${Math.cos(angle) * 85}px, ${Math.sin(angle) * 60 - 60}px) scale(.1) rotate(${i * 35}deg)`, opacity: 0 }
    ], { duration: i === 0 ? 780 : 580, easing: 'cubic-bezier(.2,.7,.3,1)' });
    travel.finished.then(() => particle.remove(), () => particle.remove());
  }
  bag.getAnimations().forEach(animation => animation.cancel());
  bag.setAttribute('data-cart-feedback', '');
  bag.animate([{ transform: 'rotate(0) scale(1)' }, { transform: 'rotate(-12deg) scale(1.22)', offset: .4 }, { transform: 'rotate(9deg) scale(1.08)', offset: .65 }, { transform: 'rotate(0) scale(1)' }], { duration: 550, delay: 420, easing: ease });
}
