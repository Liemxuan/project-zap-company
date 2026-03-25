# ZAP Architecture Core: The Separation of Concerns

To safely modify or override ("kill") the core application shell without breaking the ecosystem, it is vital to know exactly which layer is responsible for what. ZAP heavily separates concerns so that changing a color doesn't break a layout, and changing a layout doesn't break a component.

Here is the definitive mapping of the ZAP Design Engine architecture representing the L1/L2 shell.

## The Definitive Layer Mapping Table

| Visual Element | The Source of Truth (Where to Edit) | Responsibility | How it Works |
| :--- | :--- | :--- | :--- |
| **Global Typography** | `src/styles/globals.css` + `src/app/layout.tsx` | Resolves the actual font files across the DOM. | Next.js loads the physical font files (`Geist`, `Shrikhand`). Then `globals.css` injects them into the Tailwind dictionary (`--font-display`). |
| **Icons & Hardware** | `src/genesis/atoms/icons/Icon.tsx` | Controls the exact SVG rendering and stroke weight. | We do not use CSS to draw icons. The React `<Icon />` shell catches the request and dials the `@phosphor-icons` engine. To make all icons thicker globally, edit the `weight={...}` prop here. |
| **Baseline Color Core** | `src/styles/m3_tokens.css` | 🚧 M3 SKELETON: Defines the 30 base color buckets. | Defines safe Material 3 fallback hex codes for all fundamental surfaces and states. This ensures the app never hits a naked white DOM if a theme goes down. |
| **Brand Theme Override**| `src/themes/METRO/theme-metro.css`| 🎨 THE METRO FLAVOR: Overrides the skeleton. | Only active when `[data-theme="metro"]` is set. Hardcodes specific ZAP colors (`--color-brand-midnight`), tightens the navigation borders, and zeros out card shadows. |
| **L1/L2 Layout Structure** | `tailwind.config.ts` (The Engine) | 📏 THE MATH: Defines the spatial baseline. | Everything in ZAP uses spacing multipliers of `4px` (e.g., `gap-4`, `p-6`). We don't write custom CSS for layout gaps. We use the grid governed by the Tailwind configuration. |
| **Component Assembly** | `src/zap/layout/WireframeShell.tsx` | 🏗️ THE BLUEPRINT: Assembles the raw HTML. | This is where the React math comes together. It dictates that the L1 SideNav sits next to the L2 Body using `flex flex-col`. It is just structural HTML pointing to CSS utility classes. |

---

## The Concept: "Killing the Core" vs "Overriding a Theme"

If you want to go in and fundamentally change how the L1 (Navigation) interacts with L2 (Content Stage), here is how to dissect the layers based on what you want to achieve:

### Scenario 1: You want tighter space between the SideNav and the Main Stage.
* **Do Not Edit:** `theme-metro.css` or `m3_tokens.css`.
* **The Fix:** Go to `WireframeShell.tsx` or the specific container and change the Tailwind layout classes (e.g., change `gap-6` to `gap-2`).

### Scenario 2: You want the Metro Navigation border to be Thicker.
* **Do Not Edit:** `WireframeShell.tsx` (the HTML shouldn't care about border width).
* **The Fix:** Go to `src/themes/METRO/theme-metro.css` and change `--card-border-width: 1px` to `2px`. This cascades to the entire Metro shell globally.

### Scenario 3: You want to completely abandon the Material 3 Colors and build a darker theme.
* **Do Not Kill:** `m3_tokens.css`. That is the fallback safety net.
* **The Fix:** Create a brand new `src/themes/DARK/theme-dark.css`. Map the same exact variables (like `--sys-color-surface`) to your new black hex codes. Then simply tell the ZAP shell `[data-theme="dark"]`. The entire L1/L2 structure will instantly repaint without a single React layout or Tailwind file being touched.

### Scenario 4: You want standard icons to be filled instead of outlined.
* **Do Not Edit:** Any CSS files or the Tailwind config.
* **The Fix:** Go straight to `src/genesis/atoms/icons/Icon.tsx` and change `weight="regular"` to `weight="fill"`. Every L1 navigation item and L2 Inspector element will instantly refresh as solid hardware globally.
