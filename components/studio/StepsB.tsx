"use client";
import Image from "@/components/Img";
import { useRef, useState } from "react";
import { QuantityStepper } from "../QuantityStepper";
import { ErrorText, TextField, TextareaField } from "../Form";
import { Icon } from "../Icon";
import {
  COLOUR_REF_MAX, LICENCE_NOTICE, LICENCE_TITLE, LICENCE_WHY, MAX_COLOURS, MAX_COLOUR_REFS, MAX_LINKS, MAX_NOTES, MAX_PHOTOS, MAX_PICKS, NOTE_MAX, UNIQUE_HINT, UNIQUE_MAX, OTHER_ID, withOther,
  eyeStyles, expressions, finishes, hangingLoop, markings, moods, noseStyles, photoTips, postures, rightsOptions, stitched, textures, wearables,
} from "@/data/studio";
import type { StudioColour } from "@/lib/studio/catalogue";
import { hasLogoFinish, mayHaveLogo, pieceHasFeatures, showsReferenceTips } from "@/lib/studio/flow";
import { cleanLink, domainOf } from "@/lib/studio/validate";
import { pieceTitle } from "@/lib/studio/summary";
import { studioTrack } from "@/lib/studio/track";
import { PaperclipSteps } from "./Art";
import { PieceBar, Photo, useActive, type StepProps } from "./StepsA";
import { EXACT_LINE } from "@/data/studio";
import { Chips, Group, More, Note, OptionCard, OtherText, Pill, hasOther } from "./ui";

/** Round photo crop of the real colourway, zoomed at its focal point. Never tinted or clamped. */
export function Swatch({ colour, size = 56 }: { colour: StudioColour; size?: number }) {
  const f = `${colour.photo.focal[0] * 100}% ${colour.photo.focal[1] * 100}%`;
  return (
    <span className="st-swatch" style={{ width: size, height: size }}>
      <Image src={colour.photo.src} alt="" fill sizes="64px" className="object-cover" style={{ objectPosition: f, transformOrigin: f }} />
    </span>
  );
}

/* ---------------- colours ---------------- */
export function ColoursSection({ state, dispatch, data, errors, path }: StepProps) {
  const { index, piece, patch } = useActive(state, dispatch, path === "quick");
  const [fam, setFam] = useState<string>(data.families[0]?.key ?? "neutral");
  const shown = data.colours.filter((c) => c.family === fam);
  const picked = (id: string) => piece.colours.some((c) => c.id === id);
  const full = piece.colours.length >= MAX_COLOURS;
  const byId = (id: string) => data.colours.find((c) => c.id === id);
  const [ref, setRef] = useState("");
  const copyAll = () => state.brief.pieces.forEach((_, i) => { if (i !== index) dispatch({ type: "piece", index: i, patch: { colours: piece.colours, colourSource: piece.colourSource, colourNote: piece.colourNote } }); });
  return (
    <div className="grid gap-2.5">
      <Group id={`p${index}-source`} legend="How would you like to choose?">
        <Chips name="How to choose colours" list={[
          { id: "swatches", label: "Pick from our yarn colours", help: "", impactsQuote: "none" },
          { id: "photo", label: "Match a colour from my photo", help: "", impactsQuote: "none" },
          { id: "brand", label: "Brand colours", help: "", impactsQuote: "none" },
          { id: "surprise", label: "Surprise me", help: "", impactsQuote: "none" },
        ]} value={[piece.colourSource]} onToggle={(id, on) => { if (on) { patch({ colourSource: id as typeof piece.colourSource }); studioTrack("studio_colour_select", { slot: "any", family: id, source: id }); } }} />
      </Group>
      {piece.colourSource === "photo" ? (
        <Note icon="sparkle">Matching a colour from your photo is welcome. We pick the closest yarn shade. You attach the photo in WhatsApp.</Note>
      ) : null}
      {piece.colourSource === "surprise" ? (
        <Note icon="sparkle">We choose colours we think will suit it. You can still pick favourites below, or name any colour in the note.</Note>
      ) : null}
      {piece.colourSource === "brand" ? (
        <Note icon="sparkle">Pick the closest yarn colours below if you can, and add brand colour names or codes in the note.</Note>
      ) : null}
      <div className="grid gap-2" id={`p${index}-colours`} tabIndex={-1}>
        <div className="flex items-baseline justify-between gap-3">
          <p className="text-[.8125rem] font-semibold">Your colours <span className="font-normal st-soft">({piece.colours.length} chosen, select all that apply)</span></p>
          {piece.colours.length ? <button type="button" className="st-link min-h-11 text-[.8125rem]" onClick={() => dispatch({ type: "clearColours", index })}>Clear</button> : null}
        </div>
        <div className="flex min-h-[52px] flex-wrap items-center gap-1.5 rounded-[var(--st-r-card,16px)] p-1.5 st-well" aria-live="polite">
          {piece.colours.length === 0 ? <p className="px-2 text-[.8125rem] st-soft">Tap the colours you like below.</p> : piece.colours.map((c) => {
            const sc = byId(c.id);
            return (
              <button key={c.id} type="button" onClick={() => dispatch({ type: "toggleColour", index, colour: c })} aria-label={`Remove ${c.label}`}
                className="inline-flex min-h-9 items-center gap-1.5 rounded-full bg-[var(--st-paper)] py-0.5 pl-0.5 pr-2.5 text-[.8125rem] font-semibold shadow-[var(--st-sh)]">
                {sc ? <Swatch colour={sc} size={30} /> : null}{c.label}<Icon name="close" size={14} />
              </button>
            );
          })}
        </div>
        <div role="radiogroup" aria-label="Colour family" className="st-chips">
          {data.families.map((f) => <Pill key={f.key} name={`family-${piece.id}`} value={f.key} checked={fam === f.key} onChange={() => setFam(f.key)}>{f.label}</Pill>)}
        </div>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5" role="group" aria-label="Yarn colours" data-grid="colours">
          {shown.map((c) => {
            const on = picked(c.id);
            return (
              <OptionCard key={c.id} type="checkbox" name={`colour-${piece.id}`} value={c.id} checked={on} disabled={!on && full}
                onChange={() => { dispatch({ type: "toggleColour", index, colour: { id: c.id, label: c.label, family: c.family } }); if (!on) studioTrack("studio_colour_select", { slot: "pick", family: c.family, source: "swatches" }); }}
                ariaLabel={`${c.label}, from the ${c.from} photo`} className="min-h-[88px] flex-col items-center gap-1 p-2 text-center">
                <Swatch colour={c} size={44} />
                <span className="text-[.75rem] font-semibold leading-tight">{c.label}</span>
              </OptionCard>
            );
          })}
        </div>
        {full ? <p className="text-[.8125rem] st-soft">That is a lot of colours. Remove one to pick another, or name any colour in the note below.</p> : null}
        <p className="text-[.75rem] st-soft">Any colour is welcome, so name it in the note if it is not here. If we cannot get a colour, we tell you and suggest the nearest one. Each swatch is a crop of a real animal photo, so you see the true yarn. Shades can differ slightly on your screen.</p>
      </div>
      {errors[`p${index}-colours`] ? <ErrorText id={`p${index}-colours-err`}>{errors[`p${index}-colours`]}</ErrorText> : null}

      <TextareaField id={`p${index}-colourNote`} label="Any colour, by name, or anything else about colour?" optional hint="For example sage green, a room, a flag, or a brand colour name or code."
        value={piece.colourNote} onChange={(v) => patch({ colourNote: v })} maxLength={200} rows={2} />

      <div className="grid gap-1.5">
        <p className="text-[.8125rem] font-semibold">Colour references <span className="font-normal st-soft">(optional)</span></p>
        {piece.colourRefs.length ? (
          <ul className="flex flex-wrap gap-1.5">
            {piece.colourRefs.map((r, i) => (
              <li key={`${r}-${i}`}>
                <button type="button" onClick={() => dispatch({ type: "colourRef", index, at: i, value: null })} aria-label={`Remove colour reference ${r}`}
                  className="inline-flex min-h-9 items-center gap-1.5 rounded-full bg-[var(--st-paper)] px-3 text-[.8125rem] font-semibold shadow-[var(--st-sh)]">{r}<Icon name="close" size={14} /></button>
              </li>
            ))}
          </ul>
        ) : null}
        {piece.colourRefs.length < MAX_COLOUR_REFS ? (
          <div className="flex items-end gap-1.5" onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); if (ref.trim()) { dispatch({ type: "colourRef", index, at: piece.colourRefs.length, value: ref }); setRef(""); } } }}>
            <TextField id={`p${index}-colourRef`} label="Add a colour reference" className="min-w-0 flex-1" value={ref} maxLength={COLOUR_REF_MAX > 60 ? 60 : COLOUR_REF_MAX} autoComplete="off" enterKeyHint="done"
              hint="For example sage ribbon, sunset orange" onChange={setRef} />
            <button type="button" className="st-btn st-btn-sec !min-h-9 mb-px" onClick={() => { if (ref.trim()) { dispatch({ type: "colourRef", index, at: piece.colourRefs.length, value: ref }); setRef(""); } }}>Add</button>
          </div>
        ) : <p className="text-[.75rem] st-soft">That is a lot of references. Add the rest in the colour note.</p>}
      </div>
      {state.brief.pieces.length > 1 && path === "full" ? <div><button type="button" className="st-btn st-btn-sec !min-h-9" onClick={copyAll}>Use these colours for every piece</button></div> : null}
    </div>
  );
}

/* ---------------- features ---------------- */
const countOf = (...lists: (string | string[])[]) => lists.reduce<number>((n, l) => n + (Array.isArray(l) ? l.length : l ? 1 : 0), 0);

export function FeaturesSection({ state, dispatch, data, errors }: StepProps) {
  const { index, piece, patch } = useActive(state, dispatch);
  const cat = (slug: string) => data.animals.find((a) => a.slug === slug)?.category;
  if (!pieceHasFeatures(piece, cat)) return <Note>Body and face questions do not apply to this shape. Describe anything special in the notes.</Note>;
  const one = (field: "eyes" | "nose" | "expression" | "posture") => (id: string, on: boolean) => patch({ [field]: on ? id : "" } as never);
  const copy = () => state.brief.pieces.forEach((_, i) => { if (i !== index) dispatch({ type: "piece", index: i, patch: { markings: piece.markings, markingsNote: piece.markingsNote, eyes: piece.eyes, nose: piece.nose, expression: piece.expression, textures: piece.textures, posture: piece.posture, loop: piece.loop } }); });
  return (
    <div className="grid gap-2" data-features>
      <More title="Markings and patterns" count={countOf(piece.markings)} open>
        <Group id={`p${index}-markings`} legend="Which markings?" hint="Select all that apply." optional>
          <Chips name="Markings" multi list={withOther(markings, "A marking that is not listed")} value={piece.markings} onToggle={(id) => dispatch({ type: "ptoggle", index, field: "markings", id })} />
          {hasOther(piece.markings) ? <OtherText id={`p${index}-markings-other`} label="Which other marking?" value={piece.others?.markings ?? ""} onChange={(v) => dispatch({ type: "pother", index, key: "markings", value: v })} className="mt-2" /> : null}
        </Group>
        <TextareaField id={`p${index}-markingsNote`} label="More about markings" optional value={piece.markingsNote} onChange={(v) => patch({ markingsNote: v })} maxLength={200} rows={2} hint="For example a white tip on the tail." />
      </More>
      <More title="Face: eyes, nose, expression" count={countOf(piece.eyes, piece.nose, piece.expression)}>
        <Group id={`p${index}-eyes`} legend="Eye style" optional><Chips name="Eye style" list={withOther(eyeStyles)} value={[piece.eyes]} onToggle={one("eyes")} />
          {piece.eyes === OTHER_ID ? <OtherText id={`p${index}-eyes-other`} label="Which eye style?" value={piece.others?.eyes ?? ""} onChange={(v) => dispatch({ type: "pother", index, key: "eyes", value: v })} className="mt-2" /> : null}</Group>
        <Group id={`p${index}-nose`} legend="Nose style" optional><Chips name="Nose style" list={withOther(noseStyles)} value={[piece.nose]} onToggle={one("nose")} />
          {piece.nose === OTHER_ID ? <OtherText id={`p${index}-nose-other`} label="Which nose style?" value={piece.others?.nose ?? ""} onChange={(v) => dispatch({ type: "pother", index, key: "nose", value: v })} className="mt-2" /> : null}</Group>
        <Group id={`p${index}-expr`} legend="Expression" optional><Chips name="Expression" list={withOther(expressions)} value={[piece.expression]} onToggle={one("expression")} />
          {piece.expression === OTHER_ID ? <OtherText id={`p${index}-expr-other`} label="Which expression?" value={piece.others?.expression ?? ""} onChange={(v) => dispatch({ type: "pother", index, key: "expression", value: v })} className="mt-2" /> : null}</Group>
      </More>
      <More title="Texture, posture and loop" count={countOf(piece.textures, piece.posture, piece.loop)}>
        <Group id={`p${index}-textures`} legend="Textures" hint="Select all that apply." optional>
          <Chips name="Textures" multi list={withOther(textures)} value={piece.textures} onToggle={(id) => dispatch({ type: "ptoggle", index, field: "textures", id })} />
          {hasOther(piece.textures) ? <OtherText id={`p${index}-textures-other`} label="Which other texture?" value={piece.others?.textures ?? ""} onChange={(v) => dispatch({ type: "pother", index, key: "textures", value: v })} className="mt-2" /> : null}
        </Group>
        <Group id={`p${index}-posture`} legend="Posture" optional><Chips name="Posture" list={withOther(postures)} value={[piece.posture]} onToggle={one("posture")} />
          {piece.posture === OTHER_ID ? <OtherText id={`p${index}-posture-other`} label="Which posture?" value={piece.others?.posture ?? ""} onChange={(v) => dispatch({ type: "pother", index, key: "posture", value: v })} className="mt-2" /> : null}</Group>
        <Group id={`p${index}-loop`} legend="Hanging loop" optional>
          <Chips name="Hanging loop" list={hangingLoop} value={[piece.loop]} onToggle={(id, on) => patch({ loop: on ? (id as "yes" | "no") : "" })} />
        </Group>
      </More>
      <More title="Unique features" count={countOf(piece.unique)}>
        <TextareaField id={`p${index}-unique`} label="Anything that makes it yours" optional hint={UNIQUE_HINT} value={piece.unique} onChange={(v) => patch({ unique: v })} maxLength={UNIQUE_MAX} rows={3} error={errors[`p${index}-unique`]} />
      </More>
      {state.brief.pieces.length > 1 ? <div><button type="button" className="st-btn st-btn-sec !min-h-9" onClick={copy}>Use these features for every piece</button></div> : null}
    </div>
  );
}

export function LookStep(props: StepProps) {
  const { state, dispatch } = props;
  return (
    <div className="grid gap-3">
      {state.brief.pieces.length > 1 ? <PieceBar state={state} dispatch={dispatch} /> : null}
      <p className="text-[.8125rem] font-semibold" aria-live="polite">{state.brief.pieces.length > 1 ? `Editing ${pieceTitle(state.brief.pieces[Math.min(state.active, state.brief.pieces.length - 1)], Math.min(state.active, state.brief.pieces.length - 1))}` : null}</p>
      <ColoursSection {...props} />
      <FeaturesSection {...props} />
      <p className="text-[.75rem] st-soft">{EXACT_LINE}</p>
    </div>
  );
}

/* ---------------- personal touches ---------------- */
export function PersonalStep(props: StepProps) {
  const { state, dispatch, errors } = props;
  const { index, piece } = useActive(state, dispatch);
  const b = state.brief;
  const brandOpen = mayHaveLogo(b) || b.customerTypes.some((c) => c !== "private" && c !== "gift-buyer");
  const copy = () => b.pieces.forEach((_, i) => { if (i !== index) dispatch({ type: "piece", index: i, patch: { stitch: piece.stitch, stitchText: piece.stitchText, wear: piece.wear, finish: piece.finish } }); });
  return (
    <div className="grid gap-3">
      {b.pieces.length > 1 ? <PieceBar state={state} dispatch={dispatch} /> : null}
      <Note icon="sparkle">All of these are optional, and we offer them all. The cost is confirmed in your quote. {EXACT_LINE}</Note>
      <Group id={`p${index}-stitch`} legend="Stitched or embroidered" hint="Select all that apply." optional>
        <div className="grid gap-2">
          <div role="group" aria-label="Stitched or embroidered" className="flex flex-wrap gap-1.5">
            {stitched.map((s) => (
              <Pill key={s.id} type="checkbox" name={`stitch-${piece.id}`} value={s.id} checked={piece.stitch.includes(s.id)}
                onChange={(on) => { dispatch({ type: "ptoggle", index, field: "stitch", id: s.id }); studioTrack("studio_detail_toggle", { detail: s.id, on }); }}>{s.label}</Pill>
            ))}
            <Pill type="checkbox" name={`stitch-${piece.id}`} value={OTHER_ID} checked={piece.stitch.includes(OTHER_ID)} onChange={() => dispatch({ type: "ptoggle", index, field: "stitch", id: OTHER_ID })}>Other, tell us</Pill>
          </div>
          {hasOther(piece.stitch) ? <OtherText id={`p${index}-stitch-other`} label="What else should be stitched?" value={piece.others?.stitch ?? ""} onChange={(v) => dispatch({ type: "pother", index, key: "stitch", value: v })} hint="Names in any script are welcome. Long names or special characters may need us to confirm." /> : null}
          {stitched.filter((s) => piece.stitch.includes(s.id)).map((s) => (
            <TextField key={s.id} id={`p${index}-stitch-${s.id}`} label={s.label2} value={piece.stitchText[s.id] ?? ""} maxLength={s.max} autoComplete="off" enterKeyHint="next"
              hint={s.id === "name" ? s.help : `Up to ${s.max} characters.`} onChange={(v) => dispatch({ type: "stitchText", index, id: s.id, value: v })} error={errors[`p${index}-stitch-${s.id}`]} />
          ))}
        </div>
      </Group>
      <Group id={`p${index}-wear`} legend="Outfit and accessories" hint="Select all that apply." optional>
        <Chips name="Outfit and accessories" multi list={withOther(wearables)} value={piece.wear} onToggle={(id, on) => { dispatch({ type: "ptoggle", index, field: "wear", id }); studioTrack("studio_detail_toggle", { detail: id, on }); }} />
        {hasOther(piece.wear) ? <OtherText id={`p${index}-wear-other`} label="Which other outfit or accessory?" value={piece.others?.wear ?? ""} onChange={(v) => dispatch({ type: "pother", index, key: "wear", value: v })} className="mt-2" /> : null}
      </Group>
      <More title="Branding for businesses" count={piece.finish.length} open={brandOpen}>
        <Group id={`p${index}-finish`} legend="Branded finishes" hint="Select all that apply. A logo needs proof you may use it, asked in the inspiration step." optional>
          <Chips name="Branded finishes" multi list={withOther(finishes)} value={piece.finish} onToggle={(id) => dispatch({ type: "ptoggle", index, field: "finish", id })} />
          {hasOther(piece.finish) ? <OtherText id={`p${index}-finish-other`} label="Which other finish?" value={piece.others?.finish ?? ""} onChange={(v) => dispatch({ type: "pother", index, key: "finish", value: v })} className="mt-2" /> : null}
        </Group>
      </More>
      {b.pieces.length > 1 ? <div><button type="button" className="st-btn st-btn-sec !min-h-9" onClick={copy}>Use these for every piece</button></div> : null}
    </div>
  );
}

/* ---------------- inspiration ---------------- */
export function InspirationStep({ state, dispatch, data, errors }: StepProps) {
  const b = state.brief;
  const rail = useRef<HTMLDivElement>(null);
  const [link, setLink] = useState("");
  const [linkErr, setLinkErr] = useState("");
  const pref = (slug: string) => b.picks.find((p) => p.slug === slug)?.pref ?? null;
  const setPick = (slug: string, p: "like" | "avoid") => {
    const now = pref(slug);
    dispatch({ type: "setPick", slug, pref: now === p ? null : p });
    if (now !== p) studioTrack("studio_inspiration_add", { kind: "catalogue", count: b.picks.length + (now ? 0 : 1) });
  };
  const addLink = () => {
    if (!link.trim()) return;
    const clean = cleanLink(link);
    if (!clean) { setLinkErr("That link does not look right. Check it or leave it out."); return; }
    if (b.links.length >= MAX_LINKS) { setLinkErr("That is a lot of links. Put the rest in a note, or send them in WhatsApp."); return; }
    dispatch({ type: "addLink", url: clean }); setLink(""); setLinkErr("");
    studioTrack("studio_inspiration_add", { kind: "link", count: b.links.length + 1 });
  };
  const slide = (dir: number) => rail.current?.scrollBy({ left: dir * 260, behavior: "smooth" });
  const tips = showsReferenceTips(b);
  const logo = mayHaveLogo(b);
  return (
    <div className="grid gap-3">
      <Note icon="info"><span><strong>{LICENCE_TITLE}.</strong> {LICENCE_NOTICE}{" "}
        <details className="mt-1 inline"><summary className="st-link inline cursor-pointer">Why?</summary><span className="mt-1 block">{LICENCE_WHY}</span></details></span></Note>

      <section className="grid gap-2" aria-labelledby="in-ours">
        <div className="flex items-end justify-between gap-3">
          <div><h3 id="in-ours" className="text-[1rem]">Reference animals from our catalogue</h3><p className="mt-0.5 text-[.8125rem] st-soft">Select all that apply. Tap Like or Not like on any animal.</p></div>
          <div className="hidden gap-1.5 lg:flex">
            <button type="button" aria-label="Show earlier animals" onClick={() => slide(-1)} className="st-btn st-btn-sec !min-h-9 !px-2.5"><Icon name="back" size={16} /></button>
            <button type="button" aria-label="Show more animals" onClick={() => slide(1)} className="st-btn st-btn-sec !min-h-9 !px-2.5"><Icon name="arrow" size={16} /></button>
          </div>
        </div>
        <div ref={rail} className="st-rail" tabIndex={-1}>
          {data.animals.map((a) => {
            const p = pref(a.slug);
            const full = !p && b.picks.length >= MAX_PICKS;
            return (
              <div key={a.slug} data-card="pin" className="st-surface flex w-[112px] flex-col p-1">
                <div className="st-opt-media relative aspect-square w-full">{a.photo ? <Photo photo={a.photo} sizes="112px" /> : null}</div>
                <p className="px-1 pt-1.5 text-[.75rem] font-semibold leading-tight">{a.name}</p>
                <div className="mt-1.5 grid gap-1">
                  <button type="button" aria-pressed={p === "like"} disabled={full} onClick={() => setPick(a.slug, "like")} aria-label={`Like this: ${a.name}`}
                    className={`st-pill st-pill-btn !px-2 ${p === "like" ? "!bg-[var(--st-olive)] !text-[#FFF8EE]" : ""}`}>{p === "like" ? <Icon name="check" size={14} /> : <Icon name="heart" size={14} />} Like</button>
                  <button type="button" aria-pressed={p === "avoid"} disabled={full} onClick={() => setPick(a.slug, "avoid")} aria-label={`Not like this: ${a.name}`}
                    className={`st-pill st-pill-btn !px-2 ${p === "avoid" ? "!bg-[var(--st-brick)] !text-[#FFF8EE]" : ""}`}>{p === "avoid" ? <Icon name="check" size={14} /> : null} Not like</button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {(b.picks.length > 0 || b.links.length > 0) ? (
        <section className="st-surface grid gap-2 p-3" aria-labelledby="in-board" data-board>
          <h3 id="in-board" className="text-[1rem]">Your mood board</h3>
          <ul className="flex flex-wrap gap-1.5">
            {b.picks.map((p) => {
              const a = data.animals.find((x) => x.slug === p.slug);
              return (
                <li key={p.slug}>
                  <button type="button" onClick={() => dispatch({ type: "setPick", slug: p.slug, pref: null })} aria-label={`Remove ${a?.name ?? p.slug} from the board`}
                    className="inline-flex min-h-9 items-center gap-1.5 rounded-full bg-[var(--st-paper)] py-0.5 pl-0.5 pr-2.5 text-[.8125rem] font-semibold shadow-[var(--st-sh)]">
                    <span className="relative size-8 overflow-hidden rounded-full bg-[var(--st-sand)]">{a?.photo ? <Photo photo={a.photo} sizes="32px" /> : null}</span>
                    <span>{a?.name}<span className="block text-[.6875rem] font-normal leading-none st-soft">{p.pref === "like" ? "like this" : "not like this"}</span></span>
                    <Icon name="close" size={14} />
                  </button>
                </li>
              );
            })}
            {b.links.map((l) => (
              <li key={l}>
                <button type="button" onClick={() => dispatch({ type: "removeLink", url: l })} aria-label={`Remove link ${domainOf(l)}`}
                  className="inline-flex min-h-9 items-center gap-1.5 rounded-full bg-[var(--st-paper)] px-3 text-[.8125rem] font-semibold shadow-[var(--st-sh)]"><Icon name="arrow" size={14} />{domainOf(l)}<Icon name="close" size={14} /></button>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <div className="grid gap-1.5">
        <div className="flex items-end gap-1.5" onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addLink(); } }}>
          <TextField id="link" label={b.links.length ? `Links (${b.links.length} added)` : "Links"} optional className="min-w-0 flex-1" value={link} type="url" autoComplete="off" enterKeyHint="go"
            hint="Pinterest, Instagram, Google Photos, any web page. Add as many as you like." onChange={(v) => { setLink(v); setLinkErr(""); }} error={linkErr} />
          <button type="button" onClick={addLink} className="st-btn st-btn-sec !min-h-9 mb-px">Add link</button>
        </div>
      </div>

      <div className="grid gap-2">
        <p className="text-[.8125rem] font-semibold">Describe it <span className="font-normal st-soft">(optional, add a note for each idea)</span></p>
        {b.notes.map((n, i) => (
          <div key={i} className="flex items-start gap-1.5">
            <TextareaField id={i === 0 ? "note" : `note-${i}`} label={b.notes.length > 1 ? `Note ${i + 1}` : "The shape, face, ears, tail, anything that matters"} className="min-w-0 flex-1" value={n}
              onChange={(v) => dispatch({ type: "note", index: i, value: v })} maxLength={NOTE_MAX} rows={3} />
            {b.notes.length > 1 ? <button type="button" className="st-link mt-7 min-h-11 text-[.8125rem]" aria-label={`Remove note ${i + 1}`} onClick={() => dispatch({ type: "removeNote", index: i })}>Remove</button> : null}
          </div>
        ))}
        {b.notes.length < MAX_NOTES && b.notes[b.notes.length - 1].trim() ? <div><button type="button" className="st-btn st-btn-sec !min-h-9" onClick={() => dispatch({ type: "addNote" })}>Add another note</button></div> : null}
      </div>

      <Group id="moods" legend="What should it feel like?" hint="Select all that apply." optional>
        <Chips name="Mood" multi list={withOther(moods)} value={b.moods} onToggle={(id) => dispatch({ type: "toggle", field: "moods", id })} />
        {hasOther(b.moods) ? <OtherText id="moods-other" label="What else should it feel like?" value={b.others.moods ?? ""} onChange={(v) => dispatch({ type: "other", key: "moods", value: v })} className="mt-2" /> : null}
      </Group>

      {logo ? (
        <Group id="rights" legend="Is there a logo or a character?" hint={hasLogoFinish(b) ? "Needed because a logo or branded finish is in your brief." : "Only if one is part of your idea."} error={errors.rights}>
          <Chips name="Rights" list={rightsOptions} value={[b.rights]} onToggle={(id, on) => dispatch({ type: "brief", patch: { rights: on ? id : "" } })} />
          <p className="mt-1 text-[.75rem] st-soft">You can send the logo file or proof of permission in WhatsApp. We never use a logo without it.</p>
        </Group>
      ) : null}

      <section className="st-panel grid gap-2.5 p-3" aria-labelledby="in-photos">
        <div className="flex items-start gap-2.5">
          <span className="st-ico"><Icon name="camera" size={20} duo /></span>
          <div><h3 id="in-photos" className="text-[1rem]">Photos or drawings</h3>
            <p className="mt-0.5 text-[.8125rem]">Attach your photos in WhatsApp after it opens. Nothing is uploaded on this page.</p></div>
        </div>
        {tips ? <ul className="grid gap-0.5 text-[.8125rem] st-soft">{photoTips.map((t) => <li key={t}>{t}</li>)}</ul> : null}
        <PaperclipSteps />
        <QuantityStepper label="How many photos will you send?" value={b.photoCount} min={0} max={MAX_PHOTOS}
          onChange={(n) => dispatch({ type: "brief", patch: { photoCount: n } })} />
      </section>
    </div>
  );
}

