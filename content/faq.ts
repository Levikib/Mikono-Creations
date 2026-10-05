// FAQ: only questions we can answer today, from the client brief and the site itself.
import { business } from "./business";

export type Faq = { q: string; a: string; link?: { href: string; label: string } };
export type FaqGroup = { id: string; title: string; items: Faq[] };

export const faqGroups: FaqGroup[] = [
  {
    id: "animals",
    title: "About the animals",
    items: [
      { q: "What are the animals made from?", a: "Recycled acrylic yarn, crocheted by hand in Nairobi." },
      { q: "Is there any plastic?", a: "Our plain crocheted animals have zero plastic. For animals in a vest, a dress or with a bag, and for dolls, bags and wall heads, ask us on WhatsApp and we will tell you what we know." },
      { q: "Can parts come off?", a: "On our plain crocheted animals nothing is detachable. For animals in a vest, a dress or with a bag, and for dolls, bags and wall heads, ask us on WhatsApp and we will tell you what we know." },
      { q: "Which animals do you make?", a: "Safari animals such as lions, giraffes, elephants, rhinos, zebras and hippos. Domestic animals such as rabbits, cats and dogs. Also more animals such as octopuses, sharks and turtles, wall art heads and dolls.", link: { href: "/shop", label: "See the animals" } },
      { q: "What sizes are there?", a: "Four sizes: Small, Medium, Large and Extra large. We compare them by eye and do not publish centimetre measurements yet.", link: { href: "/size-guide", label: "Size guide" } },
      { q: "What colours are there?", a: "Many. Each animal comes in several colours, which you can filter in the shop." },
      { q: "Are they easy to clean?", a: "Yes. They are easy to clean. We have not published a tested wash method, so see our general tips.", link: { href: "/care", label: "Care guide" } },
    ],
  },
  {
    id: "ordering",
    title: "Ordering",
    items: [
      { q: "How do I order?", a: "Add animals to your order list, fill in the short order form, and your order is written out ready to send on WhatsApp. You press send, and a person replies.", link: { href: "/order", label: "Order form" } },
      { q: "Do I pay on the website?", a: "No. You do not pay on this site. Payment is arranged with you on WhatsApp. The order form has an optional box where you can tell us anything we should know about payment. Prices are confirmed there too." },
      { q: "What are the prices?", a: "Prices are confirmed on WhatsApp. We do not show them on the site yet." },
      { q: "Do you have it in stock?", a: "We confirm availability on WhatsApp. The site shows no stock counts." },
      { q: "Can I change my order?", a: "Message us on WhatsApp and we will help." },
      { q: "What if something arrives damaged?", a: "Message us on WhatsApp with a photo and we will respond." },
    ],
  },
  {
    id: "about",
    title: "About Mikono",
    items: [
      { q: "What does Mikono mean?", a: "Mikono is the Swahili word for hands." },
      { q: "When was Mikono Creations founded, and by whom?", a: "In 2019 in Nairobi, by Leah Maina.", link: { href: "/story", label: "Our story" } },
      { q: "Who makes the animals?", a: "Our makers are women in Nairobi. Through this work we support 25+ women.", link: { href: "/makers", label: "Our makers" } },
      { q: "Where can I buy in a shop?", a: "Our animals are sold through seven outlets in and around Nairobi.", link: { href: "/stockists", label: "Stockists" } },
      { q: "How can I contact you?", a: `Call or WhatsApp ${business.phoneDisplay}, our official business number. We are on Instagram and Facebook as @mikonocreations.`, link: { href: "/contact", label: "Contact" } },
    ],
  },
  {
    id: "trade",
    title: "Trade and partners",
    items: [
      { q: "Do you sell wholesale?", a: "Yes. Many of our customers are retailers, lodges, gift shops and organisations.", link: { href: "/wholesale", label: "Wholesale" } },
      { q: "Can I get a price list?", a: "Send a short request on the wholesale page. A person sends the price list on WhatsApp. We do not show wholesale prices on the website." },
      { q: "Can we partner with Mikono?", a: "Yes, tell us what you have in mind.", link: { href: "/partners", label: "Partners" } },
      { q: "Can I ask for a custom colour or animal?", a: "Yes. Any colour is welcome, and matching a colour from your photo is welcome too. If we cannot get a colour, we tell you and suggest the nearest one. Tell us what you have in mind and we reply on WhatsApp.", link: { href: "/custom/studio?src=faq", label: "Open the Custom Studio" } },
      { q: "How long does a custom piece take?", a: "Custom pieces depend on the quantity and design and usually take from 3 days to 1 week. The exact time is confirmed in your quote. Bulk orders start at 20 pieces. Smaller branded runs: ask us.", link: { href: "/custom/studio?src=faq", label: "Open the Custom Studio" } },
      { q: "How fast do you reply?", a: "We usually reply on WhatsApp within a few minutes to a couple of hours during working hours." },
      { q: "Do you take a deposit, and how do I pay?", a: "We can take a deposit and offer flexible payment: in full on order, a deposit now and the balance later, on delivery or on pickup. The deposit amount and how to pay are confirmed on WhatsApp in your quote. Nothing is paid on this website." },
    ],
  },
];

export const faqLd = () => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqGroups.flatMap((g) => g.items).map((i) => ({
    "@type": "Question",
    name: i.q,
    acceptedAnswer: { "@type": "Answer", text: i.a },
  })),
});
