# Market Dashboard

Statyczny dashboard rynkowy przygotowany do wdrożenia na Vercel.

## Automatyczna aktualizacja

Workflow GitHub Actions uruchamia `scripts/update-market-data.mjs` codziennie o 09:00 czasu `Europe/Warsaw`. Skrypt pobiera:

- indeksy, kryptowaluty i kontrakty na surowce z publicznego endpointu Yahoo Finance,
- średnie kursy walut z oficjalnego API NBP.

Jeżeli pobieranie kluczowych danych nie powiedzie się, skrypt kończy działanie błędem i nie nadpisuje poprzedniego raportu. Udana aktualizacja tworzy commit w repozytorium, który może automatycznie uruchomić nowy deployment Vercel.

Workflow można także uruchomić ręcznie w zakładce **Actions → Daily market data update → Run workflow**.

## Vercel

1. W Vercel wybierz **Add New → Project**.
2. Zaimportuj repozytorium `moniams1234/market_dashboard`.
3. Pozostaw framework jako **Other** i wdroż projekt bez komendy build.
4. Włącz automatyczne deploymenty z brancha `main`.

Dashboard i dane znajdują się w katalogu `public/`, który Vercel traktuje jako wynik statycznego deploymentu dla presetu **Other**. Standardowy `public/index.html` jest udostępniany bezpośrednio pod adresem głównym `/`.

## Aktualizacja lokalna

Wymagany jest Node.js 20 lub nowszy:

```powershell
node scripts/update-market-data.mjs
```
