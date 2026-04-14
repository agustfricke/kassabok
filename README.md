# Kassabok

**Kassabok** is a simple sales tracking app for `Swish` payments. It stores 
all records in local storage — nothing fancy, but far better than pen and paper.

When you are ready to analyze your data, you can export everything to a CSV file.

## How it works

Every sale you register is saved directly in the browser's local storage, so no 
backend or database is needed. When you want to dig into the numbers, just hit 
export and open the CSV in Excel, Google Sheets, or any tool you prefer.

---

## Running locally

```bash
npm install
npm run dev
```

## Deployment

```bash
npm install
npm run build
```

Upload the contents of the `dist` directory to any static hosting provider such 
as Bunny.net, Cloudflare Pages, or similar — and you are all set.
