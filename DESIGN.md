# Design System Strategy: The Arboreal Collector

## 1. Overview & Creative North Star
**Creative North Star: "The Modern Naturalist"**

This design system is built to bridge the gap between a rugged field guide and a high-end editorial gallery. We are moving away from the "app-as-a-tool" aesthetic and toward "app-as-an-exhibit." The goal is to make the user feel like they are documenting the giants of the earth within a prestigious, digital archive.

To achieve this, the system rejects the rigid, boxy constraints of standard mobile UI. We utilize **intentional asymmetry**, where large-scale imagery of ancient canopies breaks the container edges, and **tonal depth**, where elements emerge from the background like layers of a forest floor rather than being "pasted" on top. The experience is authoritative yet hushed—allowing the majestic scale of the subject matter to command the interface.

---

### 2. Colors & Surface Philosophy
The palette is grounded in the shadows of the forest (`primary: #021c10`) and the warmth of fertile earth (`secondary: #7a5649`). 

**The "No-Line" Rule**
In this system, 1px solid borders are strictly prohibited for sectioning. We define boundaries through **Background Color Shifts**. 
*   *Implementation:* Use `surface-container-low` for secondary content blocks sitting on a `surface` background. The transition should be felt, not seen.

**Surface Hierarchy & Nesting**
Treat the UI as physical layers of organic material. 
*   **Base Layer:** `surface` (#fcf9f2) — The "paper" of our field guide.
*   **Secondary Layer:** `surface-container` (#f1eee7) — Used for grouped data like tree statistics.
*   **Elevated Layer:** `surface-container-highest` (#e5e2db) — Reserved for interactive elements or high-priority cards.

**The "Glass & Gradient" Rule**
To prevent the UI from feeling "flat" or "academic," use Glassmorphism for floating navigation or informational overlays. 
*   Apply a 12px-20px `backdrop-blur` to `surface` colors at 70% opacity.
*   **Signature Textures:** For hero CTAs or data headers, use a subtle linear gradient from `primary` (#021c10) to `primary-container` (#173124). This adds a "silken" depth that flat color cannot replicate.

---

### 3. Typography: The Editorial Voice
Our typography pairing contrasts the timeless authority of a serif with the clinical precision of a modern sans-serif.

*   **Display & Headlines (Noto Serif):** These are our "title plates." Use `display-lg` for the names of ancient specimens. High-contrast serif typography evokes the heritage of botanical journals.
*   **Title & Body (Manrope):** A clean, geometric sans-serif used for data and descriptions. It provides the "modern" counter-balance to the serif's "tradition."
*   **The Hierarchy Rule:** Large `display-sm` headings should often be paired with `label-md` (All Caps, 0.05rem letter spacing) to create an archival, catalogued feel.

---

### 4. Elevation & Depth
We eschew traditional drop shadows in favor of **Tonal Layering**.

*   **The Layering Principle:** Depth is achieved by stacking. A `surface-container-lowest` card placed on a `surface-container-low` section creates a natural "lift" through value contrast alone.
*   **Ambient Shadows:** If an element must float (e.g., a "Capture" FAB), use a shadow with a 40px blur and 6% opacity. The shadow color must be derived from `on-surface` (#1c1c18), never pure black.
*   **The "Ghost Border" Fallback:** For accessibility in forms, use the `outline-variant` token at 15% opacity. This provides a faint guide without interrupting the visual flow.

---

### 5. Components

#### **Cards & Imagery**
*   **The Rule:** No dividers. Use `Spacing: 8` (2.75rem) to separate content sections.
*   **Imagery:** Photos of trees should utilize "Organic Masking"—using the `xl` roundedness (0.75rem) on three corners and a `none` (0px) radius on one to create a custom, notched look.
*   **Data Visualization:** Height and circumference stats should use `headline-sm` in `secondary` (#7a5649) to draw the eye immediately to the "Champion" metrics.

#### **Buttons**
*   **Primary:** Background: `primary` (#021c10), Text: `on-primary` (#ffffff). Shape: `md` (0.375rem).
*   **Secondary:** Background: `secondary-container` (#fdcdbc), Text: `on-secondary-container` (#795548). 
*   **State:** On press, transition to a subtle gradient rather than a simple color darken.

#### **Input Fields**
*   Avoid "Box" inputs. Use a "Minimalist Ledger" style: A `surface-container-highest` background with a `none` border, and a 2px `primary` underline that appears only on focus.

#### **Chips (Species Filters)**
*   Use `surface-container-high` backgrounds with `label-md` text. When selected, shift to `tertiary-container` (#2a2e00) with `on-tertiary-container` (#909844) text to evoke mossy, forest-floor tones.

---

### 6. Do’s and Don’ts

**Do:**
*   **Do** use asymmetrical layouts. Place a tree's scientific name (`label-sm`) vertically alongside a large-scale image.
*   **Do** use the `24` (8.5rem) spacing token for bottom padding on long-form articles to allow the content to breathe.
*   **Do** use `primary-fixed-dim` (#b0cdbb) for iconography to keep the "nature" vibe consistent even in functional elements.

**Don’t:**
*   **Don’t** use pure black (#000000) for text. Always use `on-surface` (#1c1c18) to maintain the "ink-on-paper" softness.
*   **Don’t** use standard 1px dividers between list items. Use a shift from `surface` to `surface-container-low` to indicate a new row.
*   **Don’t** crowd data. If displaying tree height, give that number its own "pedestal" of white space using the `12` (4rem) spacing token.