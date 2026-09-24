# notjustbrownie design system

## Authority and intent
The supplied full-page screenshot is the visual authority. Preserve its section order, Argentine Spanish copy, pink/cream palette, food photography, rounded images, and compact storefront composition.

## Tokens
- Brand pink: #ef507d; darker interaction pink: #c3335c.
- Page cream: #fff8f3; alternating section blush: #fdebee.
- Body ink: #272222. Font: Roboto, self-hosted through next/font.
- Page content width: 1280px. Desktop horizontal padding: 42px; mobile: 23px.
- Buttons: rounded pills, uppercase. Product cards: cream with pink offset edge. Photos: generous rounded corners.

## Structure
Sticky header with Inicio, Nosotras, Productos, cart and mobile menu. Two-column hero with brownie stack and affection seal. Brand story. Four product cards. Three shared moments. Three brand values. Six-column Instagram strip. Pink closing CTA and cream footer.

## Responsive behavior
Mobile breakpoint at 760px: stacked hero and story, two-column products, stacked moments, three-column values and social gallery. Tablet corrections between 761px and 980px prevent title and product footer overflow. Reduced motion disables scrolling animation and transitions.

## Interactions
Anchor navigation, active section highlighting, accessible Base UI sheet panels for story, catalog and cart. Cart quantities persist locally and allow removal; totals use es-AR currency presentation. Order can be copied before visiting the Instagram profile. No payment backend or checkout is configured.

## Assets and validation
Generated photographs approximate the supplied reference; originals were not separately supplied. Asset prompts are in public/images/prompts.txt. Production build and TypeScript checks pass. Static design detector returned no findings. Browser screenshots and interactive browser checks were not performed; exact pixel fidelity is not certified.

## Motion update
Affection seal uses a repeating double heartbeat (1.65 seconds), preserving its tilted shape. Hero words, brownie photograph and seal enter in sequence. Scroll reveals use photo wipes, product perspective and staggered gallery arrivals. Pointer tilt, button feedback and heart particles acknowledge interaction. ProductCard is stable across cart updates. Motion can be paused from the header, follows reduced-motion preferences, pauses loops offscreen and when the tab is hidden, and keeps all content visible without JavaScript.

## Phone centering
At widths up to 760px, center the header brand with controls on a second row, center hero/story/product/closing/footer text and actions, and keep matching anchor offsets for the taller header. Decorative hearts sit on the text axis. Desktop styles remain unchanged.

## Interactive moments and values
Both sections initially match the supplied icon-and-copy references. Each entire item is a keyboard/touch button that independently toggles to the previous photo/detail or large-icon layout and back. Accessible pressed state and inactive-face aria-hidden keep the state explicit. Transitions use opacity/translation without layout jumps, and respect the global pause and reduced-motion settings. Circle and icon dimensions are shared across siblings. The care icon is a whisk, as supplied.

The values section starts on its large-icon view; touching an item reveals the compact icon and description. The moments section still starts with the supplied icon-and-title view.
