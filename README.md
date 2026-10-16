# Zavrino website

Static website for zavrino.in. Plain HTML, CSS and JavaScript, so there's no build step and no server code.

All links are relative, so the site works three ways: opened straight from this folder (double-click `index.html` after unzipping), on Vercel, or on GitHub Pages. Keep the folder structure as it is. The `assets` folder must stay next to the `.html` files.

## Deploy (GitHub → Vercel)
1. Upload everything in this folder to the root of a GitHub repository.
2. In Vercel, import the repository. Framework preset: **Other**. Leave the build command empty and set the output directory to the repository root.
3. Add the domain `zavrino.in` in Vercel → Settings → Domains.

`vercel.json` adds security headers (CSP, HSTS, frame and content-type protection). Vercel serves `404.html` automatically for missing pages.

## Add a live offer
Edit `assets/js/offers.js` and add an object to `window.ZAVRINO_OFFERS` (the field list is at the top of the file). Add an offer only when its partnership and tracking link are live. When the list is empty, the Offers page says that no offers are live.

## Business details used
- Email: support@zavrino.in
- Address: 60, Tronglaobi Makha Leikai, Bishnupur, Manipur, India
- Minimum withdrawal: ₹250 (UPI or bank transfer)
- Claim window: 30 days from order date
- Withdrawal processing target: 7 working days

If any of these change, update them in all pages, which you can find by searching the folder.

## Contact form
The form checks what the visitor enters, then opens their email app with the message addressed to support@zavrino.in. This website stores no data. There is also a "Copy message" button in case no email app opens.
