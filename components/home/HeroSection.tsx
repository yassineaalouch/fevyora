"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, ChevronLeft, ChevronRight, Heart } from "lucide-react";
import { heroSlides } from "@/lib/data";

export function HeroSection() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const slide = heroSlides[index];

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (media.matches || paused || heroSlides.length < 2) return;

    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % heroSlides.length);
    }, 7000);

    return () => window.clearInterval(timer);
  }, [paused, index]);

  const go = (direction: -1 | 1) => {
    setIndex((current) => (current + direction + heroSlides.length) % heroSlides.length);
  };

  return (
    <section
      className="bg-cream"
      aria-roledescription="carousel"
      aria-label="Collection FEVYORA"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="pt-2 lg:hidden">
        <div className="relative min-h-[520px] overflow-hidden">
          <HeroImages mobile />
          <div className="absolute inset-0 bg-gradient-to-r from-ink/55 via-ink/20 to-transparent" />
          <div className="relative flex min-h-[520px] max-w-[16rem] flex-col justify-end p-6 text-ivory">
            <h1 className="font-serif text-[2.6rem] leading-[0.92] font-medium">
              <span className="block">{slide.title[0]}</span>
              <span className="mt-1 flex items-end gap-2">
                {slide.title[1]}
                <span className="mb-1 font-script text-4xl font-normal">
                  {slide.script}
                  <Heart className="mb-1 ml-1 inline h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
                </span>
              </span>
            </h1>
            <p className="mt-3 text-sm leading-relaxed whitespace-pre-line text-ivory/90">{slide.description}</p>
            <Link
              href={slide.href}
              className="mt-5 inline-flex w-fit items-center gap-2 rounded-full bg-burgundy px-4 py-2.5 text-sm text-ivory"
            >
              {slide.cta}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>

      <div className="relative hidden h-[min(50.5vw,calc(100svh-2.5rem))] -mt-[var(--nav-height)] lg:block">
        <HeroImages />
        <div className="relative mx-auto flex h-full w-full max-w-[1360px] items-center px-8 pt-[var(--nav-height)] xl:px-14">
          <div className="w-[min(100%,30rem)]">
            <HeroCopy />
          </div>
        </div>
        <HeroControls onPrev={() => go(-1)} onNext={() => go(1)} index={index} />
      </div>
    </section>
  );

  function HeroCopy() {
    return (
      <div key={slide.id} className="animate-rise">
        <p className="flex items-center gap-4 text-[10px] tracking-[0.42em] text-ink uppercase sm:text-[11px]">
          {slide.eyebrow}
          <span className="h-px w-14 bg-ink/40 sm:w-20" aria-hidden="true" />
        </p>
        <h1 className="mt-3 font-serif text-[2.85rem] leading-[0.9] font-medium tracking-[-0.015em] text-ink sm:text-[3.4rem] lg:mt-4 lg:text-[3.55rem] xl:text-[4.15rem]">
          <span className="block">{slide.title[0]}</span>
          <span className="mt-1 flex flex-wrap items-end gap-x-3 gap-y-1 lg:gap-x-4">
            <span>{slide.title[1]}</span>
            <span className="mb-0.5 inline-flex items-end font-script text-[2.15rem] leading-none font-normal text-ink sm:text-[2.6rem] lg:mb-1 lg:text-[2.7rem] xl:text-[3.05rem]">
              {slide.script}
              <Heart
                className="mb-1 ml-1.5 h-[0.42em] w-[0.42em]"
                strokeWidth={1.5}
                aria-hidden="true"
              />
            </span>
          </span>
        </h1>
        <p className="mt-4 max-w-[16.5rem] text-[13.5px] leading-relaxed whitespace-pre-line text-muted lg:mt-5 lg:text-sm">
          {slide.description}
        </p>
        <Link
          href={slide.href}
          className="mt-5 inline-flex items-center gap-2.5 rounded-full bg-burgundy px-5 py-3 text-[13.5px] text-ivory transition hover:bg-wine lg:mt-6"
        >
          {slide.cta}
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    );
  }

  function HeroImages({ mobile = false }: { mobile?: boolean }) {
    return heroSlides.map((item, itemIndex) => {
      const active = itemIndex === index;
      return (
        <Image
          key={`${item.id}-${mobile ? "m" : "d"}`}
          src={mobile ? item.mobileImage : item.image}
          alt={active ? item.imageAlt : ""}
          fill
          priority={itemIndex === 0}
          sizes={
            mobile
              ? "(max-width: 1023px) 100vw, 1px"
              : "(min-width: 1024px) 100vw, 1px"
          }
          className={`object-cover transition-opacity duration-700 ${active ? "opacity-100" : "opacity-0"}`}
          style={{ objectPosition: mobile ? item.mobilePosition : item.position }}
          aria-hidden={!active}
        />
      );
    });
  }

  function HeroControls({
    onPrev,
    onNext,
    index: current,
  }: {
    onPrev: () => void;
    onNext: () => void;
    index: number;
  }) {
    return (
      <div className="absolute right-5 bottom-4 z-10 flex items-center gap-2.5 text-[13px] text-ink/80 sm:right-8 sm:bottom-5">
        <span className="mr-1 tracking-[0.14em] tabular-nums">
          {current + 1} / {heroSlides.length}
        </span>
        <button
          type="button"
          className="grid h-8 w-8 place-items-center rounded-full border border-ink/15 bg-ivory/75 backdrop-blur-sm transition hover:bg-ivory"
          aria-label="Image précédente"
          onClick={onPrev}
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button
          type="button"
          className="grid h-8 w-8 place-items-center rounded-full border border-ink/15 bg-ivory/75 backdrop-blur-sm transition hover:bg-ivory"
          aria-label="Image suivante"
          onClick={onNext}
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    );
  }
}
