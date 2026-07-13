# Market Dashboard

Statyczny dashboard rynkowy przygotowany do wdrożenia na Vercel.

## Automatyczna aktualizacja

Workflow GitHub Actions uruchamia `scripts/update-market-data.mjs` codziennie o 09:00 czasu `Europe/Warsaw`. Skrypt pobiera:

- indeksy, kryptowaluty i kontrakty na surowce z publicznego endpointu Yahoo Finance,
- średnie kursy walut z oficjalnego API NBP.

Jeżeli pobieranie kluczowych danych nie powiedzie się, skrypt kończy działanie błędem i nie nadpisuje poprzedniego raportu. Udana aktualizacja tworzy commit w repozytorium, który może automatycznie uruchomić nowy deployment Vercel.

Workflow można także uruchomić ręcznie w zakładce **Actions → Daily market data update → Run workflow**.

## Codzienny e-mail z Gmaila

Po udanej aktualizacji workflow wysyła krótkie podsumowanie walut i surowców przez Gmail SMTP. Dane dostępowe nie są zapisywane w kodzie — należy dodać je w repozytorium GitHub w **Settings → Secrets and variables → Actions → New repository secret**:

| Secret | Wartość |
| --- | --- |
| `GMAIL_USER` | Pełny adres konta Google, z którego ma wychodzić wiadomość |
| `GMAIL_APP_PASSWORD` | 16-znakowe hasło aplikacji Google, bez zwykłego hasła do konta |
| `MARKET_EMAIL_TO` | Adres odbiorcy; kilka adresów można rozdzielić przecinkami |

Konto Google musi mieć włączoną weryfikację dwuetapową. Następnie w ustawieniach konta Google należy utworzyć osobne **Hasło aplikacji** dla dashboardu i wkleić je jako `GMAIL_APP_PASSWORD`.

Treść wiadomości można sprawdzić lokalnie bez jej wysyłania:

```powershell
python scripts/send-market-email.py --preview
```

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
