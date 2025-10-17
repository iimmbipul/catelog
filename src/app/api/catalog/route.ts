import { NextResponse } from 'next/server';

type Candle = {
  id: string;
  name: string;
  image: string;
  price: number;
  discount: number;
  description: string;
  fragrance: string;
  bestSeller?: boolean;
  trending?: boolean;
  soldout?: boolean;
  left?: number;
};


function parseNumber(value: string | number | undefined) {
  if (value == null) return 0;
  if (typeof value === 'number') return value;
  const n = Number(String(value).replace(/[^0-9.\-\.]/g, ''));
  return Number.isNaN(n) ? 0 : n;
}

function rowToCandle(row: Record<string, string>): Candle | null {
  if (!row['id'] && !row['ID'] && !row['Id']) return null;
  const id = row['id'] || row['ID'] || row['Id'] || '';
  const name = row['name'] || row['Name'] || '';
  const image = row['image'] || row['Image'] || '/images/placeholder.png';
  const price = parseNumber(row['price'] || row['Price']);
  const discount = parseNumber(row['discount'] || row['Discount']);
  const description = row['description'] || row['Description'] || '';
  const fragrance = row['fragrance'] || row['Fragrance'] || '';
  const bestSeller = (row['bestSeller'] || row['BestSeller'] || row['best_seller'] || '').toLowerCase() === 'true';
  const trending = (row['trending'] || row['Trending'] || '').toLowerCase() === 'true';
  const soldout = (row['soldout'] || row['SoldOut'] || '').toLowerCase() === 'true';
  const left = parseNumber(row['left'] || row['Left']);
  return { id, name, image, price, discount, description, fragrance, bestSeller, trending, soldout, left };
}



async function fetchWithServiceAccount(spreadsheetId: string, range: string) {
  try {
  // lazy import to avoid adding to client bundles
  // use dynamic ESM import instead of require()
  const { google } = (await import('googleapis')) as typeof import('googleapis');

    // service account key can be provided either as a JSON string in SERVICE_ACCOUNT_KEY
    // or as a path to a file in SERVICE_ACCOUNT_FILE
    const keyJson = process.env.SERVICE_ACCOUNT_KEY;
    const keyFile = process.env.SERVICE_ACCOUNT_FILE;
  // authClient may be a JWT client or a GoogleAuth client
  let authClient: unknown;

    if (keyJson) {
      const key = JSON.parse(keyJson);
      authClient = new google.auth.JWT(key.client_email, undefined, key.private_key, ['https://www.googleapis.com/auth/spreadsheets.readonly']);
    } else if (keyFile) {
      // use dynamic import for fs to keep behavior similar and satisfy ESLint
      const fs = await import('fs');
      const key = JSON.parse(fs.readFileSync(keyFile, 'utf-8'));
      authClient = new google.auth.JWT(key.client_email, undefined, key.private_key, ['https://www.googleapis.com/auth/spreadsheets.readonly']);
    } else {
      // try default application credentials
      // keep googleAuth separate so we can call getClient() on the correct type
      const googleAuth = new google.auth.GoogleAuth({ scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'] });
      authClient = await googleAuth.getClient();
    }

  // cast authClient where required for the google.sheets call
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sheets = google.sheets({ version: 'v4', auth: authClient as any });
    const resp = await sheets.spreadsheets.values.get({ spreadsheetId, range });
    const values: string[][] = resp.data.values || [];
    if (values.length === 0) return [];
    const headers = values[0].map((h: string) => String(h).trim());
    const rows: Record<string, string>[] = [];
    for (let i = 1; i < values.length; i++) {
      const rowArr = values[i];
      const row: Record<string, string> = {};
      for (let j = 0; j < headers.length; j++) {
        row[headers[j]] = rowArr[j] ?? '';
      }
      rows.push(row);
    }
    return rows;
  } catch (err) {
    console.warn('service account fetch failed', err);
    return [];
  }
}



export async function GET() {
  const spreadsheetId = process.env.SHEETS_SPREADSHEET_ID;
  const apiKey = process.env.SHEETS_API_KEY; // optional
  const range = process.env.SHEETS_RANGE || 'Sheet1';

  if (spreadsheetId) {
    return fetchWithServiceAccount(spreadsheetId, range).then(rows => {
      const candles: Candle[] = [];
      for (const row of rows) {
        const candle = rowToCandle(row);
        if (candle) candles.push(candle);
      }
      return NextResponse.json(candles);
    });
  }
}