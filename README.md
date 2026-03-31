# demo-supreme_eng

Client demo website for a mechanical engineering manufacturer.

## Run locally

Open `index.html` in your browser, or use a simple local server:

```bash
python3 -m http.server 5500
```

Then open `http://localhost:5500`.

## Project structure

```
/
├── index.html          # Home page
├── pages/              # Additional HTML pages (about, products, contact, …)
│   └── construction.html
├── css/                # Stylesheets
│   └── styles.css
├── js/                 # JavaScript files
│   └── script.js
└── images/
    └── products/       # Product images (add one image per product here)
```

**Adding new pages** – create an `.html` file inside `pages/` and link to it from `index.html` as `pages/your-page.html`.

**Adding new product images** – drop image files into `images/products/`. Use lowercase, hyphen-separated names with no spaces (e.g. `timing-pulley-xl.png`).

## What is included

- Premium one-page manufacturing website design
- Product showcase for industrial hardware categories
- Capabilities and industries sections for trust-building
- Delivery process timeline and animated KPI counters
- Fully responsive layout for desktop and mobile