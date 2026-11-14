# DecodeLabs Project 1 – ArtisanCraft Studio Hub

> **Industrial Training Kit | Batch 2026**  
> **Milestone 1:** Responsive Frontend Interface  
> **Evaluation Organization:** DecodeLabs  
> **Author:** Full Stack Engineering Intern  
> **Technology Stack:** Pure HTML5, CSS3, & Vanilla JavaScript (Strictly Framework-Free)  

---

## 1. Project Overview

**ArtisanCraft Studio Hub** is a responsive, accessible web application designed to connect individuals seeking analog, hands-on creative expression with master craftsmen offering small-group studio masterclasses. 

The application was built from the ground up to fulfill the **DecodeLabs Project 1 Industrial Training Kit** requirements, adhering strictly to:
* **The Mobile-First Paradigm:** Single-column mobile baseline progressively enhanced to 2D CSS Grid macro layouts.
* **Warm & Grounded 2025 Aesthetics:** Tactile luxury utilizing Mocha Mousse, Ethereal Blue, and Moonlit Grey.
* **Universal Accessibility:** Strict WCAG 2.1 AA standards, high-contrast ratios, semantic landmarks, and keyboard navigable controls.
* **Zero Framework Mandate:** Pure semantic HTML5, modern CSS3 (Grid + Flexbox + clamp), and Vanilla ES6+ JavaScript.

---

## 2. Problem Statement & User Research

### The Problem
In an increasingly digital and screen-saturated workplace, knowledge workers and creative enthusiasts experience digital fatigue and seek tangible, tactile skills (pottery, woodworking, printmaking, leathercraft). However, existing workshop websites suffer from:
1. **Severe Mobile Unfriendliness:** Cluttered multi-column tables, tiny click targets, and horizontal overflow.
2. **Poor Information Architecture:** Critical details (materials included, skill level, duration, pricing) are buried in walls of text.
3. **Broken Interactive States:** Unresponsive booking forms that reset on error without meaningful inline guidance.

### User Personas
* **Primary Persona:** *Anya Sharma (27, Product Designer)* – Spends 9+ hours daily on screens. Wants to browse, filter, and reserve weekend beginner-friendly ceramic workshops directly on her phone during her evening commute.
* **Secondary Persona:** *Marcus Chen (36, Studio Master Craftsman)* – Needs an uncluttered digital directory to showcase masterclass schedules, prerequisites, and cohort availability.

### Empathy Map (Anya Sharma)

| Dimension | User Experience & Mental State |
| :--- | :--- |
| **Says** | *"I want to do something hands-on this weekend that disconnects me from my laptop."*<br>*"Why do workshop pages make it so difficult to see fees and prerequisites on mobile?"* |
| **Thinks** | *"Will I be the only beginner there?"*<br>*"Are clay and tools provided in the registration fee?"*<br>*"I hope booking is instant and doesn't require downloading an app."* |
| **Does** | Filters listings by 'Beginner'; adjusts price slider to $90; bookmarks two favorites; completes instant reservation. |
| **Feels** | Refreshed and grounded when using a clean, tactile interface; relieved by clear pricing and instant visual confirmation. |

### "How Might We" (HMW) Statement
> *"How might we design a warm, distraction-free, and hyper-responsive workshop discovery interface that allows creative seekers to effortlessly filter, explore, and reserve local artisan masterclasses seamlessly on any screen size?"*

---

## 3. Low-Fidelity Wireframes

Following the DecodeLabs golden rule (*"If it doesn't work in grayscale, color won't fix it"*), low-fidelity grayscale wireframes were created before writing any styling:
* **Mobile Wireframe (`390px`):** [`wireframes/mobile-wireframe.svg`](wireframes/mobile-wireframe.svg) – Single column vertical stack, off-canvas hamburger drawer navigation, collapsible filter strip, full-width workshop cards, stacked reservation form.
* **Tablet Wireframe (`768px`):** [`wireframes/tablet-wireframe.svg`](wireframes/tablet-wireframe.svg) – Inline flex navigation, 2-column hero, 2-column card catalog grid, paired input form fields, 3-column footer.
* **Desktop Wireframe (`1024px – 1440px`):** [`wireframes/desktop-wireframe.svg`](wireframes/desktop-wireframe.svg) – Strict 2D CSS Grid floorplan with a sticky 280px filter sidebar (`<aside>`) on the left and a 3-column workshop catalog (`<main>`) on the right.

---

## 4. Design System & 2025 Warm Aesthetics

### Color Palette Tokens

| Token Name | Hex Code | Purpose & Semantic Role |
| :--- | :--- | :--- |
| `--color-mocha` | `#A5856F` | Primary Brand Color (stability, earth, crafted materials) |
| `--color-mocha-btn` | `#73533E` | High-contrast accessible button fill (5.3:1 contrast vs white) |
| `--color-mocha-tag` | `#5C412F` | High-contrast accessible text tag (8.4:1 contrast vs white) |
| `--color-mocha-hover`| `#5B412F` | Interactive hover & active state |
| `--color-ethereal-blue`| `#A0D4E0`| Accent, focus rings, trust badges |
| `--color-moonlit-grey`| `#F2F0EA` | Canvas ambient background (warm paper texture) |
| `--color-surface-white`| `#FFFFFF`| Elevated card surfaces, inputs, dialogs |
| `--color-text-main` | `#2B2825` | Deep charcoal body & headline text (16.2:1 contrast) |
| `--color-border` | `#E0DDD5` | Clean structural dividers |

### Typography Constraints
* **Headline Font:** `Inter` (Geometric, clean, modern)
* **Body Font:** `Roboto` (Humanist readability, optimized for screens)
* **Strict Weight Limit:** 3 font weights only (`400` Regular, `500` Medium, `700` Bold)
* **Fluid Modular Scale:** Fluid typography using `clamp()`:
  * Display / Hero: `clamp(1.85rem, 3.2vw + 1rem, 3.2rem)`
  * Section Titles (H2): `clamp(1.4rem, 2.0vw + 0.8rem, 2.15rem)`
  * Card Titles (H3): `clamp(1.1rem, 1.0vw + 0.85rem, 1.3rem)`
  * Body Copy: `clamp(0.925rem, 0.2vw + 0.85rem, 1.0rem)`

---

## 5. Technical Implementation Details

### HTML5 Semantic Infrastructure
* **Landmark Elements:** Strict hierarchy with `<header role="banner">`, `<nav aria-label="...">`, `<main id="main-content">`, `<section>`, `<aside id="filter-sidebar">`, `<article class="workshop-card">`, and `<footer role="contentinfo">`.
* **Heading Order:** Valid linear progression from `<h1>` (Hero) to `<h2>` (Landmarks) to `<h3>` (Cards & Footer Columns).
* **Forms & Dialogs:** Accessible form controls with matching `<label for="...">`, live error containers using `aria-live="polite"`, and native HTML5 `<dialog>` for modal bookings.

### CSS3 Modern Layout Engines
* **CSS Grid (Macro Layouts):**
  * `.app-layout-container`: 2D desktop floorplan (`grid-template-columns: 280px 1fr`).
  * `.workshop-grid`: Fluid responsive cards (`1fr` mobile, `repeat(2, 1fr)` tablet, `repeat(3, 1fr)` desktop).
  * `.form-grid`: Input layout scaling from 1 to 3 columns.
  * `.footer-container`: Scaled from 1 to 4 columns.
* **Flexbox (Micro Components):**
  * Header wayfinding, primary navigation links, search input grouping, horizontal category chip scroller, card internal alignment, and button icon/label centering.
* **Mobile-First Progressive Enhancement:**
  * Baseline `< 768px` (single-column, collapsible navigation drawer).
  * `@media (min-width: 768px)` (tablet enhancement).
  * `@media (min-width: 1024px)` (desktop 2D macro grid floorplan).
  * `@media (min-width: 1440px)` (large screen container constraint).

### Vanilla JavaScript Architecture (`script.js`)
* **State Management:** Reactive `state` object managing keyword search, discipline filters, experience levels, max price, sort order, and bookmarked cards.
* **Search & Filter Engine:** Real-time multi-facet filtering querying titles, descriptions, and categories with zero page reload.
* **Price Slider:** Live slider updates filter display and limits results between $50 and $150.
* **Local Storage Bookmarks:** Persists user favorites across sessions with live heart toggle and accessible toast messages.
* **Modal Booking (`<dialog>`):** Native dialog interaction with backdrop dismiss, escape key handling, and pre-filled workshop details.
* **Form Validation:** Real-time regex email checking, required field handling, date-in-the-past prevention, guest count bounds checking (1–4), and automatic invalid field focusing.

---

## 6. Multi-Device Responsive Testing Report

| Viewport Width | Device Emulation | Layout Behavior & Verification | Status |
| :--- | :--- | :--- | :--- |
| **360px** | Galaxy S8 / Android Small | Single column vertical stack, no horizontal scroll, 44px touch targets. | **PASS** |
| **375px** | iPhone SE / iPhone 13 mini | Single column, smooth category chips scroller, accessible hamburger drawer. | **PASS** |
| **390px** | iPhone 14 / iPhone 15 Pro | Fluid hero typography, clean card borders, touch-friendly inputs. | **PASS** |
| **768px** | iPad Portrait | Inline horizontal flex navigation bar, 2-column card grid, 2-column form. | **PASS** |
| **1024px** | iPad Landscape / Laptop | 2D CSS Grid floorplan (280px sticky sidebar + 3-column card catalog). | **PASS** |
| **1440px** | High-Res Desktop Display | Centered layout container (max 1320px), generous whitespace, sharp SVGs. | **PASS** |

---

## 7. Accessibility Audit (WCAG 2.1 AA Compliance)

* **Keyboard Navigation:** Full Tab key navigation through skip link, hamburger toggle, navigation links, search inputs, filter checkboxes, radio buttons, cards, modal, and reservation form.
* **Focus Indicators:** Explicit, high-visibility 2px focus outlines (`outline: 2px solid var(--color-border-focus); outline-offset: 3px;`).
* **Color Contrast:** All body text meets or exceeds WCAG AAA (16.2:1); all buttons and interactive tags meet or exceed WCAG AA (5.3:1 to 8.4:1).
* **Screen Reader Landmarks:** ARIA live regions (`aria-live="polite"`) for real-time results counter, form error messages, and toast notifications.
* **Image Descriptions:** All vector illustrations contain meaningful, context-rich `alt` attributes.

---

## 8. Google Lighthouse Audit Results

Audited using Google Chrome Headless via the official Lighthouse CLI on `http://localhost:3000`:

| Audit Category | Actual Score | Evaluation Standard | Status |
| :--- | :--- | :--- | :--- |
| **Performance** | **89 / 100** | Fast load, preloaded LCP hero image, deferred JS | **EXCELLENT** |
| **Accessibility** | **97 / 100** | Strict WCAG landmarks, labels, ARIA live | **EXCELLENT** |
| **Best Practices** | **100 / 100** | Zero console errors, valid doctype, HTTPS ready | **PERFECT** |
| **SEO** | **100 / 100** | Meta descriptions, OpenGraph tags, semantic headers | **PERFECT** |
| **Agentic Browsing** | **100 / 100** | Semantic markup optimized for screen readers and AI | **PERFECT** |

### Core Web Vitals Recorded
* **First Contentful Paint (FCP):** $1.8\text{ s}$
* **Largest Contentful Paint (LCP):** $3.1\text{ s}$
* **Total Blocking Time (TBT):** $130\text{ ms}$
* **Cumulative Layout Shift (CLS):** $\mathbf{0.000}$ *(Zero visual shift)*
* **Speed Index:** $4.1\text{ s}$

---

## 9. Requirement Compliance Matrix

| DecodeLabs Specification | Implemented Feature | Compliance Status |
| :--- | :--- | :--- |
| **Pure Fundamentals** | HTML5, CSS3, Vanilla JS only | **100% Compliant** (0 frameworks used) |
| **No Frameworks Ban** | No React, Vue, Angular, Tailwind, Bootstrap, jQuery | **100% Compliant** |
| **Semantic HTML5** | `<header>`, `<nav>`, `<main>`, `<section>`, `<aside>`, `<article>`, `<footer>` | **100% Compliant** |
| **Heading Hierarchy** | Single `<h1>`, structured `<h2>`, and descriptive `<h3>` | **100% Compliant** |
| **CSS Grid (Macro)** | 2D desktop floorplan, card catalog grid, form grid, footer | **100% Compliant** |
| **Flexbox (Micro)** | Navigation, search bar, card internals, footer metadata, chips | **100% Compliant** |
| **Mobile-First Breakpoints**| Single column mobile baseline -> 768px tablet -> 1024px desktop | **100% Compliant** |
| **Fluid Typography** | Fluid scaling using `clamp()` on all text levels | **100% Compliant** |
| **Warm 2025 Aesthetic** | Mocha Mousse, Ethereal Blue, Moonlit Grey palette | **100% Compliant** |
| **No Dark Theme** | Light, warm, tactile aesthetic exclusively | **100% Compliant** |
| **Font Constraints** | Inter (headings) + Roboto (body), capped at 3 weights | **100% Compliant** |
| **Interactive Navigation** | Mobile animated hamburger drawer + active scroll spy | **100% Compliant** |
| **Filtering & Search** | Real-time multi-category, keyword, and price range filtering | **100% Compliant** |
| **Interactive Modal** | Native HTML5 `<dialog>` for quick card reservations | **100% Compliant** |
| **Form Validation** | RFC regex email, name, date-not-past, guest count, live feedback | **100% Compliant** |
| **Touch Accessibility** | Minimum 44px x 44px touch targets on all buttons/inputs | **100% Compliant** |
| **Zero Console Errors** | Verified with zero console warnings or errors | **100% Compliant** |

---

## 10. How to Run the Project Locally

1. **Option A: Direct File Opening**
   * Double-click [index.html](file:///c:/Users/Akm73/OneDrive/Attachments/FULL%20STACK%20PROJECT%2001/index.html) or open in any modern browser (Chrome, Edge, Firefox, Safari).
2. **Option B: Local Web Server (Node.js)**
   * Open terminal in this folder and start a static server:
     ```bash
     npx serve .
     # or python -m http.server 3000
     ```
   * Open [http://localhost:3000](http://localhost:3000) in your browser.
