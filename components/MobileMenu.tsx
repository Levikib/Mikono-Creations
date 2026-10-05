"use client";
import dynamic from "next/dynamic";
import { useState } from "react";
import type { MenuPanel } from "@/lib/menu";
import { Icon } from "./Icon";

// The sheet is only fetched when the menu is first opened, so the first view carries just the burger button.
const MobileSheet = dynamic(() => import("./MobileSheet").then((m) => m.MobileSheet), { ssr: false });

/** Burger button for the collapsed header. The full screen sheet loads on first tap. */
export function MobileMenu({ panels, whatsappHref }: { panels: MenuPanel[]; whatsappHref: string }) {
  const [state, setState] = useState<{ ever: boolean; open: boolean }>({ ever: false, open: false });
  return (
    <>
      <button type="button" aria-label="Open menu" aria-haspopup="dialog" onClick={() => setState({ ever: true, open: true })} className="nav-burger iconbtn">
        <Icon name="menu" size={22} />
      </button>
      {state.ever ? <MobileSheet panels={panels} whatsappHref={whatsappHref} open={state.open} onClose={() => setState((s) => ({ ...s, open: false }))} /> : null}
    </>
  );
}
