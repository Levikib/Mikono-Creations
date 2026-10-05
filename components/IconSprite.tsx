import { PH_SPRITE } from "./iconSprite.generated";

/** One hidden sprite of the Phosphor icons in use. Server markup only: it adds no JavaScript. Rendered once, in the root layout. */
export function IconSprite() {
  return <svg width="0" height="0" aria-hidden="true" focusable="false" style={{ position: "absolute" }} dangerouslySetInnerHTML={{ __html: PH_SPRITE }} />;
}
