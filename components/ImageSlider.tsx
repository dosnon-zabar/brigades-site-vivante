"use client";

import { useState, useCallback, useEffect, useRef } from "react";

type Props = {
  images: string[];
  alt: string;
};

export default function ImageSlider({ images, alt }: Props) {
  const [current, setCurrent] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);

  const goTo = useCallback((idx: number) => {
    setCurrent(idx);
    trackRef.current?.scrollTo({ left: idx * trackRef.current.clientWidth, behavior: "smooth" });
  }, []);

  const prev = useCallback(() => goTo((current - 1 + images.length) % images.length), [current, images.length, goTo]);
  const next = useCallback(() => goTo((current + 1) % images.length), [current, images.length, goTo]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [prev, next]);

  // Sync current index when user scrolls manually (touch/trackpad)
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    let timer: ReturnType<typeof setTimeout>;
    function onScroll() {
      clearTimeout(timer);
      timer = setTimeout(() => {
        if (!el) return;
        const idx = Math.round(el.scrollLeft / el.clientWidth);
        setCurrent(idx);
      }, 100);
    }
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => { el.removeEventListener("scroll", onScroll); clearTimeout(timer); };
  }, []);

  if (images.length === 0) return null;

  if (images.length === 1) {
    return (
      <div className="relative aspect-[16/9] rounded-xl overflow-hidden mb-8">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={images[0]} alt={alt} className="w-full h-full object-cover" />
      </div>
    );
  }

  return (
    <div className="relative rounded-xl overflow-hidden mb-8 group">
      {/* Track */}
      <div
        ref={trackRef}
        className="flex overflow-x-hidden snap-x snap-mandatory scrollbar-hide"
        style={{ scrollbarWidth: "none" }}
      >
        {images.map((src, i) => (
          <div key={i} className="w-full flex-shrink-0 snap-center aspect-[16/9]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt={`${alt} — ${i + 1}/${images.length}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>

      {/* Flèches */}
      <button
        type="button"
        onClick={prev}
        className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm shadow-lg flex items-center justify-center text-brun hover:text-vert-eau opacity-0 group-hover:opacity-100 transition-opacity"
        aria-label="Image précédente"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        type="button"
        onClick={next}
        className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm shadow-lg flex items-center justify-center text-brun hover:text-vert-eau opacity-0 group-hover:opacity-100 transition-opacity"
        aria-label="Image suivante"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Dots */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
        {images.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => goTo(i)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${i === current ? "bg-white scale-125" : "bg-white/40"}`}
            aria-label={`Image ${i + 1}`}
          />
        ))}
      </div>

      {/* Counter */}
      <div className="absolute top-3 right-3 bg-black/40 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">
        {current + 1} / {images.length}
      </div>
    </div>
  );
}
