// Seed data used on first load (and by the Supabase seed script).
// Dates are generated relative to "now" so the demo always has upcoming classes.

function daysFromNow(n, hour = 18, min = 0) {
  const d = new Date();
  d.setDate(d.getDate() + n);
  d.setHours(hour, min, 0, 0);
  return d.toISOString();
}

export const SEED_EVENTS = [
  {
    id: "evt_bloom",
    slug: "buttercream-bloom-cupcakes",
    title: "Buttercream Bloom Cupcakes",
    subtitle: "A hands-on class — leave with six cupcakes you piped yourself.",
    starts_at: daysFromNow(9, 18, 0),
    ends_at: daysFromNow(9, 20, 0),
    venue_name: "The Joyful Gourmet",
    venue_city: "Libertyville, IL",
    price: 65,
    space_cost: 0,
    capacity: 12,
    seats_taken: 9,
    photo: "cupcakes-bloom",
    audience: "Adults & teens 13+",
    description:
      "Six buttercream flower cupcakes, start to finish: two piped roses, two tulips, and two of your own design once your piping hand warms up. Every technique is taught step by step, and I come around the table the whole time — nobody gets left behind with a sad flower.",
    includes: [
      "Six freshly baked vanilla cupcakes",
      "All buttercream, tips, bags, and tools",
      "My signature buttercream recipe card",
      "A box to carry your cupcakes home",
    ],
    status: "published",
  },
  {
    id: "evt_kids",
    slug: "kids-cupcake-night",
    title: "Kids' Cupcake Night",
    subtitle: "A fun, messy, hands-on class made for younger decorators.",
    starts_at: daysFromNow(16, 13, 0),
    ends_at: daysFromNow(16, 14, 30),
    venue_name: "Elawa Farm",
    venue_city: "Lake Forest, IL",
    price: 45,
    space_cost: 0,
    capacity: 14,
    seats_taken: 6,
    photo: "class-piping",
    audience: "Kids 6–12 (grown-ups welcome)",
    description:
      "A playful intro to cupcake decorating for kids. We keep it simple and silly — big swirls, lots of sprinkles, and a few piping tricks they can show off at home. Grown-ups can jump in or just watch the fun.",
    includes: [
      "Four cupcakes per child",
      "All frosting, sprinkles, and kid-friendly tools",
      "An apron to borrow",
      "A take-home box",
    ],
    status: "published",
  },
  {
    id: "evt_puppy",
    slug: "puppy-face-cupcakes",
    title: "Puppy Face Cupcakes",
    subtitle: "Our most-requested class — turn buttercream into adorable pups.",
    starts_at: daysFromNow(23, 18, 30),
    ends_at: daysFromNow(23, 20, 30),
    venue_name: "Sweet B's Studio Night",
    venue_city: "Vernon Hills, IL",
    price: 75,
    space_cost: 180,
    capacity: 12,
    seats_taken: 12,
    photo: "class-group",
    audience: "Adults & teens 13+",
    description:
      "The class everyone asks for. Learn to pipe fluffy fur, floppy ears, and sweet little faces until your cupcakes look back at you. No experience needed — just a soft spot for puppies.",
    includes: [
      "Six cupcakes to decorate",
      "All specialty tips, buttercream, and tools",
      "The fur-piping cheat sheet",
      "A take-home box",
    ],
    status: "published",
  },
];

export const SEED_QUOTES = [
  {
    id: "q_1",
    kind: "cake",
    name: "Jordan Reyes",
    email: "jordan.reyes@email.com",
    event_date: daysFromNow(21, 12, 0).slice(0, 10),
    servings: "20–30",
    flavors: "Lemon cake, raspberry filling",
    theme: "Garden tea party, pastel florals",
    budget: "$120–150",
    message: "For my mom's 60th. Saw your butterfly cake and loved it!",
    source: "Instagram",
    status: "new",
    created_at: daysFromNow(-1, 9, 12),
  },
  {
    id: "q_2",
    kind: "party",
    name: "Priya Anand",
    email: "priya.a@email.com",
    event_date: daysFromNow(34, 15, 0).slice(0, 10),
    servings: "10 kids",
    flavors: "Vanilla + chocolate",
    theme: "Unicorn birthday, ages 7–9",
    budget: "$450",
    message: "Private party at our house — is that Saturday open?",
    source: "Referral",
    status: "new",
    created_at: daysFromNow(-2, 16, 40),
  },
  {
    id: "q_3",
    kind: "cupcakes",
    name: "Dana Whitfield",
    email: "dana.w@email.com",
    event_date: daysFromNow(12, 9, 0).slice(0, 10),
    servings: "3 dozen",
    flavors: "Funfetti, cream cheese frosting",
    theme: "Office baby shower, blue + gold",
    budget: "$135",
    message: "",
    source: "Google",
    status: "quoted",
    created_at: daysFromNow(-4, 11, 5),
  },
];
