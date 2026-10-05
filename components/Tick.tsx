import type { InputHTMLAttributes, Ref } from "react";
import { cx } from "@/lib/cx";

/**
 * Checkbox or radio with a 44px hit area. The native input is stretched over a 44px box and made
 * invisible. The drawn 24px box and mark sit under it and follow its checked and focus states.
 */
export function Tick({ type, className, inputRef, ...rest }: { type: "checkbox" | "radio" } & Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "className"> & { className?: string; inputRef?: Ref<HTMLInputElement> }) {
  return (
    <span className={cx("relative inline-flex size-9 shrink-0 items-center justify-center", className)}>
      <input ref={inputRef} type={type} {...rest} className="peer absolute -inset-1 m-0 size-[calc(100%+8px)] cursor-pointer opacity-0" />
      <span aria-hidden="true" className={cx(
        "flex size-5 items-center justify-center border-2 border-baobab bg-paper text-bone shadow-[inset_0_2px_3px_rgb(110_75_50/.18)] transition-colors",
        type === "radio" ? "rounded-full" : "rounded-md",
        "peer-checked:border-baobab peer-checked:bg-baobab peer-focus-visible:outline peer-focus-visible:outline-[3px] peer-focus-visible:outline-offset-2 peer-focus-visible:outline-focus",
      )}>
        {type === "radio"
          ? <span className="size-2 rounded-full bg-current opacity-0 [:checked~span>&]:opacity-100" />
          : <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-0 [:checked~span>&]:opacity-100"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>}
      </span>
    </span>
  );
}
