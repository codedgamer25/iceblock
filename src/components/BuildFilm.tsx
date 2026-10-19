'use client';

import { Pause, Play } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

import { Reveal } from '@/components/Reveal';
import { SectionLabel } from '@/components/SectionLabel';

/**
 * The film section, and the one scroll-scrubbed moment on the page.
 *
 * The reference behaviour is a GSAP `from()` on the video section: `scale: 0.5`,
 * `start: top bottom`, `end: top center`, `scrub: 1`, `ease: power2.out`. Here it
 * is the same curve with the machinery we already ship — a cached trigger, one
 * `requestAnimationFrame` loop and the Lenis-eased scroll — rather than a second
 * animation library for a single transform.
 *
 * Two details matter:
 *
 * 1. The trigger is measured from the *frame*, not from the scaled stage. Reading
 *    the stage's transformed rect would feed its own scale back into the progress
 *    and the card would finish growing without the reader scrolling.
 * 2. The scale starts at the stage's resting visual position, not at the top of its
 *    layout box. That is what makes the 50% card sit below the hero and rise into
 *    place as it grows instead of starting already half-way through the reveal.
 *
 * The video is a separate concern: it autoplays muted only while the stage is on
 * screen, pauses when it leaves, and can be stopped for good from the header.
 */
export function BuildFilm() {
  const frameRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const manualPause = useRef(false);
  const reducedMotion = useRef(false);
  const [playing, setPlaying] = useState(true);

  const setVideoPlaying = useCallback((next: boolean) => {
    const video = videoRef.current;
    if (!video) return;
    if (next) {
      video.muted = true;
      void video.play().catch(() => {
        /* Autoplay can be refused; the poster remains and the button still works. */
      });
    } else {
      video.pause();
    }
  }, []);

  const toggle = useCallback(() => {
    manualPause.current = playing;
    setVideoPlaying(!playing);
  }, [playing, setVideoPlaying]);

  useEffect(() => {
    const frame = frameRef.current;
    const stage = stageRef.current;
    if (!frame || !stage) return;

    reducedMotion.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion.current) {
      setPlaying(false);
      stage.style.transform = 'none';
    }

    let start = 0;
    let end = 0;
    let target = 1;
    let current = 1;
    let frameRequest = 0;
    let resizeTimer = 0;
    let isMobile = window.matchMedia('(max-width: 767px)').matches;

    const startScale = () => (isMobile ? 0.92 : 0.5);

    const measureTrigger = () => {
      const box = frame.getBoundingClientRect();
      const viewport = window.innerHeight;
      const scale = startScale();
      const height = box.height;
      /* The visual top of the scaled stage at rest. The frame's own top is stable,
         so this cannot feed back into the progress. */
      const restTop = box.top + window.scrollY + ((1 - scale) * height) / 2;
      const startLine = viewport;
      const endLine = viewport * (isMobile ? 0.8 : 0.5);
      start = restTop - startLine;
      end = restTop - endLine;
    };

    const apply = () => {
      stage.style.transform = `scale(${current.toFixed(5)})`;
    };

    const tick = () => {
      frameRequest = 0;
      const delta = target - current;
      if (Math.abs(delta) < 0.0008) {
        current = target;
        apply();
        return;
      }
      /* Exponential catch-up: the same "scrub" lag as the reference, but short
         enough that the card does not feel detached from the wheel. */
      current += delta * 0.18;
      apply();
      frameRequest = window.requestAnimationFrame(tick);
    };

    const update = (snap = false) => {
      if (reducedMotion.current) {
        target = 1;
        current = 1;
        stage.style.transform = 'none';
        return;
      }

      const progress = Math.min(1, Math.max(0, (window.scrollY - start) / Math.max(1, end - start)));
      /* power2.out */
      const eased = 1 - Math.pow(1 - progress, 2);
      target = startScale() + (1 - startScale()) * eased;

      if (snap) {
        current = target;
        apply();
        return;
      }

      if (frameRequest === 0) frameRequest = window.requestAnimationFrame(tick);
    };

    measureTrigger();
    update(true);

    const onScroll = () => {
      update();
    };

    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        isMobile = window.matchMedia('(max-width: 767px)').matches;
        measureTrigger();
        update(true);
      }, 120);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize, { passive: true });

    /* Fonts and images can change the height of the products above the film, which
       moves the frame. Re-measure once those are settled. */
    const layoutObserver = new ResizeObserver(() => {
      measureTrigger();
      update(true);
    });
    layoutObserver.observe(frame);
    const ready = () => {
      measureTrigger();
      update(true);
    };
    document.fonts?.ready.then(ready).catch(() => {});
    window.addEventListener('load', ready);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('load', ready);
      layoutObserver.disconnect();
      window.clearTimeout(resizeTimer);
      if (frameRequest !== 0) window.cancelAnimationFrame(frameRequest);
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    const stage = stageRef.current;
    if (!video || !stage) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        if (entry.isIntersecting && !manualPause.current && !reducedMotion.current) {
          setVideoPlaying(true);
        } else {
          video.pause();
        }
      },
      { threshold: 0.12 },
    );
    observer.observe(stage);

    return () => observer.disconnect();
  }, [setVideoPlaying]);

  return (
    <section
      id="film"
      data-invert
      className="theme-abyss scroll-mt-header relative overflow-x-clip border-y py-v-space"
      style={{ borderColor: 'var(--rule)' }}
    >
      <div className="shell">
        <Reveal className="flex flex-col justify-between gap-7 sm:flex-row sm:items-end sm:gap-10">
          <div>
            <SectionLabel>Machine demonstration</SectionLabel>
            <h2 className="h2 mt-4 max-w-[18ch]">Commercial machines, in motion.</h2>
            <p className="lead mt-5 max-w-[54ch]">
              A demonstration of Koolink commercial ice block machines and solar systems at work in Nigeria.
            </p>
          </div>

          <button
            type="button"
            onClick={toggle}
            className="button secondary shrink-0 self-start sm:self-auto"
            aria-label={playing ? 'Pause demonstration film' : 'Play demonstration film'}
          >
            {playing ? <Pause size={15} /> : <Play size={15} />}
            <span>{playing ? 'Pause film' : 'Play film'}</span>
          </button>
        </Reveal>
      </div>

      <div className="shell mt-10 sm:mt-12">
        <div ref={frameRef} className="film-frame">
          <div
            ref={stageRef}
            className="film-stage relative overflow-hidden rounded-[var(--radius-panel)] border border-[rgba(242,247,250,0.14)] bg-[#041017] shadow-[0_45px_120px_-45px_rgba(0,0,0,0.95),inset_0_1px_0_rgba(255,255,255,0.12)]"
          >
            <video
              ref={videoRef}
              className="h-full w-full object-cover"
              poster="/videos/koolink-cold-film-poster.jpg"
              muted
              loop
              playsInline
              preload="metadata"
              aria-label="Koolink commercial ice block machine demonstration film in operation"
              onPlay={() => setPlaying(true)}
              onPause={() => setPlaying(false)}
            >
              <source src="/videos/koolink-cold-film.mp4" type="video/mp4" />
            </video>

            {/* The frame is part of the picture, not a player chrome. */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  'linear-gradient(180deg, rgba(4,16,23,0.18) 0%, transparent 24%, transparent 72%, rgba(4,16,23,0.5) 100%)',
              }}
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute left-5 top-5 flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.2em] text-[rgba(242,247,250,0.62)] sm:left-7 sm:top-7"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-[rgb(var(--chill))]" />
              Koolink / Machine demonstration
            </div>
            <div
              aria-hidden="true"
              className="pointer-events-none absolute bottom-5 right-5 font-mono text-[9px] uppercase tracking-[0.2em] text-[rgba(242,247,250,0.48)] sm:bottom-7 sm:right-7"
            >
              Factory film
            </div>
            <span
              aria-hidden="true"
              className="pointer-events-none absolute left-3 top-3 h-3 w-3 border-l border-t border-[rgba(242,247,250,0.34)] sm:left-4 sm:top-4"
            />
            <span
              aria-hidden="true"
              className="pointer-events-none absolute right-3 top-3 h-3 w-3 border-r border-t border-[rgba(242,247,250,0.34)] sm:right-4 sm:top-4"
            />
            <span
              aria-hidden="true"
              className="pointer-events-none absolute bottom-3 left-3 h-3 w-3 border-b border-l border-[rgba(242,247,250,0.34)] sm:bottom-4 sm:left-4"
            />
            <span
              aria-hidden="true"
              className="pointer-events-none absolute bottom-3 right-3 h-3 w-3 border-b border-r border-[rgba(242,247,250,0.34)] sm:bottom-4 sm:right-4"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default BuildFilm;
