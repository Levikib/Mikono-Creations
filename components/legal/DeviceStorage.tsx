import { CookieActions } from "@/components/CookieActions";
import { DRAFT_TTL_HOURS } from "@/lib/site";
import { KEYS, RETENTION } from "@/lib/storageKeys";

/** What is saved on the device, in plain words. Quotes lib/storageKeys.ts so the numbers cannot drift. */
export function PrivacyDevice() {
  return (
    <>
      <section id="on-this-device" aria-labelledby="on-this-device-h">
        <h2 id="on-this-device-h">What this website saves on your device</h2>
        <p>This site has no accounts. It does not send your name, phone number, address or order to any server of ours. What you type into the order and enquiry forms stays on your device until you choose to send it to us yourself, as a WhatsApp message. Everything below lives in your browser&rsquo;s local storage and is never uploaded. The cookies page lists each item by its exact name.</p>
        <ul>
          <li>Your order list, with any note you added to a line. Kept {RETENTION.cartDays} days after the last change.</li>
          <li>Items you put aside with Save for later. Kept {RETENTION.savedDays} days.</li>
          <li>Your delivery estimate (pickup, Nairobi area or town). Kept {RETENTION.deliveryDays} days.</li>
          <li>A draft of the order form, which can include the name, phone number and delivery details you typed. It never includes a KRA PIN or your marketing choices. Kept up to {DRAFT_TTL_HOURS} hours.</li>
          <li>Only if you tick Remember me on this device: your name, phone, email, delivery details and, for a business, its name, type, outlet and invoice name. Kept {RETENTION.profileDays} days after you last send an order with the box ticked. Never a KRA PIN, a gift note or a recipient&rsquo;s details. Use Forget me on this device in the order form at any time.</li>
          <li>A short list of your last orders: reference, time and items. No name, phone number or address.</li>
          <li>A draft of your Custom Studio brief, and your answers in the gift finder, size finder and safari family builder. They stay on your device for up to {DRAFT_TTL_HOURS} hours. The finder answers are never sent anywhere.</li>
          <li>Your cookie choice, your display choices (density and the Animals switch), which hidden animals you have found, and that you saw the home page welcome and, only if you accept analytics, the campaign link you arrived from.</li>
        </ul>
        <p>The link <strong>Clear my saved details</strong> in the footer removes all of this at once, except your cookie choice. <strong>Clear my data</strong> on the cookies page also removes the cookie choice.</p>
      </section>
      <section id="whatsapp" aria-labelledby="whatsapp-h">
        <h2 id="whatsapp-h">When you send a message on WhatsApp</h2>
        <p>The forms prepare a message and open WhatsApp. Nothing is sent until you press send in WhatsApp. The message goes to Mikono Creations, and WhatsApp (Meta) handles it under its own terms. If WhatsApp does not open, you can copy the message and send it yourself.</p>
        <p>The message holds what you entered: your items, name, phone number, delivery details and any note. If you gave a KRA PIN, it is in the message and nowhere else. After you send, the message sits in our WhatsApp chat with you, and we use it to deal with your order. This site does not keep a copy on a server.</p>
      </section>
      <section id="share" aria-labelledby="share-h">
        <h2 id="share-h">Shared lists and our host</h2>
        <p>The Share my list button builds a link that holds only animals, colours, sizes and quantities. It holds no name, phone number or note. Pages are served by Vercel, which processes normal request information, such as the page asked for and the IP address, to deliver the page.</p>
      </section>
      <section id="your-choices" aria-labelledby="your-choices-h">
        <h2 id="your-choices-h">Your choices</h2>
        <p>Change your cookie choice or clear what is saved on this device.</p>
        <div className="mt-2"><CookieActions /></div>
      </section>
    </>
  );
}

export const privacyExtraNav = [
  { id: "on-this-device", label: "What this website saves on your device" },
  { id: "whatsapp", label: "When you send a message on WhatsApp" },
  { id: "share", label: "Shared lists and our host" },
  { id: "your-choices", label: "Your choices" },
];

const rows = [
  { key: KEYS.cart, what: "Your order list lines, with any note you added to a line.", when: `Always, to keep your order list. Removed ${RETENTION.cartDays} days after the last change.`, type: "Essential" },
  { key: KEYS.saved, what: "Items you put aside with Save for later.", when: `Only if you use Save for later. Removed ${RETENTION.savedDays} days after the last change.`, type: "Essential" },
  { key: KEYS.delivery, what: "Your delivery estimate: pickup, Nairobi area or town. No street address.", when: `Only if you choose one. Removed ${RETENTION.deliveryDays} days after the last change.`, type: "Essential" },
  { key: KEYS.draft, what: "A draft of the order form, so you can resume. Can include name, phone and delivery details you typed. Never a KRA PIN or your marketing choices.", when: `While you fill in the form. Removed after ${DRAFT_TTL_HOURS} hours, or when you finish or start again.`, type: "Essential" },
  { key: KEYS.profile, what: "Your name, phone, email, delivery details and business details, to speed up your next order.", when: `Only if you tick Remember me on this device. Removed ${RETENTION.profileDays} days after you last send an order with the box ticked, or when you choose Forget me on this device. Never a KRA PIN.`, type: "Your choice" },
  { key: KEYS.orders, what: "Recent order references and items. No name, phone or address.", when: `After you send an order. The last ${RETENTION.ordersMax} are kept.`, type: "Essential" },
  { key: KEYS.studioDraft, what: "A draft of your Custom Studio brief, so you can resume. Can include a name and phone number if you typed them.", when: `While you fill in the Studio. Removed after ${DRAFT_TTL_HOURS} hours, or when you finish or start again.`, type: "Essential" },
  { key: KEYS.studioSent, what: "A note that a Studio brief was sent, so the confirmation page can show its reference. No name or phone number.", when: "After you send a brief.", type: "Essential" },
  { key: KEYS.studio, what: "An older version of the Studio draft. Cleared with the other items.", when: "Only if left over from an earlier visit.", type: "Essential" },
  { key: KEYS.helpers, what: "Your answers in the gift finder, size finder and safari family builder. They are never sent anywhere.", when: `Removed after ${DRAFT_TTL_HOURS} hours, or when you start again.`, type: "Essential" },
  { key: "mk_consent", what: "Your cookie choice.", when: "After you choose in the cookie bar.", type: "Essential" },
  { key: "mk-density", what: "Whether you prefer the compact or the roomy layout.", when: "Only if you change it.", type: "Your choice" },
  { key: KEYS.animals, what: "The Animals switch in the footer: on or off.", when: "Only if you change it. Removed by Clear my saved details.", type: "Your choice" },
  { key: "mk-fx", what: "An older version of the Animals switch. Still read, never written.", when: "Only if left over from an earlier visit.", type: "Your choice" },
  { key: KEYS.found, what: "Which hidden animals you have found in the Find the herd game.", when: "After you find one. Removed by the Reset link next to the counter, or by Clear my saved details. Never sent anywhere.", type: "Your choice" },
  { key: KEYS.seen, what: "Remembers that you saw the short welcome on the home page, so it plays once.", when: "After the welcome plays. Removed by Clear my saved details.", type: "Your choice" },
  { key: KEYS.attribution, what: "The campaign link you arrived from, if any.", when: "Only if you accept analytics.", type: "Analytics" },
  { key: KEYS.announce, what: "Remembers you closed the announcement bar.", when: "After you close it.", type: "Essential" },
  { key: KEYS.cartCorrupt, what: "A backup copy of an order list that could not be read.", when: "Only if the saved order list was damaged.", type: "Essential" },
];

/** The live list of storage items (kept in step with lib/storageKeys.ts), folded into the cookie policy. */
export function CookieTable() {
  return (
    <>
      <section id="what-is-saved" aria-labelledby="what-is-saved-h">
        <h2 id="what-is-saved-h">Every item this site saves</h2>
        <p>None of these is sent to a server. Essential items keep your order list and the order form working.</p>
        <div role="region" aria-label="Items this site saves, scrolls sideways on small screens" tabIndex={0} className="mt-2 overflow-x-auto rounded-[var(--radius-card)] bg-oat">
          <table className="w-full min-w-[620px] border-collapse text-left text-[.8125rem]">
            <caption className="sr-only">Items this site saves in your browser</caption>
            <thead>
              <tr className="border-b border-sand-deep text-baobab">
                <th scope="col" className="px-3 py-2 font-semibold">Name</th>
                <th scope="col" className="px-3 py-2 font-semibold">What it holds</th>
                <th scope="col" className="px-3 py-2 font-semibold">When</th>
                <th scope="col" className="px-3 py-2 font-semibold">Type</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.key} className="border-b border-sand align-top last:border-0">
                  <th scope="row" className="px-3 py-2 font-mono font-semibold text-charcoal">{r.key}</th>
                  <td className="px-3 py-2">{r.what}</td>
                  <td className="px-3 py-2">{r.when}</td>
                  <td className="px-3 py-2">{r.type}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <section id="your-cookie-choice" aria-labelledby="your-cookie-choice-h">
        <h2 id="your-cookie-choice-h">Your cookie choice</h2>
        <p>Analytics and advertising measurement only run if you choose Accept all in the cookie bar. You can reopen the choice at any time.</p>
        <div className="mt-2"><CookieActions /></div>
      </section>
    </>
  );
}

export const cookieExtraNav = [
  { id: "what-is-saved", label: "Every item this site saves" },
  { id: "your-cookie-choice", label: "Your cookie choice" },
];
