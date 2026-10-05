// Fills the viewport so the footer stays below the fold while a page streams in (no layout shift).
export default function Loading() {
  return (
    <div role="status" aria-label="Loading" className="mx-auto min-h-[100dvh] w-full max-w-[1280px] px-4 py-12 md:px-6 xl:px-8">
      <div className="h-10 w-2/3 max-w-md animate-pulse rounded-full bg-sand motion-reduce:animate-none" />
      <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => <div key={i} className="aspect-[4/5] animate-pulse rounded-[20px] bg-sand motion-reduce:animate-none" />)}
      </div>
    </div>
  );
}
