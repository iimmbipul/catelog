This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

### Google Sheets integration

This project can load catalog data from a Google Sheet instead of the local `public/catalog.json` file. There are two supported methods:

- Public CSV export (no API key): set the `SHEETS_SPREADSHEET_ID` environment variable to your spreadsheet ID. The API route will fetch the CSV export and transform rows into the app's candle objects.
- Google Sheets API (private sheets): set both `SHEETS_SPREADSHEET_ID` and `SHEETS_API_KEY` environment variables. The app will call the Sheets API `spreadsheets.values` endpoint for range `Sheet1` by default.

Environment variables (create `.env.local`):

SHEETS_SPREADSHEET_ID=your_spreadsheet_id_here
SHEETS_API_KEY=optional_api_key_for_private_sheets
SHEETS_RANGE=optional_range_like_Sheet1!A1:G100

If `SHEETS_SPREADSHEET_ID` is not set or Sheets fetch fails, the app falls back to `public/catalog.json` automatically.

Make sure the sheet's first row contains headers that match the keys used by the app (for example: `id,name,image,price,discount,description,fragrance,bestSeller,trending,soldout,left`).

Service account (private sheet) setup

If your sheet is private, create a Google Cloud service account and download the JSON key. Then either:

- Set `SERVICE_ACCOUNT_FILE` in `.env.local` to the absolute path of the JSON key file on the server where Next runs. Example:

SERVICE_ACCOUNT_FILE=C:\Users\you\secrets\catelog-service-account.json

- Or copy the entire JSON and set it as `SERVICE_ACCOUNT_KEY` in `.env.local` (safe for local dev, not recommended for public repos). Example:

SERVICE_ACCOUNT_KEY="{...the JSON contents...}"

Finally, share the sheet with the service account email (example you provided: `catelog@extreme-pixel-475420-d5.iam.gserviceaccount.com`) as Viewer. The API route will automatically detect the service account key and use it to read the sheet.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
