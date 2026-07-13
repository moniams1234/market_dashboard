import argparse
import json
import os
import smtplib
import ssl
from email.message import EmailMessage
from pathlib import Path


DATA_FILE = Path(__file__).resolve().parent.parent / "public" / "market_data.js"


def load_market_data():
    raw = DATA_FILE.read_text(encoding="utf-8").strip()
    prefix = "window.MARKET_DATA ="
    if not raw.startswith(prefix):
        raise ValueError("Niepoprawny format public/market_data.js")
    payload = raw[len(prefix):].strip()
    if payload.endswith(";"):
        payload = payload[:-1]
    return json.loads(payload)


def format_change(value):
    number = float(value or 0)
    return f"{number:+.2f}%".replace(".", ",")


def build_summary(data):
    currencies = [
        item for item in data.get("forex", [])
        if item.get("pair") in {"EUR/PLN", "USD/PLN", "GBP/PLN", "CHF/PLN"}
    ]
    commodities = data.get("commodities", [])

    currency_lines = "\n".join(
        f"• {item['pair']}: {item['value']} ({format_change(item.get('change'))})"
        for item in currencies
    )
    commodity_lines = "\n".join(
        f"• {item['name']}: {item['value']} ({format_change(item.get('change'))})"
        for item in commodities
    )

    return (
        f"Dzień dobry,\n\n"
        f"krótkie podsumowanie rynku — {data.get('dateLabel', data.get('date', ''))}:\n\n"
        f"WALUTY\n{currency_lines}\n\n"
        f"SUROWCE\n{commodity_lines}\n\n"
        f"Pełny dashboard: https://market-dashboard-git-main-moniams1234.vercel.app/\n\n"
        f"Dane mają charakter informacyjny i mogą pochodzić z ostatniej zakończonej sesji."
    )


def send_email(data, body):
    gmail_user = os.environ.get("GMAIL_USER", "").strip()
    app_password = os.environ.get("GMAIL_APP_PASSWORD", "").replace(" ", "")
    recipients = [
        address.strip()
        for address in os.environ.get("MARKET_EMAIL_TO", "").split(",")
        if address.strip()
    ]

    missing = [
        name for name, value in {
            "GMAIL_USER": gmail_user,
            "GMAIL_APP_PASSWORD": app_password,
            "MARKET_EMAIL_TO": recipients,
        }.items() if not value
    ]
    if missing:
        raise RuntimeError(f"Brak wymaganych GitHub Secrets: {', '.join(missing)}")

    message = EmailMessage()
    message["Subject"] = f"Market Dashboard — waluty i surowce — {data.get('date', '')}"
    message["From"] = f"Market Dashboard <{gmail_user}>"
    message["To"] = ", ".join(recipients)
    message.set_content(body)

    context = ssl.create_default_context()
    with smtplib.SMTP_SSL("smtp.gmail.com", 465, context=context, timeout=30) as smtp:
        smtp.login(gmail_user, app_password)
        smtp.send_message(message)

    print(f"Wysłano podsumowanie do {len(recipients)} odbiorcy/odbiorców.")


def main():
    parser = argparse.ArgumentParser(description="Wyślij krótkie podsumowanie rynku przez Gmail SMTP.")
    parser.add_argument("--preview", action="store_true", help="Pokaż treść bez wysyłania wiadomości.")
    args = parser.parse_args()

    data = load_market_data()
    body = build_summary(data)
    if args.preview:
        print(body)
        return
    send_email(data, body)


if __name__ == "__main__":
    main()
