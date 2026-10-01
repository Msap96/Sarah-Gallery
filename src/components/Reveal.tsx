import React, { useLayoutEffect, useRef, useState } from 'react';

interface Props {
  children: React.ReactNode;
  /** Seconds of stagger within a row. */
  delay?: number;
  className?: string;
}

type State = 'visible' | 'hidden' | 'revealed';

/**
 * Fades content up as it scrolls into view — as an enhancement only.
 *
 * The default state is `visible`. The hidden state is applied by script, in a
 * layout effect (before paint, so there is no flash), and only once we know an
 * IntersectionObserver exists to bring it back. If script never runs, or the
 * observer never fires, the content is simply there.
 *
 * This matters more than it looks: driving reveals with motion's `whileInView`
 * left every card in the grid pinned at opacity 0 when animations stalled,
 * which turns the catalogue into a blank page. An effect must never be able to
 * hide the artwork.
 */
export const Reveal: React.FC<Props> = ({ children, delay = 0, className = '' }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<State>('visible');

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReduced =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReduced || typeof IntersectionObserver === 'undefined') return;

    setState('hidden');

    const observer = new IntersectionObserver(
      entries => {
        if (entries.some(entry => entry.isIntersecting)) {
          setState('revealed');
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -8% 0px' }
    );

    observer.observe(el);

    // Safety net: if the observer has not fired by the time this many ms have
    // passed, show the content regardless.
    const failsafe = window.setTimeout(() => {
      setState('revealed');
      observer.disconnect();
    }, 2500);

    return () => {
      observer.disconnect();
      window.clearTimeout(failsafe);
    };
  }, []);

  const motionClass =
    state === 'hidden'
      ? 'opacity-0 translate-y-6'
      : state === 'revealed'
        ? 'opacity-100 translate-y-0 transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]'
        : '';

  return (
    <div
      ref={ref}
      className={`${className} ${motionClass}`}
      style={state === 'revealed' && delay ? { transitionDelay: `${delay}s` } : undefined}
    >
      {children}
    </div>
  );
};
