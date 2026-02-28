# Serhat Kumas — Portfolio Page

A modern, highly interactive, and visually stunning single-page application (SPA) portfolio designed to showcase software engineering skills, particularly focused on AI Applications. 

This project goes beyond a standard static website by incorporating rich 3D graphics (via Three.js), physics-based games, interactive audio synthesizers, and smooth scroll-triggered animations (via GSAP). It features a sleek "frosted glass" (glassmorphism) design system layered over dynamic, animated gradient backgrounds.

## 🚀 Features

*   **Interactive 3D Hero Section:** A realistic 3D Apple-style MacBook rendered in the browser using Three.js, complete with opening animations, glowing screens, and reflective metal chassis.
*   **Single Page Application (SPA) Routing:** Employs a custom vanilla JavaScript router (`router.js`) for seamless, instantaneous page transitions without full page reloads.
*   **The 3D Lab:** An interactive playground featuring 3D models (cameras, smartwatches, shoes, skateboards) that users can rotate and inspect.
*   **The Game Lab:** Fully playable HTML5 Canvas games built from scratch, including Basketball, Table Tennis, and Space Invaders.
*   **The Music Lab:** A functional, browser-based Web Audio API synthesizer with clickable keys and sound presets (Piano, Synth, 8-Bit) and integrated volume controls.
*   **Glassmorphism UI:** UI elements (cards, modals, navigation) utilize modern CSS `backdrop-filter: blur()` properties to create a frosted glass effect that beautifully interacts with the background.
*   **Dynamic Custom Cursor:** A sleek, trailing custom cursor that interacts with clickable elements across the site.
*   **Responsive Design:** Fully fluid layouts utilizing modern CSS Flexbox, Grid, and media queries to ensure the experience is excellent on mobile phones, tablets, and massive desktop monitors alike.

---

## 📁 Project Structure & Architecture

The codebase relies on zero massive frameworks (like React or Vue), favoring a lightweight vanilla HTML/CSS/JS architecture combined with powerful specialized libraries (Three.js, GSAP).

### Root Directory
*   `index.html`: The singular entry point for the application. It contains the shell of the website (Navigation, Footer, Global Modals) and the empty `<main>` containers for each injected "page" (Home, About, Skills, Experience, Labs).

### `/css` — Styling & Design System
*   `design-system.css`: The core visual engine of the site. Contains global CSS variables (`--clr-primary`, `--space-4`, etc.), typography rules, base element resets, and the globally applied animated gradient background.
*   `nav.css` / `footer.css`: Styles for the persistent navigation bar and footer.
*   `loader.css`: Styles for the initial loading spinner/screen.
*   `cursor.css`: Styles defining the physical look and trailing animation of the custom mouse cursor.
*   `/pages/`: Contains isolated CSS files for specific views (e.g., `home.css`, `about.css`, `skills.css`, `experience.css`, `contact.css`). This keeps the styling modular and prevents global CSS conflicts.

### `/js` — Logic & Interactivity
*   `router.js`: The most critical architectural file. It listens for navigation clicks, intercepts them, manages the browser History API, and gracefully fades DOM sections (`<main class="page">`) in and out to simulate a multi-page website natively.
*   `loader.js`: Handles the initial loading sequence, ensuring heavy assets (like Three.js models or textures) have time to boot before revealing the site to the user.
*   `cursor.js`: JavaScript logic managing the coordinates, trailing delay, and hover states of the custom interactive cursor.
*   `/pages/`: Contains the isolated JavaScript logic for individual views.
    *   `home.js`: Contains all the complex Three.js logic to draw, light, texture, and animate the 3D MacBook in the hero section. Also initializes GSAP scroll triggers for homepage elements.
    *   `about.js`, `skills.js`, `experience.js`: Logic to handle specific animations or interactions on these respective pages.
    *   `lab.js`: Initializes and manages the 3D object playground using Three.js (materials, lighting, rotation logic).
    *   `gamelab.js`: Contains the distinct game loops, drawing functions, and physics logic for Basketball, Table Tennis, and Space Invaders on HTML Canvases.
    *   `musiclab.js`: Manages the Web Audio API constraints, oscillator nodes, gain nodes (volume), and visual UI syncing for the interactive synthesizer.
    *   `contact.js`: Form validation and interaction logic for the contact section (if applicable) or handles simplified contact layouts.

### `/public` — Static Assets
*   `/images/`: Houses images utilized across the site, including `logo.webp` (the main SK brand logo), project thumbnails, or any hardcoded textures required by CSS or JS.

---

## 🛠 Tech Stack

*   **Core:** HTML5, CSS3, Vanilla JavaScript (ES6 Modules)
*   **3D Graphics:** [Three.js](https://threejs.org/) (Constructing primitives, materials, lighting, cameras, texturing)
*   **Animations:** [GSAP (GreenSock Animation Platform)](https://greensock.com/) (Complex timeline animations, ScrollTrigger library for scroll-bound effects, smooth property interpolation)
*   **Audio:** Native HTML5 Web Audio API
*   **2D Graphics:** Native HTML5 `<canvas>` API (rendering screen textures for laptops, game boards)

---

## ⚙️ Running Locally

Because this project relies on ES6 Modules (`type="module"`) and external libraries via CDNs, it must be run on a local development server. Opening `index.html` directly from the file system (via `file://` protocol) will result in CORS (Cross-Origin Resource Sharing) errors in the browser console.

1.  Make sure you have an HTTP server running. For example, if you have Python installed, run:
    ```bash
    python3 -m http.server 8080
    ```
    OR, if you have Node.js installed, use something like `http-server` or `live-server`:
    ```bash
    npx http-server . -p 8080
    ```
2.  Open your browser and navigate to `http://localhost:8080`.
3.  Enjoy the fully interactive, 3D portfolios experience!

---

## 📫 Contact

Feel free to reach out for collaborations or just a friendly hello!

*   **Email:** [skumas@myseneca.ca](mailto:skumas@myseneca.ca)
*   **LinkedIn:** [linkedin.com/in/serhat-kumas](https://www.linkedin.com/in/serhat-kumas/)
*   **GitHub:** [@SerhatKumas](https://github.com/SerhatKumas)
