"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/lib/cart";
import { countAnimals } from "@/lib/plural";
import { Icon } from "./Icon";

/** Header order list button. Opens the drawer; without JavaScript it is a plain link to /cart. */
export function CartButton({ variant = "icon" }: { variant?: "icon" | "pill" }) {
  const { count, hydrated, openDrawer } = useCart();
  const path = usePathname();
  const shown = hydrated ? count : 0;
  return (
    <Link href="/cart" prefetch={false} data-cart-target aria-label={`Order list, ${countAnimals(shown)}`} aria-haspopup="dialog"
      onClick={(e) => {
        if (path === "/cart") return;
        e.preventDefault();
        openDrawer();
      }}
      className={variant === "pill"
        ? "nav-cart iconbtn"
        : "btn-primary relative inline-flex size-10 items-center justify-center rounded-full"}>
      <Icon name="cart" size={18} />
      <span data-cart-count className={variant === "pill"
        ? "absolute -right-1 -top-1 inline-flex min-w-[18px] items-center justify-center rounded-full bg-terracotta-deep px-1 text-[.6875rem] font-semibold leading-[18px] text-[#FFF8EE] shadow-[0_2px_4px_rgb(59_42_34/.35)]"
        : "absolute -right-1 -top-1 inline-flex min-w-[18px] items-center justify-center rounded-full bg-baobab px-1 text-[.6875rem] font-semibold leading-[18px] text-bone"}>{shown}</span>
    </Link>
  );
}
