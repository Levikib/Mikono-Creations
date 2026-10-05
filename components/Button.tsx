import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { cx } from "@/lib/cx";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "whatsapp" | "amber";
export type ButtonSize = "compact" | "default" | "large";

const variants: Record<ButtonVariant, string> = {
  primary: "btn-primary",
  secondary: "btn-secondary",
  ghost: "btn-ghost",
  whatsapp: "btn-whatsapp",
  amber: "btn-amber",
};
const sizes: Record<ButtonSize, string> = {
  compact: "min-h-9 px-3.5 text-[.8125rem]",
  default: "min-h-10 px-4",
  large: "min-h-11 px-5 text-[.9375rem]",
};

export function buttonClass(variant: ButtonVariant = "primary", size: ButtonSize = "default", extra?: string) {
  return cx(
    "hit-y relative inline-flex max-w-full items-center justify-center gap-1.5 rounded-full text-sm font-semibold leading-tight [overflow-wrap:anywhere]",
    "transition-[transform,box-shadow] duration-200 ease-[var(--ease-squish)] active:scale-[.96] aria-disabled:opacity-55 aria-disabled:pointer-events-none disabled:opacity-55",
    variants[variant], sizes[size], extra,
  );
}

type Common = { variant?: ButtonVariant; size?: ButtonSize; children: ReactNode; className?: string };

export function Button({ variant, size, className, children, ...rest }: Common & ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button type="button" className={buttonClass(variant, size, className)} {...rest}>{children}</button>;
}

export function ButtonLink({ variant, size, className, children, href, external, prefetch, ...rest }:
  Common & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & { href: string; external?: boolean; prefetch?: boolean }) {
  const cls = buttonClass(variant, size, className);
  if (external || /^(https?:|mailto:|tel:)/.test(href)) {
    return <a href={href} className={cls} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})} {...rest}>{children}</a>;
  }
  return <Link href={href} prefetch={prefetch} className={cls} {...rest}>{children}</Link>;
}
