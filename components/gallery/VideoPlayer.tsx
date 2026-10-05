"use client";
import Image from "@/components/Img";
import { useState } from "react";
import { cx } from "@/lib/cx";

/** Click to play: the poster shows first and the file only loads once the button is pressed. */
export function VideoPlayer({ src, poster, alt, caption, className }: { src: string; poster: string; alt: string; caption?: string; className?: string }) {
  const [playing, setPlaying] = useState(false);
  return (
    <figure className={cx("m-0", className)}>
      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-[var(--radius-photo)] bg-black">
        {playing ? (
          <video src={src} poster={poster} controls autoPlay playsInline aria-label={alt} className="absolute inset-0 size-full object-contain" />
        ) : (
          <button type="button" onClick={() => setPlaying(true)} aria-label={`Play video: ${caption ?? alt}`} className="group absolute inset-0 block size-full cursor-pointer">
            <Image src={poster} alt={alt} fill sizes="(min-width:1024px) 560px, 92vw" className="object-contain" />
            <span aria-hidden="true" className="absolute inset-0 grid place-items-center">
              <span className="grid size-14 place-items-center rounded-full bg-baobab/85 text-bone shadow-clay-sm transition-transform group-hover:scale-105">
                <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor"><path d="M9 6.5v11l9-5.5z" /></svg>
              </span>
            </span>
          </button>
        )}
      </div>
      {caption ? <figcaption className="mt-1.5 text-[.8125rem] text-stone">{caption}</figcaption> : null}
    </figure>
  );
}
