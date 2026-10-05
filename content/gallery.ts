// Every supplied photo and the video, grouped by topic. Built by scripts/build-gallery.py from media/catalogue/gallery.json.
// Pixels are never changed. A source with a short side under 400 px carries a cardSrc: the photo at its own size on a sand panel.
import raw from "@/data/gallery.generated.json";

export type GalleryTabKey = "animals" | "market" | "making" | "outlets" | "moments";
export type GalleryTab = { key: GalleryTabKey; label: string; blurb: string };
export type GalleryPhoto = { id: string; src: string; w: number; h: number; tab: GalleryTabKey; caption: string; alt: string; cardSrc?: string };
export type GalleryVideo = { id: string; src: string; poster: string; w: number; h: number; tab: GalleryTabKey; caption: string; alt: string };

export const galleryTabs = raw.tabs as GalleryTab[];
export const galleryPhotos = raw.items as unknown as GalleryPhoto[];
export const galleryVideo = raw.video as GalleryVideo;

/** Photos of one topic. The video leads the market tab. */
export const photosIn = (tab: GalleryTabKey) => galleryPhotos.filter((p) => p.tab === tab);
