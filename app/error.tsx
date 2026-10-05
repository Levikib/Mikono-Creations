"use client";

// Kept free of shared UI imports on purpose: this boundary is part of every route's script list, so it stays tiny.
export default function Error({ retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return (
    <div className="mx-auto w-full max-w-[1280px] px-3 py-16 text-center">
      <h1 className="font-display text-xl font-bold">Something went wrong</h1>
      <p className="mt-1 text-stone">Please try again. If it keeps happening, message us on WhatsApp.</p>
      <button type="button" onClick={() => retry()} className="btn-primary mt-3 inline-flex min-h-11 items-center rounded-full px-5 font-semibold">Try again</button>
    </div>
  );
}
