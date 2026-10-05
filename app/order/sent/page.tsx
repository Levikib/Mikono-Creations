import type { Metadata } from "next";
import { Suspense } from "react";
import { Container } from "@/components/Container";
import { Band } from "@/components/fx/Band";
import { Confetti } from "@/components/fx/Confetti";
import { OrderSent } from "@/components/OrderSent";

export const metadata: Metadata = {
  title: "Order sent",
  robots: { index: false, follow: false },
};

// The celebration is server markup handed to the client view, so the cast sprites stay out of the client bundle.
// It only shows once the order is marked as sent. Motion is off under reduced motion and the lite tier.
const celebrate = (
  <div className="relative mx-auto w-full max-w-[560px]">
    <Band t="sent" id="parade" live nested />
    <Confetti count={16} />
  </div>
);

export default function OrderSentPage() {
  return (
    <Container className="py-3 md:py-5">
      <h1 className="mb-2 text-display-lg">Order sent</h1>
      <Suspense fallback={<p className="text-stone">Loading</p>}>
        <OrderSent celebrate={celebrate} />
      </Suspense>
    </Container>
  );
}
