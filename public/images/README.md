# Image assets

The active slots now use generated ThirsTEA artwork based on the shop photography supplied by the
owner. Drink artwork is split into transparent foreground cutouts and wide hero backdrops so the
carousel can animate both layers independently.

To replace any generated asset with final photography, keep the same filename or update the matching
path in `src/data/`. Transparent drink cutouts should keep real alpha.

## What each slot needs

### Drink cutouts — transparent PNG, no background

The entire visual direction rests on these. Cup upright and square-on, straw included, shot against
a plain backdrop and masked out cleanly. Condensation and drips are good; a visible table edge or
hand is not.

| File | Drink | Data file |
| --- | --- | --- |
| `muddy-milk.png` | Muddy Milk | `bestsellers.ts` |
| `mango-slush.png` | Mango Slush | `bestsellers.ts` |
| `strawberry-lychee.png` | Strawberry Lychee Slush | `bestsellers.ts` |
| `creamy-mango.png` | Creamy Mango | `bestsellers.ts` |
| `taro-slush.png` | Taro Slush | `bestsellers.ts` |
| `taro-milk-tea.png` | Taro Milk Tea | `bestsellers.ts` |
| `matcha-latte.png` | Matcha Latte | `bestsellers.ts` |
| `bubble-waffle.png` | Bubble waffle | `bestsellers.ts` |

### Objects — transparent PNG

| File | Subject | Data file |
| --- | --- | --- |
| `giveaway-rose-soap.png` | A rose-shaped soap | `giveaways.ts` |
| `giveaway-keychain.png` | A bubble tea keychain | `giveaways.ts` |
| `giveaway-topping.png` | Toppings — pearls, jelly, popping boba | `giveaways.ts` |

### Rooms and walls — normal JPG, background kept

| File | Subject | Data file |
| --- | --- | --- |
| `wall-lorax.jpg` | The Lorax wall, shot straight on, whole wall in frame | `walls.ts` |
| `wall-sticky-notes.jpg` | The sticky note wall, close enough to read a few notes | `walls.ts` |
| `storefront.jpg` | The unit from the parking lot, with the unit number legible | — |
| `interior.jpg` | The room mid-afternoon, tables and game shelf visible | — |

## Production requirements

- **2000px on the long edge minimum.** The hero cutout renders up to 30rem tall on a 2× display.
- **Usage rights confirmed in writing** before launch, including for any customer artwork visible on
  the wall photographs. The sticky note wall is other people's handwriting — worth asking about.
- Export cutouts as PNG with real alpha. No white boxes, no baked-in shadows: the page draws its
  own shadow, and a second one underneath looks wrong.
- Compress before committing. Aim under 400KB per cutout.
