import fs from "node:fs/promises";
import vm from "node:vm";

const DATA_FILE = new URL("../public/market_data.js", import.meta.url);
const WARSAW_TZ = "Europe/Warsaw";
const isScheduledRun = process.env.GITHUB_EVENT_NAME === "schedule";

const warsawParts = Object.fromEntries(
  new Intl.DateTimeFormat("en-CA", {
    timeZone: WARSAW_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    hourCycle: "h23",
    weekday: "long"
  }).formatToParts(new Date()).map(({ type, value }) => [type, value])
);

// GitHub cron działa w UTC. Workflow uruchamia się o 07:00 i 08:00 UTC,
// a ten warunek wybiera właściwe 09:00 również po zmianie czasu w Polsce.
if (isScheduledRun && warsawParts.hour !== "09") {
  console.log(`Pominięto: w Warszawie jest ${warsawParts.hour}:00, nie 09:00.`);
  process.exit(0);
}

const source = await fs.readFile(DATA_FILE, "utf8");
const sandbox = { window: {} };
vm.runInNewContext(source, sandbox, { filename: "market_data.js" });
const data = sandbox.window.MARKET_DATA;

if (!data || typeof data !== "object") {
  throw new Error("Nie udało się odczytać window.MARKET_DATA.");
}

const headers = {
  Accept: "application/json",
  "User-Agent": "market-dashboard-daily-update/1.0"
};

async function fetchJson(url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15_000);
  try {
    const response = await fetch(url, { headers, signal: controller.signal });
    if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
    return await response.json();
  } finally {
    clearTimeout(timeout);
  }
}

async function yahooQuote(symbol) {
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?range=5d&interval=1d`;
  const payload = await fetchJson(url);
  const result = payload?.chart?.result?.[0];
  const meta = result?.meta;
  const closes = (result?.indicators?.quote?.[0]?.close || []).filter(Number.isFinite);
  const price = Number.isFinite(meta?.regularMarketPrice) ? meta.regularMarketPrice : closes.at(-1);
  const previous = Number.isFinite(meta?.chartPreviousClose)
    ? meta.chartPreviousClose
    : closes.at(-2);

  if (!Number.isFinite(price) || !Number.isFinite(previous) || previous === 0) {
    throw new Error(`Brak kompletnej kwotacji dla ${symbol}`);
  }

  return {
    price,
    previous,
    change: ((price / previous) - 1) * 100,
    currency: meta?.currency || "",
    timestamp: meta?.regularMarketTime || null
  };
}

async function nbpRate(code) {
  const url = `https://api.nbp.pl/api/exchangerates/rates/a/${code}/last/2/?format=json`;
  const payload = await fetchJson(url);
  const rates = payload?.rates;
  if (!Array.isArray(rates) || rates.length < 2) throw new Error(`Brak kursu NBP ${code}`);
  const current = rates.at(-1).mid;
  const previous = rates.at(-2).mid;
  return {
    price: current,
    previous,
    change: ((current / previous) - 1) * 100,
    date: rates.at(-1).effectiveDate
  };
}

const indexSymbols = {
  sp500: "^GSPC",
  nasdaq: "^IXIC",
  dow: "^DJI",
  wig20: "WIG20.WA",
  dax: "^GDAXI",
  ftse: "^FTSE",
  nikkei: "^N225",
  hsi: "^HSI"
};

const cryptoSymbols = {
  "BTC/USD": "BTC-USD",
  "ETH/USD": "ETH-USD",
  "SOL/USD": "SOL-USD"
};

const commoditySymbols = {
  "Złoto": "GC=F",
  "Ropa Brent": "BZ=F",
  "Miedź": "HG=F",
  "Pszenica": "ZW=F"
};

async function collect(entries, loader) {
  const settled = await Promise.allSettled(
    Object.entries(entries).map(async ([key, symbol]) => [key, await loader(symbol)])
  );
  const values = {};
  const failures = [];
  for (const result of settled) {
    if (result.status === "fulfilled") values[result.value[0]] = result.value[1];
    else failures.push(result.reason?.message || String(result.reason));
  }
  return { values, failures };
}

const [indicesResult, cryptoResult, commoditiesResult, fxResult] = await Promise.all([
  collect(indexSymbols, yahooQuote),
  collect(cryptoSymbols, yahooQuote),
  collect(commoditySymbols, yahooQuote),
  collect({ "EUR/PLN": "eur", "USD/PLN": "usd", "GBP/PLN": "gbp", "CHF/PLN": "chf" }, nbpRate)
]);

const successfulQuotes =
  Object.keys(indicesResult.values).length +
  Object.keys(cryptoResult.values).length +
  Object.keys(commoditiesResult.values).length +
  Object.keys(fxResult.values).length;

if (successfulQuotes < 10 || !indicesResult.values.sp500 || !fxResult.values["EUR/PLN"]) {
  throw new Error(`Za mało poprawnych danych (${successfulQuotes}); plik nie zostanie nadpisany.`);
}

const formatNumber = (value, digits = 2) => new Intl.NumberFormat("pl-PL", {
  minimumFractionDigits: digits,
  maximumFractionDigits: digits
}).format(value);

const formatDate = (timestamp) => timestamp
  ? new Intl.DateTimeFormat("pl-PL", { timeZone: WARSAW_TZ, day: "numeric", month: "short" })
      .format(new Date(timestamp * 1000))
  : `${warsawParts.day}.${warsawParts.month}`;

const direction = (change) => change > 0 ? "up" : change < 0 ? "dn" : "nt";
const polishWeekday = {
  Monday: "poniedziałek",
  Tuesday: "wtorek",
  Wednesday: "środa",
  Thursday: "czwartek",
  Friday: "piątek",
  Saturday: "sobota",
  Sunday: "niedziela"
}[warsawParts.weekday];
const polishMonths = [
  "stycznia", "lutego", "marca", "kwietnia", "maja", "czerwca",
  "lipca", "sierpnia", "września", "października", "listopada", "grudnia"
];
const isoDate = `${warsawParts.year}-${warsawParts.month}-${warsawParts.day}`;
const dateLabel = `${Number(warsawParts.day)} ${polishMonths[Number(warsawParts.month) - 1]} ${warsawParts.year} · ${polishWeekday}`;

data.date = isoDate;
data.dateLabel = dateLabel;
data.generatedLabel = "Automatyczna aktualizacja o 09:00 Europe/Warsaw · indeksy, krypto i surowce: Yahoo Finance · waluty: NBP";

for (const item of data.indices) {
  const quote = indicesResult.values[item.id];
  if (!quote) continue;
  item.value = formatNumber(quote.price, 2);
  item.change = Number(quote.change.toFixed(2));
  item.changePt = `${quote.price - quote.previous >= 0 ? "+" : ""}${formatNumber(quote.price - quote.previous, 2)} pkt`;
  item.dir = direction(quote.change);
  item.sub = `${item.sub.split("·")[0].trim()} · ${formatDate(quote.timestamp)}`;
}

for (const item of data.crypto) {
  const quote = cryptoResult.values[item.ticker];
  if (!quote) continue;
  item.value = `$${formatNumber(quote.price, quote.price >= 1000 ? 0 : 2)}`;
  item.change = Number(quote.change.toFixed(2));
  item.dir = direction(quote.change);
}

const commodityUnits = {
  "Złoto": "/oz",
  "Ropa Brent": "/bbl",
  "Miedź": "/lb",
  "Pszenica": " USc/bu"
};
for (const item of data.commodities) {
  const quote = commoditiesResult.values[item.name];
  if (!quote) continue;
  const digits = quote.price >= 1000 ? 0 : 2;
  item.value = `$${formatNumber(quote.price, digits)}${commodityUnits[item.name]}`;
  item.change = Number(quote.change.toFixed(2));
  item.dir = direction(quote.change);
  item.note = `automatyczny odczyt Yahoo Finance · ${formatDate(quote.timestamp)}`;
}

for (const item of data.forex) {
  if (item.pair === "EUR/USD") continue;
  const quote = fxResult.values[item.pair];
  if (!quote) continue;
  item.value = formatNumber(quote.price, 4);
  item.change = Number(quote.change.toFixed(2));
  item.dir = direction(quote.change);
  item.note = `średni kurs NBP ${quote.date}`;
}

const eur = fxResult.values["EUR/PLN"];
const usd = fxResult.values["USD/PLN"];
const eurUsd = data.forex.find((item) => item.pair === "EUR/USD");
if (eurUsd && eur && usd) {
  const current = eur.price / usd.price;
  const previous = eur.previous / usd.previous;
  const change = ((current / previous) - 1) * 100;
  eurUsd.value = formatNumber(current, 4);
  eurUsd.change = Number(change.toFixed(2));
  eurUsd.dir = direction(change);
  eurUsd.note = "kurs krzyżowy z bieżącej tabeli NBP";
}

const sp500 = indicesResult.values.sp500;
const wig20 = indicesResult.values.wig20;
data.heroTitle = sp500.change >= 0
  ? "Globalny rynek rozpoczyna dzień na plusie"
  : "Globalny rynek rozpoczyna dzień ostrożnie";

data.today = [
  {
    icon: direction(sp500.change) === "up" ? "↑" : "↓",
    type: direction(sp500.change) === "up" ? "pos" : "neg",
    title: `S&P 500 ${sp500.change >= 0 ? "rośnie" : "spada"}`,
    sub: `Ostatni odczyt: ${formatNumber(sp500.price, 2)} pkt (${sp500.change >= 0 ? "+" : ""}${formatNumber(sp500.change, 2)}%).`
  },
  {
    icon: direction(commoditiesResult.values["Ropa Brent"]?.change || 0) === "up" ? "↑" : "↓",
    type: direction(commoditiesResult.values["Ropa Brent"]?.change || 0) === "up" ? "pos" : "neg",
    title: "Ropa Brent",
    sub: commoditiesResult.values["Ropa Brent"]
      ? `${formatNumber(commoditiesResult.values["Ropa Brent"].price, 2)} USD/bbl (${formatNumber(commoditiesResult.values["Ropa Brent"].change, 2)}%).`
      : "Brak nowego odczytu; pozostawiono poprzednie dane."
  },
  {
    icon: direction(cryptoResult.values["BTC/USD"]?.change || 0) === "up" ? "↑" : "↓",
    type: direction(cryptoResult.values["BTC/USD"]?.change || 0) === "up" ? "pos" : "neg",
    title: "Bitcoin",
    sub: cryptoResult.values["BTC/USD"]
      ? `${formatNumber(cryptoResult.values["BTC/USD"].price, 0)} USD (${formatNumber(cryptoResult.values["BTC/USD"].change, 2)}%).`
      : "Brak nowego odczytu; pozostawiono poprzednie dane."
  },
  {
    icon: wig20 && direction(wig20.change) === "up" ? "↑" : "◆",
    type: wig20 && direction(wig20.change) === "up" ? "pos" : "ind",
    title: "WIG20 i złoty",
    sub: wig20
      ? `WIG20: ${formatNumber(wig20.price, 2)} pkt (${formatNumber(wig20.change, 2)}%); EUR/PLN: ${formatNumber(eur.price, 4)}.`
      : `EUR/PLN: ${formatNumber(eur.price, 4)}; brak nowego odczytu WIG20.`
  }
];

data.narrative = [
  `S&P 500: ${formatNumber(sp500.price, 2)} pkt (${sp500.change >= 0 ? "+" : ""}${formatNumber(sp500.change, 2)}%), Nasdaq: ${formatNumber(indicesResult.values.nasdaq?.price ?? 0, 2)} pkt.`,
  `EUR/PLN według NBP: ${formatNumber(eur.price, 4)}, USD/PLN: ${formatNumber(usd.price, 4)}.`,
  `Dane zostały odświeżone automatycznie ${dateLabel} o 09:00 czasu polskiego; notowania mogą pochodzić z ostatniej zakończonej sesji.`
];

data.archive = [
  { date: isoDate, title: `Automatyczna aktualizacja: S&P 500 ${formatNumber(sp500.change, 2)}%, EUR/PLN ${formatNumber(eur.price, 4)}` },
  ...data.archive.filter((entry) => entry.date !== isoDate)
].slice(0, 6);

const failures = [
  ...indicesResult.failures,
  ...cryptoResult.failures,
  ...commoditiesResult.failures,
  ...fxResult.failures
];
if (failures.length) console.warn("Częściowe błędy źródeł:", failures.join(" | "));

await fs.writeFile(DATA_FILE, `window.MARKET_DATA = ${JSON.stringify(data, null, 2)};\n`, "utf8");
console.log(`Zaktualizowano ${DATA_FILE.pathname}: ${successfulQuotes} poprawnych kwotowań.`);
