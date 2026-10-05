// Every key this site writes on the device, in one place. The privacy and cookies pages quote this list.
export const KEYS = {
  cart: "mk.cart.v1",
  cartCorrupt: "mk.cart.corrupt",
  saved: "mk.saved.v1",
  delivery: "mk.delivery.v1",
  draft: "mk.draft.v1",
  orders: "mk.orders.v1",
  profile: "mk.profile.v1",
  studio: "mk.studio.v1",
  helpers: "mk.helpers.v1",
  studioDraft: "mk.studio.v2",
  studioSent: "mk.studio.sent.v2",
  attribution: "mk_attr",
  announce: "mk.announce.v1",
  animals: "mk-animals",
  found: "mk-found",
  seen: "mk-seen",
} as const;

/** Removed by "Clear my saved details". The cookie choice (mk_consent) is kept so the bar does not return. */
export const CLEARABLE_KEYS: string[] = Object.values(KEYS);

/** How long each item stays on the device. The privacy and cookies pages quote these values. */
export const RETENTION = {
  cartDays: 30,
  savedDays: 30,
  deliveryDays: 30,
  draftHours: 24,
  profileDays: 90,
  ordersMax: 10,
} as const;
