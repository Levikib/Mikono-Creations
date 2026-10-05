import Image from "@/components/Img";

export type PhotoSrc = { src: string; alt: string; focal?: [number, number] };

export function ImagePlaceholder({ label = "Photo to come", className = "" }: { label?: string; className?: string }) {
  return (
    <div data-placeholder className={`flex size-full items-center justify-center bg-sand text-stone ${className}`}>
      <span className="px-3 text-center text-base">{label}</span>
    </div>
  );
}

/** Photo with a caption in a plain clay frame. */
export function Polaroid({ photo, caption }: { photo?: PhotoSrc; caption: string; tilt?: number }) {
  return (
    <figure className="clay-sm m-0 w-full max-w-[280px] p-2">
      <div className="relative aspect-square overflow-hidden rounded-[var(--radius-photo)] bg-sand">
        {photo ? <Image src={photo.src} alt={photo.alt} fill sizes="280px" className="object-cover" /> : <ImagePlaceholder />}
      </div>
      <figcaption className="px-1 pb-1 pt-2 text-base font-semibold">{caption}</figcaption>
    </figure>
  );
}

/** Photo in a clay frame, no tape and no tilt. */
export function TapedPhoto({ photo, ratio = "aspect-[4/3]", className = "" }: { photo?: PhotoSrc; tilt?: number; ratio?: string; className?: string }) {
  return (
    <figure className={`clay-sm relative m-0 p-2 ${className}`}>
      <div className={`relative overflow-hidden rounded-[var(--radius-photo)] bg-sand ${ratio}`}>
        {photo ? <Image src={photo.src} alt={photo.alt} fill sizes="(min-width:1024px) 400px, 90vw" className="object-cover" /> : <ImagePlaceholder />}
      </div>
    </figure>
  );
}
