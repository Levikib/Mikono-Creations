import { Container } from "@/components/Container";
import { HandScope } from "@/components/HandScope";
import { ScrapHero, WhatsAppLink } from "@/components/Scrap";
import { JsonLd } from "@/components/JsonLd";
import { GalleryExplorer } from "@/components/gallery/GalleryExplorer";
import { galleryPhotos, galleryTabs, galleryVideo } from "@/content/gallery";
import { breadcrumbLd, pageMetadata } from "@/lib/pageMeta";

export const metadata = pageMetadata({
  title: "Gallery",
  description: "Every photo we have: our animals, market stalls, the makers at work, shelves where the animals are shown, and moments with people.",
  path: "/gallery",
});

export default function GalleryPage() {
  return (
    <HandScope>
      <JsonLd data={breadcrumbLd([{ name: "Gallery", path: "/gallery" }])} />
      <ScrapHero
        crumbs={[{ label: "Home", href: "/" }, { label: "Gallery" }]}
        eyebrow="All our photos"
        title="Gallery"
        lede={`${galleryPhotos.length} photos and a short video, grouped by topic. Open any photo to see it larger; small photos stay at their own size so they stay sharp.`}
      />
      <Container className="py-4 md:py-6">
        <GalleryExplorer tabs={galleryTabs} photos={galleryPhotos} video={galleryVideo} />
        <div className="mt-6 flex flex-col items-start gap-3 rounded-[var(--radius-panel)] bg-oat p-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-[48ch] text-[.9375rem]">Seen one you like? Tell us which animal and we will answer on WhatsApp.</p>
          <WhatsAppLink text="Hello Mikono Creations, I saw an animal in your gallery and would like to ask about it." />
        </div>
      </Container>
    </HandScope>
  );
}
