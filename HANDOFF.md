# Гэр Групп ХХК — Design Handoff

## Design Summary

Гэр Групп ХХК is an organic and sustainable boys' clothing ecommerce store for the Mongolian market. The visual direction is editorial minimalism inspired by Zara: a near-binary palette of pure black on pure white with a single stone gray for secondary text, sharp corners everywhere, hairline borders, compact sans-serif typography, and generous whitespace. The interface deliberately recedes so editorial product photography carries the brand experience.

## Approved Visual Direction

- **Direction family:** Editorial Minimal / Swiss Grid reinterpretation
- **Selected homepage option:** C — Bold Reinterpretation
- **Motion level:** 1 (Polished)
- **Palette:** `#ffffff` canvas, `#000000` ink/borders, `#757575` stone
- **Typography:** Manrope, weights 400–700, compact scale 11–120px
- **Corners:** 0px on every component
- **Shadows/gradients:** None

## Approval Record

- Homepage options shown: A (Faithful Minimal), B (Improved Asymmetric), C (Bold Reinterpretation)
- Selected option: C
- Preview artifact file paths:
  - `output/gun/designs/homepage-option-a.png`
  - `output/gun/designs/homepage-option-b.png`
  - `output/gun/designs/homepage-option-c.png`
- Final design file path: `output/gun/designs/design.pen`
- Final export file path: `output/gun/designs/design.png`
- Pencil project paths used:
  - `output/gun/designs/homepage-directions.pen`
  - `output/gun/designs/design.pen`
- Confirmation: homepage previews covered the full homepage section flow (hero, categories, best-sellers, testimonials, contact, footer).
- Locked constraints: keep the black/white/stone palette only, 0px radius everywhere, Manrope font, no shadows, no gradients.

## Source Website Inventory

- Source URL audited: `https://gun.mn`
- Audit result: `output/gun/source-audit.json` (0 pages discovered; the domain is not yet serving a public storefront)
- Because the source site was unavailable, the design was rebuilt from scratch using the Zara editorial minimalism reference supplied by the user.

## Chosen Fonts

- **Manrope** — display, body, UI labels, buttons. Chosen for its clarity, modern geometric feel, and excellent Cyrillic support.
- No decorative serif is used for UI text; the GUN logotype itself is the only display typographic moment.

## Chosen Libraries

- `framer-motion` — micro-interactions only (hover scale, fade-in).
- `lucide-react` — icons.
- `clsx` + `tailwind-merge` — class utilities.
- `next-themes` — light/dark theme scaffolding if needed later (default is light).

No GSAP, Lenis, Three.js, or heavy scroll libraries are required for motion level 1.

## Setup Commands

```bash
pnpm add framer-motion clsx tailwind-merge lucide-react next-themes
```

## Frontend Build Map

### Pages

| Route | Page | Notes |
|-------|------|-------|
| `/` | Homepage | Hero, Categories, Best Sellers, Testimonials, Contact |
| `/products` | Product listing | Sidebar filters, sort, 3-column grid |
| `/products/[id]` | Product detail | Image gallery, size selector, quantity, add-to-cart |
| `/cart` | Cart | Line items, quantity, order summary |
| `/checkout` | Checkout | Delivery form, payment selector, order summary |
| `/login` | Login | Email + password, link to register |
| `/register` | Register | Name, email, phone, password |
| `/profile` | Profile | Editable personal info |
| `/orders` | Orders | Order history table |
| `/orders/[id]` | Order detail | Status timeline |
| `/wishlist` | Wishlist | Saved product grid |

### Shared Components

- Header: GUN logotype left, search/cart icons right, minimal nav on inner pages
- Footer: GUN logotype, footer nav, copyright
- ProductCard: image, name, price
- CategoryCard: image, label
- TestimonialCard: quote, author
- ContactForm: name, email, message, submit

### Section Sequence on Homepage

1. Header
2. Hero — full-bleed image with large GUN title and outlined CTA
3. Categories — 4-column grid
4. Best Sellers — 4-column product grid
5. Testimonials — dark band with 3 bordered cards
6. Contact — form + image
7. Footer

## Animation Rules

- Motion level 1: subtle hover states only.
- Product cards: `scale: 1.02` on hover, 150ms ease.
- Buttons: opacity or background inversion on hover.
- Page load: optional 250ms fade-in for sections.
- No scroll-triggered reveals, no parallax, no page transitions.

## Interaction Rules

- All buttons are rectangular with 0px radius.
- Primary actions use black fill + white text.
- Secondary actions use transparent fill + black border + black text.
- Inputs use only a bottom hairline border.
- Links are underlined on hover; no color change.

## Responsive Behavior

- Mobile: single-column stacks, reduced outer padding (16–24px), hero title scales down.
- Tablet: 2-column grids.
- Desktop: 4-column categories/best-sellers, sidebar on products page.

## Accessibility

- Maintain 4.5:1 contrast for all body text.
- Large hero text is white on photographic backgrounds; ensure images are dark enough.
- Focus states: 1px outline in black.
- Touch targets at least 44px.

## Content Tone (Mongolian)

- Minimal, direct, confident.
- Uppercase labels for section titles and form labels.
- Avoid decorative adjectives; let product names and prices speak.

## erxes CMS Field Map

### Homepage Sections

- `hero`
- `categories`
- `best-sellers`
- `testimonials`
- `contact`

### Standalone Pages

| Slug | Purpose |
|------|---------|
| `contact` | Long-form contact page |

### Menu Structure

**Header**
- Нүүр /
- Бараа /products
- Холбоо барих /contact

**Footer**
- Бараа /products
- Холбоо барих /contact
- Хүргэлт / (anchor or static page)

### Content That Must Not Change

- Black/white/stone color system
- 0px corner radius on every element
- Manrope font family
- GUN logotype letter-spacing and weight
- Editorial photography-first layout
- No shadows, no gradients

## Exact Pencil File Paths

- `output/gun/designs/homepage-directions.pen`
- `output/gun/designs/design.pen`
